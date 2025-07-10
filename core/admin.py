from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from core.models import CustomUser  # adjust as needed

class CustomUserAdmin(UserAdmin):
    model = CustomUser

    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('city', 'state', 'address', 'phone')
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {
            'classes': ('wide',),
            'fields': ('city', 'state', 'address', 'phone'),
        }),
    )

admin.site.register(CustomUser, CustomUserAdmin)
