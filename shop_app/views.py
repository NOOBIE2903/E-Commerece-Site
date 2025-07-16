from rest_framework import generics  # Changed from individual imports
from shop_app import models as auth_model
from shop_app import serializers as auth_serializer
from rest_framework.decorators import api_view, permission_classes
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
import uuid
from django.utils.timezone import now

# Function-based view (optional - you can keep or remove)
User = get_user_model()
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_detals(request, user_id):
    try:
        user = User.objects.get(id = user_id)
        return Response({
            "id": user.id, 
            "username": user.username, 
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "date_joined": user.date_joined,
            "city": user.city,
            "state": user.state,
            "address": user.address,
            "phone": user.phone,
            })
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([AllowAny])
def add_user(request):
    try:
        serializer = auth_serializer.UserRegisterSerializer(data = request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User saved successfully", 
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                }}, status = status.HTTP_201_CREATED)
    except:
        return Response({"error": "Error in saving the user"}, status = status.HTTP_400_BAD_REQUEST)
        
        
@api_view(["GET"])
def products(request):
    products = auth_model.Product.objects.all()
    serializer = auth_serializer.ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def product_detail(request, slug):
    try:
        product = auth_model.Product.objects.get(slug=slug)
        serializer = auth_serializer.DetailedProductSerializer(product)
        return Response(serializer.data)
    except auth_model.Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)
    
