import React from 'react';
import { Link } from 'react-router-dom';

const HospitalCard = ({ hospital }) => {
    return (
        <Link to={`/patient/hospital/${hospital.id}`} key={hospital.id} className="flex items-center space-x-4 p-4 bg-white border
         border-gray-300 rounded-lg hover:shadow-md hover:border-primary transition-shadow">
            {hospital.logo_url && (
                <img src={hospital.logo_url} alt={hospital.name} className="w-16 h-16 object-cover rounded-full"/>
            )}
            <div>
                <h3 className="text-sm font-semibold text-primary capitalize">
                    {hospital.name}, {hospital.city}
                </h3>
                <p className="text-sm text-gray-500">
                    {hospital.street_address}
                </p>
            </div>
        </Link>
    );
};

export default HospitalCard;
