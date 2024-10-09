import React, { useEffect, useState } from 'react';

import UpdateDependent from '@/components/dialogs/UpdateDependent';
import DeleteItem from '@/components/dialogs/DeleteItem';
import AddDependent from '@/components/dialogs/AddDependent';

export default function DependentPatientsDetails({ patientData }) {
    const [dependentDetails, setDependentDetails] = useState([]);

    useEffect(() => {
        if (patientData) {
            const details = patientData.results[0].dependents || [];
            setDependentDetails(details);
        }
    }, [patientData]);

    return (
        <div className="w-full">
            <AddDependent />

            <h2 className="text-sm font-medium text-primary mb-4">Your Dependent Patients:</h2>

            {dependentDetails.length > 0 ? (
                <>
                    <div className="hidden sm:grid grid-cols-5 gap-4 border-b border-gray-200 pb-3">
                        <div className="text-sm font-medium text-gray-700">ID</div>
                        <div className="text-sm font-medium text-gray-700">Name</div>
                        <div className="text-sm font-medium text-gray-700">Date of Birth</div>
                        <div className="text-sm font-medium text-gray-700">Gender</div>
                        <div className="text-sm font-medium text-gray-700">Actions</div>
                    </div>

                    {dependentDetails.map((dependent) => (
                        <div
                            key={dependent.id}
                            className="grid grid-cols-1 sm:grid-cols-5 gap-0 sm:gap-4 border sm:border-t 
                            sm:border-l-0 sm:border-r-0 sm:border-b-0 border-gray-300 py-3 px-4 sm:px-0 rounded-md sm:rounded-none my-5 sm:my-0"
                        >
                            <div className="text-sm font-normal text-gray-500 flex items-center">
                                <span className="block sm:hidden mr-1">Patient Id:</span>{dependent.id}
                            </div>
                            <div className="font-bold text-md text-primary sm:text-sm sm:font-normal sm:text-gray-600 flex items-center">
                                {dependent.name}
                            </div>
                            <div className="text-sm font-normal text-gray-500 flex items-center mt-2 sm:mt-0">
                                <span className="block sm:hidden mr-1">Date of Birth:</span>{dependent.date_of_birth}
                            </div>
                            <div className="text-sm font-normal text-blue-500 sm:text-gray-500 flex items-center">
                                {dependent.gender === 'M' ? 'Male' : 'Female'}
                            </div>

                            <div className="flex justify-end sm:justify-start items-center">
                                <UpdateDependent
                                    selectedDependent={dependent}
                                />
                                <DeleteItem deleteUrl={`dependents/${dependent.id}`} itemName={"Dependent"} iconSize={16}/>
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <div>
                    <p className='text-sm text-gray-600'>No dependent patients found. Click "Add New" to create a dependent.</p>
                </div>
            )}
        </div>
    );
}
