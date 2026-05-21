/**
 * Main Application Controller (App Shell Router & State Manager)
 * Coordinates SPA navigation, search indexing, themes, and global events.
 */

window.App = {
  currentView: 'dashboard', // dashboard, calculator, admin
  activeCategory: 'All',
  searchQuery: '',

  /**
   * Boots up the platform, registers theme settings, logs traffic, and binds events
   */
  init() {
    // 1. Storage setup & Log visitor analytics
    window.AdminController.initStorage();
    window.AdminController.logVisit();
    window.AdminController.injectAds();

    // 2. Load theme settings
    this.initTheme();

    // 3. Render Dashboard list
    this.filterCalculators();

    // 4. Bind Global Event Handlers
    this.bindEvents();
    
    // Set initial SEO meta tags
    window.SEOAutomator.updateMetadata('dashboard');
  },

  /**
   * Theme configuration (Dark/Light mode)
   */
  initTheme() {
    const savedTheme = localStorage.getItem('hc_theme') || 'dark';
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle-btn');
    
    if (savedTheme === 'light') {
      body.classList.add('light-theme');
      if (themeBtn) themeBtn.innerHTML = '🌙'; // moon icon for light mode (to switch back to dark)
    } else {
      body.classList.remove('light-theme');
      if (themeBtn) themeBtn.innerHTML = '☀️'; // sun icon for dark mode (to switch to light)
    }
  },

  /**
   * Toggles theme and saves to storage
   */
  toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle-btn');
    
    body.classList.toggle('light-theme');
    
    if (body.classList.contains('light-theme')) {
      localStorage.setItem('hc_theme', 'light');
      themeBtn.innerHTML = '🌙';
    } else {
      localStorage.setItem('hc_theme', 'dark');
      themeBtn.innerHTML = '☀️';
    }
  },

  /**
   * Global event bindings
   */
  bindEvents() {
    // Logo & Header Brand
    document.getElementById('brand-logo').addEventListener('click', () => this.navigate('dashboard'));

    // Theme Switch
    document.getElementById('theme-toggle-btn').addEventListener('click', () => this.toggleTheme());

    // Search Box keydowns
    const searchBox = document.getElementById('dashboard-search-bar');
    if (searchBox) {
      searchBox.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.filterCalculators();
      });
    }

    // Category Filter Buttons
    const categoryChips = document.querySelectorAll('.category-chip');
    categoryChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        categoryChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        
        this.activeCategory = chip.dataset.category;
        this.filterCalculators();
      });
    });

    // Calculator card click triggers
    const calcCards = document.querySelectorAll('.calc-card');
    calcCards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.id;
        this.navigate('calculator', id);
      });
    });

    // Back to Dashboard trigger
    document.getElementById('back-to-dashboard-btn').addEventListener('click', () => {
      this.navigate('dashboard');
    });

    // Reset button
    document.getElementById('calc-reset-btn').addEventListener('click', () => {
      if (window.UIController.activeCalc) {
        window.UIController.renderForm(window.UIController.activeCalc);
      }
    });

    // PDF Download button
    document.getElementById('calc-download-pdf-btn').addEventListener('click', () => {
      if (window.UIController.activeCalc) {
        const calcMetadata = window.UIController.calcMetadata[window.UIController.activeCalc];
        
        // Collate inputs with units
        const inputs = {};
        calcMetadata.fields.forEach(field => {
          const val = window.UIController.getFieldValue(field.id);
          const unit = field.unit ? ` ${field.unit}` : '';
          inputs[field.label] = val + unit;
        });

        // Collate active results
        const resultsVal = document.getElementById('results-output-panel').innerText;

        window.PDFGenerator.generateReport(
          window.UIController.activeCalc, 
          calcMetadata.title, 
          inputs, 
          resultsVal
        );
      }
    });

  },

  /**
   * Filters and hides cards in the dashboard grid
   */
  filterCalculators() {
    const cards = document.querySelectorAll('.calc-card');
    let matchCount = 0;

    cards.forEach(card => {
      const title = card.querySelector('.card-title').innerText.toLowerCase();
      const desc = card.querySelector('.card-description').innerText.toLowerCase();
      const cat = card.dataset.category;

      const matchesSearch = title.includes(this.searchQuery) || desc.includes(this.searchQuery);
      const matchesCategory = this.activeCategory === 'All' || cat === this.activeCategory;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const noResults = document.getElementById('dashboard-no-results');
    if (noResults) {
      noResults.style.display = matchCount === 0 ? 'block' : 'none';
    }
  },

  /**
   * SPA View Router
   */
  navigate(targetView, calcId = null) {
    this.currentView = targetView;
    
    // Containers
    const dashView = document.getElementById('dashboard-view');
    const calcView = document.getElementById('calculator-detail-view');

    // Reset visible blocks
    dashView.style.display = 'none';
    calcView.style.display = 'none';

    if (targetView === 'dashboard') {
      dashView.style.display = 'block';
      dashView.className = 'animated-fade-in';
      
      // Reset search
      this.searchQuery = '';
      const sBox = document.getElementById('dashboard-search-bar');
      if (sBox) sBox.value = '';
      
      this.activeCategory = 'All';
      const chips = document.querySelectorAll('.category-chip');
      chips.forEach(c => {
        if (c.dataset.category === 'All') c.classList.add('active');
        else c.classList.remove('active');
      });
      
      this.filterCalculators();
      window.SEOAutomator.updateMetadata('dashboard');
    } 
    
    else if (targetView === 'calculator' && calcId) {
      calcView.style.display = 'block';
      const meta = window.UIController.calcMetadata[calcId];
      const category = meta.category || 'Other';
      calcView.className = `calculator-page-container animated-fade-in theme-${category.toLowerCase()}`;
      
      // Dynamic Title
      document.getElementById('active-calculator-title').innerText = meta.title;
      
      // Update form
      window.UIController.renderForm(calcId);

      // Load bottom article guide from CMS
      const articleContent = window.AdminController.getArticle(calcId);
      document.getElementById('active-calculator-guide-content').innerHTML = articleContent;

      window.SEOAutomator.updateMetadata(calcId);
    } 


    // Scroll back to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

// Initialize App once document is fully structured
window.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});
