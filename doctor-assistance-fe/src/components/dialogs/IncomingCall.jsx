import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import RingingIcon from '@/components/shared/RingingIcon';

export default function IncomingCall() {

    const navigate = useNavigate();

    const handleDecline = (e) => {
        console.log('Call Declined')
    };

    const handleAccept = (e) => {
        console.log('Call Accepted')
        navigate('/patient/consultation/video-call')
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='secondary' className='ml-3'>Video Call</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        <span>
                            <h1 className="mb-7 text-center ">Incoming Video Call</h1>
                            <RingingIcon />
                        </span>
                    </DialogTitle>
                    <DialogDescription>
                        <span className='text-center block'>
                            Dr. Amina Khan is calling you...
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button type="button" variant='secondary' onClick={handleDecline}>Decline</Button>
                    <Button type="button" onClick={handleAccept}>Accept</Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
