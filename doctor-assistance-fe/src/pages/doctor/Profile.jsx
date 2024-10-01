import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';
import { validateField, hasNoFieldErrors } from '@/utils/validations';
import PersonalDetails from '@/components/profile/PersonalDetails';
import WorkDetails from '@/components/profile/WorkDetails';
import ProfessionalDetails from '@/components/profile/ProffessionalDetails';
import EducationDetails from '@/components/profile/EducationDetails';
import Loading from '@/components/shared/Loading';

export default function Profile() {
  const [inputValues, setInputValues] = useState({
    registrationNo: '', experience: '', picture: null,
    name: '', doctorBirthDate: '', gender: 'M',
    degrees: [], specialities: [], diseases: [], affiliatedHospitals: []
  });
  const [inputErrors, setInputErrors] = useState({});

  const { data, isFetching, isSuccess, isError, error } = useFetchQuery({
    url: 'doctors/me',
    queryKey: ['doctorProfile'],
    fetchFunction: fetchWithAuth,
  });

  const updateProfileMutation = useCreateUpdateMutation({
    url: 'doctors/me/',
    method: 'PATCH',
    fetchFunction: fetchWithAuth,
    onSuccessMessage: 'Profile Successfully Updated',
    onErrorMessage: 'Profile Update Failed',
    onSuccess: () => {
      window.location.reload();
    }
  });

  useEffect(() => {
    if (isSuccess && data) {
      setInputValues((prev) => ({
        ...prev, registrationNo: data.pmdc_no || '', experience: data.date_of_experience || '',
        name: data.name || '', doctorBirthDate: data.date_of_birth || '', gender: data.gender || 'M',
        degrees: data.degrees || [], specialities: data.specialities || [],
        diseases: data.diseases || [], affiliatedHospitals: data.hospitals || [],
      }));
    }
  }, [isSuccess, data]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'picture') {
      const file = files[0];
      setInputValues((prev) => ({ ...prev, picture: file || null }));
    } else {
      setInputValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (e) => {
    const { id, value, files } = e.target;
    let inputValue = value;
    if (id === 'picture') {
      inputValue = files[0];
    }
    const errors = validateField(id, inputValue, inputErrors);
    setInputErrors(errors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasNoFieldErrors(inputErrors)) {
      console.log(inputErrors);
      return;
    }
    const formData = createFormData(inputValues);
    updateProfileMutation.mutate(formData);
  };

  const getIds = (key) => inputValues[key]?.map(item => item.id) || [];

  const createFormData = (inputValues) => {
    const specialityIds = getIds('specialities');
    const hospitalIds = getIds('affiliatedHospitals');
    const diseasesIds = getIds('diseases');
    const degreesIds = getIds('degrees');

    const formData = new FormData();
    formData.append('name', inputValues.name);
    formData.append('date_of_birth', inputValues.doctorBirthDate);
    formData.append('date_of_experience', inputValues.experience);
    formData.append('pmdc_no', inputValues.registrationNo);
    formData.append('gender', inputValues.gender);
    if (inputValues.picture) {
      formData.append('image_file', inputValues.picture);
    }
    hospitalIds.forEach(id => { formData.append('hospitals', id); });
    specialityIds.forEach(id => { formData.append('specialities', id); });
    degreesIds.forEach(id => { formData.append('degrees', id); });
    diseasesIds.forEach(id => { formData.append('diseases', id); });

    return formData;
  };

  if (isFetching) {
    return (
      <Loading />
    );
  }

  if (isError) {
    return <p className='text-primary'>Error fetching doctor profile: {error.message}</p>;
  }

  return (
    <div className="w-full px-4">
      <h2 className="text-lg font-semibold mb-2 text-primary">Your Profile</h2>
      <p className="text-sm mb-4">You can update your profile information below:</p>

      <hr className="border-t mt-6 mb-5 border-gray-300" />

      <form onSubmit={handleSubmit}>
        <PersonalDetails
          data={data}
          inputValues={inputValues}
          handleChange={handleChange}
          handleBlur={handleBlur}
          inputErrors={inputErrors}
        />

        <EducationDetails
          inputValues={inputValues}
          setInputValues={setInputValues}
          inputErrors={inputErrors}
          setInputErrors={setInputErrors}
        />

        <WorkDetails
          inputValues={inputValues}
          setInputValues={setInputValues}
          inputErrors={inputErrors}
          setInputErrors={setInputErrors}
        />

        <ProfessionalDetails
          inputValues={inputValues}
          handleChange={handleChange}
          handleBlur={handleBlur}
          inputErrors={inputErrors}
          setInputValues={setInputValues}
        />

        <hr className="border-t mt-4 mb-7 border-gray-300" />

        <div className='flex justify-start'>
          <Button type="submit">Update</Button>
        </div>
      </form>
    </div>
  );
}
