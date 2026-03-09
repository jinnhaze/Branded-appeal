import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

try:
    if not User.objects.filter(username='admin').exists():
        user = User.objects.create_superuser(username='admin', email='admin@brandedappeal.com', password='admin')
        print('Created admin')
    else:
        user = User.objects.get(username='admin')
        user.set_password('admin')
        user.save()
        print('Reset admin password')
except Exception as e:
    print('Error:', e)
