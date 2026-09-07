export const initialPatients = [
  {
    id: 'pt-001',
    mrn: 'CP-84920',
    name: 'Eleanor Vance',
    gender: 'Female',
    age: 68,
    dob: '1958-03-14',
    phone: '+1 (555) 234-8901',
    email: 'eleanor.vance@medmail.org',
    bloodType: 'O+',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    address: '428 Meadowbrook Lane, Boston, MA 02115',
    insurance: {
      provider: 'Blue Cross Blue Shield Medicare Advantage',
      policyNumber: 'BC-99482104-M',
      groupNumber: 'GRP-7721'
    },
    emergencyContact: {
      name: 'Thomas Vance (Son)',
      phone: '+1 (555) 345-6789',
      relationship: 'Adult Son / Healthcare Proxy'
    },
    conditions: [
      { code: 'E11.9', name: 'Type 2 Diabetes Mellitus without complications', onset: '2016-04', status: 'Active' },
      { code: 'I10', name: 'Essential (primary) Hypertension', onset: '2012-09', status: 'Active' },
      { code: 'E78.5', name: 'Hyperlipidemia, unspecified', onset: '2018-01', status: 'Active' }
    ],
    allergies: [
      { allergen: 'Penicillin (All Classes)', reaction: 'Anaphylactic bronchospasm & severe urticaria', severity: 'High' },
      { allergen: 'Shellfish / Iodine Radiocontrast', reaction: 'Facial angioedema', severity: 'Moderate' }
    ],
    activeMedications: [
      {
        id: 'med-001',
        brandName: 'Glucophage',
        genericName: 'Metformin Hydrochloride',
        dosage: '1000 mg',
        dosageForm: 'TABLET, EXTENDED RELEASE',
        route: 'ORAL',
        frequency: 'Twice daily with meals',
        refillsRemaining: 3,
        prescribingDoctor: 'Dr. Evelyn Vance, MD',
        datePrescribed: '2026-08-15',
        status: 'Active',
        ndc: '0087-6060-05'
      },
      {
        id: 'med-002',
        brandName: 'Zestril',
        genericName: 'Lisinopril',
        dosage: '20 mg',
        dosageForm: 'TABLET',
        route: 'ORAL',
        frequency: 'Once daily every morning',
        refillsRemaining: 2,
        prescribingDoctor: 'Dr. Evelyn Vance, MD',
        datePrescribed: '2026-07-10',
        status: 'Active',
        ndc: '0006-0207-68'
      },
      {
        id: 'med-003',
        brandName: 'Lipitor',
        genericName: 'Atorvastatin Calcium',
        dosage: '40 mg',
        dosageForm: 'TABLET, FILM COATED',
        route: 'ORAL',
        frequency: 'Once daily at bedtime',
        refillsRemaining: 4,
        prescribingDoctor: 'Dr. Evelyn Vance, MD',
        datePrescribed: '2026-06-20',
        status: 'Active',
        ndc: '0071-0157-23'
      }
    ],
    vitalsHistory: [
      { date: '2026-05-10', systolic: 138, diastolic: 86, heartRate: 78, glucose: 142, spO2: 98, weight: 68.5, bmi: 26.2 },
      { date: '2026-06-12', systolic: 134, diastolic: 84, heartRate: 76, glucose: 138, spO2: 98, weight: 68.0, bmi: 26.0 },
      { date: '2026-07-15', systolic: 130, diastolic: 80, heartRate: 74, glucose: 126, spO2: 99, weight: 67.4, bmi: 25.8 },
      { date: '2026-08-18', systolic: 128, diastolic: 82, heartRate: 72, glucose: 120, spO2: 98, weight: 67.1, bmi: 25.6 },
      { date: '2026-09-02', systolic: 124, diastolic: 78, heartRate: 70, glucose: 116, spO2: 99, weight: 66.8, bmi: 25.5 }
    ],
    historicalLabs: [
      { date: '2026-08-28', testName: 'Hemoglobin A1c', value: '6.8', unit: '%', referenceRange: '< 5.7', status: 'Elevated' },
      { date: '2026-08-28', testName: 'Fasting Plasma Glucose', value: '116', unit: 'mg/dL', referenceRange: '70 - 99', status: 'Elevated' },
      { date: '2026-08-28', testName: 'Estimated GFR (eGFR)', value: '74', unit: 'mL/min/1.73m2', referenceRange: '> 60', status: 'Normal' },
      { date: '2026-08-28', testName: 'Serum Creatinine', value: '0.92', unit: 'mg/dL', referenceRange: '0.50 - 1.10', status: 'Normal' },
      { date: '2026-08-28', testName: 'Total Cholesterol', value: '172', unit: 'mg/dL', referenceRange: '< 200', status: 'Normal' },
      { date: '2026-08-28', testName: 'LDL Cholesterol', value: '88', unit: 'mg/dL', referenceRange: '< 100', status: 'Normal' }
    ],
    documents: [
      {
        id: 'doc-001',
        title: 'Comprehensive Metabolic Panel (CMP) - Labcorp',
        category: 'Lab Report',
        date: '2026-08-28',
        provider: 'Quest / Labcorp Virtual Diagnostic Services',
        fileSize: '1.4 MB',
        thumbnail: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&auto=format&fit=crop&q=80',
        summary: 'Metabolic baseline stable. Glucose controlled at 116 mg/dL. Renal indices within acceptable parameters with eGFR 74.',
        downloadUrl: '#'
      },
      {
        id: 'doc-002',
        title: 'Bilateral Carotid Artery Doppler Ultrasound',
        category: 'Imaging',
        date: '2026-06-15',
        provider: 'Mass General Brigham Vascular Lab',
        fileSize: '3.8 MB',
        thumbnail: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&auto=format&fit=crop&q=80',
        summary: 'No hemodynamically significant stenosis detected (<40% luminal narrowing bilaterally). Peak systolic velocities normal.',
        downloadUrl: '#'
      },
      {
        id: 'doc-003',
        title: 'Annual Diabetic Retinopathy Dilated Eye Examination',
        category: 'Summary',
        date: '2026-04-10',
        provider: 'Boston Eye & Ear Tele-Ophthalmology',
        fileSize: '820 KB',
        thumbnail: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&auto=format&fit=crop&q=80',
        summary: 'Bilateral fundus examination negative for proliferative diabetic retinopathy, microaneurysms, or macular edema.',
        downloadUrl: '#'
      }
    ]
  },
  {
    id: 'pt-002',
    mrn: 'CP-62184',
    name: 'Marcus Chen',
    gender: 'Male',
    age: 42,
    dob: '1984-07-22',
    phone: '+1 (555) 789-1234',
    email: 'marcus.chen@biotech-tech.io',
    bloodType: 'A+',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    address: '150 Kendall Square, Cambridge, MA 02142',
    insurance: {
      provider: 'Aetna Open Choice PPO',
      policyNumber: 'AET-8831902-C',
      groupNumber: 'GRP-4410'
    },
    emergencyContact: {
      name: 'Grace Chen (Spouse)',
      phone: '+1 (555) 789-1235',
      relationship: 'Spouse'
    },
    conditions: [
      { code: 'J45.40', name: 'Moderate persistent asthma without complication', onset: '2019-11', status: 'Active' },
      { code: 'J30.9', name: 'Allergic rhinitis, unspecified', onset: '2015-05', status: 'Active' }
    ],
    allergies: [
      { allergen: 'Aspirin & NSAIDs (Ibuprofen, Naproxen)', reaction: 'Aspirin-exacerbated respiratory disease (AERD) & acute bronchospasm', severity: 'High' },
      { allergen: 'Sulfamethoxazole / Trimethoprim (Bactrim)', reaction: 'Diffuse morbilliform rash', severity: 'Moderate' }
    ],
    activeMedications: [
      {
        id: 'med-004',
        brandName: 'Advair Diskus',
        genericName: 'Fluticasone Propionate / Salmeterol',
        dosage: '250/50 mcg',
        dosageForm: 'AEROSOL POWDER, BREATH ACTIVATED',
        route: 'INHALATION',
        frequency: '1 inhalation twice daily',
        refillsRemaining: 2,
        prescribingDoctor: 'Dr. Evelyn Vance, MD',
        datePrescribed: '2026-08-01',
        status: 'Active',
        ndc: '0173-0696-00'
      },
      {
        id: 'med-005',
        brandName: 'ProAir HFA',
        genericName: 'Albuterol Sulfate',
        dosage: '90 mcg/actuation',
        dosageForm: 'AEROSOL, METERED',
        route: 'INHALATION',
        frequency: '1-2 inhalations Q4-6H PRN acute shortness of breath',
        refillsRemaining: 5,
        prescribingDoctor: 'Dr. Evelyn Vance, MD',
        datePrescribed: '2026-07-20',
        status: 'Active',
        ndc: '59310-579-22'
      }
    ],
    vitalsHistory: [
      { date: '2026-05-20', systolic: 122, diastolic: 80, heartRate: 72, glucose: 94, spO2: 96, weight: 75.0, bmi: 23.9 },
      { date: '2026-06-25', systolic: 120, diastolic: 78, heartRate: 70, glucose: 92, spO2: 97, weight: 74.8, bmi: 23.8 },
      { date: '2026-07-28', systolic: 118, diastolic: 76, heartRate: 68, glucose: 90, spO2: 99, weight: 74.5, bmi: 23.7 },
      { date: '2026-08-25', systolic: 122, diastolic: 78, heartRate: 74, glucose: 95, spO2: 98, weight: 74.3, bmi: 23.6 },
      { date: '2026-09-04', systolic: 120, diastolic: 78, heartRate: 72, glucose: 92, spO2: 98, weight: 74.2, bmi: 23.6 }
    ],
    historicalLabs: [
      { date: '2026-08-10', testName: 'Total Serum IgE', value: '240', unit: 'IU/mL', referenceRange: '< 100', status: 'Elevated' },
      { date: '2026-08-10', testName: 'Absolute Eosinophils', value: '520', unit: 'cells/uL', referenceRange: '15 - 500', status: 'Elevated' },
      { date: '2026-08-10', testName: 'Fractional Exhaled Nitric Oxide (FeNO)', value: '38', unit: 'ppb', referenceRange: '< 25', status: 'Elevated' }
    ],
    documents: [
      {
        id: 'doc-004',
        title: 'Pulmonary Function Test (PFT) & Spirometry Curve',
        category: 'Lab Report',
        date: '2026-08-10',
        provider: 'Boston Thoracic Diagnostic Clinic',
        fileSize: '2.1 MB',
        thumbnail: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?w=400&auto=format&fit=crop&q=80',
        summary: 'Mild airflow limitation with significant 14% post-bronchodilator reversibility in FEV1 confirming asthma reactivity.',
        downloadUrl: '#'
      },
      {
        id: 'doc-005',
        title: 'Comprehensive Environmental & Mold Allergy Panel',
        category: 'Lab Report',
        date: '2026-05-18',
        provider: 'New England Allergy Specialists',
        fileSize: '950 KB',
        thumbnail: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&auto=format&fit=crop&q=80',
        summary: 'Strong positive 3+ reactive skin test to birch pollen, dust mites, and Alternaria mold spores.',
        downloadUrl: '#'
      }
    ]
  },
  {
    id: 'pt-003',
    mrn: 'CP-39102',
    name: 'Sarah Jenkins',
    gender: 'Female',
    age: 29,
    dob: '1997-11-05',
    phone: '+1 (555) 456-7890',
    email: 'sarah.jenkins@designstudio.co',
    bloodType: 'B+',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    address: '88 Newbury Street, Apt 4B, Boston, MA 02116',
    insurance: {
      provider: 'UnitedHealthcare Choice Plus',
      policyNumber: 'UHC-4401928-J',
      groupNumber: 'GRP-9902'
    },
    emergencyContact: {
      name: 'Maya Jenkins (Sister)',
      phone: '+1 (555) 456-7899',
      relationship: 'Sister'
    },
    conditions: [
      { code: 'G43.109', name: 'Migraine with aura, not intractable, without status migrainosus', onset: '2021-02', status: 'Active' },
      { code: 'F41.1', name: 'Generalized anxiety disorder', onset: '2022-08', status: 'Active' }
    ],
    allergies: [
      { allergen: 'Codeine / Opioid derivatives', reaction: 'Severe nausea, pruritus & respiratory depression', severity: 'High' },
      { allergen: 'Erythromycin Base', reaction: 'Severe abdominal cramping & vomiting', severity: 'Mild' }
    ],
    activeMedications: [
      {
        id: 'med-006',
        brandName: 'Imitrex',
        genericName: 'Sumatriptan Succinate',
        dosage: '50 mg',
        dosageForm: 'TABLET',
        route: 'ORAL',
        frequency: '1 tablet at earliest onset of migraine aura; may repeat after 2h (max 200mg/24h)',
        refillsRemaining: 3,
        prescribingDoctor: 'Dr. Evelyn Vance, MD',
        datePrescribed: '2026-08-12',
        status: 'Active',
        ndc: '0173-0520-00'
      },
      {
        id: 'med-007',
        brandName: 'Zoloft',
        genericName: 'Sertraline Hydrochloride',
        dosage: '50 mg',
        dosageForm: 'TABLET, FILM COATED',
        route: 'ORAL',
        frequency: '1 tablet daily in the morning',
        refillsRemaining: 4,
        prescribingDoctor: 'Dr. Evelyn Vance, MD',
        datePrescribed: '2026-07-01',
        status: 'Active',
        ndc: '0049-4960-66'
      }
    ],
    vitalsHistory: [
      { date: '2026-05-15', systolic: 116, diastolic: 74, heartRate: 80, glucose: 88, spO2: 99, weight: 58.2, bmi: 21.4 },
      { date: '2026-06-18', systolic: 114, diastolic: 72, heartRate: 78, glucose: 86, spO2: 99, weight: 58.0, bmi: 21.3 },
      { date: '2026-07-22', systolic: 112, diastolic: 70, heartRate: 76, glucose: 89, spO2: 100, weight: 57.8, bmi: 21.2 },
      { date: '2026-08-20', systolic: 110, diastolic: 72, heartRate: 74, glucose: 87, spO2: 99, weight: 57.5, bmi: 21.1 },
      { date: '2026-09-03', systolic: 114, diastolic: 74, heartRate: 78, glucose: 88, spO2: 99, weight: 57.6, bmi: 21.2 }
    ],
    historicalLabs: [
      { date: '2026-07-22', testName: 'Thyroid Stimulating Hormone (TSH)', value: '2.14', unit: 'mIU/L', referenceRange: '0.40 - 4.50', status: 'Normal' },
      { date: '2026-07-22', testName: '25-Hydroxy Vitamin D', value: '28.4', unit: 'ng/mL', referenceRange: '30.0 - 100.0', status: 'Low' },
      { date: '2026-07-22', testName: 'Serum Ferritin', value: '36', unit: 'ng/mL', referenceRange: '15 - 150', status: 'Normal' },
      { date: '2026-07-22', testName: 'Comprehensive Metabolic Panel', value: 'Normal', unit: 'index', referenceRange: 'Normal', status: 'Normal' }
    ],
    documents: [
      {
        id: 'doc-006',
        title: 'Brain Magnetic Resonance Imaging (MRI 3.0T)',
        category: 'Imaging',
        date: '2026-07-22',
        provider: 'Brigham and Women’s Neuroimaging',
        fileSize: '4.5 MB',
        thumbnail: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&auto=format&fit=crop&q=80',
        summary: 'No acute intracranial hemorrhage, mass effect, or demyelinating plaques. Ventricular size and sulcal pattern within normal limits.',
        downloadUrl: '#'
      }
    ]
  },
  {
    id: 'pt-004',
    mrn: 'CP-19483',
    name: 'Arthur Pendelton',
    gender: 'Male',
    age: 74,
    dob: '1952-09-19',
    phone: '+1 (555) 678-9012',
    email: 'arthur.pendelton@verizon.net',
    bloodType: 'AB+',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    address: '912 Concord Turnpike, Lexington, MA 02421',
    insurance: {
      provider: 'Humana Medicare Gold Choice',
      policyNumber: 'HUM-194827-P',
      groupNumber: 'GRP-3391'
    },
    emergencyContact: {
      name: 'Beatrice Pendelton (Spouse)',
      phone: '+1 (555) 678-9013',
      relationship: 'Spouse'
    },
    conditions: [
      { code: 'I25.10', name: 'Atherosclerotic heart disease of native coronary artery s/p DES LAD', onset: '2020-03', status: 'Active' },
      { code: 'I48.91', name: 'Unspecified atrial fibrillation (Paroxysmal)', onset: '2021-06', status: 'Active' },
      { code: 'N18.3', name: 'Chronic kidney disease, stage 3 (moderate)', onset: '2023-01', status: 'Active' }
    ],
    allergies: [
      { allergen: 'Iodinated Radiocontrast Media', reaction: 'Contrast-induced acute kidney injury & anaphylactoid shock', severity: 'High' },
      { allergen: 'ACE-Inhibitors (Lisinopril, Enalapril)', reaction: 'Severe perioral angioedema and intractable cough', severity: 'High' }
    ],
    activeMedications: [
      {
        id: 'med-008',
        brandName: 'Eliquis',
        genericName: 'Apixaban',
        dosage: '5 mg',
        dosageForm: 'TABLET, FILM COATED',
        route: 'ORAL',
        frequency: '1 tablet twice daily with or without food',
        refillsRemaining: 3,
        prescribingDoctor: 'Dr. Evelyn Vance, MD',
        datePrescribed: '2026-08-05',
        status: 'Active',
        ndc: '0003-0894-21'
      },
      {
        id: 'med-009',
        brandName: 'Toprol-XL',
        genericName: 'Metoprolol Succinate',
        dosage: '50 mg',
        dosageForm: 'TABLET, EXTENDED RELEASE',
        route: 'ORAL',
        frequency: '1 tablet once daily',
        refillsRemaining: 2,
        prescribingDoctor: 'Dr. Evelyn Vance, MD',
        datePrescribed: '2026-07-15',
        status: 'Active',
        ndc: '0186-1090-05'
      },
      {
        id: 'med-010',
        brandName: 'Crestor',
        genericName: 'Rosuvastatin Calcium',
        dosage: '20 mg',
        dosageForm: 'TABLET, FILM COATED',
        route: 'ORAL',
        frequency: '1 tablet once daily in the evening',
        refillsRemaining: 4,
        prescribingDoctor: 'Dr. Evelyn Vance, MD',
        datePrescribed: '2026-06-10',
        status: 'Active',
        ndc: '0310-0752-90'
      }
    ],
    vitalsHistory: [
      { date: '2026-05-18', systolic: 136, diastolic: 82, heartRate: 76, glucose: 104, spO2: 96, weight: 81.2, bmi: 27.5 },
      { date: '2026-06-20', systolic: 134, diastolic: 80, heartRate: 72, glucose: 102, spO2: 97, weight: 80.8, bmi: 27.4 },
      { date: '2026-07-25', systolic: 130, diastolic: 78, heartRate: 68, glucose: 100, spO2: 97, weight: 80.5, bmi: 27.3 },
      { date: '2026-08-22', systolic: 128, diastolic: 78, heartRate: 70, glucose: 98, spO2: 98, weight: 80.0, bmi: 27.1 },
      { date: '2026-09-01', systolic: 126, diastolic: 76, heartRate: 68, glucose: 96, spO2: 98, weight: 79.8, bmi: 27.0 }
    ],
    historicalLabs: [
      { date: '2026-08-20', testName: 'Estimated GFR (eGFR CKD-EPI)', value: '48', unit: 'mL/min/1.73m2', referenceRange: '> 60', status: 'Low' },
      { date: '2026-08-20', testName: 'Serum Creatinine', value: '1.52', unit: 'mg/dL', referenceRange: '0.70 - 1.30', status: 'Elevated' },
      { date: '2026-08-20', testName: 'Serum Potassium (K+)', value: '4.6', unit: 'mEq/L', referenceRange: '3.5 - 5.0', status: 'Normal' },
      { date: '2026-08-20', testName: 'NT-proBNP', value: '290', unit: 'pg/mL', referenceRange: '< 450', status: 'Normal' }
    ],
    documents: [
      {
        id: 'doc-007',
        title: '12-Lead Diagnostic Electrocardiogram (ECG)',
        category: 'Cardiology',
        date: '2026-08-20',
        provider: 'Harvard Vanguard Cardiology Suite',
        fileSize: '1.8 MB',
        thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&auto=format&fit=crop&q=80',
        summary: 'Normal sinus rhythm with rate 68 BPM. Prior inferior Q waves unchanged. QTc 438ms. No acute ST-T wave abnormalities.',
        downloadUrl: '#'
      },
      {
        id: 'doc-008',
        title: 'Transthoracic Echocardiogram (TTE Complete)',
        category: 'Imaging',
        date: '2026-06-14',
        provider: 'Beth Israel Deaconess Cardiovascular Imaging',
        fileSize: '3.2 MB',
        thumbnail: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&auto=format&fit=crop&q=80',
        summary: 'Left ventricular ejection fraction (LVEF) 55-60%. Mild concentric left ventricular hypertrophy. Grade 1 diastolic dysfunction.',
        downloadUrl: '#'
      }
    ]
  },
  {
    id: 'pt-005',
    mrn: 'CP-71954',
    name: 'Elena Rostova',
    gender: 'Female',
    age: 51,
    dob: '1975-06-11',
    phone: '+1 (555) 901-2345',
    email: 'elena.rostova@consulting-group.com',
    bloodType: 'A-',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    address: '67 Commonwealth Avenue, Boston, MA 02116',
    insurance: {
      provider: 'Cigna Open Access Plus',
      policyNumber: 'CIG-719540-R',
      groupNumber: 'GRP-6200'
    },
    emergencyContact: {
      name: 'Dmitri Rostov (Spouse)',
      phone: '+1 (555) 901-2346',
      relationship: 'Spouse'
    },
    conditions: [
      { code: 'M05.79', name: 'Rheumatoid arthritis with rheumatoid factor, multiple sites', onset: '2017-08', status: 'Active' },
      { code: 'E06.3', name: 'Autoimmune thyroiditis (Hashimoto disease)', onset: '2014-02', status: 'Active' }
    ],
    allergies: [
      { allergen: 'Natural Rubber Latex', reaction: 'Type I contact urticaria & respiratory wheeze', severity: 'High' }
    ],
    activeMedications: [
      {
        id: 'med-011',
        brandName: 'Trexall',
        genericName: 'Methotrexate',
        dosage: '15 mg',
        dosageForm: 'TABLET',
        route: 'ORAL',
        frequency: 'Take 15 mg once weekly on Monday evenings',
        refillsRemaining: 2,
        prescribingDoctor: 'Dr. Evelyn Vance, MD',
        datePrescribed: '2026-08-01',
        status: 'Active',
        ndc: '0054-4592-25'
      },
      {
        id: 'med-012',
        brandName: 'Synthroid',
        genericName: 'Levothyroxine Sodium',
        dosage: '75 mcg',
        dosageForm: 'TABLET',
        route: 'ORAL',
        frequency: 'Take 1 tablet every morning 30 minutes before breakfast with full glass of water',
        refillsRemaining: 5,
        prescribingDoctor: 'Dr. Evelyn Vance, MD',
        datePrescribed: '2026-07-10',
        status: 'Active',
        ndc: '0074-4552-11'
      },
      {
        id: 'med-013',
        brandName: 'Folic Acid',
        genericName: 'Folate',
        dosage: '1 mg',
        dosageForm: 'TABLET',
        route: 'ORAL',
        frequency: '1 tablet daily (except on methotrexate day)',
        refillsRemaining: 4,
        prescribingDoctor: 'Dr. Evelyn Vance, MD',
        datePrescribed: '2026-08-01',
        status: 'Active',
        ndc: '0591-5440-01'
      }
    ],
    vitalsHistory: [
      { date: '2026-05-12', systolic: 124, diastolic: 80, heartRate: 74, glucose: 90, spO2: 98, weight: 63.5, bmi: 23.0 },
      { date: '2026-06-16', systolic: 126, diastolic: 82, heartRate: 76, glucose: 92, spO2: 98, weight: 63.8, bmi: 23.1 },
      { date: '2026-07-20', systolic: 122, diastolic: 78, heartRate: 72, glucose: 88, spO2: 99, weight: 63.2, bmi: 22.9 },
      { date: '2026-08-18', systolic: 120, diastolic: 78, heartRate: 70, glucose: 91, spO2: 99, weight: 63.0, bmi: 22.8 },
      { date: '2026-09-02', systolic: 122, diastolic: 76, heartRate: 72, glucose: 89, spO2: 98, weight: 63.1, bmi: 22.8 }
    ],
    historicalLabs: [
      { date: '2026-08-15', testName: 'C-Reactive Protein (High Sensitivity hs-CRP)', value: '4.2', unit: 'mg/L', referenceRange: '< 3.0', status: 'Elevated' },
      { date: '2026-08-15', testName: 'Erythrocyte Sedimentation Rate (ESR)', value: '28', unit: 'mm/hr', referenceRange: '< 20', status: 'Elevated' },
      { date: '2026-08-15', testName: 'Anti-Cyclic Citrullinated Peptide (Anti-CCP)', value: '84', unit: 'U/mL', referenceRange: '< 20', status: 'Elevated' },
      { date: '2026-08-15', testName: 'Thyroid Stimulating Hormone (TSH)', value: '1.82', unit: 'mIU/L', referenceRange: '0.40 - 4.50', status: 'Normal' },
      { date: '2026-08-15', testName: 'Hepatic Function ALT/AST', value: '22 / 24', unit: 'U/L', referenceRange: '< 35', status: 'Normal' }
    ],
    documents: [
      {
        id: 'doc-009',
        title: 'Bilateral Hands & Wrists Digital Radiography',
        category: 'Imaging',
        date: '2026-08-15',
        provider: 'New England Baptist Rheumatology Imaging',
        fileSize: '3.9 MB',
        thumbnail: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&auto=format&fit=crop&q=80',
        summary: 'Mild periarticular osteopenia noted at 2nd and 3rd MCP joints. No marginal erosions or joint space narrowing identified.',
        downloadUrl: '#'
      },
      {
        id: 'doc-010',
        title: 'Autoimmune Serology & Biomarker Panel',
        category: 'Lab Report',
        date: '2026-05-10',
        provider: 'Quest Diagnostics Immunology',
        fileSize: '1.2 MB',
        thumbnail: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&auto=format&fit=crop&q=80',
        summary: 'Strong positive rheumatoid factor titer (68 IU/mL). Anti-nuclear antibody (ANA) speckled pattern 1:160.',
        downloadUrl: '#'
      }
    ]
  }
];

