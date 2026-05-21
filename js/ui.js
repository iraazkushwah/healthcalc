/**
 * User Interface & SVG Visualization Engine
 * Controls dynamic calculator form generation and live reactive graphics rendering.
 */

window.UIController = {
  activeCalc: null,

  /**
   * Updates custom CSS variable for dynamic slider fill background
   */
  updateSliderFill(sliderEl) {
    const min = parseFloat(sliderEl.min) || 0;
    const max = parseFloat(sliderEl.max) || 100;
    const val = parseFloat(sliderEl.value) || 0;
    const percent = ((val - min) / (max - min)) * 100;
    sliderEl.style.setProperty('--value-percent', `${percent}%`);
  },

  // Metadata describing inputs required for each calculator
  calcMetadata: {
    bmi: {
      title: "Body Mass Index (BMI) Calculator",
      category: "Weight",
      fields: [
        { type: "segmented", id: "gender", label: "Gender (लिंग)", options: [{val: "male", label: "Male"}, {val: "female", label: "Female"}], default: "male" },
        { type: "slider", id: "height", label: "Height (ऊंचाई)", min: 100, max: 220, unit: "cm", default: 170 },
        { type: "slider", id: "weight", label: "Weight (वजन)", min: 30, max: 150, unit: "kg", default: 70 }
      ]
    },
    bmr: {
      title: "Basal Metabolic Rate (BMR) Calculator",
      category: "Weight",
      fields: [
        { type: "segmented", id: "gender", label: "Gender (लिंग)", options: [{val: "male", label: "Male"}, {val: "female", label: "Female"}], default: "male" },
        { type: "slider", id: "height", label: "Height (ऊंचाई)", min: 100, max: 220, unit: "cm", default: 170 },
        { type: "slider", id: "weight", label: "Weight (वजन)", min: 30, max: 150, unit: "kg", default: 70 },
        { type: "slider", id: "age", label: "Age (उम्र)", min: 10, max: 100, unit: "years", default: 25 }
      ]
    },
    bodyfat: {
      title: "Body Fat Percentage Calculator",
      category: "Weight",
      fields: [
        { type: "segmented", id: "gender", label: "Gender (लिंग)", options: [{val: "male", label: "Male"}, {val: "female", label: "Female"}], default: "male" },
        { type: "slider", id: "height", label: "Height (ऊंचाई)", min: 100, max: 220, unit: "cm", default: 170 },
        { type: "slider", id: "neck", label: "Neck Circumference (गर्दन का घेरा)", min: 20, max: 60, unit: "cm", default: 38 },
        { type: "slider", id: "waist", label: "Waist Circumference (कमर का घेरा)", min: 40, max: 160, unit: "cm", default: 80 },
        { type: "slider", id: "hip", label: "Hip Circumference (women only) (कूल्हे का घेरा)", min: 50, max: 160, unit: "cm", default: 90, conditional: "gender", conditionalVal: "female" }
      ]
    },
    calorieburn: {
      title: "Daily Calorie Burn Calculator",
      category: "Fitness",
      fields: [
        { type: "slider", id: "weight", label: "Weight (वजन)", min: 30, max: 150, unit: "kg", default: 70 },
        { type: "dropdown", id: "activity", label: "Activity Type (गतिविधि प्रकार)", options: [
          {val: "walking", label: "Walking (साधारण सैर)"},
          {val: "running", label: "Running (दौड़ना)"},
          {val: "cycling", label: "Cycling (साइकिल चलाना)"},
          {val: "swimming", label: "Swimming (तैराकी)"},
          {val: "strength", label: "Strength Training (भार प्रशिक्षण)"},
          {val: "yoga", label: "Yoga (योग)"}
        ], default: "running" },
        { type: "slider", id: "duration", label: "Duration (अवधि)", min: 5, max: 180, unit: "mins", default: 30 }
      ]
    },
    tdee: {
      title: "TDEE (Total Daily Energy Expenditure) Calculator",
      category: "Fitness",
      fields: [
        { type: "segmented", id: "gender", label: "Gender (लिंग)", options: [{val: "male", label: "Male"}, {val: "female", label: "Female"}], default: "male" },
        { type: "slider", id: "height", label: "Height (ऊंचाई)", min: 100, max: 220, unit: "cm", default: 170 },
        { type: "slider", id: "weight", label: "Weight (वजन)", min: 30, max: 150, unit: "kg", default: 70 },
        { type: "slider", id: "age", label: "Age (उम्र)", min: 10, max: 100, unit: "years", default: 25 },
        { type: "dropdown", id: "activityLevel", label: "Activity Level (सक्रियता स्तर)", options: [
          {val: "sedentary", label: "Sedentary (Little to no exercise)"},
          {val: "lightly_active", label: "Lightly Active (1-3 days/week)"},
          {val: "moderately_active", label: "Moderately Active (3-5 days/week)"},
          {val: "very_active", label: "Very Active (6-7 days/week)"},
          {val: "extra_active", label: "Extra Active (Athletic/Hard physical job)"}
        ], default: "moderately_active" }
      ]
    },
    macros: {
      title: "Macronutrient Breakdown Calculator",
      category: "Fitness",
      fields: [
        { type: "slider", id: "tdeeKcal", label: "Daily Calorie Target (TDEE/Calories)", min: 1000, max: 5000, unit: "kcal", default: 2000 },
        { type: "segmented", id: "fitnessGoal", label: "Fitness Goal (फिटनेस लक्ष्य)", options: [
          {val: "lose", label: "Weight Loss"},
          {val: "maintain", label: "Maintain Weight"},
          {val: "gain", label: "Muscle Gain"}
        ], default: "maintain" },
        { type: "dropdown", id: "dietType", label: "Diet Ratio Plan (आहार योजना)", options: [
          {val: "balanced", label: "Balanced (30% Protein / 40% Carbs / 30% Fat)"},
          {val: "low_carb", label: "Low Carb (40% Protein / 20% Carbs / 40% Fat)"},
          {val: "high_protein", label: "High Protein (40% Protein / 30% Carbs / 30% Fat)"},
          {val: "keto", label: "Keto (20% Protein / 5% Carbs / 75% Fat)"}
        ], default: "balanced" }
      ]
    },
    heartrate: {
      title: "Target Heart Rate Zone Calculator",
      category: "Cardio",
      fields: [
        { type: "slider", id: "age", label: "Age (उम्र)", min: 10, max: 90, unit: "years", default: 25 },
        { type: "slider", id: "restingHr", label: "Resting Heart Rate (RHR) [Optional]", min: 0, max: 120, unit: "bpm", default: 0 }
      ]
    },
    bloodpressure: {
      title: "Blood Pressure Clinical Analyzer",
      category: "Cardio",
      fields: [
        { type: "slider", id: "systolic", label: "Systolic Pressure (शीर्ष संख्या - Systolic)", min: 80, max: 200, unit: "mmHg", default: 120 },
        { type: "slider", id: "diastolic", label: "Diastolic Pressure (निचली संख्या - Diastolic)", min: 40, max: 130, unit: "mmHg", default: 80 }
      ]
    },
    ovulation: {
      title: "Ovulation & Fertile Calendar",
      category: "Women",
      fields: [
        { type: "date", id: "lmpDate", label: "First Day of Last Period (पिछली अवधि का पहला दिन)", default: new Date().toISOString().split('T')[0] },
        { type: "slider", id: "cycleLength", label: "Average Cycle Length (औसत चक्र अवधि)", min: 22, max: 45, unit: "days", default: 28 }
      ]
    },
    pregnancy: {
      title: "Pregnancy Due Date & Gestation Tracker",
      category: "Women",
      fields: [
        { type: "date", id: "lmpDate", label: "First Day of Last Period (पिछली अवधि का पहला दिन)", default: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
        { type: "slider", id: "cycleLength", label: "Average Cycle Length (औसत चक्र अवधि)", min: 22, max: 45, unit: "days", default: 28 }
      ]
    },
    waterintake: {
      title: "Daily Hydration Target Calculator",
      category: "Other",
      fields: [
        { type: "slider", id: "weight", label: "Weight (वजन)", min: 30, max: 150, unit: "kg", default: 70 },
        { type: "segmented", id: "activityLevel", label: "Activity Level (शारीरिक परिश्रम)", options: [
          {val: "sedentary", label: "Sedentary"},
          {val: "active", label: "Active"},
          {val: "athletic", label: "Athletic"}
        ], default: "active" },
        { type: "segmented", id: "climate", label: "Climate (जलवायु)", options: [
          {val: "cold", label: "Cold"},
          {val: "moderate", label: "Moderate"},
          {val: "hot", label: "Hot"}
        ], default: "moderate" }
      ]
    },
    alcohol: {
      title: "Blood Alcohol Concentration (BAC) Calculator",
      category: "Other",
      fields: [
        { type: "segmented", id: "gender", label: "Gender (लिंग)", options: [{val: "male", label: "Male"}, {val: "female", label: "Female"}], default: "male" },
        { type: "slider", id: "weight", label: "Weight (वजन)", min: 30, max: 150, unit: "kg", default: 70 },
        { type: "slider", id: "drinkVolume", label: "Drink Quantity (मात्रा)", min: 100, max: 1000, unit: "ml", default: 350 },
        { type: "slider", id: "abv", label: "Drink Strength (ABV %)", min: 2, max: 50, unit: "%", default: 5 },
        { type: "slider", id: "hours", label: "Hours Since First Sip (पीने के बाद बीते घंटे)", min: 0, max: 12, unit: "hours", default: 1 }
      ]
    }
  },

  /**
   * Generates dynamic form inputs and sets up sliders
   */
  renderForm(calcId) {
    this.activeCalc = calcId;
    const formContainer = document.getElementById('dynamic-form-fields');
    if (!formContainer) return;

    formContainer.innerHTML = '';
    const calc = this.calcMetadata[calcId];
    if (!calc) return;

    calc.fields.forEach(field => {
      const group = document.createElement('div');
      group.className = 'form-group';
      group.dataset.id = field.id;

      // Handle conditional display (e.g. Hip size only for women body fat)
      if (field.conditional) {
        group.style.display = 'none';
        group.classList.add('conditional-field');
        group.dataset.dependsOn = field.dependsOn || field.conditional;
        group.dataset.dependsVal = field.conditionalVal;
      }

      // Add slider markup
      if (field.type === "slider") {
        group.innerHTML = `
          <div class="form-label-row">
            <label class="form-label" for="inp-${field.id}">${field.label}</label>
            <span class="form-value-badge" id="val-${field.id}">${field.default}${field.unit}</span>
          </div>
          <div class="slider-wrapper">
            <input type="range" class="slider-input" id="inp-${field.id}" 
                   min="${field.min}" max="${field.max}" value="${field.default}" step="${field.step || 1}">
          </div>
        `;
      } 
      // Add Segmented radio tabs
      else if (field.type === "segmented") {
        let optionsHtml = '';
        field.options.forEach((opt, idx) => {
          const isActive = opt.val === field.default ? 'active' : '';
          optionsHtml += `
            <div class="segmented-btn ${isActive}" data-val="${opt.val}">${opt.label}</div>
          `;
        });

        group.innerHTML = `
          <label class="form-label" style="display:block; margin-bottom: 0.75rem;">${field.label}</label>
          <div class="segmented-control" id="inp-${field.id}">
            ${optionsHtml}
          </div>
        `;
      } 
      // Add Dropdown Selector
      else if (field.type === "dropdown") {
        let optionsHtml = '';
        field.options.forEach(opt => {
          const isSel = opt.val === field.default ? 'selected' : '';
          optionsHtml += `<option value="${opt.val}" ${isSel}>${opt.label}</option>`;
        });

        group.innerHTML = `
          <label class="form-label" for="inp-${field.id}" style="display:block; margin-bottom: 0.75rem;">${field.label}</label>
          <select class="dropdown-select" id="inp-${field.id}">
            ${optionsHtml}
          </select>
        `;
      }
      // Add Date selector
      else if (field.type === "date") {
        group.innerHTML = `
          <label class="form-label" for="inp-${field.id}" style="display:block; margin-bottom: 0.75rem;">${field.label}</label>
          <input type="date" class="text-input" id="inp-${field.id}" value="${field.default}">
        `;
      }

      formContainer.appendChild(group);
    });

    // Initialize slider track fills
    formContainer.querySelectorAll('.slider-input').forEach(slider => {
      this.updateSliderFill(slider);
    });

    this.bindEvents();
    this.recalculate();
  },

  /**
   * Binds slide and change events to reactive inputs
   */
  bindEvents() {
    const calc = this.calcMetadata[this.activeCalc];
    if (!calc) return;

    calc.fields.forEach(field => {
      const el = document.getElementById(`inp-${field.id}`);
      if (!el) return;

      // Range slider dynamic numbers bubble syncing
      if (field.type === "slider") {
        el.addEventListener('input', (e) => {
          document.getElementById(`val-${field.id}`).innerText = `${e.target.value}${field.unit}`;
          this.updateSliderFill(e.target);
          this.recalculate();
        });
      }
      
      // Segmented control click toggle
      else if (field.type === "segmented") {
        const btns = el.querySelectorAll('.segmented-btn');
        btns.forEach(btn => {
          btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Check conditionals (e.g. show hip slider if female is clicked)
            this.checkConditionals();
            this.recalculate();
          });
        });
      }
      
      // Dropdown and Date input changes
      else {
        el.addEventListener('change', () => {
          this.recalculate();
        });
      }
    });

    this.checkConditionals();
  },

  /**
   * Evaluates conditional field rules
   */
  checkConditionals() {
    const conditionals = document.querySelectorAll('.conditional-field');
    conditionals.forEach(cond => {
      const dependsOnId = cond.dataset.dependsOn;
      const targetVal = cond.dataset.dependsVal;

      const controllerEl = document.getElementById(`inp-${dependsOnId}`);
      if (!controllerEl) return;

      let currentVal = "";
      if (controllerEl.classList.contains('segmented-control')) {
        const activeBtn = controllerEl.querySelector('.segmented-btn.active');
        if (activeBtn) currentVal = activeBtn.dataset.val;
      } else {
        currentVal = controllerEl.value;
      }

      if (currentVal === targetVal) {
        cond.style.display = 'block';
      } else {
        cond.style.display = 'none';
      }
    });
  },

  /**
   * Retrieves active value of form field
   */
  getFieldValue(fieldId) {
    const el = document.getElementById(`inp-${fieldId}`);
    if (!el) return null;

    if (el.classList.contains('segmented-control')) {
      const activeBtn = el.querySelector('.segmented-btn.active');
      return activeBtn ? activeBtn.dataset.val : null;
    }

    if (el.type === "range" || el.tagName === "SELECT") {
      const val = el.value;
      return isNaN(val) ? val : Number(val);
    }

    return el.value;
  },

  /**
   * Performs core calculation and triggers dynamic layout draws
   */
  recalculate() {
    const resultsPanel = document.getElementById('results-output-panel');
    if (!resultsPanel) return;

    // Reset indicator classes
    resultsPanel.className = 'workspace-panel animated-fade-in';

    let html = '';
    const id = this.activeCalc;

    // Log calculation to localStorage statistics
    window.AdminController.logCalculation(id);

    if (id === "bmi") {
      const gender = this.getFieldValue("gender");
      const height = this.getFieldValue("height");
      const weight = this.getFieldValue("weight");

      const res = window.HealthCalculators.calculateBMI(height, weight, gender);
      
      // Compute gauge pointer rotation (BMI 15 to 35 maps to 0 to 180 degrees)
      let rotation = ((res.score - 15) / (35 - 15)) * 180;
      rotation = Math.max(0, Math.min(180, rotation));

      html = `
        <div class="results-header-block">
          <div class="results-large-val" style="background: var(--grad-weight); -webkit-background-clip: text;">${res.score}</div>
          <div class="results-classification" style="color: ${res.color};">${res.classification}</div>
        </div>

        <div class="gauge-visual-container">
          <svg viewBox="0 0 300 170" class="gauge-svg">
            <defs>
              <linearGradient id="bmi-gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#06b6d4" />
                <stop offset="35%" stop-color="#10b981" />
                <stop offset="70%" stop-color="#f59e0b" />
                <stop offset="100%" stop-color="#ef4444" />
              </linearGradient>
            </defs>
            <path d="M 30,150 A 120,120 0 0,1 270,150" fill="none" stroke="var(--bg-tertiary)" stroke-width="24" stroke-linecap="round" />
            <path d="M 30,150 A 120,120 0 0,1 270,150" fill="none" stroke="url(#bmi-gauge-grad)" stroke-width="20" stroke-linecap="round" />
            
            <circle cx="150" cy="140" r="10" fill="var(--text-primary)" />
            <polygon points="146,140 150,25 154,140" fill="var(--text-primary)" class="gauge-needle" style="transform: rotate(${rotation - 90}deg)" />
          </svg>
        </div>

        <div style="margin-top: 1.5rem; text-align: center; font-size: 0.95rem;">
          <p>Normal Weight limits for your height: <strong>${res.minNormalWeight}kg - ${res.maxNormalWeight}kg</strong></p>
        </div>
      `;

      resultsPanel.style.borderColor = res.color;
      this.updateTipsSection(res.healthTip);

    } else if (id === "bmr") {
      const gender = this.getFieldValue("gender");
      const height = this.getFieldValue("height");
      const weight = this.getFieldValue("weight");
      const age = this.getFieldValue("age");

      const res = window.HealthCalculators.calculateBMR(height, weight, age, gender);

      html = `
        <div class="results-header-block">
          <div class="results-large-val" style="background: var(--grad-weight); -webkit-background-clip: text;">${res.score} kcal</div>
          <div class="results-classification">Basal Metabolic Rate (BMR)</div>
        </div>

        <div style="margin-top: 2rem;">
          <p style="font-size: 0.95rem; line-height: 1.6; text-align: center;">
            This is the exact raw energy your system requires for survival resting inside a clinically neutral environment.
          </p>
          <div style="display:flex; justify-content:space-around; margin-top:2rem; text-align:center;">
            <div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">HOURLY METABOLISM</div>
              <div style="font-family:var(--font-heading); font-size:1.5rem; font-weight:800; color:var(--color-weight);">${Math.round(res.score / 24)} kcal</div>
            </div>
            <div>
              <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">RESTING HEART EQUIVALENT</div>
              <div style="font-family:var(--font-heading); font-size:1.5rem; font-weight:800; color:var(--color-weight);">~1 MET</div>
            </div>
          </div>
        </div>
      `;

      resultsPanel.style.borderColor = 'var(--color-weight)';
      this.updateTipsSection(res.healthTip);

    } else if (id === "bodyfat") {
      const gender = this.getFieldValue("gender");
      const height = this.getFieldValue("height");
      const neck = this.getFieldValue("neck");
      const waist = this.getFieldValue("waist");
      const hip = this.getFieldValue("hip") || 90;

      const res = window.HealthCalculators.calculateBodyFat(gender, height, neck, waist, hip);
      
      // Calculate circle dashoffset (440 base circumference)
      let offset = 440 - (440 * (res.score / 60)); // Max 60% BFP calibrated
      offset = Math.max(0, Math.min(440, offset));

      html = `
        <div class="results-header-block">
          <div class="results-large-val" style="background: var(--grad-weight); -webkit-background-clip: text;">${res.score}%</div>
          <div class="results-classification" style="color: ${res.color};">${res.classification}</div>
        </div>

        <div class="circular-progress-container">
          <svg class="ring-svg">
            <circle class="ring-bg" cx="80" cy="80" r="70" />
            <circle class="ring-fill" cx="80" cy="80" r="70" style="stroke: ${res.color}; stroke-dashoffset: ${offset};" />
          </svg>
          <div class="ring-center-content">
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">BODY FAT</span>
          </div>
        </div>
      `;

      resultsPanel.style.borderColor = res.color;
      this.updateTipsSection(res.healthTip);

    } else if (id === "calorieburn") {
      const weight = this.getFieldValue("weight");
      const activity = this.getFieldValue("activity");
      const duration = this.getFieldValue("duration");

      const res = window.HealthCalculators.calculateDailyCalorieBurn(weight, activity, duration);

      html = `
        <div class="results-header-block">
          <div class="results-large-val" style="background: var(--grad-fitness); -webkit-background-clip: text;">${res.score} kcal</div>
          <div class="results-classification">Workout Energy Burned</div>
        </div>

        <div class="circular-progress-container">
          <svg class="ring-svg">
            <circle class="ring-bg" cx="80" cy="80" r="70" />
            <circle class="ring-fill" cx="80" cy="80" r="70" style="stroke: var(--color-fitness); stroke-dashoffset: 80;" />
          </svg>
          <div class="ring-center-content">
            <div style="font-family:var(--font-heading); font-size:1.5rem; font-weight:800; color:var(--color-fitness);">${duration}m</div>
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700; text-transform:uppercase;">DURATION</span>
          </div>
        </div>

        <div style="text-align: center; font-size: 0.95rem; margin-top: 1rem;">
          <p>Metabolic Equivalent Intensity (MET): <strong>${res.met} METs</strong></p>
        </div>
      `;

      resultsPanel.style.borderColor = 'var(--color-fitness)';
      this.updateTipsSection(res.healthTip);

    } else if (id === "tdee") {
      const gender = this.getFieldValue("gender");
      const height = this.getFieldValue("height");
      const weight = this.getFieldValue("weight");
      const age = this.getFieldValue("age");
      const level = this.getFieldValue("activityLevel");

      const res = window.HealthCalculators.calculateTDEE(height, weight, age, gender, level);

      html = `
        <div class="results-header-block">
          <div class="results-large-val" style="background: var(--grad-fitness); -webkit-background-clip: text;">${res.score} kcal</div>
          <div class="results-classification">TDEE (Daily Calories Limit)</div>
        </div>

        <div class="macro-chart-container" style="margin-top: 2rem;">
          <div class="macro-chart-item">
            <div class="macro-chart-label-row">
              <span>Extreme Fat Loss (30% Deficit)</span>
              <span style="color: var(--color-fitness);">${res.extremeLoss} kcal</span>
            </div>
            <div class="macro-chart-bar-bg">
              <div class="macro-chart-bar-fill" style="width: 70%; background: var(--grad-fitness);"></div>
            </div>
          </div>

          <div class="macro-chart-item">
            <div class="macro-chart-label-row">
              <span>Healthy Weight Loss (15% Deficit)</span>
              <span style="color: var(--color-fitness);">${res.mildLoss} kcal</span>
            </div>
            <div class="macro-chart-bar-bg">
              <div class="macro-chart-bar-fill" style="width: 85%; background: var(--grad-fitness);"></div>
            </div>
          </div>

          <div class="macro-chart-item">
            <div class="macro-chart-label-row">
              <span>Weight Maintenance</span>
              <span style="color: var(--text-primary);">${res.maintenance} kcal</span>
            </div>
            <div class="macro-chart-bar-bg">
              <div class="macro-chart-bar-fill" style="width: 100%; background: var(--text-muted);"></div>
            </div>
          </div>

          <div class="macro-chart-item">
            <div class="macro-chart-label-row">
              <span>Muscle Gain (Lean Bulk)</span>
              <span style="color: var(--color-weight);">${res.bulk} kcal</span>
            </div>
            <div class="macro-chart-bar-bg">
              <div class="macro-chart-bar-fill" style="width: 100%; background: var(--grad-weight);"></div>
            </div>
          </div>
        </div>
      `;

      resultsPanel.style.borderColor = 'var(--color-fitness)';
      this.updateTipsSection(res.healthTip);

    } else if (id === "macros") {
      const targetCal = this.getFieldValue("tdeeKcal");
      const goal = this.getFieldValue("fitnessGoal");
      const diet = this.getFieldValue("dietType");

      const res = window.HealthCalculators.calculateMacros(targetCal, goal, diet);

      // Pie divisions visual
      html = `
        <div class="results-header-block">
          <div class="results-large-val" style="background: var(--grad-fitness); -webkit-background-clip: text;">${res.score} kcal</div>
          <div class="results-classification">Calorie Target Selected</div>
        </div>

        <div class="macro-chart-container" style="margin-top: 2rem;">
          <div class="macro-chart-item">
            <div class="macro-chart-label-row">
              <span>Protein (प्रोटिन) - ${res.ratios[0]}%</span>
              <span style="font-weight:700;">${res.proteinG}g (${res.proteinKcal} kcal)</span>
            </div>
            <div class="macro-chart-bar-bg">
              <div class="macro-chart-bar-fill" style="width: ${res.ratios[0]}%; background: var(--color-fitness);"></div>
            </div>
          </div>

          <div class="macro-chart-item">
            <div class="macro-chart-label-row">
              <span>Carbohydrates (कार्बोहाइड्रेट) - ${res.ratios[1]}%</span>
              <span style="font-weight:700;">${res.carbG}g (${res.carbKcal} kcal)</span>
            </div>
            <div class="macro-chart-bar-bg">
              <div class="macro-chart-bar-fill" style="width: ${res.ratios[1]}%; background: var(--color-weight);"></div>
            </div>
          </div>

          <div class="macro-chart-item">
            <div class="macro-chart-label-row">
              <span>Dietary Fats (वसा) - ${res.ratios[2]}%</span>
              <span style="font-weight:700;">${res.fatG}g (${res.fatKcal} kcal)</span>
            </div>
            <div class="macro-chart-bar-bg">
              <div class="macro-chart-bar-fill" style="width: ${res.ratios[2]}%; background: var(--color-women);"></div>
            </div>
          </div>
        </div>
      `;

      resultsPanel.style.borderColor = 'var(--color-fitness)';
      this.updateTipsSection(res.healthTip);

    } else if (id === "heartrate") {
      const age = this.getFieldValue("age");
      const rhr = this.getFieldValue("restingHr");

      const res = window.HealthCalculators.calculateTargetHeartRate(age, rhr);

      let zonesHtml = '';
      res.zones.forEach((zone, index) => {
        zonesHtml += `
          <div class="heart-zone-card ${index === 1 ? 'active' : ''}">
            <div class="heart-zone-left">
              <div class="heart-zone-indicator" style="background: ${zone.color};"></div>
              <div>
                <div style="font-weight:600; font-size:0.95rem;">${zone.name}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${zone.desc}</div>
              </div>
            </div>
            <div class="heart-zone-range" style="color: ${zone.color};">${zone.lower}-${zone.upper} bpm</div>
          </div>
        `;
      });

      html = `
        <div class="results-header-block">
          <div class="results-large-val" style="background: var(--grad-cardio); -webkit-background-clip: text;">${res.score} bpm</div>
          <div class="results-classification">Max Safe Heart Rate (HR max)</div>
        </div>

        <div class="heart-zones-list">
          ${zonesHtml}
        </div>
      `;

      resultsPanel.style.borderColor = 'var(--color-cardio)';
      this.updateTipsSection(res.healthTip);

    } else if (id === "bloodpressure") {
      const sys = this.getFieldValue("systolic");
      const dia = this.getFieldValue("diastolic");

      const res = window.HealthCalculators.calculateBloodPressure(sys, dia);

      // Coordinate grids. Width/height are mapped as: Sys (80 to 200), Dia (40 to 130)
      let bottomPercent = ((dia - 40) / (130 - 40)) * 100;
      let leftPercent = ((sys - 80) / (200 - 80)) * 100;

      bottomPercent = Math.max(5, Math.min(95, bottomPercent));
      leftPercent = Math.max(5, Math.min(95, leftPercent));

      html = `
        <div class="results-header-block">
          <div class="results-large-val" style="background: var(--grad-cardio); -webkit-background-clip: text;">${res.score} mmHg</div>
          <div class="results-classification" style="color: ${res.color};">${res.classification}</div>
        </div>

        <div class="bp-coordinate-grid">
          <div class="bp-grid-label-y" style="bottom: 90%;">130 -</div>
          <div class="bp-grid-label-y" style="bottom: 50%;">80 -</div>
          <div class="bp-grid-label-y" style="bottom: 10%;">40 -</div>
          
          <div class="bp-grid-label-x" style="left: 10%;">80</div>
          <div class="bp-grid-label-x" style="left: 45%;">120</div>
          <div class="bp-grid-label-x" style="left: 85%;">200</div>
          
          <div class="bp-coordinate-dot" style="bottom: ${bottomPercent}%; left: ${leftPercent}%;"></div>
        </div>
        
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); font-weight:700;">
          <span>HYPOTENSION / NORMAL</span>
          <span>HYPERTENSION / CRISIS</span>
        </div>
      `;

      resultsPanel.style.borderColor = res.color;
      this.updateTipsSection(res.healthTip);

    } else if (id === "ovulation") {
      const date = this.getFieldValue("lmpDate");
      const len = this.getFieldValue("cycleLength");

      const res = window.HealthCalculators.calculateOvulation(date, len);

      html = `
        <div class="results-header-block">
          <div class="results-large-val" style="background: var(--grad-women); -webkit-background-clip: text; font-size: 2.25rem;">${res.score}</div>
          <div class="results-classification" style="color: var(--color-women);">Estimated Peak Ovulation Day</div>
        </div>

        <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
          <div style="background: var(--bg-secondary); border: var(--border-width) solid var(--border-glass); border-radius: var(--radius-md); padding: 1rem;">
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">HIGH METABOLIC FERTILITY WINDOW</div>
            <div style="font-family:var(--font-heading); font-size:1.15rem; font-weight:700; margin-top:0.25rem; color:var(--text-primary);">
              ${res.fertileStart} - ${res.fertileEnd}
            </div>
          </div>

          <div style="background: var(--bg-secondary); border: var(--border-width) solid var(--border-glass); border-radius: var(--radius-md); padding: 1rem;">
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">NEXT MENSTRUATION CYCLE COMMENCES</div>
            <div style="font-family:var(--font-heading); font-size:1.15rem; font-weight:700; margin-top:0.25rem; color:var(--text-secondary);">
              ${res.nextPeriod}
            </div>
          </div>
        </div>
      `;

      resultsPanel.style.borderColor = 'var(--color-women)';
      this.updateTipsSection(res.healthTip);

    } else if (id === "pregnancy") {
      const date = this.getFieldValue("lmpDate");
      const len = this.getFieldValue("cycleLength");

      const res = window.HealthCalculators.calculatePregnancyDueDate(date, len);

      // Timeline percentage (weeks 0 to 40)
      let percentage = (res.gestationWeeks / 40) * 100;
      percentage = Math.max(0, Math.min(100, percentage));

      html = `
        <div class="results-header-block">
          <div class="results-large-val" style="background: var(--grad-women); -webkit-background-clip: text; font-size: 2.25rem;">${res.score}</div>
          <div class="results-classification" style="color: var(--color-women);">Estimated Baby Delivery Date</div>
        </div>

        <div style="display:flex; justify-content:space-between; margin-top:1rem; text-align:center;">
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">GESTATIONAL AGE</div>
            <div style="font-family:var(--font-heading); font-size:1.25rem; font-weight:800; color:var(--text-primary);">${res.gestationWeeks}w ${res.gestationDays}d</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">CURRENT TERM</div>
            <div style="font-family:var(--font-heading); font-size:1.25rem; font-weight:800; color:var(--color-women);">${res.trimester}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">BABY ESTIMATED SIZE</div>
            <div style="font-family:var(--font-heading); font-size:1.25rem; font-weight:800; color:var(--text-primary);">${res.babySize}</div>
          </div>
        </div>

        <div class="pregnancy-timeline-container">
          <div class="preg-timeline-bg">
            <div class="preg-timeline-fill" style="width: ${percentage}%;"></div>
            <div class="preg-timeline-indicator" style="left: ${percentage}%;"></div>
          </div>
          <div class="preg-timeline-labels">
            <span>Conception</span>
            <span>Trimester 2 (13w)</span>
            <span>Trimester 3 (27w)</span>
            <span>Due (40w)</span>
          </div>
        </div>

        <div style="text-align:center; font-size:0.875rem; color:var(--text-muted); font-weight:600;">
          Countdown: <strong>${res.daysLeft} days remaining</strong> until arrival.
        </div>
      `;

      resultsPanel.style.borderColor = 'var(--color-women)';
      this.updateTipsSection(res.healthTip);

    } else if (id === "waterintake") {
      const weight = this.getFieldValue("weight");
      const activity = this.getFieldValue("activityLevel");
      const climate = this.getFieldValue("climate");

      const res = window.HealthCalculators.calculateWaterIntake(weight, activity, climate);

      // Hydration percentage target (capped at 5 liters)
      let waterHeight = (res.score / 5000) * 100;
      waterHeight = Math.max(5, Math.min(100, waterHeight));

      html = `
        <div class="results-header-block">
          <div class="results-large-val" style="background: var(--grad-other); -webkit-background-clip: text;">${res.targetLiters} Liters</div>
          <div class="results-classification" style="color: var(--color-other);">${res.cups} standard cups (250ml)</div>
        </div>

        <div class="water-glass-visual">
          <div class="water-fill-layer" style="height: ${waterHeight}%;">
            <div style="font-family:var(--font-heading); font-weight:800; font-size:1.25rem; color:#fff; z-index:5;">${res.score}ml</div>
          </div>
        </div>
      `;

      resultsPanel.style.borderColor = 'var(--color-other)';
      this.updateTipsSection(res.healthTip);

    } else if (id === "alcohol") {
      const gender = this.getFieldValue("gender");
      const weight = this.getFieldValue("weight");
      const volume = this.getFieldValue("drinkVolume");
      const abv = this.getFieldValue("abv");
      const hours = this.getFieldValue("hours");

      const res = window.HealthCalculators.calculateBAC(gender, weight, volume, abv, hours);

      // Gauge dial width percentage (BAC 0.0 to 0.2 mapped to 0 to 100 percent)
      let scale = (res.score / 0.2) * 100;
      scale = Math.max(0, Math.min(100, scale));

      html = `
        <div class="results-header-block">
          <div class="results-large-val" style="background: var(--grad-other); -webkit-background-clip: text;">${res.score}%</div>
          <div class="results-classification" style="color: ${res.color};">${res.drivingLegalStatus}</div>
        </div>

        <div style="margin: 1.5rem 0;">
          <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700; margin-bottom:0.5rem; text-transform:uppercase;">SOBRIETY BLOOD CONCENTRATION BAR</div>
          <div style="width:100%; height:12px; background:var(--bg-tertiary); border-radius:6px; overflow:hidden;">
            <div style="height:100%; width:${scale}%; background: ${res.color}; border-radius:6px;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">
            <span>0.0% Sober</span>
            <span>0.08% Legal Limit</span>
            <span>0.2% Extreme</span>
          </div>
        </div>

        <div style="display:flex; justify-content:space-around; text-align:center; margin-top:1.5rem;">
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">IMPAIRMENT ZONE</div>
            <div style="font-size:0.95rem; font-weight:700; margin-top:0.25rem; color:var(--text-primary);">${res.impairmentLevel.split(',')[0]}</div>
          </div>
          <div>
            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">CLEARANCE TIME</div>
            <div style="font-size:0.95rem; font-weight:700; margin-top:0.25rem; color:var(--text-primary);">~${res.soberHours} hours</div>
          </div>
        </div>
      `;

      resultsPanel.style.borderColor = res.color;
      this.updateTipsSection(res.healthTip);
    }

    resultsPanel.innerHTML = html;
  },

  /**
   * Updates recommendation advice area under charts
   */
  updateTipsSection(tipText) {
    const tipContainer = document.getElementById('calc-clinical-tips');
    if (tipContainer) {
      tipContainer.innerHTML = `
        <div style="display: flex; gap: 1rem; align-items: flex-start;">
          <div style="font-size: 1.5rem; color: var(--color-fitness);">💡</div>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.25rem; color: var(--text-primary);">Recommendations & Tips</div>
            <div style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">${tipText}</div>
          </div>
        </div>
      `;
    }
  }
};
