// HL7 FHIR R4 Bundle Generator for Clinical Data Interoperability
export function generateFhirR4Bundle(patient, vitals = [], prescriptions = []) {
  const timestamp = new Date().toISOString();
  
  const entries = [
    // Patient Resource
    {
      fullUrl: `urn:uuid:patient-${patient.id}`,
      resource: {
        resourceType: 'Patient',
        id: patient.id,
        identifier: [
          {
            system: 'https://carepulse.health/mrn',
            value: patient.mrn
          }
        ],
        active: true,
        name: [
          {
            use: 'official',
            text: patient.name,
            family: patient.name.split(' ').slice(-1)[0],
            given: patient.name.split(' ').slice(0, -1)
          }
        ],
        gender: (patient.gender || 'unknown').toLowerCase(),
        birthDate: patient.dob,
        telecom: [
          { system: 'phone', value: patient.phone, use: 'mobile' },
          { system: 'email', value: patient.email, use: 'home' }
        ],
        address: [
          {
            use: 'home',
            text: patient.address
          }
        ]
      }
    }
  ];

  // AllergyIntolerance Resources
  if (Array.isArray(patient.allergies)) {
    patient.allergies.forEach((allergy, idx) => {
      entries.push({
        fullUrl: `urn:uuid:allergy-${patient.id}-${idx}`,
        resource: {
          resourceType: 'AllergyIntolerance',
          clinicalStatus: {
            coding: [{ system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical', code: 'active' }]
          },
          verificationStatus: {
            coding: [{ system: 'http://terminology.hl7.org/CodeSystem/allergyintolerance-verification', code: 'confirmed' }]
          },
          criticality: allergy.severity === 'High' ? 'high' : 'low',
          code: { text: allergy.allergen },
          patient: { reference: `urn:uuid:patient-${patient.id}` },
          reaction: [{ manifestion: [{ text: allergy.reaction }] }]
        }
      });
    });
  }

  // Condition (Problem List) Resources
  if (Array.isArray(patient.conditions)) {
    patient.conditions.forEach((cond, idx) => {
      entries.push({
        fullUrl: `urn:uuid:condition-${patient.id}-${idx}`,
        resource: {
          resourceType: 'Condition',
          clinicalStatus: {
            coding: [{ system: 'http://terminology.hl7.org/CodeSystem/condition-clinical', code: 'active' }]
          },
          code: {
            coding: [
              {
                system: 'http://hl7.org/fhir/sid/icd-10-cm',
                code: cond.code,
                display: cond.name
              }
            ],
            text: cond.name
          },
          subject: { reference: `urn:uuid:patient-${patient.id}` },
          recordedDate: cond.onset || '2026-01-01'
        }
      });
    });
  }

  // MedicationRequest Resources
  const meds = prescriptions.length > 0 ? prescriptions : (patient.activeMedications || []);
  meds.forEach((med, idx) => {
    entries.push({
      fullUrl: `urn:uuid:medication-${patient.id}-${idx}`,
      resource: {
        resourceType: 'MedicationRequest',
        status: 'active',
        intent: 'order',
        medicationCodeableConcept: {
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/ndc',
              code: med.ndc || med.productNdc || '00000-000-00',
              display: med.brandName
            }
          ],
          text: `${med.brandName} (${med.genericName || ''}) ${med.dosage || ''}`
        },
        subject: { reference: `urn:uuid:patient-${patient.id}` },
        dosageInstruction: [
          {
            text: med.frequency || 'As directed',
            route: { text: med.route || 'ORAL' }
          }
        ]
      }
    });
  });

  // Observations (Vitals)
  const vitalsList = vitals.length > 0 ? vitals : (patient.vitalsHistory || []);
  vitalsList.slice(-2).forEach((v, idx) => {
    entries.push({
      fullUrl: `urn:uuid:observation-bp-${patient.id}-${idx}`,
      resource: {
        resourceType: 'Observation',
        status: 'final',
        category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'vital-signs' }] }],
        code: { text: 'Blood Pressure' },
        subject: { reference: `urn:uuid:patient-${patient.id}` },
        effectiveDateTime: v.date,
        component: [
          {
            code: { text: 'Systolic blood pressure' },
            valueQuantity: { value: v.systolic, unit: 'mmHg' }
          },
          {
            code: { text: 'Diastolic blood pressure' },
            valueQuantity: { value: v.diastolic, unit: 'mmHg' }
          }
        ]
      }
    });
  });

  return {
    resourceType: 'Bundle',
    type: 'document',
    timestamp,
    meta: {
      profile: ['http://hl7.org/fhir/StructureDefinition/Bundle']
    },
    entry: entries
  };
}
