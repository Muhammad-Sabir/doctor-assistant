import React from 'react';
import { MdOutlineDelete } from "react-icons/md";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useDeleteMutation } from '@/hooks/useDeleteMutation';

const DeleteItemDialog = ({deleteUrl, itemName}) => {

    const deleteMutation = useDeleteMutation({
        url: `${deleteUrl}`,
        onSuccessMessage: `${itemName} Successfully Deleted`,
        onErrorMessage: `Failed to Delete ${itemName}`,
        onSuccess: () => {
            setTimeout(() => {
                window.location.reload();
            }, 300); 
        }
    });

    const handleSubmit = () => {
        deleteMutation.mutate();
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <span >
                    <MdOutlineDelete size={17} color='red' className='mt-1 ml-2 text-primary' />
                </span>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete {itemName}</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the {itemName}
                    </DialogDescription>
                </DialogHeader>
                
                    <DialogFooter>
                        <Button type="button" onClick={handleSubmit}>Confirm</Button>
                    </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteItemDialog;
