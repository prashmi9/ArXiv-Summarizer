import os
import re
import json
import logging
from django.conf import settings
from datasets import load_dataset

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables to store the dataset
dataset = None

def initialize_services():
    """Initialize the dataset"""
    global dataset
    
    try:
        logger.info("Initializing ArXiv dataset...")
        # Load only a subset of the dataset for demonstration purposes
        dataset = load_dataset(settings.DATASET_NAME, split="train[:1000]")
        logger.info("ArXiv dataset initialized successfully!")
        
        logger.info("Skipping Llama model initialization - using mock text analysis service instead.")
        logger.info("Services initialization completed!")
    except Exception as e:
        logger.error(f"Error during service initialization: {e}")
        logger.warning("Some functionality may not be available.")

def search_papers(query, max_results=10):
    """
    Search for papers in the dataset based on the query
    """
    if dataset is None:
        raise Exception("Dataset not initialized")
    
    # Convert query to lowercase for case-insensitive search
    query = query.lower()
    
    # Filter papers that match the query in title or abstract
    matching_papers = []
    for i, paper in enumerate(dataset):
        if (query in paper['title'].lower() or 
            query in paper['abstract'].lower()):
            
            # Extract arxiv ID from the URL if available
            arxiv_id = "unknown"
            if 'arxiv_url' in paper and paper['arxiv_url']:
                match = re.search(r'abs/([^/]+)', paper['arxiv_url'])
                if match:
                    arxiv_id = match.group(1)
            
            # Format the paper data
            formatted_paper = {
                'id': str(i),
                'arxiv_id': arxiv_id,
                'title': paper['title'],
                'authors': paper.get('authors', '').split(', ') if paper.get('authors') else [],
                'abstract': paper['abstract'],
                'summary': paper.get('summary', ''),
                'categories': paper.get('categories', '').split(' ') if paper.get('categories') else [],
                'published_date': paper.get('publish_time', '')
            }
            
            matching_papers.append(formatted_paper)
            
            if len(matching_papers) >= max_results:
                break
    
    return matching_papers

def analyze_text(text):
    """
    Mock text analysis function that simulates AI analysis
    """
    logger.info("Using mock text analysis service")
    
    # Simple text analysis logic
    word_count = len(text.split())
    sentence_count = len(re.split(r'[.!?]+', text))
    
    # Generate a simple summary based on the first few sentences
    sentences = re.split(r'(?<=[.!?])\s+', text)
    summary = ' '.join(sentences[:2]) if len(sentences) > 1 else text
    
    # Extract potential topics based on word frequency
    words = re.findall(r'\b[a-zA-Z]{4,}\b', text.lower())
    word_freq = {}
    for word in words:
        if word not in ['this', 'that', 'with', 'from', 'have', 'were', 'they', 'their', 'about', 'would', 'could']:
            word_freq[word] = word_freq.get(word, 0) + 1
    
    # Get the top 5 most frequent words as topics
    topics = [word for word, _ in sorted(word_freq.items(), key=lambda x: x[1], reverse=True)[:5]]
    
    # Determine sentiment based on simple keyword matching
    positive_words = ['good', 'great', 'excellent', 'positive', 'amazing', 'wonderful', 'best', 'success', 'successful']
    negative_words = ['bad', 'worst', 'terrible', 'negative', 'poor', 'failure', 'failed', 'problem', 'difficult']
    
    positive_count = sum(1 for word in words if word in positive_words)
    negative_count = sum(1 for word in words if word in negative_words)
    
    if positive_count > negative_count:
        sentiment = 'positive'
    elif negative_count > positive_count:
        sentiment = 'negative'
    else:
        sentiment = 'neutral'
    
    # Generate insights based on text characteristics
    insights = [
        f"The text contains approximately {word_count} words and {sentence_count} sentences.",
        "This is a mock analysis generated without using an AI model."
    ]
    
    # Add sentiment insight
    if sentiment == 'positive':
        insights.append("The text appears to have a positive tone.")
    elif sentiment == 'negative':
        insights.append("The text appears to have a negative tone.")
    else:
        insights.append("The text appears to have a neutral tone.")
    
    # Add complexity insight
    avg_words_per_sentence = word_count / max(1, sentence_count)
    if avg_words_per_sentence > 25:
        insights.append("The text uses relatively complex sentence structures.")
    elif avg_words_per_sentence < 10:
        insights.append("The text uses relatively simple sentence structures.")
    
    return {
        "summary": summary,
        "insights": insights,
        "sentiment": sentiment,
        "topics": topics
    }
