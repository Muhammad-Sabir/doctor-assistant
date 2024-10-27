import React from 'react';

import DeleteItem from '@/components/dialogs/DeleteItem';
import UpdateMedication from '@/components/dialogs/UpdateMedication';
import { getAuthStatus } from '@/utils/auth';

export default function MedicationTable({ medications }) {

    const { user } = getAuthStatus();

    return (
        <div className="w-full">
            {medications.length > 0 ? (
                <div className={`${user.role === 'doctor' ? 'mx-2' :'' } mt-1 mb-5 mr-5 sm:mr-24`}>

                    <div className={`w-[100%] hidden sm:grid ${user.role === 'doctor' ? 'grid-cols-4' : 'grid-cols-3'} py-2 gap-3 border-b border-gray-300`}>
                        <div className="text-sm font-medium text-gray-500">Name</div>
                        <div className="text-sm font-medium text-gray-500">Dosage</div>
                        <div className="text-sm font-medium text-gray-500">Frequency</div>
                        {user.role === 'doctor' && <div className="text-sm font-medium text-gray-500 ml-6 actionButton">Action</div>}
                    </div>

                    {medications.map((med, index) => (
                        <div key={index} className={`w-[100%] grid grid-cols-1  ${user.role === 'doctor' ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-0 sm:gap-3 border sm:border-b
                           sm:border-l-0 sm:border-r-0 sm:border-t-0 border-gray-300 text-sm py-3 px-4 sm:px-0 rounded-md sm:rounded-none my-5 mx-1 sm:my-0`}
                        >
                            <div className="text-sm text-gray-500 flex items-center font-medium sm:font-normal p-0 m-0 focus-visible:ring-0 w-[90%] focus:text-gray-500 border-none">
                                {med.name}
                            </div>
                            <div className="p-0 m-0 focus-visible:ring-0 w-[90%] focus:text-gray-500 border-none font-bold text-md text-primary sm:text-sm sm:font-normal sm:text-gray-600 flex items-center">
                                {med.dosage}
                            </div>
                            <div className="flex flex-col items-start mt-3 sm:mt-0 text-sm font-normal text-gray-500">
                                <span className="block sm:hidden mr-1">Frequency:</span>
                                {med.frequency}
                            </div>

                            {user.role === 'doctor' && (
                                <div className="sm:ml-4 flex justify-end sm:justify-start">
                                    <UpdateMedication medication={med} />
                                    <DeleteItem deleteUrl={`/`} itemName={"Medication"} iconSize={16} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <p className='text-sm text-gray-600'>No medications yet.</p>
                </div>
            )}
        </div>
    );
}
