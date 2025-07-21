document.addEventListener('DOMContentLoaded', () => {
    const bmvContainer = document.getElementById('bmv-stocks-container');
    const internationalContainer = document.getElementById('international-stocks-container');
    const indicesContainer = document.getElementById('indices-container');
    const newsContainer = document.getElementById('news-container');
    const favoritesContainer = document.getElementById('favorites-container');
    const favoritesSection = document.getElementById('favorites');
    const searchInput = document.getElementById('search-input');
    const themeSwitcher = document.getElementById('theme-switcher');

    let stockChart = null;
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    const allStocks = [...mexicanStocks, ...internationalStocks];

    const createStockCard = (stock) => {
        const changeClass = stock.change >= 0 ? 'text-profit' : 'text-loss';
        const changeIcon = stock.change >= 0 ? 'bi-arrow-up-right' : 'bi-arrow-down-left';
        const isFavorite = favorites.includes(stock.ticker);
        const favoriteIconClass = isFavorite ? 'bi-star-fill' : 'bi-star';

        return `
            <div class="col-lg-3 col-md-4 col-sm-6 stock-card-wrapper" data-ticker="${stock.ticker}">
                <div class="card stock-card h-100">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h5 class="card-title mb-0">${stock.name}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">${stock.ticker}</h6>
                            </div>
                            <i class="bi ${favoriteIconClass} favorite-btn fs-5" data-ticker="${stock.ticker}" style="cursor: pointer;"></i>
                        </div>
                        <div class="mt-auto">
                            <p class="stock-price mb-0">${stock.price.toFixed(2)}</p>
                            <p class="stock-change ${changeClass} mb-0">
                                <i class="bi ${changeIcon}"></i> ${stock.change.toFixed(2)} (${stock.changePercent.toFixed(2)}%)
                            </p>
                        </div>
                         <button class="btn btn-outline-primary btn-sm mt-3 view-details-btn" data-ticker="${stock.ticker}">View Details</button>
                    </div>
                </div>
            </div>
        `;
    };

    const createIndexCard = (item, index) => `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <div class="row justify-content-center">
                <div class="col-11 col-md-10 col-lg-8">
                     <div class="index-card text-center">
                        <span class="fw-bold">${item.name}:</span>
                        <span class="ms-2">${item.value.toFixed(2)}</span>
                        <span class="ms-2 ${item.change >= 0 ? 'text-profit' : 'text-loss'}">
                            ${item.change.toFixed(2)} (${item.changePercent.toFixed(2)}%)
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;

    const createNewsItem = (item) => `
        <a href="#" class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
                <h5 class="mb-1">${item.title}</h5>
                <small>${item.date}</small>
            </div>
            <p class="mb-1">${item.summary}</p>
            <small>${item.source}</small>
        </a>
    `;

    const renderStocks = () => {
        bmvContainer.innerHTML = mexicanStocks.map(createStockCard).join('');
        internationalContainer.innerHTML = internationalStocks.map(createStockCard).join('');
        renderFavorites();
        addCardListeners();
    };
    
    const renderFavorites = () => {
        const favoriteStocks = allStocks.filter(s => favorites.includes(s.ticker));
        if (favoriteStocks.length > 0) {
            favoritesSection.classList.remove('d-none');
            favoritesContainer.innerHTML = favoriteStocks.map(createStockCard).join('');
        } else {
            favoritesSection.classList.add('d-none');
            favoritesContainer.innerHTML = '';
        }
    };
    
    const toggleFavorite = (ticker) => {
        const index = favorites.indexOf(ticker);
        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(ticker);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        renderStocks(); // Re-render all to update star icons
    };
    
    const showStockDetails = (ticker) => {
        const stock = allStocks.find(s => s.ticker === ticker);
        if (!stock) return;

        const modal = new bootstrap.Modal(document.getElementById('stock-modal'));
        document.getElementById('stock-modal-label').innerText = `${stock.name} (${stock.ticker})`;

        const chartCanvas = document.getElementById('stock-chart');
        
        if (stockChart) {
            stockChart.destroy();
        }

        const labels = stock.history.map((_, i) => `Day ${i + 1}`);
        stockChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Price History',
                    data: stock.history,
                    borderColor: 'var(--color-neutral)',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
            }
        });
        
        modal.show();
    };
    
    function addCardListeners() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(e.target.dataset.ticker);
            });
        });
        
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                showStockDetails(e.target.dataset.ticker);
            });
        });
    }

    const filterStocks = (query) => {
        const upperQuery = query.toUpperCase();
        document.querySelectorAll('.stock-card-wrapper').forEach(card => {
            const ticker = card.dataset.ticker.toUpperCase();
            if (ticker.includes(upperQuery)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    };
    
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeSwitcher.checked = theme === 'dark';
        if (stockChart) {
            stockChart.options.scales.x.ticks.color = theme === 'dark' ? '#e0e0e0' : '#212529';
            stockChart.options.scales.y.ticks.color = theme === 'dark' ? '#e0e0e0' : '#212529';
            stockChart.update();
        }
    };
    
    // Initial Setup
    indicesContainer.innerHTML = globalIndices.map(createIndexCard).join('');
    newsContainer.innerHTML = newsFeed.map(createNewsItem).join('');
    renderStocks();
    
    // Event Listeners
    searchInput.addEventListener('input', (e) => filterStocks(e.target.value));
    
    themeSwitcher.addEventListener('change', (e) => {
        setTheme(e.target.checked ? 'dark' : 'light');
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
});

