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
    const { maxArticles, maxDescriptionLength } = config;

    // Sélecteurs
    const tabs = document.querySelectorAll('.tab-button');
    const newsList = document.getElementById('news-list');
    const errorMessage = document.getElementById('error-message');
    const searchInput = document.getElementById('search-input');
    const themeSelect = document.getElementById('theme-select');
    const redditDropdown = document.getElementById('reddit-dropdown');
    const dropdownButton = document.getElementById('reddit-button');
    const backToTopButton = document.getElementById('back-to-top');

    // Fonction pour récupérer les données
    const fetchData = async (source) => {
        if (!source) return;
        const url = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/datas.json`;

        try {
            const response = await fetch(url);
            const data = response.ok ? await response.json() : await fetch(`/datas.json`).then(r => r.json());
            displayArticles(data[source] && data[source].items, searchInput.value);  // Passe la valeur de recherche à la fonction
        } catch (error) {
            console.error('Fetch error:', error);
            errorMessage.textContent = 'Failed to load data. Please try again later.';
        }
    };

    // Filtrage et affichage des articles
    const filterArticles = (articles, query) => {
        if (!query.trim()) return articles.slice(0, maxArticles); // Affiche tous les articles si la recherche est vide
        const keywords = query.toLowerCase().split(/\s+/);
        return articles.filter(item => {
            const title = item.title.toLowerCase();
            const description = item.description.toLowerCase();
            return keywords.some(keyword => title.includes(keyword) || description.includes(keyword));
        }).slice(0, maxArticles);
    };

    const truncateDescription = (description) => {
        if (description.length <= maxDescriptionLength) return description;
        const truncated = description.slice(0, maxDescriptionLength);
        const lastSpace = truncated.lastIndexOf(' ');
        return lastSpace > 0 ? truncated.slice(0, lastSpace) + '...' : truncated + '...';
    };

    const displayArticles = (articles, query) => {
        newsList.innerHTML = '';
        if (!articles) {
            errorMessage.textContent = 'No data available.';
            return;
        }
        const filteredItems = filterArticles(articles, query);
    
        filteredItems.forEach(item => {
            if (item.link && item.link !== 'No Link') {
                const listItem = document.createElement('li');
                listItem.classList.add('news-list-item');  // Ajout de la classe "news-list-item"
                
                // Enveloppe tout le contenu dans un seul lien <a>
                listItem.innerHTML = `
                    <a href="${item.link}" target="_blank" class="news-list-link">
                        <h3>${item.title}</h3>
                        <p class="description">${truncateDescription(item.description)}</p>
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
        displayArticles(articles, searchInput.value); // Filtre les articles en fonction de la recherche
    });

    // Fonction pour changer le thème
    const changeTheme = (theme) => {
        document.body.classList.remove('light-theme', 'dark-theme', 'autumn-theme', 'refined-dark-theme');
        document.body.classList.add(`${theme}`);
        localStorage.setItem('selectedTheme', theme);
    };

    // Initialisation du thème
    const savedTheme = localStorage.getItem('selectedTheme') || 'light-theme';
    changeTheme(savedTheme);
    themeSelect.value = savedTheme; 

    // Gestion du changement de thème
    themeSelect.addEventListener('change', (e) => changeTheme(e.target.value));

    // Gestion des onglets
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Retirer la classe "active" de tous les onglets
            tabs.forEach(t => t.classList.remove('active'));
    
            // Ajouter la classe "active" à l'onglet cliqué
            tab.classList.add('active');
    
            fetchData(tab.dataset.source);

        });
    });

    // Fonction pour afficher le dropdown à la position du bouton
    function toggleDropdown() {
        // Récupérer les coordonnées et dimensions du bouton
        const rect = dropdownButton.getBoundingClientRect();
        
        // Calculer la position du dropdown en fonction du bouton
        redditDropdown.style.top = `${rect.bottom + window.scrollY}px`; // En dessous du bouton
        redditDropdown.style.left = `${rect.left + window.scrollX}px`; // Aligné au bouton

        // Basculer la classe "show" pour afficher ou cacher le dropdown
        redditDropdown.classList.toggle('show');
        console.log("toggled");
        
    }

    // Gestion du menu déroulant Reddit
    dropdownButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Stop propagation to prevent closing dropdown immediately
        toggleDropdown();
    });

    // Fermer le menu déroulant lorsqu'on clique à l'extérieur
    document.addEventListener('click', (event) => {
        if (!event.target.closest('#reddit-button') && !event.target.closest('#reddit-dropdown') && redditDropdown.classList.contains('show')) {
            redditDropdown.classList.remove('show');
        }
    });

    redditDropdown.addEventListener('click', (event) => {
        if (event.target.matches('.subreddit-button')) {
            const subreddit = event.target.dataset.source;
            fetchData(subreddit);
            dropdownButton.textContent = event.target.textContent + '▼';
            redditDropdown.classList.remove('show');
        }
    });

    // Gestion du bouton retour en haut
    backToTopButton.addEventListener('click', function(event) {
        event.preventDefault();  // Empêche le comportement par défaut du lien
        window.scrollTo({ top: 0, behavior: 'smooth' });  // Faire défiler en douceur vers le haut de la page
    });

    fetchData("hackernews");
});