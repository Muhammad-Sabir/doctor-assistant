import React, { useState, useEffect } from 'react';
import { IoCopyOutline, IoCopy } from 'react-icons/io5';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { handleDownloadPDF } from '@/utils/pdf';

export default function Notes() {

  const [isCopied, setIsCopied] = useState(false);
  const [formData, setFormData] = useState({
    chiefComplaint: 'Persistent flu-like symptoms for three months.',
    presentIllness: 'The patient presents with recurrent coughing, nasal congestion, sore throat, fatigue, and occasional low-grade fever persisting for the past three months. Symptoms have not responded to over-the-counter medications.',
    familyHistory: 'The patient reports a family history of allergic rhinitis and asthma on the maternal side.',
    differentialDiagnosis: ['Asthma exacerbation', 'Bronchitis'],
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
      [name]: name === 'differentialDiagnosis' ? value.split('\n') : value,
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
    const textToCopy = `Chief Complaint: ${formData.chiefComplaint} History of Present Illness: ${formData.presentIllness}
                        Family History: ${formData.familyHistory} Differential Diagnosis: ${formData.differentialDiagnosis.join(', ')}
                        Additional Information: ${formData.additionalInfo}`.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    });
  };

  return (
    <div className="h-[76vh]">
      <div id="notes-content" className="h-[67vh] mb-5 overflow-y-scroll">

        <Label htmlFor='chiefComplaint' className='text-primary'>Chief Complaint:</Label>
        <textarea name="chiefComplaint" id="chiefComplaint" value={formData.chiefComplaint} rows={1}
          onChange={handleInputChange} placeholder="Enter chief complaint for patient..."
          className="mx-2 focus-visible:ring-gray-500 focus:text-gray-500 w-[90%] border-none rounded-md my-2" />

        <Label htmlFor='presentIllness' className='text-primary'>History of Present Illness:</Label>
        <textarea name="presentIllness" id="presentIllness" value={formData.presentIllness} rows={1}
          onChange={handleInputChange} placeholder="Enter present Illness for patient..."
          className="mx-2 focus-visible:ring-gray-500 focus:text-gray-500 w-[90%] border-none rounded-md my-2" />

        <Label htmlFor='familyHistory' className='text-primary'>Family History:</Label>
        <textarea name="familyHistory" id="familyHistory" value={formData.familyHistory} rows={1}
          onChange={handleInputChange} placeholder="Enter Family History for patient..."
          className="mx-2 focus-visible:ring-gray-500 focus:text-gray-500 w-[90%] border-none rounded-md my-2" />

        <Label htmlFor='differentialDiagnosis' className='text-primary'>Differential Diagnosis:</Label>
        <textarea name="differentialDiagnosis" id='differentialDiagnosis' value={formData.differentialDiagnosis.join('\n')}
          onChange={handleInputChange} rows={1} placeholder="Enter each diagnosis on a new line..."
          className="mx-2 focus-visible:ring-gray-500 focus:text-gray-500 w-[90%] border-none rounded-md my-2" />

        <Label htmlFor='additionalInfo' className='text-primary'>Additional Information:</Label>
        <textarea name="additionalInfo" id='additionalInfo' value={formData.additionalInfo} rows={1}
          onChange={handleInputChange} placeholder="Add Additional information here (if any)..."
          className="mx-2 focus-visible:ring-gray-500 focus:text-gray-500 w-[90%] border-none rounded-md my-2" />

      </div>

      <div className="flex justify-end gap-3">
        <Button onClick={() => handleDownloadPDF('notes-content', 'patient-notes.pdf')}>Download PDF</Button>
        <Button onClick={handleCopy} variant='outline'>  {isCopied ? <IoCopy /> : <IoCopyOutline />}  </Button>
      </div>
    </div>
  );
}
