import React, { useState } from 'react';

import banner from "@/assets/images/webp/profileBanner.webp";
import userIcon from "@/assets/images/webp/userIcon.webp";

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';
import { getAuthStatus } from '@/utils/auth';

import PatientPersonalDetails from '@/components/profile/PatientPersonalDetails';
import DependentPatientsDetails from '@/components/profile/DependentPatientsDetails';
import ProfileTabs from '@/components/shared/ProfileTabs';
import Loading from '@/components/shared/Loading';
import PatientAllergiesDetail from '@/components/profile/PatientAllergiesDetail';

export default function Profile() {
  const { user } = getAuthStatus();
  const [activeTab, setActiveTab] = useState("personal");

  const { data, isFetching, isError, error } = useFetchQuery({
    url: 'patients/',
    queryKey: ['patientProfile'],
    fetchFunction: fetchWithAuth,
  });

  const patientTabs = [
    { label: "Personal Details", key: "personal" },
    { label: "Dependent Patients Details", key: "dependentPatients" },
    { label: "Allergies Details", key: "allergies" },
  ];

  const tabComponents = {
    personal: <PatientPersonalDetails patientData ={data} />,
    dependentPatients: <DependentPatientsDetails patientData={data} />,
    allergies: <PatientAllergiesDetail patientData={data} />
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
    <section className="relative pt-40 pb-24 mx-1">
      <img src={banner} alt="cover-image"
        className="w-full absolute top-0 left-0 z-0 h-[10rem] object-cover"
      />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-8 -mt-28 bg-white">
        <div className="flex items-center justify-center sm:justify-start relative z-10 mb-5 mt-10 lg:mt-0">
          <img src={userIcon} alt="user-image"
            className="bg-white h-[120px] lg:h-[152px] w-[120px] lg:w-[152px] object-cover border border-gray-300 rounded-full"
          />
        </div>

        <div className="flex items-center justify-center flex-col sm:flex-row max-sm:gap-5 sm:justify-between mb-5">
          <div>
            <h3 className="font-manrope font-bold text-xl text-primary mb-1 max-sm:text-center">{data?.results[0].name}</h3>
            <p className="font-normal text-gray-500 max-sm:text-center text-sm">
            <span className='leading-6'>{user?.username}</span> <br className="hidden sm:block" />
              Patient ID: {data?.results[0].id} 
            </p>
          </div>
        </div>

        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={patientTabs} />

        {tabComponents[activeTab]}
      </div>
    </section>
  );
}
