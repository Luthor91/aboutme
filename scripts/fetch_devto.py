import requests
import json

# URL du fichier de configuration sur GitHub
CONFIG_URL = "https://raw.githubusercontent.com/Luthor91/aboutme/main/config/config.json"

# Fonction pour charger la configuration depuis GitHub
def load_config():
    try:
        response = requests.get(CONFIG_URL)
        response.raise_for_status()
        config = response.json()
        return config
    except requests.RequestException as e:
        print(f"Erreur lors du chargement de la configuration: {e}")
        return {
            "maxArticles": 30,
            "maxWordsDescription": 50,
            "keywordsToSkip": ["paywall", "fermented"]
        }

config = load_config()

# Constantes de configuration
MAX_ARTICLES = config["maxArticles"]
MAX_WORDS_DESCRIPTION = config["maxWordsDescription"]
KEYWORDS_TO_SKIP = config["keywordsToSkip"]
URL = "https://dev.to/api/articles"

# Fonction pour limiter la description à un nombre maximum de mots
def limit_words(text, max_words):
    words = text.split()
    if len(words) > max_words:
        return ' '.join(words[:max_words]) + '...'
    return text

# Fonction pour vérifier si un titre contient un des mots-clés à filtrer
def contains_keyword(title, keywords):
    return any(keyword.lower() in title.lower() for keyword in keywords)

# Récupérer les données depuis l'URL
response = requests.get(URL)
response.raise_for_status()  # Vérifie les erreurs HTTP

# Parse le contenu JSON
data = response.json()

# Extraire les articles
items = []
for item in data:
    title = item.get('title', 'No Title')
    link = item.get('url', 'No Link')
    description = item.get('description', 'No Description')
    
    if link and not contains_keyword(title, KEYWORDS_TO_SKIP):
        if len(items) >= MAX_ARTICLES:
            break
        items.append({
            'title': title,
            'link': link,
            'description': limit_words(description, MAX_WORDS_DESCRIPTION)
        })

# Sauvegarder les données en JSON
json_path = 'config/devto_datas.json'
with open(json_path, 'w') as f:
    json.dump({'items': items}, f, indent=4)

print(f"Les données ont été sauvegardées dans {json_path}")