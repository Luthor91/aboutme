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
    const dropdownButton = document.getElementById('reddit-button'); // Change the selector for the dropdown button

    const getRawUrl = (source) => `https://raw.githubusercontent.com/${username}/${repo}/${branch}/config/${source}_datas.json`;

    // Fonction pour récupérer les données
    const fetchData = async (source) => {
        if (!source) return;
        const url = getRawUrl(source);

        try {
            const response = await fetch(url);
            const data = response.ok ? await response.json() : await fetch(`/config/${source}_datas.json`).then(r => r.json());
            displayArticles(data.items);
        } catch (error) {
            console.error('Fetch error:', error);
            errorMessage.textContent = 'Failed to load data. Please try again later.';
        }
    };

    // Filtrage et affichage des articles
    const filterArticles = (articles, query) => {
        if (!query) return articles.slice(0, maxArticles);
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

    const displayArticles = (articles) => {
        newsList.innerHTML = '';
        const query = searchInput.value;
        const filteredItems = filterArticles(articles, query);

        filteredItems.forEach(item => {
            if (item.link && item.link !== 'No Link') {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                    <p class="description">${truncateDescription(item.description)}</p>
                `;
                newsList.appendChild(listItem);
            }
        });
    };

    // Gestion de la recherche
    searchInput.addEventListener('input', () => {
        const articles = Array.from(newsList.querySelectorAll('li')).map(li => ({
            title: li.querySelector('h3 a').textContent,
            description: li.querySelector('p.description').textContent,
            link: li.querySelector('h3 a').href
        }));
        displayArticles(articles);
    });

    // Gestion du thème
    const switchTheme = (theme) => {
        document.body.classList.remove('light-mode', 'dark-mode', 'autumn-mode', 'refined-dark-mode');
        document.body.classList.add(`${theme}-mode`);
        localStorage.setItem('selectedTheme', theme);
    };

    const savedTheme = localStorage.getItem('selectedTheme') || 'light';
    switchTheme(savedTheme);
    themeSelect.value = savedTheme;
    themeSelect.addEventListener('change', (e) => switchTheme(e.target.value));

    // Gestion des onglets
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(btn => {
                btn.classList.remove('active');
            });

            tab.classList.add('active');

            // Synchroniser la classe active du bouton déroulant avec l'onglet actif
            if (tab.dataset.source === 'reddit') {
                redditDropdown.classList.toggle('show');
            } else {
                fetchData(tab.dataset.source);
                redditDropdown.classList.remove('show');
            }
        });
    });

    // Gestion du menu déroulant Reddit
    dropdownButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Stop propagation to prevent closing dropdown immediately
        redditDropdown.classList.toggle('show');
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('#reddit-button') && !event.target.closest('#reddit-dropdown') && redditDropdown.classList.contains('show')) {
            redditDropdown.classList.remove('show');
        }
    });

    redditDropdown.addEventListener('click', (event) => {
        if (event.target.matches('.subreddit-button')) {
            const subreddit = event.target.dataset.source; // Use 'data-source' instead of 'data-subreddit'
            fetchData(subreddit);
            dropdownButton.textContent = event.target.textContent;
            redditDropdown.classList.remove('show');
        }
    });
});