export const initialAppointments = [
  {
    id: 'apt-001',
    patientId: 'pt-001',
    doctorName: 'Dr. Evelyn Vance, MD',
    doctorSpecialty: 'Internal Medicine & Telehealth Lead',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    date: '2026-09-05',
    timeSlot: '09:30 AM',
    type: 'Telehealth Consultation',
    status: 'Waiting',
    reason: 'Quarterly Type 2 Diabetes follow-up and review of recent HbA1c lab work',
    symptoms: ['Slight morning fatigue', 'Blood sugar check review', 'Medication refill request'],
    triageLevel: 'Routine',
    estimatedWaitMins: 5,
    roomPeerId: 'carepulse-room-pt001',
    notes: 'Patient checked in online. Home glucometer readings available for sync.'
  },
  {
    id: 'apt-002',
    patientId: 'pt-002',
    doctorName: 'Dr. Evelyn Vance, MD',
    doctorSpecialty: 'Internal Medicine & Telehealth Lead',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    date: '2026-09-05',
    timeSlot: '10:15 AM',
    type: 'Telehealth Consultation',
    status: 'In Consultation',
    reason: 'Asthma exacerbation evaluation after seasonal pollen exposure',
    symptoms: ['Nocturnal dry cough', 'Mild wheeze upon exertion', 'Advair inhaler compliance check'],
    triageLevel: 'Urgent',
    estimatedWaitMins: 0,
    roomPeerId: 'carepulse-room-pt002',
    notes: 'Virtual consultation in progress. Peak flow measurement requested.'
  },
  {
    id: 'apt-003',
    patientId: 'pt-003',
    doctorName: 'Dr. Evelyn Vance, MD',
    doctorSpecialty: 'Internal Medicine & Telehealth Lead',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    date: '2026-09-05',
    timeSlot: '11:00 AM',
    type: 'Telehealth Consultation',
    status: 'Waiting',
    reason: 'Migraine aura frequency assessment and Zoloft tolerance review',
    symptoms: ['Scintillating scotoma 2x this week', 'Tension headache', 'Sleep disturbance'],
    triageLevel: 'Routine',
    estimatedWaitMins: 18,
    roomPeerId: 'carepulse-room-pt003',
    notes: 'Patient waiting in lobby with camera verified.'
  },
  {
    id: 'apt-004',
    patientId: 'pt-004',
    doctorName: 'Dr. Evelyn Vance, MD',
    doctorSpecialty: 'Internal Medicine & Telehealth Lead',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    date: '2026-09-05',
    timeSlot: '08:30 AM',
    type: 'Telehealth Consultation',
    status: 'Completed',
    reason: 'Anticoagulation surveillance and renal function (eGFR) monitoring',
    symptoms: ['Mild bilateral ankle edema', 'Medication tolerance inquiry'],
    triageLevel: 'Routine',
    estimatedWaitMins: 0,
    roomPeerId: 'carepulse-room-pt004',
    notes: 'Consultation concluded. SOAP note signed. Renal panel stable. Refills renewed.'
  },
  {
    id: 'apt-005',
    patientId: 'pt-005',
    doctorName: 'Dr. Evelyn Vance, MD',
    doctorSpecialty: 'Internal Medicine & Telehealth Lead',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    date: '2026-09-06',
    timeSlot: '02:00 PM',
    type: 'Telehealth Consultation',
    status: 'Upcoming',
    reason: 'Methotrexate toxicity monitoring and joint stiffness check',
    symptoms: ['Morning hand stiffness > 45 mins', 'Mild nausea after dose'],
    triageLevel: 'Routine',
    estimatedWaitMins: 0,
    roomPeerId: 'carepulse-room-pt005',
    notes: 'Scheduled for tomorrow. Lab results linked to record.'
  }
];

