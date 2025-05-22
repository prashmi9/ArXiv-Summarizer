from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        # Import and initialize the dataset and model when the app is ready
        try:
            from .services import initialize_services
            initialize_services()
        except Exception as e:
            logger.error(f"Error during app initialization: {e}")
            logger.warning("Application may not function correctly.")
