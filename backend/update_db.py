import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from products.models import Category, Product
from django.core.files import File
import urllib.request
from django.core.files.temp import NamedTemporaryFile

# Download a dummy 3D glasses model (using a simple placeholder GLB if possible, or just marking it)
# We will use a public free GLTF/GLB from a CDN for testing if we can't build one, but we can just use a local dummy for now.
# To make it really work, let's download a small sample GLB from a safe source, e.g. a generic cube, or just skip the real 3D file and use a mock for the db.
# For demo purposes, let's create a generic glasses object and attach the images.
cat_sun = Category.objects.get(slug='sunglasses')
cat_comp = Category.objects.get(slug='computer-glasses')
cat_read = Category.objects.get(slug='reading-glasses')

# Update Sunglasses
p1 = Product.objects.get(name='Aviator Classic')
p1.image = 'products/sunglasses.png'
p1.save()

p2 = Product.objects.get(name='Wayfarer Style')
p2.image = 'products/sunglasses.png'
p2.save()

# Update Computer Glasses
p3 = Product.objects.get(name='Blue Light Blocker')
p3.image = 'products/computer.png'
p3.save()

# Add Reading Glasses
Product.objects.get_or_create(
    name='Tortoiseshell Reader',
    defaults={
        'category': cat_read,
        'price': 85.00,
        'frame_width': 130,
        'bridge_width': 15,
        'temple_length': 135,
        'image': 'products/reading.png'
    }
)

# Wait, let's download an actual 3D model so the VT feature works.
import urllib.request
import tempfile

# Downloading a free CC0 GLB cube as a placeholder for 3D glasses.
gltf_url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF-Binary/Box.glb"
try:
    with tempfile.NamedTemporaryFile(delete=True) as temp_file:
        urllib.request.urlretrieve(gltf_url, temp_file.name)
        p1.model_3d.save('glasses_cube_mock.glb', File(open(temp_file.name, 'rb')))
        print("Mock 3D model attached to Aviator Classic!")
except Exception as e:
    print(f"Failed to fetch mock 3D model: {e}")

print("Database updated with dummy images!")