export const initialEncounters = [
  {
    id: 'enc-001',
    appointmentId: 'apt-004',
    patientId: 'pt-004',
    doctorName: 'Dr. Evelyn Vance, MD',
    date: '2026-09-05T08:50:00Z',
    subjective: '74-year-old male with history of CAD s/p DES, paroxysmal atrial fibrillation, and stage 3 CKD presenting for routine telehealth follow-up. Patient reports good compliance with Eliquis 5mg BID and Toprol-XL 50mg daily. Notes mild bilateral ankle edema late in evening, which resolves with elevation. Denies chest pain, palpitations, syncope, dyspnea on exertion, or orthopnea.',
    objective: 'Vitals: BP 126/76 mmHg, HR 68 bpm regular, SpO2 98% room air. Video exam: Well-appearing, in no acute respiratory distress. No facial droop, speech clear and coherent. Jugular venous pulsations not elevated on angled camera inspection. Lower extremity inspection shows trace pitting edema bilateral ankles, no erythema or calf tenderness.',
    assessment: '1. Paroxysmal Atrial Fibrillation - rate well controlled, CHA2DS2-VASc score 4, on therapeutic DOAC.\n2. Coronary Artery Disease - clinically stable without angina.\n3. Stage 3 Chronic Kidney Disease - eGFR 48 mL/min stable on recent labs.',
    plan: '1. Continue Eliquis 5mg BID without dose adjustment; renal function monitored every 6 months.\n2. Continue Toprol-XL 50mg daily.\n3. Advised low sodium diet (<2g/day) and calf compression stockings for mild dependent edema.\n4. Repeat comprehensive metabolic panel and eGFR in 3 months. Follow up in 6 months or PRN acute symptoms.',
    signedAt: '2026-09-05T08:55:00Z',
    isSigned: true
  }
];

