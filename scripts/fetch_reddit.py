import requests
import json

# URL du fichier de configuration sur GitHub
CONFIG_URL = "https://raw.githubusercontent.com/Luthor91/aboutme/main/config/config.json"

# Fonction pour charger la configuration depuis GitHub
def load_config():
    try:
        response = requests.get(CONFIG_URL)
        response.raise_for_status()  # Vé   rifie les erreurs HTTP
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

# Subreddits pour les langages spécifiques
SUBREDDITS = ["java", "javascript", "rust", "C_Programming", "golang", "python"]

# En-têtes pour éviter les restrictions de l'API Reddit
HEADERS = {'User-Agent': 'Mozilla/5.0'}

# Fonction pour limiter la description à un nombre maximum de mots
def limit_words(text, max_words):
    words = text.split()
    if len(words) > max_words:
        return ' '.join(words[:max_words]) + '...'
    return text

# Fonction pour vérifier si un titre contient un des mots-clés à filtrer
def contains_keyword(title, keywords):
    return any(keyword.lower() in title.lower() for keyword in keywords)

# Fonction pour récupérer les derniers articles de Reddit
def fetch_reddit_data():
    items = []
    try:
        for subreddit in SUBREDDITS:
            url = f"https://www.reddit.com/r/{subreddit}/new.json?limit={MAX_ARTICLES}"
            response = requests.get(url, headers=HEADERS)
            response.raise_for_status()  # Vérifie les erreurs HTTP
            
            data = response.json()
            for post in data['data']['children']:
                post_data = post['data']
                title = post_data.get('title', 'No Title')
                link = post_data.get('url', 'No Link')
                description = post_data.get('selftext', 'No Description')
                
                if link and not contains_keyword(title, KEYWORDS_TO_SKIP):
                    if len(items) >= MAX_ARTICLES:
                        break
                    items.append({
                        'title': f"{subreddit} : {title}",
                        'link': link,
                        'description': limit_words(description, MAX_WORDS_DESCRIPTION)
                    })
        
        # Sauvegarder les données en JSON
        json_path = 'config/reddit_datas.json'
        with open(json_path, 'w') as json_file:
            json.dump({'items': items}, json_file, indent=4)
        
        print(f"Les données ont été sauvegardées dans {json_path}")
    except Exception as e:
        print(f"Erreur lors de la récupération des données de Reddit: {str(e)}")

if __name__ == "__main__":
    fetch_reddit_data()