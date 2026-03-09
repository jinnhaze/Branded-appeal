from rest_framework import serializers
from .models import Order, OrderItem
from products.serializers import ProductSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_id', 'quantity', 'price')

from django.contrib.auth import get_user_model
User = get_user_model()

class UserMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phone_number')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_details = UserMiniSerializer(source='user', read_only=True)

    class Meta:
        model = Order
        fields = ('id', 'user', 'user_details', 'created_at', 'status', 'total_amount', 'shipping_address', 'is_paid', 'items')
        read_only_fields = ('user', 'total_amount', 'status', 'is_paid')
