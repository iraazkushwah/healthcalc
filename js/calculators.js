/**
 * Health & Fitness Calculators Core Logic
 * Fully encapsulated mathematical formulas for 12 core health calculators
 */

window.HealthCalculators = {
  /**
   * 1. Body Mass Index (BMI)
   * Formula: BMI = weight (kg) / (height (m))^2
   */
  calculateBMI(heightCm, weightKg, gender) {
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const score = Math.round(bmi * 10) / 10;
    
    let classification = "";
    let color = "";
    let tip = "";

    if (score < 18.5) {
      classification = "Underweight (कम वजन)";
      color = "var(--color-info)";
      tip = "Consider speaking with a healthcare provider about healthy weight gain strategies and nutrient-dense eating patterns.";
    } else if (score >= 18.5 && score < 25) {
      classification = "Normal Weight (सामान्य वजन)";
      color = "var(--color-success)";
      tip = "Excellent! Maintain your current balanced diet, regular physical exercise, and hydration levels to sustain this healthy status.";
    } else if (score >= 25 && score < 30) {
      classification = "Overweight (अधिक वजन)";
      color = "var(--color-warning)";
      tip = "Consider adding moderate cardiovascular activity (e.g., fast walking 30 mins) and keeping tabs on sugar and calorie intake.";
    } else {
      classification = "Obese (मोटापा)";
      color = "var(--color-danger)";
      tip = "We highly recommend consulting a physician or nutritionist to co-create a safe dietary and lifestyle regimen.";
    }

    const minNormalWeight = Math.round(18.5 * (heightM * heightM) * 10) / 10;
    const maxNormalWeight = Math.round(24.9 * (heightM * heightM) * 10) / 10;

    return {
      score,
      classification,
      color,
      healthTip: tip,
      minNormalWeight,
      maxNormalWeight
    };
  },

  /**
   * 2. Basal Metabolic Rate (BMR)
   * Formula Mifflin-St Jeor:
   * Men: 10 * wt + 6.25 * ht - 5 * age + 5
   * Women: 10 * wt + 6.25 * ht - 5 * age - 161
   */
  calculateBMR(heightCm, weightKg, age, gender) {
    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    const score = Math.round(bmr);
    return {
      score,
      healthTip: "This is the minimum number of calories your body needs to survive at complete rest. Never eat below this limit without medical supervision."
    };
  },

  /**
   * 3. Body Fat Calculator (U.S. Navy Method)
   */
  calculateBodyFat(gender, heightCm, neckCm, waistCm, hipCm = 0) {
    let bodyFat = 0;
    
    // Convert inputs to inches
    const heightIn = heightCm / 2.54;
    const neckIn = neckCm / 2.54;
    const waistIn = waistCm / 2.54;

    if (gender === "male") {
      // Men: 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
      const logCirc = Math.log10(waistIn - neckIn);
      const logHt = Math.log10(heightIn);
      bodyFat = 86.010 * logCirc - 70.041 * logHt + 36.76;
    } else {
      // Women: 163.205 * log10(waist + hip - neck) - 97.684 * log10(height) - 78.387
      const hipIn = hipCm / 2.54;
      const logCirc = Math.log10(waistIn + hipIn - neckIn);
      const logHt = Math.log10(heightIn);
      bodyFat = 163.205 * logCirc - 97.684 * logHt - 78.387;
    }

    if (isNaN(bodyFat) || bodyFat < 2) bodyFat = 2; // Safeguard

    const score = Math.round(bodyFat * 10) / 10;
    
    // Classifications
    let classification = "";
    let color = "";
    
    if (gender === "male") {
      if (score <= 5) { classification = "Essential Fat (अति आवश्यक वसा)"; color = "var(--color-danger)"; }
      else if (score <= 13) { classification = "Athletes (एथलीट)"; color = "var(--color-success)"; }
      else if (score <= 17) { classification = "Fitness (फिटनेस)"; color = "var(--color-success)"; }
      else if (score <= 24) { classification = "Average (औसत)"; color = "var(--color-warning)"; }
      else { classification = "Obese (मोटापा)"; color = "var(--color-danger)"; }
    } else {
      if (score <= 13) { classification = "Essential Fat (अति आवश्यक वसा)"; color = "var(--color-danger)"; }
      else if (score <= 20) { classification = "Athletes (एथलीट)"; color = "var(--color-success)"; }
      else if (score <= 24) { classification = "Fitness (फिटनेस)"; color = "var(--color-success)"; }
      else if (score <= 31) { classification = "Average (औसत)"; color = "var(--color-warning)"; }
      else { classification = "Obese (मोटापा)"; color = "var(--color-danger)"; }
    }

    return {
      score,
      classification,
      color,
      healthTip: `Your target body fat percentage should be based on your fitness goals. Focus on progressive resistance training to build fat-free body mass.`
    };
  },

  /**
   * 4. Daily Calorie Burn
   * Formula: Duration * (MET * 3.5 * Weight / 200)
   */
  calculateDailyCalorieBurn(weightKg, activityType, durationMins) {
    // MET values
    const metMap = {
      walking: 3.8,
      running: 9.8,
      cycling: 7.5,
      swimming: 8.0,
      strength: 5.0,
      yoga: 2.5
    };

    const met = metMap[activityType] || 3.5;
    const caloriesBurned = durationMins * (met * 3.5 * weightKg / 200);
    const score = Math.round(caloriesBurned);

    return {
      score,
      met,
      healthTip: `Fantastic job staying active! Burning ${score} calories helps improve your cardiovascular strength and metabolic flexibility.`
    };
  },

  /**
   * 5. Total Daily Energy Expenditure (TDEE)
   */
  calculateTDEE(heightCm, weightKg, age, gender, activityLevel) {
    const bmrResult = this.calculateBMR(heightCm, weightKg, age, gender);
    const bmr = bmrResult.score;

    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      extra_active: 1.9
    };

    const multiplier = activityMultipliers[activityLevel] || 1.2;
    const score = Math.round(bmr * multiplier);

    // Dynamic targets
    return {
      score,
      maintenance: score,
      mildLoss: Math.round(score * 0.85),
      extremeLoss: Math.round(score * 0.70),
      mildGain: Math.round(score * 1.10),
      bulk: Math.round(score * 1.20),
      healthTip: "This is your total daily calorie usage. Adjust your daily intake based on whether you want to lose, maintain, or gain weight."
    };
  },

  /**
   * 6. Macronutrient (Macros)
   */
  calculateMacros(tdeeKcal, fitnessGoal, dietType) {
    let targetCalories = tdeeKcal;
    
    if (fitnessGoal === "lose") {
      targetCalories = Math.round(tdeeKcal - 500);
    } else if (fitnessGoal === "gain") {
      targetCalories = Math.round(tdeeKcal + 400);
    }

    // Split ratio maps [Protein%, Carbs%, Fat%]
    const dietSplits = {
      balanced: [0.30, 0.40, 0.30],
      low_carb: [0.40, 0.20, 0.40],
      high_protein: [0.40, 0.30, 0.30],
      keto: [0.20, 0.05, 0.75]
    };

    const ratios = dietSplits[dietType] || dietSplits.balanced;
    
    const pKcal = targetCalories * ratios[0];
    const cKcal = targetCalories * ratios[1];
    const fKcal = targetCalories * ratios[2];

    const proteinG = Math.round(pKcal / 4);
    const carbG = Math.round(cKcal / 4);
    const fatG = Math.round(fKcal / 9);

    return {
      score: targetCalories,
      proteinG,
      carbG,
      fatG,
      proteinKcal: Math.round(pKcal),
      carbKcal: Math.round(pKcal),
      fatKcal: Math.round(fKcal),
      ratios: ratios.map(r => r * 100),
      healthTip: "Prioritize getting sufficient protein to retain lean muscle, and fill the rest of your daily calories using clean fats and complex carbs."
    };
  },

  /**
   * 7. Target Heart Rate (THR)
   * Haskell & Fox: HRmax = 220 - Age
   * Karvonen: Target HR = ((HRmax - HRrest) * Intensity%) + HRrest
   */
  calculateTargetHeartRate(age, restingHr = 0) {
    const hrMax = 220 - age;
    
    const zoneMultipliers = [
      { name: "Warm-Up (वार्म-अप)", min: 0.50, max: 0.60, color: "#10b981", desc: "Easy cardiovascular conditioning and warm-up." },
      { name: "Fat Burn (वसा घटाना)", min: 0.60, max: 0.70, color: "#06b6d4", desc: "Optimal cardiovascular zone to consume fat energy." },
      { name: "Aerobic (सहनशक्ति)", min: 0.70, max: 0.80, color: "#f59e0b", desc: "Builds systemic endurance, respiratory stamina." },
      { name: "Anaerobic (अवायवीय)", min: 0.80, max: 0.90, color: "#f97316", desc: "Boosts lactate threshold, speed, muscular capacity." },
      { name: "Red Line (चरम सीमा)", min: 0.90, max: 1.00, color: "#e11d48", desc: "Extreme short sprints. Hardcore athletic capacity." }
    ];

    const zones = zoneMultipliers.map(zone => {
      let lower = 0;
      let upper = 0;

      if (restingHr > 0) {
        // Karvonen formula
        const reserve = hrMax - restingHr;
        lower = Math.round((reserve * zone.min) + restingHr);
        upper = Math.round((reserve * zone.max) + restingHr);
      } else {
        // Simple Haskell formula
        lower = Math.round(hrMax * zone.min);
        upper = Math.round(hrMax * zone.max);
      }

      return {
        ...zone,
        lower,
        upper
      };
    });

    return {
      score: hrMax,
      zones,
      healthTip: "Aim to keep your workouts in the Fat Burn or Aerobic zone for sustainable and safe long-term heart conditioning."
    };
  },

  /**
   * 8. Blood Pressure Analyzer
   */
  calculateBloodPressure(systolic, diastolic) {
    let classification = "";
    let color = "";
    let tip = "";

    if (systolic < 120 && diastolic < 80) {
      classification = "Normal (सामान्य)";
      color = "var(--color-success)";
      tip = "Splendid! Keep up your healthy eating and stress reduction routines to preserve this ideal blood pressure.";
    } else if (systolic >= 120 && systolic < 130 && diastolic < 80) {
      classification = "Elevated (बढ़ा हुआ)";
      color = "var(--color-warning)";
      tip = "Your blood pressure is slightly high. Focus on reducing dietary sodium, exercising regularly, and drinking plenty of water.";
    } else if ((systolic >= 130 && systolic < 140) || (diastolic >= 80 && diastolic < 90)) {
      classification = "Hypertension - Stage 1 (उच्च रक्तचाप - चरण 1)";
      color = "var(--color-warning)";
      tip = "Consider discussing this with a family doctor. Positive lifestyle revisions (aerobics, less salt) can often help normalise numbers.";
    } else if (systolic >= 140 || diastolic >= 90) {
      classification = "Hypertension - Stage 2 (उच्च रक्तचाप - चरण 2)";
      color = "var(--color-danger)";
      tip = "High risk zone. We strongly advise booking a clinical checkup with a medical practitioner for personalized counsel.";
    }

    // Crisis override
    if (systolic > 180 || diastolic > 120) {
      classification = "Hypertensive Crisis (रक्तचाप का गंभीर संकट)";
      color = "var(--color-danger)";
      tip = "CRITICAL WARNING! Seek immediate emergency medical assistance. Sit comfortably and wait for emergency help.";
    }

    return {
      score: `${systolic}/${diastolic}`,
      classification,
      color,
      healthTip: tip
    };
  },

  /**
   * 9. Ovulation Calculator
   */
  calculateOvulation(lmpDateStr, cycleLength) {
    const lmpDate = new Date(lmpDateStr);
    
    // Next Period Date = LMP + cycle length
    const nextPeriodDate = new Date(lmpDate.getTime() + cycleLength * 24 * 60 * 60 * 1000);
    
    // Ovulation Day = Next Period Date - 14 Days
    const ovulationDate = new Date(nextPeriodDate.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    // Fertile Window: Ovulation - 5 days to Ovulation + 1 day
    const fertileStart = new Date(ovulationDate.getTime() - 5 * 24 * 60 * 60 * 1000);
    const fertileEnd = new Date(ovulationDate.getTime() + 1 * 24 * 60 * 60 * 1000);

    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return {
      score: formatDate(ovulationDate),
      nextPeriod: formatDate(nextPeriodDate),
      fertileStart: formatDate(fertileStart),
      fertileEnd: formatDate(fertileEnd),
      ovulationRaw: ovulationDate,
      fertileStartRaw: fertileStart,
      fertileEndRaw: fertileEnd,
      healthTip: "Your fertile window spans the 6 days ending on ovulation. Egg cell viability is highest on the ovulation day."
    };
  },

  /**
   * 10. Pregnancy Due Date Calculator
   */
  calculatePregnancyDueDate(lmpDateStr, cycleLength) {
    const lmpDate = new Date(lmpDateStr);
    
    // Naegele's Rule adjusted: due = lmp + 280 days + (cycle - 28)
    const cycleAdjustment = cycleLength - 28;
    const dueTime = lmpDate.getTime() + (280 + cycleAdjustment) * 24 * 60 * 60 * 1000;
    const dueDate = new Date(dueTime);

    const today = new Date();
    const diffTime = Math.max(0, today.getTime() - lmpDate.getTime());
    const totalGestationDays = Math.floor(diffTime / (24 * 60 * 60 * 1000));
    
    const weeks = Math.floor(totalGestationDays / 7);
    const days = totalGestationDays % 7;

    let trimester = "Trimester 1";
    if (weeks >= 13 && weeks < 27) trimester = "Trimester 2";
    else if (weeks >= 27) trimester = "Trimester 3";

    // Baby size comparison list
    const sizeComparison = [
      { week: 4, size: "Poppy Seed (खसखस दाना)" },
      { week: 8, size: "Raspberry (रसभरी)" },
      { week: 12, size: "Lime (नींबू)" },
      { week: 16, size: "Avocado (एवोकैडो)" },
      { week: 20, size: "Banana (केला)" },
      { week: 24, size: "Cantaloupe (खरबूजा)" },
      { week: 28, size: "Eggplant (बैंगन)" },
      { week: 32, size: "Squash (पेठा)" },
      { week: 36, size: "Papaya (पपीता)" },
      { week: 40, size: "Pumpkin (कद्दू)" }
    ];

    let babySize = "Microscopic (अति सूक्ष्म)";
    for (let comp of sizeComparison) {
      if (weeks >= comp.week) {
        babySize = comp.size;
      }
    }

    const daysLeft = Math.max(0, Math.ceil((dueDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000)));

    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return {
      score: formatDate(dueDate),
      gestationWeeks: weeks,
      gestationDays: days,
      trimester,
      babySize,
      daysLeft,
      healthTip: "Eat small, frequent nutritional meals, take your physician-prescribed prenatal vitamins, and secure ample rest daily."
    };
  },

  /**
   * 11. Water Intake
   */
  calculateWaterIntake(weightKg, activityLevel, climate) {
    // Base target: 35ml per kg of weight
    let baseMl = weightKg * 35;

    // Adjust for activity
    if (activityLevel === "active") baseMl += 500;
    else if (activityLevel === "athletic") baseMl += 1000;

    // Adjust for climate
    if (climate === "hot") baseMl += 500;
    else if (climate === "cold") baseMl -= 300;

    const targetMl = Math.round(baseMl);
    const targetLiters = Math.round((targetMl / 1000) * 10) / 10;
    const cups = Math.round(targetMl / 250);

    const schedule = [
      { time: "08:00 AM", desc: "Wake up glass (1 cup)" },
      { time: "11:00 AM", desc: "Mid-morning focus (1-2 cups)" },
      { time: "01:30 PM", desc: "Post-lunch digestive (1 cup)" },
      { time: "04:30 PM", desc: "Afternoon revitalizer (1-2 cups)" },
      { time: "07:30 PM", desc: "Pre-dinner drink (1 cup)" },
      { time: "09:30 PM", desc: "Nightcap rest balance (0.5 cup)" }
    ];

    return {
      score: targetMl,
      targetLiters,
      cups,
      schedule,
      healthTip: "Carry a reusable flask with you to keep sipping regularly. Hydration increases cognitive capacity and energy levels."
    };
  },

  /**
   * 12. Blood Alcohol Calculator (BAC)
   * Formula (Widmark):
   * Alcohol in grams = Vol (ml) * (ABV% / 100) * 0.8
   * Men r = 0.68, Women r = 0.55
   * BAC = (Grams / (WeightGrams * r) * 100) - (Hours * 0.015)
   */
  calculateBAC(gender, weightKg, drinkVolumeMl, abvPercent, hoursSinceFirstDrink) {
    const alcoholGrams = drinkVolumeMl * (abvPercent / 100) * 0.8;
    const rConstant = (gender === "male") ? 0.68 : 0.55;
    const weightGrams = weightKg * 1000;

    const rawBac = (alcoholGrams / (weightGrams * rConstant) * 100) - (hoursSinceFirstDrink * 0.015);
    const score = Math.max(0, Math.round(rawBac * 1000) / 1000);

    // Sobriety clearance timer
    let soberHours = 0;
    if (score > 0) {
      soberHours = Math.round((score / 0.015) * 10) / 10;
    }

    let drivingLegalStatus = "Legal to Drive (सुरक्षित)";
    let color = "var(--color-success)";
    let impairmentLevel = "No apparent impairment (कोई स्पष्ट नशा नहीं)";

    if (score > 0 && score < 0.05) {
      drivingLegalStatus = "Caution Advised (सावधानी रखें)";
      color = "var(--color-warning)";
      impairmentLevel = "Mild coordination degradation, relaxed emotional state.";
    } else if (score >= 0.05) {
      drivingLegalStatus = "UNSAFE/ILLEGAL (अवैध/असुरक्षित)";
      color = "var(--color-danger)";
      impairmentLevel = "Severe reflex delay, motor skills impairment, low decision capacity.";
    }

    return {
      score,
      soberHours,
      drivingLegalStatus,
      color,
      impairmentLevel,
      healthTip: "Never consume alcohol and get behind a steering wheel. Use a designated driver, ride-sharing service, or public transit."
    };
  }
};
