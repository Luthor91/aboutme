document.addEventListener('DOMContentLoaded', async () => {
    // Variables pour la configuration
    let config = {};
    const username = 'Luthor91';
    const repo = 'aboutme';
    const branch = 'main';

    // Charger la configuration depuis le fichier JSON hébergé sur GitHub
    const loadConfig = async () => {
        const url = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/config/config.json`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            config = await response.json();
        } catch (error) {
            console.error('Fetch error for config:', error);
            // Valeurs par défaut si le fichier de config ne peut pas être chargé
            config = {
                maxArticles: 30,
                maxDescriptionLength: 150
            };
        }
    };

    await loadConfig();

    const tabs = document.querySelectorAll('.tab-button');
    const newsList = document.getElementById('news-list');
    const errorMessage = document.getElementById('error-message');
    const searchInput = document.getElementById('search-input');
    const themeSelect = document.getElementById('theme-select');

    const { maxArticles, maxDescriptionLength } = config;

    const getRawUrl = (source) => `https://raw.githubusercontent.com/${username}/${repo}/${branch}/config/${source}_datas.json`;

    let articles = [];

    const fetchDataFromGitHub = async (source) => {
        if (source === undefined) return;
        
        const url = getRawUrl(source);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            articles = data.items;
            displayArticles();
        } catch (error) {
            console.error('Fetch error from GitHub:', error);
            fetchDataFromLocal(source);
        }
    };

    const fetchDataFromLocal = async (source) => {
        try {
            const response = await fetch(`/config/${source}_datas.json`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            articles = data.items;
            displayArticles();
        } catch (error) {
            console.error('Fetch error from local:', error);
            errorMessage.textContent = 'Failed to load data. Please try again later.';
        }
    };

    const fetchData = async (source) => {
        await fetchDataFromGitHub(source);
    };

    const filterArticles = (query) => {
        if (!query) return articles.slice(0, maxArticles);

        const keywords = query.toLowerCase().split(/\s+/);

        return articles
            .filter(item => {
                const title = item.title.toLowerCase();
                const description = item.description.toLowerCase();
                const containsKeyword = keywords.some(keyword => title.includes(keyword) || description.includes(keyword));
                return containsKeyword;
            })
            .slice(0, maxArticles);
    };

    const truncateDescription = (description, maxLength) => {
        if (description.length <= maxLength) return description;

        const truncated = description.slice(0, maxLength);
        const lastSpace = truncated.lastIndexOf(' ');

        return lastSpace > 0 ? truncated.slice(0, lastSpace) + '...' : truncated + '...';
    };

    const displayArticles = () => {
        newsList.innerHTML = '';
        const query = searchInput.value;
        const filteredItems = filterArticles(query);

        filteredItems.forEach(item => {
            if (item.link && item.link !== 'No Link') {
                const listItem = document.createElement('li');
                const description = truncateDescription(item.description, maxDescriptionLength);
                listItem.innerHTML = `
                    <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                    <p class="description">${description}</p>
                `;
                newsList.appendChild(listItem);
            }
        });

        adjustDescriptionWidth();
    };

    const adjustDescriptionWidth = () => {
        const descriptions = document.querySelectorAll('#news-list p.description');
        descriptions.forEach(desc => {
            const parentWidth = desc.parentElement.clientWidth;
            const textWidth = desc.scrollWidth;
            if (textWidth > parentWidth) {
                desc.style.whiteSpace = 'pre-wrap';
            } else {
                desc.style.whiteSpace = 'normal';
            }
        });
    };

    const onSearchInput = () => {
        displayArticles();
    };

    const switchTheme = (theme) => {
        document.body.classList.remove('light-mode', 'dark-mode', 'autumn-mode', 'refined-dark-mode');
        document.body.classList.add(`${theme}-mode`);
        localStorage.setItem('selectedTheme', theme); // Sauvegarde du thème sélectionné
    };

    // Appliquer le thème enregistré ou par défaut
    const savedTheme = localStorage.getItem('selectedTheme') || 'light';
    switchTheme(savedTheme);
    themeSelect.value = savedTheme;

    searchInput.addEventListener('input', onSearchInput);

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(btn => btn.classList.remove('active'));
            tab.classList.add('active');
            fetchData(tab.dataset.source);
        });
    });

    themeSelect.addEventListener('change', (event) => {
        switchTheme(event.target.value);
    });

    // Initial fetch for default tab
    const defaultTab = document.querySelector('.tab-button[data-source="hackernews"]');
    if (defaultTab) {
        defaultTab.classList.add('active');
        fetchData('hackernews');
    }

    switchTheme(savedTheme);  // Appliquer le thème lors du chargement
});

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const tabs = document.querySelector('.tabs');

    const adjustTabsPosition = () => {
        const headerHeight = header.offsetHeight;
        tabs.style.top = `${headerHeight}px`;
    };

    // Initial adjustment
    adjustTabsPosition();

    // Adjust on window resize
    window.addEventListener('resize', adjustTabsPosition);
});