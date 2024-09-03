import requests
import xml.etree.ElementTree as ET
import json
import re

# URL du fichier de configuration sur GitHub
CONFIG_URL = "https://raw.githubusercontent.com/Luthor91/aboutme/main/config/config.json"

# Fonction pour charger la configuration depuis GitHub
def load_config():
    try:
        response = requests.get(CONFIG_URL)
        response.raise_for_status()  # Vérifie les erreurs HTTP
        config = response.json()
        return config
    except requests.RequestException as e:
        print(f"Erreur lors du chargement de la configuration: {e}")
        # Valeurs par défaut en cas d'échec de chargement de la configuration
        return {
            "maxArticles": 30,
            "maxDescriptionLength": 150,
            "maxWordsDescription": 50,
            "maxAttempts": 20,
            "maxWordLength": 30,
            "keywordsToSkip": ["paywall", "fermented"]
        }

config = load_config()

# Constantes de configuration
MAX_ARTICLES = config["maxArticles"]
MAX_WORDS_DESCRIPTION = config["maxWordsDescription"]
KEYWORDS_TO_SKIP = config["keywordsToSkip"]
URL = "https://rss.slashdot.org/Slashdot/slashdotMain"

# Fonction pour limiter la description à un nombre maximum de mots
def limit_words(text, max_words):
    words = re.findall(r'\b\w+\b', text)
    if len(words) > max_words:
        return ' '.join(words[:max_words]) + '...'
    return text

# Fonction pour vérifier si un titre contient un des mots-clés à filtrer
def contains_keyword(title, keywords):
    return any(keyword.lower() in title.lower() for keyword in keywords)

# Récupérer les données depuis l'URL
response = requests.get(URL)
response.raise_for_status()  # Vérifie les erreurs HTTP

# Parse le contenu XML
root = ET.fromstring(response.content)

# Définir les espaces de noms utilisés dans le XML
namespaces = {
    'rss': 'http://purl.org/rss/1.0/',
    'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'dc': 'http://purl.org/dc/elements/1.1/',
    'slash': 'http://purl.org/rss/1.0/modules/slash/',
    'synd': 'http://purl.org/rss/1.0/modules/syndication/'
}

# Extraire les articles
items = []
for item in root.findall('rss:item', namespaces):
    title = item.find('rss:title', namespaces).text if item.find('rss:title', namespaces) is not None else 'No Title'
    link = item.find('rss:link', namespaces).text if item.find('rss:link', namespaces) is not None else 'No Link'
    description = item.find('rss:description', namespaces).text if item.find('rss:description', namespaces) is not None else ''
    
    if link and link != 'No Link' and not contains_keyword(title, KEYWORDS_TO_SKIP):
        if len(items) >= MAX_ARTICLES:
            break
        items.append({
            'title': title,
            'link': link,
            'description': limit_words(description, MAX_WORDS_DESCRIPTION)
        })

# Sauvegarder les données en JSON
json_path = 'config/slashdot_datas.json'
with open(json_path, 'w') as f:
    json.dump({'items': items}, f, indent=4)

print(f"Les données ont été sauvegardées dans {json_path}")