# views.py
@api_view(["POST"])
@permission_classes([AllowAny])
@csrf_exempt  # Add this decorator
def add_item(request):
    try:
        cart_code = request.data.get("cart_code")
        product_id = request.data.get("product_id")
        
        if not cart_code or not product_id:
            return Response(
                {"error": "cart_code and product_id are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get or create cart
        user = request.user if request.user.is_authenticated else None
        cart, created = auth_model.Cart.objects.get_or_create(
            cart_code=cart_code,
            defaults={'user': user}
        )
        
        # Get product
        product = auth_model.Product.objects.get(id=product_id)
        
        # Add or update item in cart
        cart_item, created = auth_model.CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': 1}
        )
        
        if not created:
            cart_item.quantity += 1
            cart_item.save()
        
        return Response({
            "message": "Item added to cart",
            "quantity": cart_item.quantity
        }, status=status.HTTP_201_CREATED)
        
    except auth_model.Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def product_in_cart(request):
    cart_code = request.GET.get("cart_code")
    product_id = request.GET.get("product_id")
    
    try:
        cart = auth_model.Cart.objects.get(cart_code=cart_code)
    except auth_model.Cart.DoesNotExist:
        return Response({"in_cart": False, "error": "Cart not found"}, status=404)

    in_cart = auth_model.CartItem.objects.filter(cart=cart, product_id=product_id).exists()
    return Response({"in_cart": in_cart})


@api_view(['GET'])
@permission_classes([AllowAny])
def get_cart_state(request):
    cart_code = request.GET.get('cart_code')
    if not cart_code:
        return Response({"error": "cart_code parameter is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        cart = auth_model.Cart.objects.get(cart_code=cart_code)
        items = auth_model.CartItem.objects.filter(cart=cart)
        
        serialized_items = auth_serializer.CartItemSerializer(items, many=True).data
        sum_total = sum(item.product.price * item.quantity for item in items)
        
        return Response({
            "items": serialized_items,
            "sum_total": sum_total,
            "cart_code": cart.cart_code
        }, status=status.HTTP_200_OK)
        
    except auth_model.Cart.DoesNotExist:
        return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_user_cart(request): 
    try:
        cart = auth_model.Cart.objects.get(user = request.user).latest('updated_at')
        return Response({
            "cart_code": cart.cart_code,
            "items": auth_serializer.CartItemSerializer(cart.items.all(), many = True)
        })
    except auth_model.Cart.DoesNotExist:
        new_cart = auth_model.Cart.create (
            user = request.user,
            cart_code = str(uuid.uuid4())
        )
        return Response({
            'cart_code': new_cart.cart_code,
            'items': []
        })

@api_view(['GET'])
@permission_classes([AllowAny])
def get_cart(request):
    cart_code = request.GET.get('cart_code')
    if not cart_code:
        return Response(
            {"error": "cart_code parameter is required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        cart = auth_model.Cart.objects.get(cart_code=cart_code)
        items = auth_model.CartItem.objects.filter(cart=cart)
        serializer = auth_serializer.CartItemSerializer(items, many=True)
        total = sum(item.product.price * item.quantity for item in items)
        
        # order = auth_model.Order.objects.create(
        #     user=request.user,
        #     total_price=total,
        #     created_at=now(),
        #     status="PENDING"
        # )
        
        # for cart_items in items:
        #     auth_model.OrderItem.objects.create(
        #         order=order,
        #         product=cart_items.product,
        #         product_name=cart_items.product.name,
        #         quantity=cart_items.quantity,
        #         price=cart_items.product.price
        #     )
        
        return Response({
            "items": serializer.data,
            "total": total
        })
    except auth_model.Cart.DoesNotExist:
        return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_or_create_user_cart(request):
    try:
        # Get cart_code from request if exists
        cart_code = request.GET.get('cart_code')
        user = request.user if request.user.is_authenticated else None
        
        # If we have a cart_code, try to get that cart
        if cart_code:
            try:
                cart = auth_model.Cart.objects.get(cart_code=cart_code)
                # If user is authenticated and cart doesn't have a user, associate it
                if user and not cart.user:
                    cart.user = user
                    cart.save()
                return Response({"cart_code": cart.cart_code}, status=status.HTTP_200_OK)
            except auth_model.Cart.DoesNotExist:
                pass  # We'll create a new cart
        
        # Create new cart
        new_cart_code = str(uuid.uuid4())
        cart = auth_model.Cart.objects.create(
            cart_code=new_cart_code,
            user=user if user else None
        )
        
        return Response({"cart_code": cart.cart_code}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_or_create_cart(request):
    # Try to get user's most recent cart
    cart = auth_model.Cart.objects.filter(user=request.user).order_by('-updated_at').first()
    
    if not cart:
        # Create new cart if none exists
        cart = auth_model.Cart.objects.create(
            user=request.user,
            cart_code=str(uuid.uuid4())
        )
    
    return Response({'cart_code': cart.cart_code})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def associate_cart(request):
    try:
        cart_code = request.data.get('cart_code')
        if not cart_code:
            return Response({'error': 'cart_code is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get the cart (could be anonymous or already belong to user)
        cart = auth_model.Cart.objects.get(cart_code=cart_code)
        
        # If cart already belongs to this user, just return success
        if cart.user == request.user:
            return Response({
                'message': 'Cart already belongs to user',
                'cart_code': cart.cart_code
            })
            
        # If cart belongs to another user, return error
        if cart.user and cart.user != request.user:
            return Response({
                'error': 'Cart belongs to another user'
            }, status=status.HTTP_403_FORBIDDEN)
            
        # Assign cart to current user
        cart.user = request.user
        cart.save()
        
        return Response({
            'message': 'Cart associated successfully',
            'cart_code': cart.cart_code
        })
        
    except auth_model.Cart.DoesNotExist:
        return Response({'error': 'Cart not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(["PATCH"])
def update_quantity(request):
    try:
        cart_item_id = request.data.get("item_id")
        quantity = request.data.get("quantity")
        quantity = int(quantity)
        cart_item = auth_model.CartItem.objects.get(id = cart_item_id)
        cart_item.quantity = quantity
        cart_item.save()
        serializer = auth_serializer    .CartItemSerializer(cart_item)
        return Response({"data": serializer.data, "message": "Cart Item updated successfully !!"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)
    
@api_view(['DELETE'])
def delete_cart_item(request):
    cart_item_id = request.data.get("item_id")
    cart_item = auth_model.CartItem.objects.get(id = cart_item_id)
    cart_item.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_orders(request):
    user = request.user
    order = auth_model.Order.objects.filter(user = user).order_by("-created_at")
    serializer = auth_serializer.OrderSerializer(order, many = True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def checkout_cart(request):
    try:
        cart_code = request.data.get('cart_code')
        if not cart_code:
            return Response({"error": "cart_code is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        cart = auth_model.Cart.objects.get(cart_code=cart_code)
        items = auth_model.CartItem.objects.filter(cart=cart)

        if not items:
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
        
        total = sum(item.product.price * item.quantity for item in items)

        order = auth_model.Order.objects.create(
            user=request.user,
            total_price=total,
            created_at=now(),
            status="PENDING"
        )

        for item in items:
            auth_model.OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                quantity=item.quantity,
                price=item.product.price
            )

        # Optionally clear the cart after checkout
        items.delete()

        return Response({"message": "Order placed successfully", "order_id": order.id}, status=201)

    except auth_model.Cart.DoesNotExist:
        return Response({"error": "Cart not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
