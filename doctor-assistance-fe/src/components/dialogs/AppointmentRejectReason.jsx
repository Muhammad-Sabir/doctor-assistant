import React from 'react';
import { TbInfoTriangle } from 'react-icons/tb';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { getAuthStatus } from '@/utils/auth';

const AppointmentRejectReason = ({reason}) => {

    const { user } = getAuthStatus();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <span >
                <TbInfoTriangle className='text-red-500 mt-0.5 ml-1' size={18}/>
                </span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Appointment Rejected</DialogTitle>
                    <DialogDescription>
                        This appointment has been rejected by {user.role === 'doctor' ? 'You' : 'the Doctor'}
                    </DialogDescription>
                </DialogHeader>
                <p className='text-sm text-red-700'>Reason of Rejection: {reason} </p>
            </DialogContent>
        </Dialog>
    );
};

export default AppointmentRejectReason;