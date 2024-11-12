import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

import { getAuthStatus } from '@/utils/auth';
import { useWebRTCContext } from '@/context/WebRTCContext';

export default function CallEndedDialog() {

    const {user} = getAuthStatus();
    const role = user.role;

    const {isEndCall, setIsEndCall} = useWebRTCContext();

    const navigate = useNavigate();

    const handleSubmit = () => {
        setIsEndCall(false);
        if (role === 'doctor') {
            navigate('/doctor/home');
        } else if (role === 'patient') {
            navigate('/patient/home');
        }
    };

    return (
        <Dialog open={isEndCall} onOpenChange={setIsEndCall}>
            <DialogContent className="sm:max-w-[425px] p-6 [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle>Video Call Ended</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    <span>Your call has Ended.</span>
                </DialogDescription>
                <DialogFooter>
                <Button type="button" onClick={handleSubmit}>Ok</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
