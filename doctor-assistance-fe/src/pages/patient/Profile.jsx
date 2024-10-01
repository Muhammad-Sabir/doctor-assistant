import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import PatientPersonalDetails from '@/components/profile/PatientPersonalDetails';
import Loading from '@/components/shared/Loading';

export default function Profile() {
  const [inputValues, setInputValues] = useState({name: '', birthDate: '', gender: 'M'});
  const [inputErrors, setInputErrors] = useState({});

  const { data, isFetching, isSuccess, isError, error } = useFetchQuery({
    url: 'patients/',
    queryKey: ['doctorProfile'],
    fetchFunction: fetchWithAuth,
  });

  const patientId = data?.results?.[0]?.id;

  const updateProfileMutation = useCreateUpdateMutation({
    url: `patients/${patientId}/`,
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    fetchFunction: fetchWithAuth,
    onSuccessMessage: 'Profile Successfully Updated',
    onErrorMessage: 'Profile Update Failed',
    onSuccess: () => {
      window.location.reload();
    }
  });

  useEffect(() => {
    if (isSuccess && data) {
      const patient = data.results[0];
      console.log(patient)
      setInputValues((prev) => ({
        ...prev, name: patient.name || '', birthDate: patient.date_of_birth || '', gender: patient.gender || '',
      }));
    }
  }, [isSuccess, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    const errors = validateField(id, value, inputErrors);
    setInputErrors(errors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasNoFieldErrors(inputErrors)) {
      console.log(inputErrors);
      return;
    }

    const { name, birthDate, gender } = inputValues;
    updateProfileMutation.mutate(JSON.stringify({ name, date_of_birth: birthDate, gender}))
  };

  
  if (isFetching) {
    return (
      <Loading />
    );
  }

  if (isError) {
    return <p className='text-primary'>Error fetching patient profile: {error.message}</p>;
  }

  return (
    <div className="w-full px-4">
      <h2 className="text-lg font-semibold mb-2 text-primary">Your Profile</h2>
      <p className="text-sm mb-4">You can update your profile information below:</p>

      <hr className="border-t mt-6 mb-5 border-gray-300" />

      <form onSubmit={handleSubmit}>
        <PatientPersonalDetails
          inputValues={inputValues}
          handleChange={handleChange}
          handleBlur={handleBlur}
          inputErrors={inputErrors}
        />
        
        <hr className="border-t mt-4 mb-7 border-gray-300" />

        <div className='flex justify-start'>
          <Button type="submit">Update</Button>
        </div>
      </form>
    </div>
  );
}
