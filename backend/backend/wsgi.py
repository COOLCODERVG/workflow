import os
import sys

# Add the parent directory of the backend project
sys.path.append("/home/schoolifys/taskify/backend")

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
