import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSolidError } from "react-icons/bi";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { validateField, hasNoFieldErrors } from '@/utils/validations';
import { useCreateUpdateMutation } from '@/hooks/useCreateUpdateMutation';
import { fetchWithAuth } from '@/utils/fetchApis';

export default function CompleteProfile() {
  const navigate = useNavigate();
  const [inputValues, setInputValues] = useState({ name: '', birthDate: '', gender: 'M' });
  const [inputErrors, setInputErrors] = useState({});

  const completeProfileMutation = useCreateUpdateMutation({
    url: 'patients/',
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    fetchFunction: fetchWithAuth,
    onSuccessMessage: 'Profile Successfully Setup',
    onErrorMessage: 'Profile Setup Failed',
    onSuccess: () => {
        let user = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({ ...user, is_profile_completed: true }));
        navigate(`/${user.role}`)
    }
});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    const errors = validateField(id, value, inputErrors);
    setInputErrors(errors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasNoFieldErrors(inputErrors)) {
      console.log(inputErrors);
      return;
    }

    console.log(inputValues);
    const { name, birthDate, gender } = inputValues;
    completeProfileMutation.mutate(JSON.stringify({ name, date_of_birth: birthDate, gender}))
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-2 mb-5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name='name'
            type="text"
            placeholder="Enter your name..."
            onChange={handleChange}
            onBlur={handleBlur}
            value={inputValues.name}
            className={inputErrors.name ? 'border-red-500' : ''}
            required
          />
          {inputErrors.name && (
            <div aria-live="assertive" className="flex text-red-500 text-sm">
              <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.name}
            </div>
          )}
        </div>
        <div className="grid gap-2 mb-5">
          <Label htmlFor="birthDate">Date of Birth</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            placeholder="Enter your age..."
            onChange={handleChange}
            onBlur={handleBlur}
            value={inputValues.birthDate}
            className={`w-full border rounded-md p-2 ${inputErrors.birthDate ? 'border-red-500' : 'border-gray-300'}`}
            required
          />
          {inputErrors.birthDate && (
            <div aria-live="assertive" className="flex text-red-500 text-sm">
              <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.birthDate}
            </div>
          )}
        </div>
        <div className='grid gap-2 mb-3'>
          <Label>Gender</Label>
          <div>
            <input
              type="radio"
              id="M"
              name="gender"
              value="M"
              onBlur={handleBlur}
              onChange={handleChange}
              checked={inputValues.gender === 'M'}
            />
            <Label htmlFor="M" className='ml-2 -mt-2 font-normal'>Male</Label>

            <input
              type="radio"
              id="F"
              name="gender"
              value="F"
              onBlur={handleBlur}
              onChange={handleChange}
              className='ml-3'
              checked={inputValues.gender === 'F'}
            />
            <Label htmlFor="F" className='ml-2 -mt-2 font-normal'>Female</Label>
          </div>
          {inputErrors.gender && (
            <div aria-live="assertive" className="flex text-red-500 text-sm">
              <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors.gender}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" >
            Submit
          </Button>

        </div>
      </form>
    </>

  );
}
