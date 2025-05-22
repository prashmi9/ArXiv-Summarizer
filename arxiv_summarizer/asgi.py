"""
ASGI config for arxiv_summarizer project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'arxiv_summarizer.settings')

application = get_asgi_application()
