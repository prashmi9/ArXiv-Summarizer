"""
WSGI config for arxiv_summarizer project.
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'arxiv_summarizer.settings')

application = get_wsgi_application()
