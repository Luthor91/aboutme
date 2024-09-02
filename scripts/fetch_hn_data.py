import requests
import json
import re
from globals import MAX_WORDS_DESCRIPTION, MAX_ARTICLES, KEYWORDS_TO_SKIP

# Constantes de configuration
URL = f"https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage={MAX_ARTICLES}"

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