import requests
import xml.etree.ElementTree as ET
import json
import re

# Configuration
url = "https://rss.slashdot.org/Slashdot/slashdotMain"
max_words_description = 50  # Nombre maximum de mots dans la description

# Récupérer les données depuis l'URL
response = requests.get(url)
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

# Fonction pour limiter la description à un nombre maximum de mots
def limit_words(text, max_words):
    words = re.findall(r'\b\w+\b', text)
    if len(words) > max_words:
        return ' '.join(words[:max_words]) + '...'
    return text

# Extraire les articles
items = []
for item in root.findall('rss:item', namespaces):
    title = item.find('rss:title', namespaces).text if item.find('rss:title', namespaces) is not None else 'No Title'
    link = item.find('rss:link', namespaces).text if item.find('rss:link', namespaces) is not None else 'No Link'
    description = item.find('rss:description', namespaces).text if item.find('rss:description', namespaces) is not None else 'No Description'

    # Limiter la description au nombre maximum de mots
    description = limit_words(description, max_words_description)

    items.append({
        'title': title,
        'link': link,
        'description': description
    })

# Sauvegarder les données en JSON
json_path = 'datas/slashdot_datas.json'
with open(json_path, 'w') as f:
    json.dump({'items': items}, f, indent=4)

print(f"Les données ont été sauvegardées dans {json_path}")