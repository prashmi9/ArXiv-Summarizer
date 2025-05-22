from django.urls import path
from .views import PaperSearchView, TextAnalysisView

urlpatterns = [
    path('papers/search/', PaperSearchView.as_view(), name='paper-search'),
    path('analyze/', TextAnalysisView.as_view(), name='text-analysis'),
]
