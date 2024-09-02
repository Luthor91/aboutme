import requests
import xml.etree.ElementTree as ET
import json
import re

# Constantes de configuration
URL = "https://rss.slashdot.org/Slashdot/slashdotMain"
MAX_WORDS_DESCRIPTION = 50  # Nombre maximum de mots dans la description
MAX_ATTEMPTS = 20  # Nombre maximum d'articles à vérifier
MAX_ARTICLES = 10  # Nombre maximum d'articles à afficher
KEYWORDS_TO_SKIP = ["paywall"]  # Liste de mots-clés à filtrer

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
count = 0
for item in root.findall('rss:item', namespaces):
    title = item.find('rss:title', namespaces).text if item.find('rss:title', namespaces) is not None else 'No Title'
    link = item.find('rss:link', namespaces).text if item.find('rss:link', namespaces) is not None else 'No Link'
    description = item.find('rss:description', namespaces).text if item.find('rss:description', namespaces) is not None else 'No Description'
    
    if link and link != 'No Link' and not contains_keyword(title, KEYWORDS_TO_SKIP):
        if len(items) >= MAX_ARTICLES:
            break
        items.append({
            'title': title,
            'link': link,
            'description': limit_words(description, MAX_WORDS_DESCRIPTION)
        })

# Sauvegarder les données en JSON
json_path = 'datas/slashdot_datas.json'
with open(json_path, 'w') as f:
    json.dump({'items': items}, f, indent=4)

print(f"Les données ont été sauvegardées dans {json_path}")