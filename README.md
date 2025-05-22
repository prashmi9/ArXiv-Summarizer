# ArXiv Summarizer

A full-stack web application for searching and analyzing ArXiv papers using NLP.

## Features

- Search ArXiv papers with AI-generated summaries
- Analyze text using Meta's Llama 3.2 model
- Extract key insights, sentiment, and topics from research papers

## Tech Stack

- **Frontend**: React with Vite, Tailwind CSS
- **Backend**: Django REST Framework
- **NLP**: Meta-Llama/Llama-3.2-1B
- **Data**: ccdv/arxiv-summarization dataset from Hugging Face
- **Deployment**: Docker and Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Hugging Face API token (for accessing Llama 3.2 model)
- Python

## Run Python virtual environment

### Navigate to the backend directory

cd arxiv-summarizer-app

### Create a virtual environment

python -m venv venv

### Activate the virtual environment

### On Windows:

venv\Scripts\activate

### On macOS/Linux:

source venv/bin/activate

### Install Python dependencies

pip install -r requirements.txt

### Installation

1. Clone the repository:
   <br/>

   - bash <br/>
     git clone https://github.com/yourusername/arxiv-summarizer.git
     cd arxiv-summarizer
     <br/>

2. Create a `.env` file in the project root with the following variables:
   \`\`\`
   SECRET_KEY=your_django_secret_key
   DEBUG=true
   ALLOWED_HOSTS=localhost,127.0.0.1
   CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
   HF_TOKEN=your_huggingface_token
   LLAMA_MODEL_ID=meta-llama/Llama-3.2-1B
   DATASET_NAME=ccdv/arxiv-summarization
   \`\`\`

3. Build and start the containers:
   \`\`\`bash
   docker-compose up -d
   \`\`\`
   Run Database migartion:
   python manage.py migrate

   Start Django server :
   python manage.py runserver

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/analyze/

## API Endpoints

- `GET /api/papers/search/?query=<search_term>`: Search for papers
- `POST /api/analyze/`: Analyze text with Llama 3.2

## Development

### Running in Development Mode

For development, you can run the frontend and backend separately:

#### Frontend

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

#### Backend

\`\`\`bash
cd backend
pip install -r requirements.txt
python manage.py runserver
\`\`\`
