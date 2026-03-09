import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from products.models import Category, Product

# Create Categories
cat_sun, _ = Category.objects.get_or_create(name='Sunglasses', slug='sunglasses')
cat_read, _ = Category.objects.get_or_create(name='Reading Glasses', slug='reading-glasses')
cat_comp, _ = Category.objects.get_or_create(name='Computer Glasses', slug='computer-glasses')

# Create Products
Product.objects.get_or_create(
    name='Aviator Classic',
    defaults={
        'category': cat_sun,
        'price': 150.00,
        'frame_width': 140,
        'bridge_width': 14,
        'temple_length': 135
    }
)

Product.objects.get_or_create(
    name='Wayfarer Style',
    defaults={
        'category': cat_sun,
        'price': 130.00,
        'frame_width': 138,
        'bridge_width': 18,
        'temple_length': 145
    }
)

Product.objects.get_or_create(
    name='Blue Light Blocker',
    defaults={
        'category': cat_comp,
        'price': 99.00,
        'frame_width': 135,
        'bridge_width': 16,
        'temple_length': 140
    }
)
print("Products populated!")
