document.addEventListener('DOMContentLoaded', async () => {
    // Variables de configuration
    const username = 'Luthor91';
    const repo = 'aboutme';
    const branch = 'main';
    let config = {};

    // Charger la configuration depuis GitHub
    const loadConfig = async () => {
        const url = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/config/config.json`;
        try {
            const response = await fetch(url);
            config = response.ok ? await response.json() : { maxArticles: 30, maxDescriptionLength: 150 };
        } catch (error) {
            console.error('Fetch error for config:', error);
            config = { maxArticles: 30, maxDescriptionLength: 150 };
        }
    };

    await loadConfig();
    const { maxArticles, maxDescriptionLength, urls, subreddits, keywordsToSkip } = config;
    console.log(config);
    
    // Sélecteurs
    const tabs = document.querySelectorAll('.tab-button');
    const newsList = document.getElementById('news-list');
    const errorMessage = document.getElementById('error-message');
    const searchInput = document.getElementById('search-input');
    const themeSelect = document.getElementById('theme-select');
    const redditDropdown = document.getElementById('reddit-dropdown');
    const dropdownButton = document.getElementById('reddit-button');
    const backToTopButton = document.getElementById('back-to-top');

    const getApiUrl = (source, subreddit = '') => {
        let apiUrl = urls[source];
        if (source === 'reddit' && subreddit) {
            apiUrl = apiUrl.replace('{subreddit}', subreddit).replace('{MAX_ARTICLES}', maxArticles);
        } else {
            apiUrl = apiUrl.replace('{MAX_ARTICLES}', maxArticles);
        }
        return apiUrl;
    };

    const fetchDataFromApi = async (url, cacheName) => {
        // Vérifier si la réponse est en cache
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(url);

        if (cachedResponse) {
            console.log(`Données récupérées depuis le cache: ${url}`);
            return cachedResponse.json();
        }

        try {
            const response = await fetch(url);
            const data = await response.json();

            // Storer la réponse dans le cache
            cache.put(url, new Response(JSON.stringify(data)));

            console.log(`Données récupérées depuis l'API: ${url}`);
            return data;
        } catch (error) {
            if (cachedResponse) {
                console.warn(`Erreur réseau. Utilisation du cache: ${url}`);
                return cachedResponse.json();
            } else {
                throw new Error(`Échec de la requête et du cache pour ${url}`);
            }
        }
    };

    // Fonction pour récupérer les données des différentes APIs
    const fetchData = async (source, subreddit = '') => {
        const apiUrl = getApiUrl(source, subreddit);
        const cacheName = 'api-data-cache';
        
        try {
            const data = await fetchDataFromApi(apiUrl, cacheName);
            if (source === 'reddit') {
                displayArticles(data.data.children.map(child => child.data), searchInput.value); // Reddit a une structure différente
            } else if (source === 'hackernews') {
                displayArticles(data.hits, searchInput.value); // Hackernews a une structure différente
            } else if (source === 'devto') {
                displayArticles(data, searchInput.value);
            } else {
                displayArticles(data.items, searchInput.value); // RSS feed comme slashdot
            }
        } catch (error) {
            console.error('Fetch error:', error);
            errorMessage.textContent = 'Failed to load data. Please try again later.';
        }
    };

    // Filtrage des articles selon les mots-clés à ignorer et la recherche
    const filterArticles = (articles, query) => {
        if (!query.trim()) return articles.slice(0, maxArticles); // Affiche tous les articles si la recherche est vide

        const keywords = query.toLowerCase().split(/\s+/);
        return articles.filter(item => {
            const title = item.title ? item.title.toLowerCase() : '';
            const description = item.description ? item.description.toLowerCase() : '';
            
            // Exclure les articles avec des mots-clés à ignorer
            if (keywordsToSkip.some(keyword => title.includes(keyword) || description.includes(keyword))) {
                return false;
            }

            // Filtrer selon la recherche
            return keywords.some(keyword => title.includes(keyword) || description.includes(keyword));
        }).slice(0, maxArticles);
    };

    const truncateDescription = (description) => {
        if (!description || description.length <= maxDescriptionLength) return description;
        const truncated = description.slice(0, maxDescriptionLength);
        const lastSpace = truncated.lastIndexOf(' ');
        return lastSpace > 0 ? truncated.slice(0, lastSpace) + '...' : truncated + '...';
    };

    const displayArticles = (articles, query) => {
        newsList.innerHTML = '';
        const filteredItems = filterArticles(articles, query);
    
        filteredItems.forEach(item => {
            if (item.url || item.link) {
                const listItem = document.createElement('li');
                listItem.classList.add('news-list-item');
                
                const link = item.url ? item.url : item.link;
                const title = item.title ? item.title : 'No title';
                const description = truncateDescription(item.description ? item.description : 'No description');

                listItem.innerHTML = `
                    <a href="${link}" target="_blank" class="news-list-link">
                        <h3>${title}</h3>
                        <p class="description">${description}</p>
                    </a>
                `;
                
                newsList.appendChild(listItem);
            }
        });
    };

    // Gestion de la recherche
    searchInput.addEventListener('input', () => {
        const articles = Array.from(newsList.querySelectorAll('.news-list-item')).map(li => ({
            title: li.querySelector('h3').textContent,
            description: li.querySelector('p.description').textContent,
            link: li.querySelector('a').href
        }));
        displayArticles(articles, searchInput.value);
    });

    // Gestion du changement de thème
    const changeTheme = (theme) => {
        document.body.classList.remove('light-theme', 'dark-theme', 'autumn-theme', 'refined-dark-theme');
        document.body.classList.add(`${theme}`);
        localStorage.setItem('selectedTheme', theme);
    };

    // Initialisation du thème
    const savedTheme = localStorage.getItem('selectedTheme') || 'light-theme';
    changeTheme(savedTheme);
    themeSelect.value = savedTheme;

    themeSelect.addEventListener('change', (e) => changeTheme(e.target.value));

    // Gestion des onglets
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            fetchData(tab.dataset.source);
        });
    });

    // Gestion du menu déroulant Reddit
    dropdownButton.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleDropdown();
    });

    redditDropdown.addEventListener('click', (event) => {
        if (event.target.matches('.subreddit-button')) {
            const subreddit = event.target.dataset.source;
            fetchData('reddit', subreddit);
            dropdownButton.textContent = event.target.textContent + '▼';
            redditDropdown.classList.remove('show');
        }
    });

    // Fonction pour afficher le dropdown à la position du bouton
    function toggleDropdown() {
        const rect = dropdownButton.getBoundingClientRect();
        redditDropdown.style.top = `${rect.bottom + window.scrollY}px`;
        redditDropdown.style.left = `${rect.left + window.scrollX}px`;
        redditDropdown.classList.toggle('show');
    }

    document.addEventListener('click', (event) => {
        if (!event.target.closest('#reddit-button') && !event.target.closest('#reddit-dropdown') && redditDropdown.classList.contains('show')) {
            redditDropdown.classList.remove('show');
        }
    });

    // Gestion du bouton retour en haut
    backToTopButton.addEventListener('click', function(event) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    fetchData("hackernews");
});