import requests
import json
import re
import os

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

config = load_config()

# Constantes de configuration
MAX_ARTICLES = config["maxArticles"]
MAX_WORDS_DESCRIPTION = config["maxWordsDescription"]
KEYWORDS_TO_SKIP = config["keywordsToSkip"]

# Liste des subreddits à scrapper
subreddits = ["r/java", "r/javascript", "r/rust", "r/golang", "r/python", "r/C_Programming"]

def contains_keyword(title, keywords):
    return any(keyword.lower() in title.lower() for keyword in keywords)

def limit_words(text, max_words):
    words = re.findall(r'\b\w+\b', text)
    if len(words) > max_words:
        return ' '.join(words[:max_words]) + '...'
    return text

# Créer le répertoire de sortie s'il n'existe pas
output_dir = 'config'
os.makedirs(output_dir, exist_ok=True)

for subreddit in subreddits:
    URL = f"https://www.reddit.com/{subreddit}/new.json?limit={MAX_ARTICLES}"

    # Effectuer une requête GET pour obtenir les données
    response = requests.get(URL, headers={'User-agent': 'Mozilla/5.0'})
    data = response.json()

    # Extraire les articles
    items = []
    for post in data['data']['children']:
        post_data = post['data']
        title = post_data.get('title', 'No Title')
        link = post_data.get('url', 'No Link')
        description = post_data.get('selftext', '')

        if link and not contains_keyword(title, KEYWORDS_TO_SKIP):
            if len(items) >= MAX_ARTICLES:
                break
            items.append({
                'subreddit': post_data.get('subreddit', 'No Subreddit'),
                'title': title,
                'link': link,
                'description': limit_words(description, MAX_WORDS_DESCRIPTION)
            })

    # Sauvegarder les données en JSON pour chaque subreddit
    subreddit_filename = subreddit.replace('/', '_') + '_datas.json'
    json_path = os.path.join(output_dir, subreddit_filename)
    with open(json_path, 'w') as json_file:
        json.dump({'items': items}, json_file, indent=4)

    print(f"Les données pour {subreddit} ont été sauvegardées dans {json_path}")