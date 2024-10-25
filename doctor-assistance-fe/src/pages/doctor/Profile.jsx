import React, { useState, useEffect } from 'react';
import { BiSolidError } from "react-icons/bi";
import { AiTwotoneEdit } from "react-icons/ai";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import banner from "@/assets/images/webp/profileBanner.webp";
import userIcon from "@/assets/images/webp/userIcon.webp";

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';

import { fetchWithAuth } from '@/utils/fetchApis';
import { getAuthStatus } from '@/utils/auth';
import { validateField, hasNoFieldErrors } from '@/utils/validations';

import PersonalDetails from '@/components/profile/PersonalDetails';
import WorkDetails from '@/components/profile/WorkDetails';
import ProfessionalDetails from '@/components/profile/ProffessionalDetails';
import EducationDetails from '@/components/profile/EducationDetails';
import Loading from '@/components/shared/Loading';
import ProfileTabs from '@/components/shared/ProfileTabs';


export default function Profile() {
  const { user } = getAuthStatus();
  const [inputValues, setInputValues] = useState({
    registrationNo: '', experience: '', picture: null,
    name: '', doctorBirthDate: '', gender: 'M',
    degrees: [], specialities: [], diseases: [], affiliatedHospitals: []
  });
  const [inputErrors, setInputErrors] = useState({});
  const [activeTab, setActiveTab] = useState("personal");

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
    onSuccess: () => window.location.reload(),
  });

  useEffect(() => {
    if (isSuccess && data) {
      setInputValues(prev => ({
        ...prev,
        registrationNo: data.pmdc_no || '',
        experience: data.date_of_experience || '',
        name: data.name || '',
        doctorBirthDate: data.date_of_birth || '',
        gender: data.gender || 'M',
        degrees: data.degrees || [],
        specialities: data.specialities || [],
        diseases: data.diseases || [],
        affiliatedHospitals: data.hospitals || [],
      }));
    }
  }, [isSuccess, data]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'picture') {
      setInputValues(prev => ({ ...prev, picture: files[0] || null }));
    } else {
      setInputValues(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = e => {
    const { id, value, files } = e.target;
    const inputValue = id === 'picture' ? files[0] : value;
    setInputErrors(prev => validateField(id, inputValue, prev));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!hasNoFieldErrors(inputErrors)) return;
    const formData = createFormData(inputValues);
    updateProfileMutation.mutate(formData);
  };

  const getIds = key => inputValues[key]?.map(item => item.id) || [];

  const createFormData = inputValues => {
    const formData = new FormData();
    formData.append('name', inputValues.name);
    formData.append('date_of_birth', inputValues.doctorBirthDate);
    formData.append('date_of_experience', inputValues.experience);
    formData.append('pmdc_no', inputValues.registrationNo);
    formData.append('gender', inputValues.gender);
    if (inputValues.picture) formData.append('image_file', inputValues.picture);

    getIds('affiliatedHospitals').forEach(id => formData.append('hospitals', id));
    getIds('specialities').forEach(id => formData.append('specialities', id));
    getIds('degrees').forEach(id => formData.append('degrees', id));
    getIds('diseases').forEach(id => formData.append('diseases', id));

    return formData;
  };

  const doctorTabs = [
    { label: "Personal Details", key: "personal" },
    { label: "Education Details", key: "education" },
    { label: "Work Details", key: "work" },
    { label: "Professional Details", key: "professional" },
  ];

  const tabComponents = {
    personal: <PersonalDetails inputValues={inputValues} handleChange={handleChange} handleBlur={handleBlur} inputErrors={inputErrors} />,
    education: <EducationDetails inputValues={inputValues} setInputValues={setInputValues} inputErrors={inputErrors} setInputErrors={setInputErrors} />,
    work: <WorkDetails inputValues={inputValues} setInputValues={setInputValues} inputErrors={inputErrors} setInputErrors={setInputErrors} />,
    professional: <ProfessionalDetails inputValues={inputValues} handleChange={handleChange} handleBlur={handleBlur} inputErrors={inputErrors} setInputValues={setInputValues} />,
  };

  if (isFetching) return <Loading />;

  if (isError) return <p className='text-primary'>Error fetching doctor profile: {error.message}</p>;

  const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

  return (
    <section className="relative pt-40 pb-24 mx-1">
      <img src={banner} alt="cover-image"
        className="w-full absolute top-0 left-0 z-0 h-[10rem] object-cover"
      />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 -mt-28 bg-white">
        <div className="flex items-center justify-center sm:justify-start relative z-10 mb-5 mt-10 lg:mt-0">
          <img src={data?.file_url ? `${baseUrl}${data.file_url}` : userIcon} alt="user-image"
            className="bg-white h-[120px] lg:h-[152px] w-[120px] lg:w-[152px] object-cover border border-gray-300 rounded-full"
          />
        </div>

        <div className="flex items-center justify-center flex-col sm:flex-row max-sm:gap-5 sm:justify-between mb-5">
          <div>
            <h3 className="font-manrope font-bold text-xl text-primary mb-1 max-sm:text-center">Dr. {data?.name}</h3>
            <p className="font-normal text-gray-500 max-sm:text-center text-sm">
              <span className='leading-6'>{user?.username}</span> <br className="hidden sm:block" />
              Doctor at {data?.hospitals[0]?.name}
            </p>
          </div>
          <div className="grid gap-2">
            <div className='flex items-center justify-center md:justify-start'>
              <Label htmlFor="picture" className='text-gray-600 font-normal'>Edit Image</Label>
              <AiTwotoneEdit size={15} className='mt-1 ml-1 text-gray-600' />
            </div>
            <Input id="picture" name="picture" type="file" onChange={handleChange} onBlur={handleBlur}
              className={`border ${inputErrors.picture ? 'border-red-500' : 'border-gray-300'} max-w-[200px]`}
            />
            {inputErrors.picture && (
              <div aria-live="assertive" className="flex text-red-500 text-sm mt-1">
                <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.picture}
              </div>
            )}
          </div>
        </div>

        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={doctorTabs} />

        <form onSubmit={handleSubmit}>
          {tabComponents[activeTab]}
          <div className='flex justify-end mt-6'>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
