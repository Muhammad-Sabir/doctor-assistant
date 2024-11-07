import React, { useState } from 'react';
import { IoCopyOutline, IoCopy } from 'react-icons/io5';

import { Button } from '@/components/ui/button';

import { handleDownloadPDF } from '@/utils/pdf';
import MedicationTable from '@/components/consultation/MedicationTable';

export default function Prescription() {

  const [isCopied, setIsCopied] = useState(false);
  const [formData, setFormData] = useState({
    medications: [
      { name: 'Aspirin (Bayer)', dosage: '500mg', frequency: 'Take one tablet every 4-6 hours' },
      { name: 'Ibuprofen (Advil)', dosage: '320mg', frequency: 'Take one tablet daily' },
      { name: 'Acetaminophen (Tylenol)', dosage: '500mg', frequency: 'Take one tablet every 4-6 hours' },
    ],
    prescribedTests: ['Complete Blood Count (CBC)', 'C-reactive protein (CRP)', 'Comprehensive Metabolic Panel (CMP)'],
    patientInstructions: [
      'Take medications as prescribed by the doctor. Follow dosage instructions carefully.',
      'Stay hydrated by drinking plenty of fluids to help thin mucus and alleviate congestion.'
    ],
    additionalInfo: '',
  });

  const handleCopy = () => {
    const textToCopy = `Medications: ${formData.medications.map(med => `${med.name}, ${med.dosage}, ${med.frequency}`).join(', ')}
                        Prescribed Tests: ${formData.prescribedTests.join(', ')}
                        Patient Instructions: ${formData.patientInstructions.join(', ')}
                        Additional Information: ${formData.additionalInfo}`.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    });
  };

  return (
    <div className="px-2 h-[84vh]">
      <div id="patient-prescription" className="h-[74vh] mb-5 overflow-y-scroll">

        <h3 className="my-1 text-primary text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Prescription:</h3>

        <h3 className="mt-5 mb-3 text-primary text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Medications:</h3>
        <MedicationTable medications={formData.medications} setMedications={(medications) => setFormData(prev => ({ ...prev, medications }))} />

        <h3 className="mt-5 mb-3 text-primary text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Prescribed Tests:</h3>
        <div className="mx-2 text-sm w-[90%] my-2">
          {formData.prescribedTests.map((test, index) => (
            <div key={index}>{test}</div>
          ))}
        </div>

        <h3 className="mt-5 mb-3 text-primary text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Patient Instructions:</h3>
        <div className="mx-2 text-sm w-[90%] my-2">
          {formData.patientInstructions.map((test, index) => (
            <div key={index}>{test}</div>
          ))}
        </div>

        <h3 className="mt-5 mb-3 text-primary text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Additional Notes</h3>
        <div className="mx-2 text-sm w-[90%] my-2">
          {formData.additionalInfo ? formData.additionalInfo : 'N/A'}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button onClick={() => handleDownloadPDF('patient-prescription', 'patient-prescription.pdf')}>Download PDF</Button>
        <Button onClick={handleCopy} variant="outline">  {isCopied ? <IoCopy /> : <IoCopyOutline />}  </Button>
      </div>
    </div>
  );
}