export const initialAuditLogs = [
  {
    id: 'log-001',
    timestamp: '2026-09-05T08:15:22Z',
    role: 'Provider Workspace (Doctor)',
    user: 'Dr. Evelyn Vance, MD',
    patientId: 'pt-004',
    patientName: 'Arthur Pendelton',
    action: 'VIEW_RECORD',
    details: 'Opened clinical chart and past cardiology labs prior to encounter.',
    ipAddress: '192.168.1.104',
    complianceStatus: 'VERIFIED'
  },
  {
    id: 'log-002',
    timestamp: '2026-09-05T08:31:00Z',
    role: 'Provider Workspace (Doctor)',
    user: 'Dr. Evelyn Vance, MD',
    patientId: 'pt-004',
    patientName: 'Arthur Pendelton',
    action: 'CONSULTATION_STARTED',
    details: 'Initiated secure WebRTC telehealth video session in Virtual Suite Room apt-004.',
    ipAddress: '192.168.1.104',
    complianceStatus: 'VERIFIED'
  },
  {
    id: 'log-003',
    timestamp: '2026-09-05T08:55:10Z',
    role: 'Provider Workspace (Doctor)',
    user: 'Dr. Evelyn Vance, MD',
    patientId: 'pt-004',
    patientName: 'Arthur Pendelton',
    action: 'SOAP_DICTATION_SAVED',
    details: 'Finalized and cryptographically signed clinical encounter SOAP note enc-001.',
    ipAddress: '192.168.1.104',
    complianceStatus: 'VERIFIED'
  },
  {
    id: 'log-004',
    timestamp: '2026-09-05T09:05:44Z',
    role: 'Patient Portal',
    user: 'Eleanor Vance',
    patientId: 'pt-001',
    patientName: 'Eleanor Vance',
    action: 'APPOINTMENT_SCHEDULED',
    details: 'Patient self-scheduled quarterly telehealth slot for 09:30 AM.',
    ipAddress: '73.162.88.19',
    complianceStatus: 'VERIFIED'
  },
  {
    id: 'log-005',
    timestamp: '2026-09-05T09:12:30Z',
    role: 'Patient Portal',
    user: 'Eleanor Vance',
    patientId: 'pt-001',
    patientName: 'Eleanor Vance',
    action: 'VIEW_RECORD',
    details: 'Patient accessed Medical Vault lab summary for CMP test.',
    ipAddress: '73.162.88.19',
    complianceStatus: 'VERIFIED'
  },
  {
    id: 'log-006',
    timestamp: '2026-09-05T09:20:00Z',
    role: 'Provider Workspace (Doctor)',
    user: 'Dr. Evelyn Vance, MD',
    patientId: 'pt-002',
    patientName: 'Marcus Chen',
    action: 'CONSULTATION_STARTED',
    details: 'Provider admitted patient Marcus Chen from virtual waiting room.',
    ipAddress: '192.168.1.104',
    complianceStatus: 'VERIFIED'
  }
];
