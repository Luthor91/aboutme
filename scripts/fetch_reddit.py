import requests
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
        return {
            "maxArticles": 30,
            "maxDescriptionLength": 150,
            "maxWordsDescription": 50,
            "maxAttempts": 20,
            "maxWordLength": 30,
            "keywordsToSkip": ["paywall", "fermented"]
        }

# Définir les fonctions avant de les utiliser
def contains_keyword(title, keywords):
    return any(keyword.lower() in title.lower() for keyword in keywords)

def limit_words(text, max_words):
    words = re.findall(r'\b\w+\b', text)
    if len(words) > max_words:
        return ' '.join(words[:max_words]) + '...'
    return text

# Charger la configuration
config = load_config()

# Constantes de configuration
MAX_ARTICLES = config["maxArticles"]
MAX_WORDS_DESCRIPTION = config["maxWordsDescription"]
KEYWORDS_TO_SKIP = config["keywordsToSkip"]

# Liste des subreddits à scrapper
subreddits = ["r/java", "r/javascript", "r/rust", "r/golang", "r/python", "/C_Programming"]

all_items = []

for subreddit in subreddits:
    URL = f"https://www.reddit.com/{subreddit}/new.json?limit={MAX_ARTICLES}"

    # Effectuer une requête GET pour obtenir les données
    response = requests.get(URL, headers={'User-agent': 'Mozilla/5.0'})
    data = response.json()

    # Extraire les articles
    items = []
    for post in data['data']['children']:
        title = post['data']['title']
        link = post['data']['url']
        description = post['data']['selftext'] if 'selftext' in post['data'] else ''

        if link and not contains_keyword(title, KEYWORDS_TO_SKIP):
            if len(items) >= MAX_ARTICLES:
                break
            items.append({
                'subreddit': subreddit,
                'title': title,
                'link': link,
                'description': limit_words(description, MAX_WORDS_DESCRIPTION)
            })
    all_items.extend(items)

# Sauvegarder les données en JSON
json_path = 'config/reddit_datas.json'
with open(json_path, 'w') as json_file:
    json.dump({'items': all_items}, json_file, indent=4)

print(f"Les données ont été sauvegardées dans {json_path}")