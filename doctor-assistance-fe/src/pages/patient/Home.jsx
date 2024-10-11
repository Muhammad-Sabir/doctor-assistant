import React from 'react';
import { Link } from 'react-router-dom';
import { CiStethoscope } from 'react-icons/ci';
import { PiHeartbeatLight, PiBabyCarriageThin, PiFaceMaskLight, PiPersonLight } from 'react-icons/pi';

import PatientHomeCards from '@/components/dashboard/PatientHomeCards';
import HospitalSearchBar from '@/components/dashboard/HospitalSearchBar';


const doctorSpecialties = [
  { icon: <PiHeartbeatLight size={40} />, name: 'Cardiologists', url: '/patient/doctors/search-results?speciality_name=cardiologist' },
  { icon: <CiStethoscope size={40} />, name: 'General Physicians', url: '/patient/doctors/search-results?speciality_name=General%20Physician' },
  { icon: <PiFaceMaskLight size={40} />, name: 'Dermatologists', url: '/patient/doctors/search-results?speciality_name=dermatologist' },
  { icon: <PiBabyCarriageThin size={40} />, name: 'Gynecologists', url: '/patient/doctors/search-results?speciality_name=Gynecologist' },
  { icon: <PiPersonLight size={40} />, name: 'Pediatricians', url: '/patient/doctors/search-results?speciality_name=Pediatrician' },
];

export default function Home() {

  return (
    <div>
      <HospitalSearchBar />
      <PatientHomeCards />
      <div className='px-2'>
        <h2 className='text-md font-medium text-primary'>Discover Our 5 Leading Specialties!</h2>
        <p className='text-md font-medium text-secondary mb-4'>Your Health Starts Here</p>

        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5'>
          {doctorSpecialties.map((specialty) => (
            <Link to={specialty.url} key={specialty.name} className="flex flex-col items-center border border-gray-300 rounded-md py-4 hover:shadow-md hover:border-primary transition-shadow duration-500">
              <span className="p-3 flex items-center justify-center text-primary">
                {specialty.icon}
              </span>
              <p className="m-2 text-center text-sm text-gray-600">{specialty.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
