/**
 * Diagnostic PDF Report Generator
 * Programmatically constructs a clean, professional, high-contrast clinical print report
 * and triggers the native browser print engine.
 */

window.PDFGenerator = {
  /**
   * Compiles the active calculator inputs & results and prints them
   */
  generateReport(calculatorId, calculatorName, inputs, results) {
    // 1. Remove any existing print container to avoid duplicates
    const oldReport = document.getElementById('print-report-root');
    if (oldReport) oldReport.remove();

    // 2. Extract live recommendations tip
    const tipsEl = document.getElementById('calc-clinical-tips');
    let tipsText = "Maintain a balanced lifestyle, monitor body metrics regularly, and keep physically active.";
    if (tipsEl) {
      // Clean up text
      tipsText = tipsEl.innerText.replace(/recommendations\s*&\s*tips/gi, '').trim();
    }

    // 3. Extract active results details from DOM
    const largeVal = document.querySelector('#results-output-panel .results-large-val')?.innerText || '';
    const classification = document.querySelector('#results-output-panel .results-classification')?.innerText || '';
    const classificationColor = document.querySelector('#results-output-panel .results-classification')?.style.color || '#0f172a';

    // Helper to resolve print colors safely for high-contrast output
    const getPrintColor = (colorStr) => {
      if (!colorStr) return '#0f172a';
      const clean = colorStr.trim().toLowerCase();
      if (clean === 'var(--text-primary)' || clean === 'var(--text-secondary)' || clean === 'var(--text-muted)' ||
          clean === '#f8fafc' || clean === '#ffffff' || clean === '#fff' ||
          clean === 'rgb(248, 250, 252)' || clean === 'rgb(255, 255, 255)') {
        return '#0f172a';
      }
      return colorStr;
    };

    // Extract extra details (macros list, training zones list, etc.) and strip graphical elements
    let extraDetailsHtml = '';
    const resultsPanel = document.getElementById('results-output-panel');
    if (resultsPanel) {
      const clone = resultsPanel.cloneNode(true);
      
      // Remove header block elements since we render them separately
      const headerBlock = clone.querySelector('.results-header-block');
      if (headerBlock) headerBlock.remove();
      
      // Strip SVG gauges, progress bars, coordinates, liquid containers
      clone.querySelectorAll('svg').forEach(svg => svg.remove());
      clone.querySelectorAll('.water-glass-visual').forEach(el => el.remove());
      clone.querySelectorAll('.bp-coordinate-grid').forEach(el => el.remove());
      clone.querySelectorAll('.pregnancy-timeline-container').forEach(el => el.remove());
      
      extraDetailsHtml = clone.innerHTML;
    }

    // 4. Translate raw coded values to professional English-Hindi bilingual text
    const valueTranslations = {
      'male': 'Male (पुरुष)',
      'female': 'Female (महिला)',
      'sedentary': 'Sedentary (सक्रियता रहित - No Exercise)',
      'lightly_active': 'Lightly Active (कम सक्रिय - 1-3 days/week)',
      'moderately_active': 'Moderately Active (मध्यम सक्रिय - 3-5 days/week)',
      'very_active': 'Very Active (अत्यधिक सक्रिय - 6-7 days/week)',
      'extra_active': 'Extra Active (अथक सक्रिय - Hard physical job/Athletic)',
      'active': 'Active (सक्रिय)',
      'athletic': 'Athletic (खेलकूद विशेषज्ञ)',
      'cold': 'Cold (ठंडी जलवायु)',
      'moderate': 'Moderate (सामान्य जलवायु)',
      'hot': 'Hot (गर्म जलवायु)',
      'lose': 'Weight Loss (वजन घटाना)',
      'maintain': 'Maintain Weight (वजन बनाए रखना)',
      'gain': 'Muscle Gain (मांसपेशियों का विकास)',
      'balanced': 'Balanced (30% Prot / 40% Carb / 30% Fat)',
      'low_carb': 'Low Carb (40% Prot / 20% Carb / 40% Fat)',
      'high_protein': 'High Protein (40% Prot / 30% Carb / 30% Fat)',
      'keto': 'Keto Plan (20% Prot / 5% Carb / 75% Fat)',
      'walking': 'Walking (साधारण सैर)',
      'running': 'Running (दौड़ना)',
      'cycling': 'Cycling (साइकिल चलाना)',
      'swimming': 'Swimming (तैराकी)',
      'strength': 'Strength Training (भार प्रशिक्षण)',
      'yoga': 'Yoga (योग)'
    };

    let inputsRowsHtml = '';
    for (const [label, val] of Object.entries(inputs)) {
      let displayVal = val;
      const cleanVal = String(val).trim();
      
      const parts = cleanVal.split(' ');
      if (parts.length > 1 && valueTranslations[parts[0]]) {
        displayVal = valueTranslations[parts[0]] + ' ' + parts.slice(1).join(' ');
      } else if (valueTranslations[cleanVal]) {
        displayVal = valueTranslations[cleanVal];
      } else if (cleanVal.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const d = new Date(cleanVal);
        if (!isNaN(d.getTime())) {
          displayVal = d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }
      }
      
      inputsRowsHtml += `
        <tr style="border-bottom: 1px solid #e2e8f0;">
          <td style="padding: 0.65rem 0; font-size: 13px; color: #475569; font-weight: 600;">${label}</td>
          <td style="padding: 0.65rem 0; font-size: 13px; color: #0f172a; font-weight: 800; text-align: right;">${displayVal}</td>
        </tr>
      `;
    }

    // Dynamic Accent Colors based on category
    const category = window.UIController.calcMetadata[calculatorId]?.category || 'Other';
    const categoryColors = {
      Weight: '#06b6d4',
      Fitness: '#f97316',
      Cardio: '#e11d48',
      Women: '#ec4899',
      Other: '#3b82f6'
    };
    const categoryBgColors = {
      Weight: '#ecfeff',
      Fitness: '#fff7ed',
      Cardio: '#fff1f2',
      Women: '#fdf2f8',
      Other: '#eff6ff'
    };
    const categoryTextColors = {
      Weight: '#0891b2',
      Fitness: '#ea580c',
      Cardio: '#be123c',
      Women: '#be185d',
      Other: '#1d4ed8'
    };

    const accentColor = categoryColors[category] || '#3b82f6';
    const accentBgColor = categoryBgColors[category] || '#eff6ff';
    const accentTextColor = categoryTextColors[category] || '#1d4ed8';

    // 5. Create clinical print wrapper element
    const reportContainer = document.createElement('div');
    reportContainer.id = 'print-report-root';
    
    // Set explicit print-friendly styling
    reportContainer.innerHTML = `
      <div style="font-family: 'Outfit', 'Inter', sans-serif; max-width: 800px; margin: 0 auto; padding: 2.5rem; color: #1e293b; background: #ffffff;">
        
        <!-- Header Banner -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0f172a; padding-bottom: 1.25rem; margin-bottom: 2rem;">
          <div>
            <h1 style="margin: 0; font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">HEALTHCALC CLINICAL REPORT</h1>
            <p style="margin: 3px 0 0 0; font-size: 12px; color: #64748b; font-weight: 500;">Diagnostic Body Metrics & Lifestyle Assessment</p>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 800; font-size: 13px; color: #0f172a;">REPORT ID: HC-${Math.floor(100000 + Math.random() * 900000)}</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 3px;">Date Compiled: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>

        <!-- Tool Identification -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: 4px solid ${accentColor}; border-radius: 8px; padding: 0.85rem 1.25rem; margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-size: 9.5px; text-transform: uppercase; font-weight: 800; color: ${accentColor}; letter-spacing: 0.5px; display: block;">Selected Diagnostic Tool</span>
            <h2 style="margin: 2px 0 0 0; font-size: 18px; font-weight: 800; color: #0f172a;">${calculatorName}</h2>
          </div>
          <div style="font-size: 12px; font-weight: 700; color: ${accentTextColor}; background: ${accentBgColor}; padding: 4px 10px; border-radius: 6px; text-transform: uppercase;">Verified Engine</div>
        </div>

        <!-- Two Column Content Grid -->
        <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 2.5rem; margin-bottom: 2rem;">
          
          <!-- Inputs Column -->
          <div>
            <h3 style="font-size: 13px; font-weight: 800; color: #0f172a; border-bottom: 2px solid #cbd5e1; padding-bottom: 0.4rem; margin-bottom: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">Configured Input Parameters</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${inputsRowsHtml}
            </table>
          </div>

          <!-- Outputs Column -->
          <div>
            <h3 style="font-size: 13px; font-weight: 800; color: #0f172a; border-bottom: 2px solid #cbd5e1; padding-bottom: 0.4rem; margin-bottom: 0.85rem; text-transform: uppercase; letter-spacing: 0.5px;">Computed Results</h3>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-top: 4px solid ${accentColor}; border-radius: 12px; padding: 1.5rem; text-align: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              <div style="font-size: 34px; font-weight: 800; color: #0f172a; line-height: 1.1; margin-bottom: 4px;">${largeVal}</div>
              <div style="font-size: 13px; font-weight: 800; color: ${getPrintColor(classificationColor)}; text-transform: uppercase; letter-spacing: 0.2px;">${classification}</div>
            </div>
          </div>

        </div>

        <!-- Extra details (e.g. macro breakdowns, metabolic zones) -->
        ${extraDetailsHtml ? `
          <div class="print-extra-details" style="margin-bottom: 2rem; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.25rem; background: #fafafa;">
            <h3 style="font-size: 12px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 0.75rem 0; border-bottom: 1px solid #cbd5e1; padding-bottom: 0.25rem;">Detailed Metabolic Assessment</h3>
            <div style="font-size: 13px; line-height: 1.6;">
              ${extraDetailsHtml}
            </div>
          </div>
        ` : ''}

        <!-- Recommendations & Clinical Tips Section -->
        <div style="border-left: 4px solid ${accentColor}; background: ${accentBgColor}; border-radius: 0 8px 8px 0; padding: 1.25rem; margin-bottom: 3.5rem;">
          <h4 style="margin: 0 0 0.4rem 0; font-size: 12px; font-weight: 800; color: ${accentTextColor}; text-transform: uppercase; letter-spacing: 0.5px;">Clinical Guidance & Recommendations</h4>
          <p style="margin: 0; font-size: 13px; color: ${accentTextColor}; line-height: 1.6; font-weight: 500;">${tipsText}</p>
        </div>

        <!-- Medical Disclaimer -->
        <div style="border-top: 1px solid #e2e8f0; padding-top: 1.25rem; text-align: center; font-size: 10px; color: #94a3b8; line-height: 1.5;">
          <p style="margin: 0; font-weight: 700; color: #64748b;">DISCLAIMER: This metabolic computation report is compiled for educational purposes only.</p>
          <p style="margin: 3px 0 0 0;">It does not constitute medical diagnostic testing, pharmacological prescriptions, or therapeutic instructions. Please speak to a certified general physician or licensed nutritionist for targeted health plans.</p>
        </div>
      </div>
    `;

    document.body.appendChild(reportContainer);

    // 6. Append dynamic helper styles for clean printing layout
    const helperStyleId = 'print-engine-helper-style';
    let helperStyle = document.getElementById(helperStyleId);
    if (!helperStyle) {
      helperStyle = document.createElement('style');
      helperStyle.id = helperStyleId;
      helperStyle.textContent = `
        #print-report-root {
          display: none;
        }
        @media print {
          :root {
            --text-primary: #0f172a !important;
            --text-secondary: #475569 !important;
            --text-muted: #64748b !important;
            --bg-primary: #ffffff !important;
            --bg-secondary: #ffffff !important;
            --bg-tertiary: #f1f5f9 !important;
            --bg-glass: #ffffff !important;
            --border-glass: rgba(0, 0, 0, 0.08) !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide main app contents completely */
          .app-container, .ad-slot, .footer, .header-nav {
            display: none !important;
          }
          /* Show print report exclusively */
          #print-report-root {
            display: block !important;
            background: #ffffff !important;
            min-height: 100vh !important;
            width: 100% !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
          }
          body {
            background: #ffffff !important;
            color: #1e293b !important;
          }
          
          /* Clean up custom elements inside cloned extra assessment details */
          #print-report-root .macro-chart-bar-bg {
            background: #e2e8f0 !important;
            border: 1px solid #cbd5e1 !important;
          }
          #print-report-root .macro-chart-bar-fill {
            background: #6366f1 !important;
          }
          #print-report-root .heart-zone-card {
            background: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
            color: #1e293b !important;
            box-shadow: none !important;
          }
          #print-report-root .heart-zone-card.active {
            background: #fee2e2 !important;
            border-color: #ef4444 !important;
          }
          #print-report-root .segmented-control {
            background: #f1f5f9 !important;
            border: 1px solid #e2e8f0 !important;
          }
          #print-report-root .segmented-btn.active {
            background: #ffffff !important;
            color: #0f172a !important;
            border: 1px solid #cbd5e1 !important;
          }
          /* Ensure cloned theme variables don't hide text */
          #print-report-root .pregnancy-timeline-container,
          #print-report-root .bp-coordinate-grid,
          #print-report-root .water-glass-visual {
            display: none !important;
          }
        }
      `;
      document.head.appendChild(helperStyle);
    }

    // 7. Trigger print dialogue
    setTimeout(() => {
      window.print();
    }, 100);

    // 8. Register automatic post-print cleanup
    const cleanUp = () => {
      reportContainer.remove();
    };

    window.addEventListener('afterprint', cleanUp, { once: true });
    // Fallback cleanup in case afterprint does not fire on some devices
    setTimeout(cleanUp, 5000);
  }
};

