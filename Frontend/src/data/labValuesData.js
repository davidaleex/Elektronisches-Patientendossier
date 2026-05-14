// Labor-Daten für alle 4 User mit 20 Standardwerten

export const labValuesData = {
  // 1. LUCA FREI - Gesund, sportlich, 20 Jahre
  'luca-frei': [
    // HÄMATOLOGIE
    {
      name: 'Erythrozyten (RBC)',
      category: 'Hämatologie',
      measurements: [
        { date: '15.10.2024', value: 5.2, unit: 'Mio/µl', referenceRange: '4.5-5.9', status: 'good' },
        { date: '20.07.2024', value: 5.1, unit: 'Mio/µl', referenceRange: '4.5-5.9', status: 'good' },
        { date: '10.04.2024', value: 5.3, unit: 'Mio/µl', referenceRange: '4.5-5.9', status: 'good' }
      ]
    },
    {
      name: 'Hämoglobin (Hb)',
      category: 'Hämatologie',
      measurements: [
        { date: '15.10.2024', value: 15.2, unit: 'g/dl', referenceRange: '14-18', status: 'good' },
        { date: '20.07.2024', value: 15.0, unit: 'g/dl', referenceRange: '14-18', status: 'good' },
        { date: '10.04.2024', value: 15.4, unit: 'g/dl', referenceRange: '14-18', status: 'good' }
      ]
    },
    {
      name: 'Hämatokrit (Hct)',
      category: 'Hämatologie',
      measurements: [
        { date: '15.10.2024', value: 45, unit: '%', referenceRange: '40-52', status: 'good' },
        { date: '20.07.2024', value: 44, unit: '%', referenceRange: '40-52', status: 'good' },
        { date: '10.04.2024', value: 46, unit: '%', referenceRange: '40-52', status: 'good' }
      ]
    },
    {
      name: 'Leukozyten (WBC)',
      category: 'Hämatologie',
      measurements: [
        { date: '15.10.2024', value: 6.8, unit: 'Tsd/µl', referenceRange: '4-10', status: 'good' },
        { date: '20.07.2024', value: 7.2, unit: 'Tsd/µl', referenceRange: '4-10', status: 'good' },
        { date: '10.04.2024', value: 6.5, unit: 'Tsd/µl', referenceRange: '4-10', status: 'good' }
      ]
    },
    {
      name: 'Thrombozyten',
      category: 'Hämatologie',
      measurements: [
        { date: '15.10.2024', value: 245, unit: 'Tsd/µl', referenceRange: '150-400', status: 'good' },
        { date: '20.07.2024', value: 238, unit: 'Tsd/µl', referenceRange: '150-400', status: 'good' },
        { date: '10.04.2024', value: 252, unit: 'Tsd/µl', referenceRange: '150-400', status: 'good' }
      ]
    },
    {
      name: 'MCV',
      category: 'Hämatologie',
      measurements: [
        { date: '15.10.2024', value: 88, unit: 'fl', referenceRange: '80-96', status: 'good' },
        { date: '20.07.2024', value: 87, unit: 'fl', referenceRange: '80-96', status: 'good' },
        { date: '10.04.2024', value: 89, unit: 'fl', referenceRange: '80-96', status: 'good' }
      ]
    },

    // STOFFWECHSEL
    {
      name: 'Glukose (nüchtern)',
      category: 'Stoffwechsel',
      measurements: [
        { date: '15.10.2024', value: 92, unit: 'mg/dl', referenceRange: '70-100', status: 'good' },
        { date: '20.07.2024', value: 89, unit: 'mg/dl', referenceRange: '70-100', status: 'good' },
        { date: '10.04.2024', value: 94, unit: 'mg/dl', referenceRange: '70-100', status: 'good' }
      ]
    },
    {
      name: 'HbA1c (Langzeitzucker)',
      category: 'Stoffwechsel',
      measurements: [
        { date: '15.10.2024', value: 5.3, unit: '%', referenceRange: '<5.7', status: 'good' },
        { date: '20.07.2024', value: 5.2, unit: '%', referenceRange: '<5.7', status: 'good' },
        { date: '10.04.2024', value: 5.4, unit: '%', referenceRange: '<5.7', status: 'good' }
      ]
    },
    {
      name: 'Cholesterin gesamt',
      category: 'Stoffwechsel',
      measurements: [
        { date: '15.10.2024', value: 178, unit: 'mg/dl', referenceRange: '<200', status: 'good' },
        { date: '20.07.2024', value: 175, unit: 'mg/dl', referenceRange: '<200', status: 'good' },
        { date: '10.04.2024', value: 182, unit: 'mg/dl', referenceRange: '<200', status: 'good' }
      ]
    },
    {
      name: 'LDL-Cholesterin',
      category: 'Stoffwechsel',
      measurements: [
        { date: '15.10.2024', value: 105, unit: 'mg/dl', referenceRange: '<116', status: 'good' },
        { date: '20.07.2024', value: 102, unit: 'mg/dl', referenceRange: '<116', status: 'good' },
        { date: '10.04.2024', value: 108, unit: 'mg/dl', referenceRange: '<116', status: 'good' }
      ]
    },
    {
      name: 'HDL-Cholesterin',
      category: 'Stoffwechsel',
      measurements: [
        { date: '15.10.2024', value: 58, unit: 'mg/dl', referenceRange: '>40', status: 'good' },
        { date: '20.07.2024', value: 56, unit: 'mg/dl', referenceRange: '>40', status: 'good' },
        { date: '10.04.2024', value: 59, unit: 'mg/dl', referenceRange: '>40', status: 'good' }
      ]
    },
    {
      name: 'Triglyceride',
      category: 'Stoffwechsel',
      measurements: [
        { date: '15.10.2024', value: 98, unit: 'mg/dl', referenceRange: '<150', status: 'good' },
        { date: '20.07.2024', value: 95, unit: 'mg/dl', referenceRange: '<150', status: 'good' },
        { date: '10.04.2024', value: 102, unit: 'mg/dl', referenceRange: '<150', status: 'good' }
      ]
    },

    // NIERE & LEBER
    {
      name: 'Kreatinin',
      category: 'Niere & Leber',
      measurements: [
        { date: '15.10.2024', value: 0.9, unit: 'mg/dl', referenceRange: '0.7-1.2', status: 'good' },
        { date: '20.07.2024', value: 0.88, unit: 'mg/dl', referenceRange: '0.7-1.2', status: 'good' },
        { date: '10.04.2024', value: 0.92, unit: 'mg/dl', referenceRange: '0.7-1.2', status: 'good' }
      ]
    },
    {
      name: 'eGFR (Nierenfunktion)',
      category: 'Niere & Leber',
      measurements: [
        { date: '15.10.2024', value: 108, unit: 'ml/min', referenceRange: '>90', status: 'good' },
        { date: '20.07.2024', value: 110, unit: 'ml/min', referenceRange: '>90', status: 'good' },
        { date: '10.04.2024', value: 106, unit: 'ml/min', referenceRange: '>90', status: 'good' }
      ]
    },
    {
      name: 'ASAT/GOT (Leberwert)',
      category: 'Niere & Leber',
      measurements: [
        { date: '15.10.2024', value: 28, unit: 'U/l', referenceRange: '<50', status: 'good' },
        { date: '20.07.2024', value: 26, unit: 'U/l', referenceRange: '<50', status: 'good' },
        { date: '10.04.2024', value: 30, unit: 'U/l', referenceRange: '<50', status: 'good' }
      ]
    },
    {
      name: 'ALAT/GPT (Leberwert)',
      category: 'Niere & Leber',
      measurements: [
        { date: '15.10.2024', value: 32, unit: 'U/l', referenceRange: '<50', status: 'good' },
        { date: '20.07.2024', value: 30, unit: 'U/l', referenceRange: '<50', status: 'good' },
        { date: '10.04.2024', value: 34, unit: 'U/l', referenceRange: '<50', status: 'good' }
      ]
    },
    {
      name: 'Gamma-GT',
      category: 'Niere & Leber',
      measurements: [
        { date: '15.10.2024', value: 22, unit: 'U/l', referenceRange: '<60', status: 'good' },
        { date: '20.07.2024', value: 20, unit: 'U/l', referenceRange: '<60', status: 'good' },
        { date: '10.04.2024', value: 24, unit: 'U/l', referenceRange: '<60', status: 'good' }
      ]
    },

    // SONSTIGES
    {
      name: 'TSH (Schilddrüse)',
      category: 'Sonstiges',
      measurements: [
        { date: '15.10.2024', value: 1.8, unit: 'mU/l', referenceRange: '0.4-4.0', status: 'good' },
        { date: '20.07.2024', value: 1.7, unit: 'mU/l', referenceRange: '0.4-4.0', status: 'good' },
        { date: '10.04.2024', value: 1.9, unit: 'mU/l', referenceRange: '0.4-4.0', status: 'good' }
      ]
    },
    {
      name: 'Vitamin D',
      category: 'Sonstiges',
      measurements: [
        { date: '15.10.2024', value: 38, unit: 'ng/ml', referenceRange: '30-100', status: 'good' },
        { date: '20.07.2024', value: 42, unit: 'ng/ml', referenceRange: '30-100', status: 'good' },
        { date: '10.04.2024', value: 35, unit: 'ng/ml', referenceRange: '30-100', status: 'good' }
      ]
    },
    {
      name: 'CRP (Entzündungswert)',
      category: 'Sonstiges',
      measurements: [
        { date: '15.10.2024', value: 0.3, unit: 'mg/dl', referenceRange: '<0.5', status: 'good' },
        { date: '20.07.2024', value: 0.2, unit: 'mg/dl', referenceRange: '<0.5', status: 'good' },
        { date: '10.04.2024', value: 0.4, unit: 'mg/dl', referenceRange: '<0.5', status: 'good' }
      ]
    }
  ],

  // 2. NINA BAUMANN - Schwanger, 30 Jahre
  'nina-baumann': [
    // HÄMATOLOGIE (leicht anämisch wegen Schwangerschaft)
    {
      name: 'Erythrozyten (RBC)',
      category: 'Hämatologie',
      measurements: [
        { date: '20.11.2024', value: 4.2, unit: 'Mio/µl', referenceRange: '4.1-5.1', status: 'good' },
        { date: '15.10.2024', value: 4.1, unit: 'Mio/µl', referenceRange: '4.1-5.1', status: 'good' },
        { date: '20.09.2024', value: 4.3, unit: 'Mio/µl', referenceRange: '4.1-5.1', status: 'good' },
        { date: '15.08.2024', value: 4.4, unit: 'Mio/µl', referenceRange: '4.1-5.1', status: 'good' }
      ]
    },
    {
      name: 'Hämoglobin (Hb)',
      category: 'Hämatologie',
      measurements: [
        { date: '20.11.2024', value: 11.8, unit: 'g/dl', referenceRange: '11-16', status: 'good' },
        { date: '15.10.2024', value: 11.5, unit: 'g/dl', referenceRange: '11-16', status: 'good' },
        { date: '20.09.2024', value: 12.0, unit: 'g/dl', referenceRange: '11-16', status: 'good' },
        { date: '15.08.2024', value: 12.2, unit: 'g/dl', referenceRange: '11-16', status: 'good' }
      ]
    },
    {
      name: 'Hämatokrit (Hct)',
      category: 'Hämatologie',
      measurements: [
        { date: '20.11.2024', value: 35, unit: '%', referenceRange: '33-44', status: 'good' },
        { date: '15.10.2024', value: 34, unit: '%', referenceRange: '33-44', status: 'good' },
        { date: '20.09.2024', value: 36, unit: '%', referenceRange: '33-44', status: 'good' },
        { date: '15.08.2024', value: 37, unit: '%', referenceRange: '33-44', status: 'good' }
      ]
    },
    {
      name: 'Leukozyten (WBC)',
      category: 'Hämatologie',
      measurements: [
        { date: '20.11.2024', value: 10.5, unit: 'Tsd/µl', referenceRange: '6-16', status: 'good' },
        { date: '15.10.2024', value: 10.2, unit: 'Tsd/µl', referenceRange: '6-16', status: 'good' },
        { date: '20.09.2024', value: 9.8, unit: 'Tsd/µl', referenceRange: '6-16', status: 'good' },
        { date: '15.08.2024', value: 9.5, unit: 'Tsd/µl', referenceRange: '6-16', status: 'good' }
      ]
    },
    {
      name: 'Thrombozyten',
      category: 'Hämatologie',
      measurements: [
        { date: '20.11.2024', value: 198, unit: 'Tsd/µl', referenceRange: '150-400', status: 'good' },
        { date: '15.10.2024', value: 205, unit: 'Tsd/µl', referenceRange: '150-400', status: 'good' },
        { date: '20.09.2024', value: 210, unit: 'Tsd/µl', referenceRange: '150-400', status: 'good' },
        { date: '15.08.2024', value: 215, unit: 'Tsd/µl', referenceRange: '150-400', status: 'good' }
      ]
    },
    {
      name: 'MCV',
      category: 'Hämatologie',
      measurements: [
        { date: '20.11.2024', value: 86, unit: 'fl', referenceRange: '80-96', status: 'good' },
        { date: '15.10.2024', value: 85, unit: 'fl', referenceRange: '80-96', status: 'good' },
        { date: '20.09.2024', value: 87, unit: 'fl', referenceRange: '80-96', status: 'good' },
        { date: '15.08.2024', value: 88, unit: 'fl', referenceRange: '80-96', status: 'good' }
      ]
    },

    // STOFFWECHSEL
    {
      name: 'Glukose (nüchtern)',
      category: 'Stoffwechsel',
      measurements: [
        { date: '20.11.2024', value: 88, unit: 'mg/dl', referenceRange: '70-92', status: 'good' },
        { date: '15.10.2024', value: 86, unit: 'mg/dl', referenceRange: '70-92', status: 'good' },
        { date: '20.09.2024', value: 90, unit: 'mg/dl', referenceRange: '70-92', status: 'good' },
        { date: '15.08.2024', value: 87, unit: 'mg/dl', referenceRange: '70-92', status: 'good' }
      ]
    },
    {
      name: 'HbA1c (Langzeitzucker)',
      category: 'Stoffwechsel',
      measurements: [
        { date: '20.11.2024', value: 5.0, unit: '%', referenceRange: '<5.7', status: 'good' },
        { date: '15.10.2024', value: 4.9, unit: '%', referenceRange: '<5.7', status: 'good' },
        { date: '20.09.2024', value: 5.1, unit: '%', referenceRange: '<5.7', status: 'good' }
      ]
    },
    {
      name: 'Cholesterin gesamt',
      category: 'Stoffwechsel',
      measurements: [
        { date: '20.11.2024', value: 245, unit: 'mg/dl', referenceRange: '150-300', status: 'good' },
        { date: '15.10.2024', value: 238, unit: 'mg/dl', referenceRange: '150-300', status: 'good' },
        { date: '20.09.2024', value: 228, unit: 'mg/dl', referenceRange: '150-300', status: 'good' }
      ]
    },
    {
      name: 'LDL-Cholesterin',
      category: 'Stoffwechsel',
      measurements: [
        { date: '20.11.2024', value: 135, unit: 'mg/dl', referenceRange: '<160', status: 'good' },
        { date: '15.10.2024', value: 130, unit: 'mg/dl', referenceRange: '<160', status: 'good' },
        { date: '20.09.2024', value: 125, unit: 'mg/dl', referenceRange: '<160', status: 'good' }
      ]
    },
    {
      name: 'HDL-Cholesterin',
      category: 'Stoffwechsel',
      measurements: [
        { date: '20.11.2024', value: 68, unit: 'mg/dl', referenceRange: '>50', status: 'good' },
        { date: '15.10.2024', value: 65, unit: 'mg/dl', referenceRange: '>50', status: 'good' },
        { date: '20.09.2024', value: 62, unit: 'mg/dl', referenceRange: '>50', status: 'good' }
      ]
    },
    {
      name: 'Triglyceride',
      category: 'Stoffwechsel',
      measurements: [
        { date: '20.11.2024', value: 188, unit: 'mg/dl', referenceRange: '<250', status: 'good' },
        { date: '15.10.2024', value: 178, unit: 'mg/dl', referenceRange: '<250', status: 'good' },
        { date: '20.09.2024', value: 168, unit: 'mg/dl', referenceRange: '<250', status: 'good' }
      ]
    },

    // NIERE & LEBER
    {
      name: 'Kreatinin',
      category: 'Niere & Leber',
      measurements: [
        { date: '20.11.2024', value: 0.65, unit: 'mg/dl', referenceRange: '0.5-1.0', status: 'good' },
        { date: '15.10.2024', value: 0.63, unit: 'mg/dl', referenceRange: '0.5-1.0', status: 'good' },
        { date: '20.09.2024', value: 0.67, unit: 'mg/dl', referenceRange: '0.5-1.0', status: 'good' }
      ]
    },
    {
      name: 'eGFR (Nierenfunktion)',
      category: 'Niere & Leber',
      measurements: [
        { date: '20.11.2024', value: 115, unit: 'ml/min', referenceRange: '>90', status: 'good' },
        { date: '15.10.2024', value: 118, unit: 'ml/min', referenceRange: '>90', status: 'good' },
        { date: '20.09.2024', value: 112, unit: 'ml/min', referenceRange: '>90', status: 'good' }
      ]
    },
    {
      name: 'ASAT/GOT (Leberwert)',
      category: 'Niere & Leber',
      measurements: [
        { date: '20.11.2024', value: 24, unit: 'U/l', referenceRange: '<35', status: 'good' },
        { date: '15.10.2024', value: 22, unit: 'U/l', referenceRange: '<35', status: 'good' },
        { date: '20.09.2024', value: 26, unit: 'U/l', referenceRange: '<35', status: 'good' }
      ]
    },
    {
      name: 'ALAT/GPT (Leberwert)',
      category: 'Niere & Leber',
      measurements: [
        { date: '20.11.2024', value: 28, unit: 'U/l', referenceRange: '<35', status: 'good' },
        { date: '15.10.2024', value: 26, unit: 'U/l', referenceRange: '<35', status: 'good' },
        { date: '20.09.2024', value: 30, unit: 'U/l', referenceRange: '<35', status: 'good' }
      ]
    },
    {
      name: 'Gamma-GT',
      category: 'Niere & Leber',
      measurements: [
        { date: '20.11.2024', value: 18, unit: 'U/l', referenceRange: '<40', status: 'good' },
        { date: '15.10.2024', value: 16, unit: 'U/l', referenceRange: '<40', status: 'good' },
        { date: '20.09.2024', value: 20, unit: 'U/l', referenceRange: '<40', status: 'good' }
      ]
    },

    // SONSTIGES
    {
      name: 'TSH (Schilddrüse)',
      category: 'Sonstiges',
      measurements: [
        { date: '20.11.2024', value: 2.1, unit: 'mU/l', referenceRange: '0.5-3.5', status: 'good' },
        { date: '15.10.2024', value: 2.0, unit: 'mU/l', referenceRange: '0.5-3.5', status: 'good' },
        { date: '20.09.2024', value: 2.2, unit: 'mU/l', referenceRange: '0.5-3.5', status: 'good' }
      ]
    },
    {
      name: 'Vitamin D',
      category: 'Sonstiges',
      measurements: [
        { date: '20.11.2024', value: 45, unit: 'ng/ml', referenceRange: '30-100', status: 'good' },
        { date: '15.10.2024', value: 48, unit: 'ng/ml', referenceRange: '30-100', status: 'good' },
        { date: '20.09.2024', value: 42, unit: 'ng/ml', referenceRange: '30-100', status: 'good' }
      ]
    },
    {
      name: 'CRP (Entzündungswert)',
      category: 'Sonstiges',
      measurements: [
        { date: '20.11.2024', value: 0.4, unit: 'mg/dl', referenceRange: '<0.5', status: 'good' },
        { date: '15.10.2024', value: 0.3, unit: 'mg/dl', referenceRange: '<0.5', status: 'good' },
        { date: '20.09.2024', value: 0.5, unit: 'mg/dl', referenceRange: '<0.5', status: 'good' }
      ]
    }
  ],

  // 3. MARKUS HUBER - Geschäftsmann, 50 Jahre, kardiovaskuläres Risiko
  'markus-huber': [
    // HÄMATOLOGIE
    {
      name: 'Erythrozyten (RBC)',
      category: 'Hämatologie',
      measurements: [
        { date: '25.11.2024', value: 5.0, unit: 'Mio/µl', referenceRange: '4.5-5.9', status: 'good' },
        { date: '15.09.2024', value: 4.9, unit: 'Mio/µl', referenceRange: '4.5-5.9', status: 'good' },
        { date: '20.06.2024', value: 5.1, unit: 'Mio/µl', referenceRange: '4.5-5.9', status: 'good' },
        { date: '15.03.2024', value: 5.0, unit: 'Mio/µl', referenceRange: '4.5-5.9', status: 'good' }
      ]
    },
    {
      name: 'Hämoglobin (Hb)',
      category: 'Hämatologie',
      measurements: [
        { date: '25.11.2024', value: 14.8, unit: 'g/dl', referenceRange: '14-18', status: 'good' },
        { date: '15.09.2024', value: 14.6, unit: 'g/dl', referenceRange: '14-18', status: 'good' },
        { date: '20.06.2024', value: 15.0, unit: 'g/dl', referenceRange: '14-18', status: 'good' },
        { date: '15.03.2024', value: 14.7, unit: 'g/dl', referenceRange: '14-18', status: 'good' }
      ]
    },
    {
      name: 'Hämatokrit (Hct)',
      category: 'Hämatologie',
      measurements: [
        { date: '25.11.2024', value: 44, unit: '%', referenceRange: '40-52', status: 'good' },
        { date: '15.09.2024', value: 43, unit: '%', referenceRange: '40-52', status: 'good' },
        { date: '20.06.2024', value: 45, unit: '%', referenceRange: '40-52', status: 'good' },
        { date: '15.03.2024', value: 44, unit: '%', referenceRange: '40-52', status: 'good' }
      ]
    },
    {
      name: 'Leukozyten (WBC)',
      category: 'Hämatologie',
      measurements: [
        { date: '25.11.2024', value: 7.5, unit: 'Tsd/µl', referenceRange: '4-10', status: 'good' },
        { date: '15.09.2024', value: 7.2, unit: 'Tsd/µl', referenceRange: '4-10', status: 'good' },
        { date: '20.06.2024', value: 7.8, unit: 'Tsd/µl', referenceRange: '4-10', status: 'good' },
        { date: '15.03.2024', value: 7.4, unit: 'Tsd/µl', referenceRange: '4-10', status: 'good' }
      ]
    },
    {
      name: 'Thrombozyten',
      category: 'Hämatologie',
      measurements: [
        { date: '25.11.2024', value: 268, unit: 'Tsd/µl', referenceRange: '150-400', status: 'good' },
        { date: '15.09.2024', value: 272, unit: 'Tsd/µl', referenceRange: '150-400', status: 'good' },
        { date: '20.06.2024', value: 265, unit: 'Tsd/µl', referenceRange: '150-400', status: 'good' },
        { date: '15.03.2024', value: 270, unit: 'Tsd/µl', referenceRange: '150-400', status: 'good' }
      ]
    },
    {
      name: 'MCV',
      category: 'Hämatologie',
      measurements: [
        { date: '25.11.2024', value: 90, unit: 'fl', referenceRange: '80-96', status: 'good' },
        { date: '15.09.2024', value: 89, unit: 'fl', referenceRange: '80-96', status: 'good' },
        { date: '20.06.2024', value: 91, unit: 'fl', referenceRange: '80-96', status: 'good' },
        { date: '15.03.2024', value: 90, unit: 'fl', referenceRange: '80-96', status: 'good' }
      ]
    },

    // STOFFWECHSEL (erhöhte Werte!)
    {
      name: 'Glukose (nüchtern)',
      category: 'Stoffwechsel',
      measurements: [
        { date: '25.11.2024', value: 105, unit: 'mg/dl', referenceRange: '70-100', status: 'elevated' },
        { date: '15.09.2024', value: 108, unit: 'mg/dl', referenceRange: '70-100', status: 'elevated' },
        { date: '20.06.2024', value: 102, unit: 'mg/dl', referenceRange: '70-100', status: 'elevated' },
        { date: '15.03.2024', value: 110, unit: 'mg/dl', referenceRange: '70-100', status: 'elevated' }
      ]
    },
    {
      name: 'HbA1c (Langzeitzucker)',
      category: 'Stoffwechsel',
      measurements: [
        { date: '25.11.2024', value: 5.9, unit: '%', referenceRange: '<5.7', status: 'elevated' },
        { date: '15.09.2024', value: 6.0, unit: '%', referenceRange: '<5.7', status: 'elevated' },
        { date: '20.06.2024', value: 5.8, unit: '%', referenceRange: '<5.7', status: 'elevated' },
        { date: '15.03.2024', value: 6.1, unit: '%', referenceRange: '<5.7', status: 'warning' }
      ]
    },
    {
      name: 'Cholesterin gesamt',
      category: 'Stoffwechsel',
      measurements: [
        { date: '25.11.2024', value: 242, unit: 'mg/dl', referenceRange: '<200', status: 'warning' },
        { date: '15.09.2024', value: 245, unit: 'mg/dl', referenceRange: '<200', status: 'warning' },
        { date: '20.06.2024', value: 238, unit: 'mg/dl', referenceRange: '<200', status: 'warning' },
        { date: '15.03.2024', value: 250, unit: 'mg/dl', referenceRange: '<200', status: 'warning' }
      ]
    },
    {
      name: 'LDL-Cholesterin',
      category: 'Stoffwechsel',
      measurements: [
        { date: '25.11.2024', value: 155, unit: 'mg/dl', referenceRange: '<116', status: 'warning' },
        { date: '15.09.2024', value: 158, unit: 'mg/dl', referenceRange: '<116', status: 'warning' },
        { date: '20.06.2024', value: 152, unit: 'mg/dl', referenceRange: '<116', status: 'warning' },
        { date: '15.03.2024', value: 162, unit: 'mg/dl', referenceRange: '<116', status: 'warning' }
      ]
    },
    {
      name: 'HDL-Cholesterin',
      category: 'Stoffwechsel',
      measurements: [
        { date: '25.11.2024', value: 42, unit: 'mg/dl', referenceRange: '>40', status: 'good' },
        { date: '15.09.2024', value: 41, unit: 'mg/dl', referenceRange: '>40', status: 'good' },
        { date: '20.06.2024', value: 43, unit: 'mg/dl', referenceRange: '>40', status: 'good' },
        { date: '15.03.2024', value: 40, unit: 'mg/dl', referenceRange: '>40', status: 'good' }
      ]
    },
    {
      name: 'Triglyceride',
      category: 'Stoffwechsel',
      measurements: [
        { date: '25.11.2024', value: 198, unit: 'mg/dl', referenceRange: '<150', status: 'warning' },
        { date: '15.09.2024', value: 205, unit: 'mg/dl', referenceRange: '<150', status: 'warning' },
        { date: '20.06.2024', value: 192, unit: 'mg/dl', referenceRange: '<150', status: 'elevated' },
        { date: '15.03.2024', value: 212, unit: 'mg/dl', referenceRange: '<150', status: 'warning' }
      ]
    },

    // NIERE & LEBER
    {
      name: 'Kreatinin',
      category: 'Niere & Leber',
      measurements: [
        { date: '25.11.2024', value: 1.15, unit: 'mg/dl', referenceRange: '0.7-1.2', status: 'good' },
        { date: '15.09.2024', value: 1.18, unit: 'mg/dl', referenceRange: '0.7-1.2', status: 'elevated' },
        { date: '20.06.2024', value: 1.12, unit: 'mg/dl', referenceRange: '0.7-1.2', status: 'good' },
        { date: '15.03.2024', value: 1.20, unit: 'mg/dl', referenceRange: '0.7-1.2', status: 'elevated' }
      ]
    },
    {
      name: 'eGFR (Nierenfunktion)',
      category: 'Niere & Leber',
      measurements: [
        { date: '25.11.2024', value: 72, unit: 'ml/min', referenceRange: '>90', status: 'elevated' },
        { date: '15.09.2024', value: 70, unit: 'ml/min', referenceRange: '>90', status: 'elevated' },
        { date: '20.06.2024', value: 75, unit: 'ml/min', referenceRange: '>90', status: 'elevated' },
        { date: '15.03.2024', value: 68, unit: 'ml/min', referenceRange: '>90', status: 'elevated' }
      ]
    },
    {
      name: 'ASAT/GOT (Leberwert)',
      category: 'Niere & Leber',
      measurements: [
        { date: '25.11.2024', value: 38, unit: 'U/l', referenceRange: '<50', status: 'good' },
        { date: '15.09.2024', value: 42, unit: 'U/l', referenceRange: '<50', status: 'good' },
        { date: '20.06.2024', value: 35, unit: 'U/l', referenceRange: '<50', status: 'good' },
        { date: '15.03.2024', value: 45, unit: 'U/l', referenceRange: '<50', status: 'good' }
      ]
    },
    {
      name: 'ALAT/GPT (Leberwert)',
      category: 'Niere & Leber',
      measurements: [
        { date: '25.11.2024', value: 44, unit: 'U/l', referenceRange: '<50', status: 'good' },
        { date: '15.09.2024', value: 48, unit: 'U/l', referenceRange: '<50', status: 'good' },
        { date: '20.06.2024', value: 41, unit: 'U/l', referenceRange: '<50', status: 'good' },
        { date: '15.03.2024', value: 52, unit: 'U/l', referenceRange: '<50', status: 'elevated' }
      ]
    },
    {
      name: 'Gamma-GT',
      category: 'Niere & Leber',
      measurements: [
        { date: '25.11.2024', value: 52, unit: 'U/l', referenceRange: '<60', status: 'good' },
        { date: '15.09.2024', value: 58, unit: 'U/l', referenceRange: '<60', status: 'good' },
        { date: '20.06.2024', value: 48, unit: 'U/l', referenceRange: '<60', status: 'good' },
        { date: '15.03.2024', value: 62, unit: 'U/l', referenceRange: '<60', status: 'elevated' }
      ]
    },

    // SONSTIGES
    {
      name: 'TSH (Schilddrüse)',
      category: 'Sonstiges',
      measurements: [
        { date: '25.11.2024', value: 2.5, unit: 'mU/l', referenceRange: '0.4-4.0', status: 'good' },
        { date: '15.09.2024', value: 2.4, unit: 'mU/l', referenceRange: '0.4-4.0', status: 'good' },
        { date: '20.06.2024', value: 2.6, unit: 'mU/l', referenceRange: '0.4-4.0', status: 'good' }
      ]
    },
    {
      name: 'Vitamin D',
      category: 'Sonstiges',
      measurements: [
        { date: '25.11.2024', value: 22, unit: 'ng/ml', referenceRange: '30-100', status: 'warning' },
        { date: '15.09.2024', value: 25, unit: 'ng/ml', referenceRange: '30-100', status: 'warning' },
        { date: '20.06.2024', value: 28, unit: 'ng/ml', referenceRange: '30-100', status: 'warning' }
      ]
    },
    {
      name: 'CRP (Entzündungswert)',
      category: 'Sonstiges',
      measurements: [
        { date: '25.11.2024', value: 0.8, unit: 'mg/dl', referenceRange: '<0.5', status: 'elevated' },
        { date: '15.09.2024', value: 0.7, unit: 'mg/dl', referenceRange: '<0.5', status: 'elevated' },
        { date: '20.06.2024', value: 0.6, unit: 'mg/dl', referenceRange: '<0.5', status: 'elevated' },
        { date: '15.03.2024', value: 0.9, unit: 'mg/dl', referenceRange: '<0.5', status: 'elevated' }
      ]
    }
  ],

  // 4. ELISA MEIER - 90 Jahre, multimorbid (Diabetes, Herz, Niere)
  'elisa-meier': [
    // HÄMATOLOGIE
    {
      name: 'Erythrozyten (RBC)',
      category: 'Hämatologie',
      measurements: [
        { date: '28.11.2024', value: 4.0, unit: 'Mio/µl', referenceRange: '4.1-5.1', status: 'warning' },
        { date: '30.10.2024', value: 4.1, unit: 'Mio/µl', referenceRange: '4.1-5.1', status: 'good' },
        { date: '25.09.2024', value: 3.9, unit: 'Mio/µl', referenceRange: '4.1-5.1', status: 'warning' },
        { date: '20.08.2024', value: 4.2, unit: 'Mio/µl', referenceRange: '4.1-5.1', status: 'good' },
        { date: '15.07.2024', value: 4.0, unit: 'Mio/µl', referenceRange: '4.1-5.1', status: 'warning' }
      ]
    },
    {
      name: 'Hämoglobin (Hb)',
      category: 'Hämatologie',
      measurements: [
        { date: '28.11.2024', value: 11.5, unit: 'g/dl', referenceRange: '12-16', status: 'warning' },
        { date: '30.10.2024', value: 11.8, unit: 'g/dl', referenceRange: '12-16', status: 'warning' },
        { date: '25.09.2024', value: 11.2, unit: 'g/dl', referenceRange: '12-16', status: 'warning' },
        { date: '20.08.2024', value: 12.0, unit: 'g/dl', referenceRange: '12-16', status: 'good' },
        { date: '15.07.2024', value: 11.6, unit: 'g/dl', referenceRange: '12-16', status: 'warning' }
      ]
    },
    {
      name: 'Hämatokrit (Hct)',
      category: 'Hämatologie',
      measurements: [
        { date: '28.11.2024', value: 34, unit: '%', referenceRange: '36-46', status: 'warning' },
        { date: '30.10.2024', value: 35, unit: '%', referenceRange: '36-46', status: 'warning' },
        { date: '25.09.2024', value: 33, unit: '%', referenceRange: '36-46', status: 'warning' },
        { date: '20.08.2024', value: 36, unit: '%', referenceRange: '36-46', status: 'good' },
        { date: '15.07.2024', value: 34, unit: '%', referenceRange: '36-46', status: 'warning' }
      ]
    },
    {
      name: 'Leukozyten (WBC)',
      category: 'Hämatologie',
      measurements: [
        { date: '28.11.2024', value: 8.5, unit: 'Tsd/µl', referenceRange: '4-10', status: 'good' },
        { date: '30.10.2024', value: 8.2, unit: 'Tsd/µl', referenceRange: '4-10', status: 'good' },
        { date: '25.09.2024', value: 9.0, unit: 'Tsd/µl', referenceRange: '4-10', status: 'good' },
        { date: '20.08.2024', value: 8.8, unit: 'Tsd/µl', referenceRange: '4-10', status: 'good' },
        { date: '15.07.2024', value: 8.3, unit: 'Tsd/µl', referenceRange: '4-10', status: 'good' }
      ]
    },
    {
      name: 'Thrombozyten',
      category: 'Hämatologie',
      measurements: [
        { date: '28.11.2024', value: 188, unit: 'Tsd/µl', referenceRange: '150-400', status: 'good' },
        { date: '30.10.2024', value: 195, unit: 'Tsd/µl', referenceRange: '150-400', status: 'good' },
        { date: '25.09.2024', value: 182, unit: 'Tsd/µl', referenceRange: '150-400', status: 'good' },
        { date: '20.08.2024', value: 190, unit: 'Tsd/µl', referenceRange: '150-400', status: 'good' },
        { date: '15.07.2024', value: 185, unit: 'Tsd/µl', referenceRange: '150-400', status: 'good' }
      ]
    },
    {
      name: 'MCV',
      category: 'Hämatologie',
      measurements: [
        { date: '28.11.2024', value: 92, unit: 'fl', referenceRange: '80-96', status: 'good' },
        { date: '30.10.2024', value: 91, unit: 'fl', referenceRange: '80-96', status: 'good' },
        { date: '25.09.2024', value: 93, unit: 'fl', referenceRange: '80-96', status: 'good' },
        { date: '20.08.2024', value: 90, unit: 'fl', referenceRange: '80-96', status: 'good' },
        { date: '15.07.2024', value: 92, unit: 'fl', referenceRange: '80-96', status: 'good' }
      ]
    },

    // STOFFWECHSEL (deutlich erhöhte Werte - Diabetes!)
    {
      name: 'Glukose (nüchtern)',
      category: 'Stoffwechsel',
      measurements: [
        { date: '28.11.2024', value: 155, unit: 'mg/dl', referenceRange: '70-100', status: 'warning' },
        { date: '30.10.2024', value: 148, unit: 'mg/dl', referenceRange: '70-100', status: 'warning' },
        { date: '25.09.2024', value: 162, unit: 'mg/dl', referenceRange: '70-100', status: 'warning' },
        { date: '20.08.2024', value: 150, unit: 'mg/dl', referenceRange: '70-100', status: 'warning' },
        { date: '15.07.2024', value: 158, unit: 'mg/dl', referenceRange: '70-100', status: 'warning' }
      ]
    },
    {
      name: 'HbA1c (Langzeitzucker)',
      category: 'Stoffwechsel',
      measurements: [
        { date: '28.11.2024', value: 7.2, unit: '%', referenceRange: '<5.7', status: 'warning' },
        { date: '30.10.2024', value: 7.4, unit: '%', referenceRange: '<5.7', status: 'warning' },
        { date: '25.09.2024', value: 7.1, unit: '%', referenceRange: '<5.7', status: 'warning' },
        { date: '20.08.2024', value: 7.5, unit: '%', referenceRange: '<5.7', status: 'warning' },
        { date: '15.07.2024', value: 7.3, unit: '%', referenceRange: '<5.7', status: 'warning' }
      ]
    },
    {
      name: 'Cholesterin gesamt',
      category: 'Stoffwechsel',
      measurements: [
        { date: '28.11.2024', value: 228, unit: 'mg/dl', referenceRange: '<200', status: 'warning' },
        { date: '30.10.2024', value: 232, unit: 'mg/dl', referenceRange: '<200', status: 'warning' },
        { date: '25.09.2024', value: 225, unit: 'mg/dl', referenceRange: '<200', status: 'warning' },
        { date: '20.08.2024', value: 235, unit: 'mg/dl', referenceRange: '<200', status: 'warning' },
        { date: '15.07.2024', value: 230, unit: 'mg/dl', referenceRange: '<200', status: 'warning' }
      ]
    },
    {
      name: 'LDL-Cholesterin',
      category: 'Stoffwechsel',
      measurements: [
        { date: '28.11.2024', value: 145, unit: 'mg/dl', referenceRange: '<116', status: 'warning' },
        { date: '30.10.2024', value: 148, unit: 'mg/dl', referenceRange: '<116', status: 'warning' },
        { date: '25.09.2024', value: 142, unit: 'mg/dl', referenceRange: '<116', status: 'warning' },
        { date: '20.08.2024', value: 152, unit: 'mg/dl', referenceRange: '<116', status: 'warning' },
        { date: '15.07.2024', value: 146, unit: 'mg/dl', referenceRange: '<116', status: 'warning' }
      ]
    },
    {
      name: 'HDL-Cholesterin',
      category: 'Stoffwechsel',
      measurements: [
        { date: '28.11.2024', value: 48, unit: 'mg/dl', referenceRange: '>50', status: 'warning' },
        { date: '30.10.2024', value: 46, unit: 'mg/dl', referenceRange: '>50', status: 'warning' },
        { date: '25.09.2024', value: 49, unit: 'mg/dl', referenceRange: '>50', status: 'warning' },
        { date: '20.08.2024', value: 45, unit: 'mg/dl', referenceRange: '>50', status: 'warning' },
        { date: '15.07.2024', value: 47, unit: 'mg/dl', referenceRange: '>50', status: 'warning' }
      ]
    },
    {
      name: 'Triglyceride',
      category: 'Stoffwechsel',
      measurements: [
        { date: '28.11.2024', value: 185, unit: 'mg/dl', referenceRange: '<150', status: 'elevated' },
        { date: '30.10.2024', value: 192, unit: 'mg/dl', referenceRange: '<150', status: 'warning' },
        { date: '25.09.2024', value: 178, unit: 'mg/dl', referenceRange: '<150', status: 'elevated' },
        { date: '20.08.2024', value: 198, unit: 'mg/dl', referenceRange: '<150', status: 'warning' },
        { date: '15.07.2024', value: 188, unit: 'mg/dl', referenceRange: '<150', status: 'elevated' }
      ]
    },

    // NIERE & LEBER (deutlich eingeschränkte Nierenfunktion!)
    {
      name: 'Kreatinin',
      category: 'Niere & Leber',
      measurements: [
        { date: '28.11.2024', value: 1.45, unit: 'mg/dl', referenceRange: '0.5-1.0', status: 'warning' },
        { date: '30.10.2024', value: 1.42, unit: 'mg/dl', referenceRange: '0.5-1.0', status: 'warning' },
        { date: '25.09.2024', value: 1.48, unit: 'mg/dl', referenceRange: '0.5-1.0', status: 'warning' },
        { date: '20.08.2024', value: 1.40, unit: 'mg/dl', referenceRange: '0.5-1.0', status: 'warning' },
        { date: '15.07.2024', value: 1.52, unit: 'mg/dl', referenceRange: '0.5-1.0', status: 'warning' }
      ]
    },
    {
      name: 'eGFR (Nierenfunktion)',
      category: 'Niere & Leber',
      measurements: [
        { date: '28.11.2024', value: 42, unit: 'ml/min', referenceRange: '>90', status: 'warning' },
        { date: '30.10.2024', value: 44, unit: 'ml/min', referenceRange: '>90', status: 'warning' },
        { date: '25.09.2024', value: 40, unit: 'ml/min', referenceRange: '>90', status: 'warning' },
        { date: '20.08.2024', value: 45, unit: 'ml/min', referenceRange: '>90', status: 'warning' },
        { date: '15.07.2024', value: 38, unit: 'ml/min', referenceRange: '>90', status: 'warning' }
      ]
    },
    {
      name: 'ASAT/GOT (Leberwert)',
      category: 'Niere & Leber',
      measurements: [
        { date: '28.11.2024', value: 32, unit: 'U/l', referenceRange: '<35', status: 'good' },
        { date: '30.10.2024', value: 34, unit: 'U/l', referenceRange: '<35', status: 'good' },
        { date: '25.09.2024', value: 30, unit: 'U/l', referenceRange: '<35', status: 'good' },
        { date: '20.08.2024', value: 33, unit: 'U/l', referenceRange: '<35', status: 'good' },
        { date: '15.07.2024', value: 31, unit: 'U/l', referenceRange: '<35', status: 'good' }
      ]
    },
    {
      name: 'ALAT/GPT (Leberwert)',
      category: 'Niere & Leber',
      measurements: [
        { date: '28.11.2024', value: 28, unit: 'U/l', referenceRange: '<35', status: 'good' },
        { date: '30.10.2024', value: 30, unit: 'U/l', referenceRange: '<35', status: 'good' },
        { date: '25.09.2024', value: 26, unit: 'U/l', referenceRange: '<35', status: 'good' },
        { date: '20.08.2024', value: 29, unit: 'U/l', referenceRange: '<35', status: 'good' },
        { date: '15.07.2024', value: 27, unit: 'U/l', referenceRange: '<35', status: 'good' }
      ]
    },
    {
      name: 'Gamma-GT',
      category: 'Niere & Leber',
      measurements: [
        { date: '28.11.2024', value: 35, unit: 'U/l', referenceRange: '<40', status: 'good' },
        { date: '30.10.2024', value: 38, unit: 'U/l', referenceRange: '<40', status: 'good' },
        { date: '25.09.2024', value: 32, unit: 'U/l', referenceRange: '<40', status: 'good' },
        { date: '20.08.2024', value: 36, unit: 'U/l', referenceRange: '<40', status: 'good' },
        { date: '15.07.2024', value: 34, unit: 'U/l', referenceRange: '<40', status: 'good' }
      ]
    },

    // SONSTIGES
    {
      name: 'TSH (Schilddrüse)',
      category: 'Sonstiges',
      measurements: [
        { date: '28.11.2024', value: 3.2, unit: 'mU/l', referenceRange: '0.4-4.0', status: 'good' },
        { date: '30.10.2024', value: 3.0, unit: 'mU/l', referenceRange: '0.4-4.0', status: 'good' },
        { date: '25.09.2024', value: 3.4, unit: 'mU/l', referenceRange: '0.4-4.0', status: 'good' },
        { date: '20.08.2024', value: 3.1, unit: 'mU/l', referenceRange: '0.4-4.0', status: 'good' }
      ]
    },
    {
      name: 'Vitamin D',
      category: 'Sonstiges',
      measurements: [
        { date: '28.11.2024', value: 18, unit: 'ng/ml', referenceRange: '30-100', status: 'warning' },
        { date: '30.10.2024', value: 20, unit: 'ng/ml', referenceRange: '30-100', status: 'warning' },
        { date: '25.09.2024', value: 22, unit: 'ng/ml', referenceRange: '30-100', status: 'warning' },
        { date: '20.08.2024', value: 16, unit: 'ng/ml', referenceRange: '30-100', status: 'warning' }
      ]
    },
    {
      name: 'CRP (Entzündungswert)',
      category: 'Sonstiges',
      measurements: [
        { date: '28.11.2024', value: 1.2, unit: 'mg/dl', referenceRange: '<0.5', status: 'warning' },
        { date: '30.10.2024', value: 1.0, unit: 'mg/dl', referenceRange: '<0.5', status: 'warning' },
        { date: '25.09.2024', value: 1.4, unit: 'mg/dl', referenceRange: '<0.5', status: 'warning' },
        { date: '20.08.2024', value: 1.1, unit: 'mg/dl', referenceRange: '<0.5', status: 'warning' },
        { date: '15.07.2024', value: 1.3, unit: 'mg/dl', referenceRange: '<0.5', status: 'warning' }
      ]
    }
  ]
};
