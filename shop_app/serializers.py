from rest_framework import serializers
from shop_app import models as auth_model
from django.contrib.auth import get_user_model

User = get_user_model()
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']
        
class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}
    
    def create(self, validated_data):
        user = User(
            username = validated_data['username'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = auth_model.Product
        fields = ["id", "name", "slug", "image", "description", "category", "price"]
        
class DetailedProductSerializer(serializers.ModelSerializer):
    similar_products = serializers.SerializerMethodField()
    class Meta:
        model = auth_model.Product
        fields = ["id", "name", "slug", "image", "price", "description", "similar_products"]
        
    def get_similar_products(self, product):
        product = auth_model.Product.objects.filter(category = product.category).exclude(id = product.id)
        serializer = ProductSerializer(product, many = True)
        return serializer.data
    
    
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only = True)
    total = serializers.SerializerMethodField()
    class Meta:
        model = auth_model.CartItem
        fields = ["id", "quantity", "product", "total"]
        
    def get_total(self, cart_item):
        price = cart_item.product.price * cart_item.quantity
        return price
        

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(read_only=True, many=True)
    sum_total = serializers.SerializerMethodField()
    num_of_items = serializers.SerializerMethodField()
    
    class Meta:
        model = auth_model.Cart
        fields = ["id", "cart_code", "items", "sum_total", "num_of_items", "created_at", "modified_at"]
        
    def get_sum_total(self, cart):
        items = cart.items.all()
        total = sum([item.product.price * item.quantity for item in items])
        return total
    
    def get_num_of_items(self, cart):
        # items = cart.items.all()
        # total = sum([item.quantity for item in items])
        return cart.items.count()
        
class SimpleCartSerializer(serializers.ModelSerializer):
    num_of_items = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()
    
    class Meta:
        model = auth_model.Cart
        fields = ["id", "cart_code", "num_of_items", "items"]
        
    def get_num_of_items(self, cart):
        # num_of_items = sum([item.quantity for item in cart.items.all()])
        return cart.items.count()
    
    def get_items(self, cart):
        items = auth_model.CartItem.objects.filter(cart = cart)
        return CartItemSerializer(items, many=True).data
        
        
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = auth_model.OrderItem
        fields = ["product_name", "quantity", "price"]
        
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many = True, read_only = True)
    class Meta:
        model = auth_model.Order
        fields = ["id", "created_at", "total_price", "status", "items"]