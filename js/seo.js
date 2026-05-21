/**
 * SEO & Structured Data Schema Automator
 * Dynamically modifies head metadata and injects JSON-LD schemas
 */

window.SEOAutomator = {
  // Database of SEO details per calculator
  metaDatabase: {
    dashboard: {
      title: "Premium Health & Fitness Calculators Dashboard",
      description: "Access our collection of 12+ premium health, fitness, and lifestyle calculators. Free diagnostic calculations for BMI, BMR, Ovulation, target heart rate, and more.",
      keywords: "health calculator, fitness calculator, BMI, BMR, TDEE, macros, cardiovascular, ovulation, hydration, BAC"
    },
    bmi: {
      title: "Premium BMI (Body Mass Index) Calculator | Health Calc",
      description: "Quickly compute your Body Mass Index (BMI) instantly. Understand your body composition category and discover customized medical weight targets.",
      keywords: "BMI calculator, Body Mass Index, health weight, body composition, lose weight"
    },
    bmr: {
      title: "Basal Metabolic Rate (BMR) Calorie Calculator | Health Calc",
      description: "Calculate your BMR using the Mifflin-St Jeor formula. Uncover your body's base daily calorie requirements at complete rest.",
      keywords: "BMR calculator, Basal Metabolic Rate, calorie burn at rest, base calories"
    },
    bodyfat: {
      title: "U.S. Navy Method Body Fat Percentage Calculator | Health Calc",
      description: "Estimate your body fat percentage, lean body mass, and fat weight using neck, waist, and hip parameters. Fast, scientific, and zero-reload.",
      keywords: "body fat calculator, Navy body fat, fat percentage, lean mass"
    },
    calorieburn: {
      title: "Daily Workout Calorie Burn MET Tracker | Health Calc",
      description: "Calculate exact calories burned during running, walking, swimming, cycling, or yoga. Tracks training MET values reactively.",
      keywords: "calorie burn calculator, MET calculator, workout calories, calories burned"
    },
    tdee: {
      title: "Total Daily Energy Expenditure (TDEE) Calculator | Health Calc",
      description: "Calculate your BMR and TDEE instantly. View detailed daily calorie goals for muscle building, fat loss, or maintaining your weight.",
      keywords: "TDEE calculator, daily expenditure, calorie surplus, calorie deficit"
    },
    macros: {
      title: "Macronutrient (Macros) Ratio Split Calculator | Health Calc",
      description: "Get customized grams of Protein, Carbs, and Fats for your daily eating plan. Supports Balanced, Low Carb, High Protein, and Keto diets.",
      keywords: "Macros calculator, macronutrients, keto grams, protein requirement"
    },
    heartrate: {
      title: "Target Heart Rate (THR) Zone Calculator | Health Calc",
      description: "Calculate your maximum heart rate and 5 optimal cardiovascular training intensity zones using Haskell and Karvonen formulas.",
      keywords: "target heart rate calculator, HR zone, Karvonen formula, cardiovascular, training zones"
    },
    bloodpressure: {
      title: "Blood Pressure (BP) Clinical Level Analyzer | Health Calc",
      description: "Analyze your blood pressure readings instantly. Discover classification ranges from Normal to Stage 2 Hypertension with medical advice.",
      keywords: "blood pressure calculator, BP level, hypertension, systolic, diastolic"
    },
    ovulation: {
      title: "Ovulation Calendar & Fertility Window Calculator | Health Calc",
      description: "Track your menstruation cycles to determine your next period date, fertility window, and peak ovulation day dynamically.",
      keywords: "ovulation calculator, fertile window, fertility calendar, track cycle"
    },
    pregnancy: {
      title: "Pregnancy Due Date & Gestational Age Tracker | Health Calc",
      description: "Calculate your estimated baby due date and gestational progress. Tracks trimesters, days remaining, and baby growth benchmarks.",
      keywords: "pregnancy calculator, due date calculator, gestational age, trimester countdown"
    },
    waterintake: {
      title: "Daily Hydration Water Intake Volume Calculator | Health Calc",
      description: "Determine how much water you need to drink daily based on weight, training levels, and regional climate. With custom cups layout.",
      keywords: "water intake calculator, daily hydration, water cups, fluid balance"
    },
    alcohol: {
      title: "Blood Alcohol Concentration (BAC) Calculator | Health Calc",
      description: "Estimate blood alcohol percentage and sober countdown using the Widmark formula. Monitor physical impairment and legal driving states.",
      keywords: "BAC calculator, blood alcohol, Widmark formula, sobriety calculator, alcohol level"
    },
    admin: {
      title: "Health Calculator Administrator Console | Health Calc",
      description: "Manage global Google AdSense slots, analytics traffic graphs, and edit educational content articles dynamically using local database storage.",
      keywords: "admin console, cms, analytics, traffic charts"
    }
  },

  /**
   * Updates page head metadata and injects rich JSON-LD schema
   */
  updateMetadata(key) {
    const data = this.metaDatabase[key] || this.metaDatabase.dashboard;

    // 1. Update Head title
    document.title = data.title;

    // 2. Manage meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = data.description;

    // 3. Manage meta keywords
    let metaKey = document.querySelector('meta[name="keywords"]');
    if (!metaKey) {
      metaKey = document.createElement('meta');
      metaKey.name = "keywords";
      document.head.appendChild(metaKey);
    }
    metaKey.content = data.keywords;

    // 4. Inject JSON-LD Schema
    this.injectSchema(key, data);
  },

  /**
   * Generates and embeds structured schema markup
   */
  injectSchema(key, data) {
    // Remove existing schema scripts
    const oldSchemas = document.querySelectorAll('script[type="application/ld+json"].seo-schema');
    oldSchemas.forEach(el => el.remove());

    const schemaObj = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": data.title,
      "description": data.description,
      "applicationCategory": "HealthApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD"
      }
    };

    // Add specialized HealthCalculator type details if not dashboard or admin
    if (key !== "dashboard" && key !== "admin") {
      schemaObj["@type"] = "HealthTopicContent";
      schemaObj["about"] = {
        "@type": "Thing",
        "name": key.toUpperCase() + " Health Calculation Parameters"
      };
    }

    const scriptEl = document.createElement('script');
    scriptEl.type = "application/ld+json";
    scriptEl.className = "seo-schema";
    scriptEl.textContent = JSON.stringify(schemaObj, null, 2);
    document.head.appendChild(scriptEl);
  }
};
