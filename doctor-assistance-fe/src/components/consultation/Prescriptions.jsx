import React, { useState, useEffect } from 'react';
import { IoCopyOutline, IoCopy } from 'react-icons/io5';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { handleDownloadPDF } from '@/utils/pdf';
import MedicationTable from '@/components/consultation/MedicationTable';
import AddMedication from '@/components/dialogs/AddMedication';

export default function Prescriptions() {
  const [isCopied, setIsCopied] = useState(false);
  const [formData, setFormData] = useState({
    medications: [
      { name: 'Aspirin (Bayer)', instruction: 'Take one tablet every 4-6 hours' },
      { name: 'Ibuprofen (Advil)', instruction: 'Take one tablet daily' },
      { name: 'Acetaminophen (Tylenol)', instruction: 'Take one tablet every 4-6 hours' },
    ],
    additionalInfo: '',
  });

  const autoResize = (textarea) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach((textarea) => autoResize(textarea));

    const handleResize = () => {
      textareas.forEach((textarea) => autoResize(textarea));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [formData]);

  const handleCopy = () => {
    const textToCopy = `Medications: ${formData.medications.map(med => `${med.name}, ${med.instruction}`).join(', ')}
                        Additional Information: ${formData.additionalInfo}`.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    });
  };

  return (
    <div className="h-[76vh]">
      <div id="prescription-content" className="h-[67vh] mb-5 overflow-y-scroll">

        <div className='flex items-center justify-between'>
          <h3 className="-mt-2 text-sm font-medium leading-none text-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Medications:</h3>
          <AddMedication />
        </div>

        <MedicationTable medications={formData.medications} setMedications={(medications) => setFormData(prev => ({ ...prev, medications }))} />

        <Label htmlFor='PadditionalInfo' className="text-primary">Additional Information:</Label>
        <textarea name="additionalInfo" id='PadditionalInfo' value={formData.additionalInfo}
          onChange={handleInputChange} rows={1}
          className="mx-2 focus-visible:ring-gray-500 focus:text-gray-500 w-[90%] border-none rounded-md my-2"
          placeholder="Add Additional information here (if any)..." />
      </div>

      <div className="flex justify-end gap-3">
        <Button onClick={() => handleDownloadPDF('prescription-content', 'patient-prescription.pdf')}>Download PDF</Button>
        <Button onClick={handleCopy} variant="outline">  {isCopied ? <IoCopy /> : <IoCopyOutline />}  </Button>
      </div>

    </div>
  );
}
