import React, { useState } from 'react';
import { MdOutlineDelete } from "react-icons/md";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const DeleteMedication = ({ medication, index, onDelete }) => {

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = () => {
    onDelete(index); 
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <span>
          <MdOutlineDelete size="16" color="red" className="actionButton mt-0.5 ml-2 text-primary" />
        </span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete {medication.medicine_name}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {medication.medicine_name} from the prescription?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" onClick={handleDelete}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteMedication;
