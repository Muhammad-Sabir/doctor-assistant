import React from 'react';

export default function PatientMedicationTable({ medicines }) {

    return (
        <div className="w-full">
            {medicines.length > 0 ? (
                <div className="sm:mx-2 mt-1 mb-5 mr-5 sm:mr-24`">

                    <div className="w-[100%] hidden sm:grid grid-cols-3 py-2 gap-3 border-b border-gray-300">
                        <div className="text-sm font-medium text-gray-500">Name</div>
                        <div className="text-sm font-medium text-gray-500">Instruction</div>
                    </div>

                    {medicines.map((med, index) => (
                        <div key={index} className="w-[100%] grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-3 border sm:border-b sm:border-l-0 sm:border-r-0 sm:border-t-0 border-gray-300 text-sm py-3 px-4 sm:px-0 rounded-md sm:rounded-none my-5 mx-1 sm:my-0">

                            <div className="text-sm text-gray-500 flex items-center font-normal">
                                <span className='text-primary sm:hidden font-semibold mr-2'>Medicine Name:</span>
                                {med.medicine_name}
                            </div>

                            <div className="text-sm font-normal text-gray-600 flex items-center">
                                <span className='text-primary sm:hidden font-semibold mr-2'>Instruction:</span>
                                {med.instruction}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <p className="text-sm text-gray-600 mb-4">No medicines prescribed by the doctor.</p>
                </div>
            )}
        </div>
    );
}
