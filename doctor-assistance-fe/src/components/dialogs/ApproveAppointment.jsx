import React from 'react';
import { MdFileDownloadDone } from "react-icons/md";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';

const ApproveAppointment = ({appointment}) => {

    const approveAppointmentMutation = useCreateUpdateMutation({
        url: `appointments/${appointment.id}/`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        fetchFunction: fetchWithAuth,
        onSuccessMessage: 'Appointment Successfully Approved',
        onErrorMessage: 'Failed to Approve Appointment',
        onSuccess: () => {
            setTimeout(() => {
                window.location.reload();
            }, 300); 
        }
    });

    const handleSubmit = () => {
        approveAppointmentMutation.mutate(JSON.stringify({ status: 'approved' }))
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <span >
                <MdFileDownloadDone className='text-green-500 mt-0.5 ml-1' size={20}/>
                </span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Approve Appointment</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to approve Appointment with {appointment.patient_name}
                    </DialogDescription>
                </DialogHeader>
                
                    <DialogFooter>
                        <Button type="button" onClick={handleSubmit}>Confirm</Button>
                    </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ApproveAppointment;