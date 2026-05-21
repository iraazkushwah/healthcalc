/**
 * Admin Panel Dashboard & CMS Controller
 * Visualizes analytics using dynamic SVGs and manages local CMS articles/ad scripts.
 */

window.AdminController = {
  // Default Articles Database (Fallback copy)
  defaultArticles: {
    bmi: `
      <h3>Understanding Body Mass Index (BMI)</h3>
      <p>Body Mass Index (BMI) is a simple, universally accepted numerical value used to classify human body weight into clinical ranges. It is calculated by dividing body weight in kilograms by the square of height in meters.</p>
      <h3>Health Risks & Context</h3>
      <p>A high BMI can be an indicator of high body fatness, while a very low BMI can indicate undernutrition. However, BMI is a screening tool and does not directly measure body fat or muscle mass. For athletes or highly active individuals, a high BMI might reflect heavy muscular mass rather than excess fat.</p>
      <h3>Recommendations</h3>
      <ul>
        <li><strong>Underweight:</strong> Focus on calorie-dense, healthy foods and resistance training to build lean muscle safely.</li>
        <li><strong>Normal Weight:</strong> Maintain a balanced diet rich in micronutrients and get at least 150 minutes of aerobic exercise weekly.</li>
        <li><strong>Overweight/Obese:</strong> Focus on progressive caloric deficit, limiting refined sugars, and incorporating strength and cardio workouts.</li>
      </ul>
    `,
    bmr: `
      <h3>What is Basal Metabolic Rate (BMR)?</h3>
      <p>Your Basal Metabolic Rate (BMR) represents the total number of calories your body requires to perform basic life-sustaining functions at complete rest. These functions include breathing, cellular production, temperature regulation, and blood circulation.</p>
      <h3>The Mifflin-St Jeor Equation</h3>
      <p>We utilize the gold-standard Mifflin-St Jeor equation, which scientific studies have shown to be the most accurate BMR formula for modern populations. The rate scales with body weight, height, age, and biological sex.</p>
      <h3>How to Use Your BMR</h3>
      <p>Your BMR is the baseline from which all dietary planning should commence. You should never consume fewer daily calories than your resting BMR without strict medical guidance, as doing so can trigger metabolic slowdown and muscle loss.</p>
    `,
    bodyfat: `
      <h3>Decoding U.S. Navy Body Fat Method</h3>
      <p>The U.S. Navy Body Fat formula is a highly reliable circumference-based algorithm designed to estimate body fat percentage. It offers an easy, affordable, and scientifically verified alternative to expensive DEXA scans or hydrostatic weighing.</p>
      <h3>Why Measuring Body Fat Matters</h3>
      <p>Weight alone does not tell the whole story. A person can have a high weight but low body fat (high muscle mass), or a normal weight but high body fat ("skinny fat"). Monitoring body fat percentage helps you track actual fat loss rather than mere dehydration or muscle degradation during fitness programs.</p>
      <h3>Essential vs. Excess Fat</h3>
      <p>Essential fat is required for physiological health, hormone synthesis, and organ insulation. Keeping your body fat within the recommended 'Athletes' or 'Fitness' ranges supports metabolic and cardiovascular longevity.</p>
    `,
    calorieburn: `
      <h3>How Workout Calories are Estimated</h3>
      <p>Daily calorie burn tracking is based on Metabolic Equivalents (METs). One MET is defined as the energy spent sitting quietly, which is equivalent to consuming roughly 3.5 ml of oxygen per kilogram of body weight per minute.</p>
      <h3>MET Intensities</h3>
      <p>Different physical activities are graded on their metabolic load relative to rest. For instance, running averages 9.8 METs, meaning you burn energy roughly 10 times faster than sitting. Increasing duration or exercise intensity amplifies the MET rate and subsequent cumulative calorie burn.</p>
    `,
    tdee: `
      <h3>Total Daily Energy Expenditure Explained</h3>
      <p>Your Total Daily Energy Expenditure (TDEE) is an estimation of how many calories you burn per day when incorporating physical movement and daily activities. It is calculated by taking your resting BMR and scaling it by an activity coefficient.</p>
      <h3>Calorie Planning Guidelines</h3>
      <ul>
        <li><strong>Maintenance:</strong> Eating exactly at your TDEE preserves your weight.</li>
        <li><strong>Fat Loss (Cut):</strong> Eating 15% to 20% below your TDEE encourages healthy weight loss.</li>
        <li><strong>Muscle Gain (Bulk):</strong> Eating 10% to 20% above your TDEE assists in building new muscular tissue during strength routines.</li>
      </ul>
    `,
    macros: `
      <h3>The Importance of Macronutrients</h3>
      <p>Macronutrients—Proteins, Carbohydrates, and Fats—are the primary structural building blocks of food that yield metabolic energy. While total calories dictate weight gain or loss, the distribution of macros dictates body composition quality (muscle vs. fat).</p>
      <h3>Macros Gram conversions</h3>
      <ul>
        <li><strong>Protein (4 kcal/g):</strong> Critical for muscular cell repair, metabolic rate maintenance, and high satiety levels.</li>
        <li><strong>Carbs (4 kcal/g):</strong> The body's preferred fast glycogen fuel source for high-intensity training.</li>
        <li><strong>Fats (9 kcal/g):</strong> Vital for hormone synthesis, vitamin absorption, and cognitive safety.</li>
      </ul>
    `,
    heartrate: `
      <h3>Cardiovascular Conditioning & Target Heart Rate</h3>
      <p>Your Target Heart Rate (THR) indicates the optimal heart beats per minute range required to safely stress your cardiovascular system during workouts. Training in targeted zones helps optimize athletic conditioning, fat burning, and lactate tolerance.</p>
      <h3>Understanding the Zones</h3>
      <p>We use the Karvonen formula (incorporating resting heart rate) which scales target thresholds to your exact cardiovascular capacity. Warm-Up builds metabolic aerobic base, Fat Burn prioritizes lipid energy expenditure, and Aerobic builds high oxygen volume processing (VO2 Max).</p>
    `,
    bloodpressure: `
      <h3>Clinical Blood Pressure Thresholds</h3>
      <p>Blood pressure measures the hydrostatic force of blood pushing against your arterial walls. The top number, Systolic, represents pressure during heartbeats, while the bottom number, Diastolic, measures pressure between beats.</p>
      <h3>Preventive Care Tips</h3>
      <p>Maintaining normal blood pressure (< 120/80 mmHg) drastically reduces clinical risk factors for cardiovascular disease, strokes, and kidney failures. You can naturally reduce elevated numbers by limiting processed salt, practicing stress management, and adding high-potassium foods.</p>
    `,
    ovulation: `
      <h3>Tracking Ovulation & Conception Cycles</h3>
      <p>Ovulation is the biological release of a mature egg cell from the ovarian follicle, ready for fertilization. Because sperm cells can survive inside the female body for up to 5 days, and the egg remains viable for roughly 12-24 hours, the fertile window spans roughly 6 days.</p>
      <h3>Identifying Peak Fertility</h3>
      <p>Tracking the first day of your last menstrual period (LMP) and your average cycle length allows you to estimate your next fertile window and peak ovulation date. Regular cycle tracking helps in both planning conception and monitoring reproductive health.</p>
    `,
    pregnancy: `
      <h3>Your Pregnancy Timeline</h3>
      <p>A standard pregnancy term lasts approximately 280 days (40 weeks) from the first day of your last menstrual period (LMP). Due dates are calculated using Naegele's rule, adjusted for your cycle length.</p>
      <h3>Trimesters Progress</h3>
      <ul>
        <li><strong>Trimester 1 (Weeks 1-12):</strong> Critical embryonic organogenesis. Focus on high folic acid intake and morning sickness management.</li>
        <li><strong>Trimester 2 (Weeks 13-26):</strong> The "golden phase." Energy levels return, and rapid fetal growth takes place.</li>
        <li><strong>Trimester 3 (Weeks 27-40):</strong> Fetal weight accumulation. Safe stretching and proper pelvic alignment exercises are advised.</li>
      </ul>
    `,
    waterintake: `
      <h3>Hydration & Cellular Physiology</h3>
      <p>Water constitutes roughly 60% of human body mass and is required for cellular oxygenation, metabolic chemical reactions, joint lubrication, and cognitive performance. Even a minor 2% dehydration level can decrease athletic performance and focus.</p>
      <h3>Custom Hydration Targets</h3>
      <p>Our algorithm accounts for your weight, physical activity level, and local weather patterns. Hot climates and intensive workouts demand additional fluid replenishment to replace sweat losses and maintain optimal electrolyte balances.</p>
    `,
    alcohol: `
      <h3>Understanding Blood Alcohol Concentration (BAC)</h3>
      <p>Blood Alcohol Concentration (BAC) measures the percentage of alcohol present in your bloodstream. We calculate this value using the scientific Widmark Formula, which accounts for body mass, gender-specific fluid constants, ABV beverage strength, and active hepatic metabolism.</p>
      <h3>Impairment Risks</h3>
      <p>Alcohol is a central nervous system depressant. Even at low levels (0.02% - 0.04%), processing speed, spatial awareness, and decision-making begin to decline. Driving with a BAC at or exceeding 0.05% is extremely hazardous and illegal in many regions. Always prioritize safety first.</p>
    `
  },

  /**
   * Initializes LocalStorage databases for CMS and Ads
   */
  initStorage() {
    if (!localStorage.getItem('hc_cms_articles')) {
      localStorage.setItem('hc_cms_articles', JSON.stringify(this.defaultArticles));
    }
    if (!localStorage.getItem('hc_ads_config')) {
      const defaultAds = {
        header: { enabled: true, code: '<div style="font-weight:600;color:var(--text-secondary);">⚡ Stay Fit & Stay Healthy - Access premium calculators instantly! ⚡</div>' },
        sidebar: { enabled: true, code: '<div style="font-weight:600;color:var(--text-muted);">💪 Premium Workout Guides Available in the Article Section! 💪</div>' },
        footer: { enabled: true, code: '<div style="font-weight:600;color:var(--text-muted);">🛡️ Secure, Private, Local Calculations. No Data Ever Uploaded. 🛡️</div>' }
      };
      localStorage.setItem('hc_ads_config', JSON.stringify(defaultAds));
    }
    
    // Set up mock analytics if not already present
    if (!localStorage.getItem('hc_analytics_visits')) {
      const mockVisits = {
        total: 1482,
        runs: 3512,
        popular: {
          bmi: 914,
          tdee: 760,
          waterintake: 512,
          heartrate: 420,
          macros: 390,
          ovulation: 280,
          pregnancy: 236
        }
      };
      localStorage.setItem('hc_analytics_visits', JSON.stringify(mockVisits));
    }
  },

  /**
   * Logs a calculator run to localStorage analytics
   */
  logCalculation(calcId) {
    this.initStorage();
    const analytics = JSON.parse(localStorage.getItem('hc_analytics_visits'));
    
    analytics.runs += 1;
    if (!analytics.popular[calcId]) {
      analytics.popular[calcId] = 0;
    }
    analytics.popular[calcId] += 1;
    
    localStorage.setItem('hc_analytics_visits', JSON.stringify(analytics));
  },

  /**
   * Logs a site visit to localStorage analytics
   */
  logVisit() {
    this.initStorage();
    const analytics = JSON.parse(localStorage.getItem('hc_analytics_visits'));
    analytics.total += 1;
    localStorage.setItem('hc_analytics_visits', JSON.stringify(analytics));
  },

  /**
   * Returns current CMS articles from storage
   */
  getArticle(calcId) {
    this.initStorage();
    const articles = JSON.parse(localStorage.getItem('hc_cms_articles'));
    return articles[calcId] || this.defaultArticles[calcId] || "<p>Educational article under construction.</p>";
  },

  /**
   * Saves updated article back to localStorage
   */
  saveArticle(calcId, content) {
    this.initStorage();
    const articles = JSON.parse(localStorage.getItem('hc_cms_articles'));
    articles[calcId] = content;
    localStorage.setItem('hc_cms_articles', JSON.stringify(articles));
  },

  /**
   * Inject configured Ads templates into the DOM container spots
   */
  injectAds() {
    this.initStorage();
    const ads = JSON.parse(localStorage.getItem('hc_ads_config'));

    const placements = {
      header: document.querySelector('.ad-slot-header'),
      sidebar: document.querySelector('.ad-slot-sidebar'),
      footer: document.querySelector('.ad-slot-footer')
    };

    Object.keys(placements).forEach(key => {
      const container = placements[key];
      const adConfig = ads[key];
      
      if (container) {
        if (adConfig && adConfig.enabled) {
          container.innerHTML = adConfig.code;
          container.classList.add('visible');
        } else {
          container.innerHTML = '';
          container.classList.remove('visible');
        }
      }
    });
  },

  /**
   * Returns ads config
   */
  getAdsConfig() {
    this.initStorage();
    return JSON.parse(localStorage.getItem('hc_ads_config'));
  },

  /**
   * Saves ads config
   */
  saveAdsConfig(config) {
    localStorage.setItem('hc_ads_config', JSON.stringify(config));
    this.injectAds();
  },

  /**
   * Renders the dynamic visual SVG bar chart inside the admin panel
   */
  renderAnalyticsChart() {
    this.initStorage();
    const analytics = JSON.parse(localStorage.getItem('hc_analytics_visits'));
    const container = document.getElementById('admin-chart-container');
    if (!container) return;

    // Clear existing
    container.innerHTML = '';

    // Find max value to calibrate percentage bar widths
    const vals = Object.values(analytics.popular);
    const maxVal = Math.max(...vals, 1);

    const popularSorted = Object.entries(analytics.popular)
      .sort((a, b) => b[1] - a[1]);

    const chartBlock = document.createElement('div');
    chartBlock.className = 'admin-analytics-chart';

    popularSorted.forEach(([calcKey, count]) => {
      const percent = (count / maxVal) * 100;
      
      const friendlyNames = {
        bmi: "BMI Calculator",
        bmr: "BMR Calculator",
        bodyfat: "Body Fat Navy",
        calorieburn: "Daily Burn METs",
        tdee: "TDEE Calculator",
        macros: "Macros Splitter",
        heartrate: "Target Heart Rate",
        bloodpressure: "Blood Pressure",
        ovulation: "Ovulation Calendar",
        pregnancy: "Pregnancy Tracker",
        waterintake: "Water Intake Vol",
        alcohol: "BAC Sobriety"
      };

      const friendlyName = friendlyNames[calcKey] || calcKey.toUpperCase();

      chartBlock.innerHTML += `
        <div class="analytics-bar-item">
          <div class="analytics-bar-name" title="${friendlyName}">${friendlyName}</div>
          <div class="analytics-bar-track">
            <div class="analytics-bar-fill" style="width: 0%;" data-width="${percent}%"></div>
          </div>
          <div class="analytics-bar-val">${count}</div>
        </div>
      `;
    });

    container.appendChild(chartBlock);

    // Trigger visual sliding animations in a tiny timeout
    setTimeout(() => {
      chartBlock.querySelectorAll('.analytics-bar-fill').forEach(fill => {
        fill.style.width = fill.getAttribute('data-width');
      });
    }, 100);
  }
};
