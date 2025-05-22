from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .services import search_papers, analyze_text
import logging

# Set up logging
logger = logging.getLogger(__name__)

class PaperSearchView(APIView):
    """
    API endpoint for searching ArXiv papers
    """
    def get(self, request):
        query = request.query_params.get('query', '')
        if not query:
            return Response(
                {"error": "Query parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            papers = search_papers(query)
            return Response(papers)
        except Exception as e:
            logger.error(f"Error in paper search: {e}")
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class TextAnalysisView(APIView):
    """
    API endpoint for analyzing text using mock analysis service
    """
    def post(self, request):
        text = request.data.get('text', '')
        if not text:
            return Response(
                {"error": "Text is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            result = analyze_text(text)
            return Response(result)
        except Exception as e:
            logger.error(f"Error in text analysis: {e}")
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
