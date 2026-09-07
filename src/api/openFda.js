// OpenFDA National Drug Code (NDC) Directory API Client

const FALLBACK_DRUGS = [
  {
    brandName: 'Amoxicillin',
    genericName: 'Amoxicillin',
    dosageForm: 'CAPSULE',
    route: 'ORAL',
    activeIngredients: [{ name: 'AMOXICILLIN', strength: '500 mg' }],
    productNdc: '0093-3109-01',
    labeler: 'Teva Pharmaceuticals USA, Inc.'
  },
  {
    brandName: 'Metformin',
    genericName: 'Metformin Hydrochloride',
    dosageForm: 'TABLET, EXTENDED RELEASE',
    route: 'ORAL',
    activeIngredients: [{ name: 'METFORMIN HYDROCHLORIDE', strength: '1000 mg' }],
    productNdc: '0087-6060-05',
    labeler: 'Bristol-Myers Squibb Company'
  },
  {
    brandName: 'Lisinopril',
    genericName: 'Lisinopril',
    dosageForm: 'TABLET',
    route: 'ORAL',
    activeIngredients: [{ name: 'LISINOPRIL', strength: '20 mg' }],
    productNdc: '0006-0207-68',
    labeler: 'Merck Sharp & Dohme Corp.'
  },
  {
    brandName: 'Lipitor',
    genericName: 'Atorvastatin Calcium',
    dosageForm: 'TABLET, FILM COATED',
    route: 'ORAL',
    activeIngredients: [{ name: 'ATORVASTATIN CALCIUM', strength: '40 mg' }],
    productNdc: '0071-0157-23',
    labeler: 'Pfizer Laboratories Div Pfizer Inc'
  },
  {
    brandName: 'Advair Diskus',
    genericName: 'Fluticasone Propionate and Salmeterol',
    dosageForm: 'AEROSOL POWDER, BREATH ACTIVATED',
    route: 'RESPIRATORY (INHALATION)',
    activeIngredients: [
      { name: 'FLUTICASONE PROPIONATE', strength: '250 mcg' },
      { name: 'SALMETEROL XINAFOATE', strength: '50 mcg' }
    ],
    productNdc: '0173-0696-00',
    labeler: 'GlaxoSmithKline LLC'
  },
  {
    brandName: 'Eliquis',
    genericName: 'Apixaban',
    dosageForm: 'TABLET, FILM COATED',
    route: 'ORAL',
    activeIngredients: [{ name: 'APIXABAN', strength: '5 mg' }],
    productNdc: '0003-0894-21',
    labeler: 'Bristol-Myers Squibb Company'
  },
  {
    brandName: 'Synthroid',
    genericName: 'Levothyroxine Sodium',
    dosageForm: 'TABLET',
    route: 'ORAL',
    activeIngredients: [{ name: 'LEVOTHYROXINE SODIUM', strength: '75 mcg' }],
    productNdc: '0074-4552-11',
    labeler: 'AbbVie Inc.'
  },
  {
    brandName: 'Ozempic',
    genericName: 'Semaglutide',
    dosageForm: 'INJECTION, SOLUTION',
    route: 'SUBCUTANEOUS',
    activeIngredients: [{ name: 'SEMAGLUTIDE', strength: '2 mg/1.5 mL' }],
    productNdc: '0169-4130-13',
    labeler: 'Novo Nordisk'
  },
  {
    brandName: 'ProAir HFA',
    genericName: 'Albuterol Sulfate',
    dosageForm: 'AEROSOL, METERED',
    route: 'RESPIRATORY (INHALATION)',
    activeIngredients: [{ name: 'ALBUTEROL SULFATE', strength: '90 mcg/actuation' }],
    productNdc: '59310-579-22',
    labeler: 'Teva Respiratory LLC'
  },
  {
    brandName: 'Imitrex',
    genericName: 'Sumatriptan Succinate',
    dosageForm: 'TABLET',
    route: 'ORAL',
    activeIngredients: [{ name: 'SUMATRIPTAN SUCCINATE', strength: '50 mg' }],
    productNdc: '0173-0520-00',
    labeler: 'GlaxoSmithKline'
  }
];

export async function searchOpenFdaMedications(query) {
  const cleanQuery = (query || '').trim();
  if (!cleanQuery || cleanQuery.length < 2) {
    return [];
  }

  try {
    const url = `https://api.fda.gov/drug/ndc.json?search=brand_name:${encodeURIComponent(cleanQuery)}&limit=5`;
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      // If 404 or other status, try searching fallback dataset or prefix
      return searchFallbackDrugs(cleanQuery);
    }

    const data = await response.json();
    if (data && Array.isArray(data.results) && data.results.length > 0) {
      return data.results.map(item => {
        // Extract dosage form, route, and active ingredients cleanly
        const brand = item.brand_name || item.generic_name || 'Unknown Drug';
        const generic = item.generic_name || brand;
        const dosageForm = item.dosage_form || (item.dosage_form_name ? item.dosage_form_name.join(', ') : 'TABLET');
        const route = Array.isArray(item.route) ? item.route.join(', ') : (item.route || 'ORAL');
        
        let activeIngredients = [];
        if (Array.isArray(item.active_ingredients)) {
          activeIngredients = item.active_ingredients.map(ing => ({
            name: ing.name || 'Active Ingredient',
            strength: ing.strength || ''
          }));
        } else if (item.substance_name) {
          activeIngredients = [{ name: item.substance_name, strength: '' }];
        }

        return {
          brandName: brand,
          genericName: generic,
          dosageForm,
          route,
          activeIngredients,
          productNdc: item.product_ndc || item.package_ndc || 'N/A',
          labeler: item.labeler_name || 'FDA Registered Manufacturer'
        };
      });
    }

    return searchFallbackDrugs(cleanQuery);
  } catch (err) {
    console.warn('OpenFDA live API query encountered error, falling back to clinical registry:', err);
    return searchFallbackDrugs(cleanQuery);
  }
}

function searchFallbackDrugs(query) {
  const lower = query.toLowerCase();
  const matched = FALLBACK_DRUGS.filter(d =>
    d.brandName.toLowerCase().includes(lower) ||
    d.genericName.toLowerCase().includes(lower) ||
    d.activeIngredients.some(i => i.name.toLowerCase().includes(lower))
  );
  return matched.slice(0, 5);
}
