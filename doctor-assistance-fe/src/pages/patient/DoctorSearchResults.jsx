import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import DoctorCard from '@/components/shared/DoctorCard';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';
import Loading from '@/components/shared/Loading';

export default function DoctorSearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    name: '', average_rating_min: '',
    average_rating_max: '', years_of_experience: '', gender: 'all',
  });

  const queryString = searchParams.toString();

  const { data: doctorsData, isFetching, isError, error } = useFetchQuery({
    url: `doctors?${queryString}`,
    queryKey: ['doctorsSearchResults', queryString],
    fetchFunction: fetchWithAuth,
  });

  const doctors = doctorsData?.results || [];
  const nextPage = doctorsData?.next;
  const prevPage = doctorsData?.previous;

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const newParams = { ...Object.fromEntries(searchParams.entries()) };

    const isGenderAll = name === 'gender' && value === 'all';
    const isValueEmpty = !value;
  
    if (isGenderAll) {
      delete newParams.gender;
    } else if (isValueEmpty) {
      delete newParams[name]; 
    } else {
      newParams[name] = value; 
    }

    newParams.page = 1;
    setSearchParams(newParams);
  };

  const removeFilter = (filterName) => {
    const newFilters = { ...filters, [filterName]: '' };
    setFilters(newFilters);

    const newParams = { ...Object.fromEntries(searchParams.entries()) };
    delete newParams[filterName];

    newParams.page = 1;
    setSearchParams(newParams);
  };

  const handleNextPage = () => {
    const newSearchParams = new URL(nextPage).searchParams;
    setSearchParams(newSearchParams);
  };

  const handlePrevPage = () => {
    const newSearchParams = new URL(prevPage).searchParams;
    setSearchParams(newSearchParams);
  };

  if (isFetching) return <Loading />;
  if (isError) return <p className='text-primary'>Error fetching doctor profile: {error.message}</p>;

  return (
    <div className="px-2 pb-6">
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="flex flex-col">
            <Input type="text" name="name" value={filters.name}
              placeholder="Filter by Name" onChange={handleFilterChange} onBlur={handleBlur} />
          </div>
          <div className="flex flex-col">
            <Input type="number" name="average_rating_min" value={filters.average_rating_min}
              placeholder="Min Rating" onChange={handleFilterChange} onBlur={handleBlur} />
          </div>
          <div className="flex flex-col">
            <Input type="number" name="average_rating_max" value={filters.average_rating_max}
              placeholder="Max Rating" onChange={handleFilterChange} onBlur={handleBlur} />
          </div>
          <div className="flex flex-col">
            <Input type="number" name="years_of_experience" value={filters.years_of_experience}
              placeholder="Years of Experience" onChange={handleFilterChange} onBlur={handleBlur} />
          </div>
          <div className="flex flex-col">
            <select name="gender" value={filters.gender} onChange={handleFilterChange} onBlur={handleBlur}
              className="flex text-gray-500 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
              <option value="all">Gender: All</option>
              <option value="M">Gender: Male</option>
              <option value="F">Gender: Female</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {Object.keys(filters).map((key) =>
            filters[key] && !(key === 'gender' && filters[key] === 'all') && (
              <span key={key} className="m-1 py-1 px-2 bg-accent rounded-md inline-block text-xs font-medium text-primary text-center">
                {`${key}: ${filters[key]}`}
                <button type="button" onClick={() => removeFilter(key)} className="ml-2 text-destructive">
                  &times;
                </button>
              </span>
            )
          )}
        </div>
      </div>

      <h2 className="text-md font-medium text-primary mb-4">Search Results:</h2>
      {doctors.length ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 mx-auto max-w-screen-lg">
            {doctors.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
          <div className="flex justify-center gap-3.5 mt-8">
            <Button variant='outline' onClick={handlePrevPage} disabled={!prevPage}><FaAnglesLeft className='mr-1'/>Prev </Button>
            <Button variant='outline' onClick={handleNextPage} disabled={!nextPage}>Next <FaAnglesRight className='ml-1 mt-0.5'/></Button>
          </div>
        </>
      ) : (
        <p className='text-sm text-gray-600'>No doctors found.</p>
      )}
    </div>
  );
}
