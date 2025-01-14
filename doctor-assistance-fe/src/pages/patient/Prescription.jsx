import React, { useState, useEffect } from 'react';
import { IoCopyOutline, IoCopy } from 'react-icons/io5';
import { useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { handleDownloadPDF } from '@/utils/pdf';
import { fetchWithAuth } from '@/utils/fetchApis';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import PatientMedicationTable from '@/components/consultation/PatientMedicationTable';
import Loading from '@/components/shared/Loading';

export default function Prescription() {
  const { consultationId } = useParams();

  const [isCopied, setIsCopied] = useState(false);
  const [formData, setFormData] = useState({
    medicines: [],
    additionalInfo: '',
  });

  const { data, isFetching, isError, error } = useFetchQuery({
    url: `prescriptions/?consultation_id=${consultationId}`,
    queryKey: ['patientPrescription', consultationId],
    fetchFunction: fetchWithAuth,
  });

  useEffect(() => {
    if (data?.results?.length > 0) {
      const prescription = data.results[0];
      setFormData({
        medicines: prescription.medicines,
        additionalInfo: prescription.additional_info || 'N/A',
      });
    }
  }, [data]);

  const handleCopy = () => {
    const textToCopy = `Medications: ${formData.medicines
      .map((med) => `${med.medicine_name} (${med.instruction})`)
      .join(', ')}
      Additional Information: ${formData.additionalInfo}`.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    });
  };

  if (isFetching) return <Loading />;
  if (isError)
    return (
      <p className="text-primary">
        Error fetching prescription: {error.message}
      </p>
    );

  return (
    <div className="px-2 h-[84vh]">
      <div id="patient-prescription" className="h-[74vh] mb-5 overflow-y-scroll">
        <h3 className="my-1 text-primary text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Prescription:
        </h3>

        <h3 className="mt-5 mb-3 text-primary text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Medications:
        </h3>

        <PatientMedicationTable medicines={formData.medicines} />

        <h3 className="mt-6 mb-3 text-primary text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Additional Notes
        </h3>
        <div className="mx-2 text-sm w-[90%] my-2">
          {formData.additionalInfo ? formData.additionalInfo : 'N/A'}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          onClick={() => handleDownloadPDF('patient-prescription', 'patient-prescription.pdf')}
        >
          Download PDF
        </Button>
        <Button onClick={handleCopy} variant="outline">
          {isCopied ? <IoCopy /> : <IoCopyOutline />}
        </Button>
      </div>
    </div>
  );
}
