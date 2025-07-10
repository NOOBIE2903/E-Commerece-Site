from django.contrib import admin
from shop_app import models as auth_model
# Register your models here.

# class ProductAdmin(admin.ModelAdmin):
#     prepopulated_fields = {"slug": ("title")}    

admin.site.register(auth_model.Product)
admin.site.register(auth_model.CartItem)
admin.site.register(auth_model.Cart)
