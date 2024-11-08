import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

import { getAuthStatus } from '@/utils/auth';

export default function CallEndedDialog() {

    const {user} = getAuthStatus();
    const role = user.role;

    const [isOpen, setIsOpen] = useState(true); 

    const navigate = useNavigate();

    const handleSubmit = () => {
        setIsOpen(false);
        if (role === 'doctor') {
            navigate('/doctor/home');
        } else if (role === 'patient') {
            navigate('/patient/home');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
