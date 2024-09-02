document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-button');
    const newsList = document.getElementById('news-list');
    const errorMessage = document.getElementById('error-message');
    const searchInput = document.getElementById('search-input');

    const username = 'Luthor91';
    const repo = 'aboutme';
    const branch = 'main';
    const maxFilteredArticles = 10;

    const getRawUrl = (source) => `https://raw.githubusercontent.com/${username}/${repo}/${branch}/datas/${source}_datas.json`;

    let articles = [];

    const fetchDataFromGitHub = async (source) => {
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
            errorMessage.textContent = 'Failed to load data from GitHub. Trying local data...';
            // Try to load from local file as fallback
            fetchDataFromLocal(source);
        }
    };

    const fetchDataFromLocal = async (source) => {
        try {
            const response = await fetch(`/datas/${source}_datas.json`);
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
        // Attempt to fetch data from GitHub first
        await fetchDataFromGitHub(source);
    };

    const filterArticles = (query) => {
        if (!query) return articles.slice(0, maxFilteredArticles);  // Si aucune requête, afficher les articles par défaut
    
        const keywords = query.toLowerCase().split(/\s+/);  // Diviser la requête en mots-clés
    
        return articles
            .filter(item => {
                const title = item.title.toLowerCase();
                const description = item.description.toLowerCase();
                // Vérifie si l'article contient un des mots-clés dans le titre ou la description
                const containsKeyword = keywords.some(keyword => title.includes(keyword) || description.includes(keyword));
                return containsKeyword;  // Conserver les articles contenant les mots-clés
            })
            .slice(0, maxFilteredArticles);  // Limiter le nombre d'articles à afficher
    };
    

    const displayArticles = () => {
        newsList.innerHTML = '';
        const query = searchInput.value;    
        const filteredItems = filterArticles(query);
        
        filteredItems.forEach(item => {
            if (item.link && item.link !== 'No Link') {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                    <p class="description">${item.description}</p>
                `;
                newsList.appendChild(listItem);
            }
        });
    };

    const onSearchInput = () => {
        displayArticles();  // Refresh articles based on the search input
    };

    searchInput.addEventListener('input', onSearchInput);

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(btn => btn.classList.remove('active'));
            tab.classList.add('active');
            fetchData(tab.dataset.source);
        });
    });

    // Load default tab content
    fetchData('hackernews');
});