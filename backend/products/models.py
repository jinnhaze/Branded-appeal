from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    
    # Dimensions for Virtual Try-On mapping
    frame_width = models.FloatField(help_text="Width of the frame in millimeters")
    bridge_width = models.FloatField(help_text="Width of the nose bridge in millimeters")
    temple_length = models.FloatField(help_text="Length of the temple in millimeters")
    
    # 3D Model file
    model_3d = models.FileField(upload_to='models_3d/', help_text="Upload .glb or .obj files", null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
