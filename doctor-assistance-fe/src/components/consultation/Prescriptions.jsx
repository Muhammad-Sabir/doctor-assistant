import React, { useState, useEffect } from 'react';
import { IoCopyOutline, IoCopy } from 'react-icons/io5';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { handleDownloadPDF } from '@/utils/pdf';
import MedicationTable from '@/components/consultation/MedicationTable';
import AddMedication from '@/components/dialogs/AddMedication';
import { fetchWithAuth } from '@/utils/fetchApis';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';

export default function Prescriptions({ consultationId }) {

  const [isCopied, setIsCopied] = useState(false);
  const [formData, setFormData] = useState({
    medicines: [],
    additional_info: '',
  });

  const { data } = useFetchQuery({
    url: `prescriptions/${consultationId}/`,
    queryKey: ['consultationPrescription', consultationId],
    fetchFunction: fetchWithAuth,
  });

  const updatePrescriptionMutation = useCreateUpdateMutation({
    url: `prescriptions/${consultationId}/`,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    fetchFunction: fetchWithAuth,
    onSuccessMessage: 'Successfully Updated Prescription',
    onErrorMessage: 'Failed to Update Prescription',
  });

  useEffect(() => {
    if (data) {
      setFormData({
        medicines: data.medicines || [],
        additional_info: data.additional_info || '',
      });
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    updatePrescriptionMutation.mutate(JSON.stringify({ [name]: value }));
  };

  const handleAddMedication = (newMedication) => {
    const updatedmedicines = [...formData.medicines, newMedication];
    setFormData((prev) => ({ ...prev, medicines: updatedmedicines }));
    updatePrescriptionMutation.mutate(JSON.stringify({ medicines: updatedmedicines }));
  };

  const handleUpdateMedication = (updatedMedication, index) => {
    const updatedMedicines = [...formData.medicines];
    updatedMedicines[index] = updatedMedication;

    setFormData((prev) => ({ ...prev, medicines: updatedMedicines }));

    updatePrescriptionMutation.mutate(
      JSON.stringify({ medicines: updatedMedicines }),
    );
  };

  const handleDeleteMedication = (index) => {
    const updatedmedicines = formData.medicines.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, medicines: updatedmedicines }));
    updatePrescriptionMutation.mutate(JSON.stringify({ ...formData, medicines: updatedmedicines }));
  };

  const handleCopy = () => {
    const textToCopy = `
      medicines: ${formData.medicines.map(med => `${med.name}: ${med.instruction}`).join(', ')}
      Additional Information: ${formData.additional_info}`.trim();

    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1000);
    });
  };

  return (
    <div className="h-[76vh]">
      <div id="prescription-content" className="h-[67vh] mb-5 overflow-y-scroll">
        <div className="flex items-center justify-between">
          <h3 className="-mt-2 text-sm font-medium leading-none text-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Medications:</h3>
          <AddMedication onAdd={handleAddMedication} />
        </div>

        <MedicationTable
          medicines={formData.medicines}
          onUpdate={handleUpdateMedication}
          onDelete={handleDeleteMedication}
        />

        <Label htmlFor="Padditional_info" className="text-primary mt-3">Additional Information:</Label>
        <textarea
          name="additional_info"
          id="Padditional_info"
          value={formData.additional_info}
          onChange={handleInputChange}
          onBlur={handleBlur}
          rows={1}
          className="mx-2 focus-visible:ring-gray-500 focus:text-gray-500 w-[90%] border-none rounded-md my-2"
          placeholder="Add Additional information here (if any)..."
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button onClick={() => handleDownloadPDF('prescription-content', 'patient-prescription.pdf')}>Download PDF</Button>
        <Button onClick={handleCopy} variant="outline">
          {isCopied ? <IoCopy /> : <IoCopyOutline />}
        </Button>
      </div>
    </div>
  );
}
