document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-button');
    const newsList = document.getElementById('news-list');
    const errorMessage = document.getElementById('error-message');

    const username = 'Luthor91';
    const repo = 'aboutme';
    const branch = 'main';

    const fetchDataFromGitHub = async (source) => {
        const url = `https://raw.githubusercontent.com/${username}/${repo}/${branch}/datas/${source}_datas.json`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayArticles(data.items);
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
            displayArticles(data.items);
        } catch (error) {
            console.error('Fetch error from local:', error);
            errorMessage.textContent = 'Failed to load data. Please try again later.';
        }
    };

    const fetchData = async (source) => {
        // Attempt to fetch data from GitHub first
        await fetchDataFromGitHub(source);
    };

    const displayArticles = (items) => {
        newsList.innerHTML = '';
        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
                <p class="description">${item.description}</p>
            `;
            newsList.appendChild(listItem);
        });
    };

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