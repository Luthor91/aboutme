import requests
import json
import re

# Constantes de configuration
URL = "https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=12"
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

# Effectuer une requête GET pour obtenir les données
response = requests.get(URL)
data = response.json()

# Extraire les articles
items = []
count = 0
for hit in data['hits']:
    title = hit.get('title', 'No Title')
    link = hit.get('url', 'No Link')
    
    if link and link != 'No Link' and not contains_keyword(title, KEYWORDS_TO_SKIP):
        if len(items) >= MAX_ARTICLES:
            break
        items.append({
            'title': title,
            'link': link,
            'description': limit_words(hit.get('story_text', 'No Description'), MAX_WORDS_DESCRIPTION)
        })

# Sauvegarder les données en JSON
json_path = 'datas/hackernews_datas.json'
with open(json_path, 'w') as json_file:
    json.dump({'items': items}, json_file, indent=4)

print(f"Les données ont été sauvegardées dans {json_path}")