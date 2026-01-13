document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const elements = {
        navSearchContainer: document.getElementById('nav-search-container'),
        navSearchForm: document.getElementById('nav-search-form'),
        navSearchInput: document.querySelector('.nav-search-input'),

        homeView: document.getElementById('home-view'),
        homeSearchForm: document.getElementById('home-search-form'),
        homeSearchInput: document.getElementById('home-search-input'),
        hintBtns: document.querySelectorAll('.hint-btn'),

        resultsView: document.getElementById('results-view'),
        resultQuery: document.getElementById('result-query'),
        sidebarList: document.getElementById('sidebar-list'),
        mainResult: document.getElementById('main-result'),

        wotdBugis: document.getElementById('wotd-bugis'),
        wotdIndonesia: document.getElementById('wotd-indonesia'),
        wotdLink: document.getElementById('wotd-link'),

        loading: document.getElementById('loading')
    };

    // Helper: Update URL state
    function updateUrl(query) {
        if (query) {
            const newUrl = `${window.location.pathname}?q=${encodeURIComponent(query)}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
        } else {
            const newUrl = window.location.pathname;
            window.history.pushState({ path: newUrl }, '', newUrl);
        }
    }

    // API Call
    async function fetchData(query = '') {
        try {
            elements.loading.classList.remove('hidden');
            elements.homeView.classList.add('hidden');
            elements.resultsView.classList.add('hidden');

            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return { results: [], query: query };
        } finally {
            elements.loading.classList.add('hidden');
        }
    }

    // Render Home View
    function renderHome(data) {
        elements.homeView.classList.remove('hidden');
        elements.resultsView.classList.add('hidden');
        elements.navSearchContainer.classList.add('hidden');

        // Set Word of the Day (random)
        if (data.results && data.results.length > 0) {
            const random = data.results[Math.floor(Math.random() * data.results.length)];
            elements.wotdBugis.textContent = random.bugis;
            elements.wotdIndonesia.textContent = random.indonesia;

            elements.wotdLink.onclick = (e) => {
                e.preventDefault();
                handleSearch(null, { value: random.bugis });
            };
        }
    }

    // Render Results View
    function renderResults(data) {
        elements.homeView.classList.add('hidden');
        elements.resultsView.classList.remove('hidden');
        elements.navSearchContainer.classList.remove('hidden');

        elements.resultQuery.textContent = data.query;
        elements.navSearchInput.value = data.query;

        const results = data.results || [];

        // Render Sidebar (Similar Matches)
        elements.sidebarList.innerHTML = '';
        if (results.length > 0) {
            const sidebarItems = results.slice(0, 5); // Show top 5
            sidebarItems.forEach(item => {
                const li = document.createElement('li');
                li.className = 'sidebar-item';
                li.innerHTML = `
                    <span class="sidebar-word">${item.bugis}</span>
                    <span class="sidebar-sub">${item.indonesia}</span>
                `;
                li.onclick = () => {
                    handleSearch(null, { value: item.bugis });
                };
                elements.sidebarList.appendChild(li);
            });

            if (results.length > 5) {
                const li = document.createElement('li');
                li.className = 'sidebar-item';
                li.style.color = 'var(--primary)';
                li.style.fontWeight = '500';
                li.textContent = `Lihat ${results.length - 5} lainnya...`;
                elements.sidebarList.appendChild(li);
            }
        } else {
            elements.sidebarList.innerHTML = '<li class="sidebar-item" style="cursor:default; color: var(--text-muted);">Tidak ada saran</li>';
        }

        // Render Main Content
        elements.mainResult.innerHTML = '';
        if (results.length === 0) {
            elements.mainResult.innerHTML = `
                <div class="result-card">
                    <h2>Tidak ditemukan hasil untuk "${data.query}"</h2>
                    <p style="margin-top: 1rem; color: var(--text-muted);">Coba kata kunci lain atau periksa ejaan Anda.</p>
                </div>
            `;
        } else {
            const match = results[0];
            elements.mainResult.innerHTML = `
                <div class="result-card">
                    <div class="result-header">
                        <div>
                            <h1 class="main-word-title">${match.bugis}</h1>
                            <div class="word-meta">
                                <span class="meta-tag">Bugis</span>
                                <span class="meta-tag" style="background: white; border: 1px solid var(--border);">Kata Dasar: ${match.bugis}</span>
                            </div>
                        </div>
                    </div>

                    <div class="section-label">Definisi</div>
                    <div class="definition-text">
                        <p>1. <strong>${match.indonesia}</strong></p>
                    </div>
                </div>
            `;
            // NOTE: Removed "Examples & Usage" and "Pronounce" buttons as requested
        }
    }

    // Search Handler
    function handleSearch(e, input) {
        if (e) e.preventDefault();
        const query = input.value.trim();
        if (query) {
            updateUrl(query);
            fetchData(query).then(data => renderResults(data));
        }
    }

    // Event Listeners
    elements.navSearchForm.addEventListener('submit', (e) => handleSearch(e, elements.navSearchInput));
    elements.homeSearchForm.addEventListener('submit', (e) => handleSearch(e, elements.homeSearchInput));

    elements.hintBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const word = btn.dataset.word;
            handleSearch(null, { value: word });
        });
    });

    // Handle Back/Forward Browser Buttons
    window.addEventListener('popstate', (e) => {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        if (query) {
            fetchData(query).then(data => renderResults(data));
        } else {
            fetchData('').then(data => renderHome(data));
        }
    });

    // Initial Load
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q');

    if (initialQuery) {
        fetchData(initialQuery).then(data => renderResults(data));
    } else {
        fetchData('').then(data => renderHome(data));
    }
});
