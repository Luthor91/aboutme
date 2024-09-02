import requests
import json
import re

# URL de l'API pour récupérer les articles les plus récents
url = "https://hn.algolia.com/api/v1/search_by_date?tags=story&hitsPerPage=12"
max_words_description = 50  # Nombre maximum de mots dans la description
max_attempts = 20  # Nombre maximum d'articles à vérifier

# Effectuer une requête GET pour obtenir les données
response = requests.get(url)
data = response.json()

# Fonction pour limiter la description à un nombre maximum de mots
def limit_words(text, max_words):
    words = re.findall(r'\b\w+\b', text)
    if len(words) > max_words:
        return ' '.join(words[:max_words]) + '...'
    return text

# Extraire les articles
items = []
count = 0
for hit in data['hits']:
    link = hit.get('url', 'No Link')
    if link and link != 'No Link':
        if count >= max_attempts:
            break
        items.append({
            'title': hit.get('title', 'No Title'),
            'link': link,
            'description': limit_words(hit.get('story_text', 'No Description'), max_words_description)
        })
        count += 1

# Sauvegarder les données en JSON
json_path = 'datas/hackernews_datas.json'
with open(json_path, 'w') as json_file:
    json.dump({'items': items}, json_file, indent=4)

print(f"Les données ont été sauvegardées dans {json_path}")