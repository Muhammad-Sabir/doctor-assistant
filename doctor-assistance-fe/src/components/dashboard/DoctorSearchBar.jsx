import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdOutlineSearch } from "react-icons/md";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from '@/components/ui/input';

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';

const DoctorSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("speciality_name");
  const [isSelected, setIsSelected] = useState(false);
  const navigate = useNavigate();

  const labels = {
    speciality_name: `specialities`,
    disease_name: `diseases`,
    degree_name: `degrees`,
  };

  const { data } = useFetchQuery({
    url: `${labels[searchBy]}?name=${searchQuery}`,
    queryKey: ['suggestions', searchBy, searchQuery],
    fetchFunction: fetchWithAuth,
    enabled: searchQuery.length > 0 && !isSelected,
  });

  const suggestions = data?.results || [];
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/patient/doctors/search-results?${searchBy}=${searchQuery}`);
    }
  };

  const handleSuggestionClick = (item) => {
    setSearchQuery(item.name);
    setIsSelected(true);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setIsSelected(false);
  };

  return (
    <div className="mt-1">
      <div className="border-gray-300 border rounded-lg px-1 py-1 flex items-center justify-between">
        <div className="text-primary font-semibold">
          <Select onValueChange={setSearchBy} value={searchBy}>
            <SelectTrigger className="w-28 border-none">
              <SelectValue placeholder={searchBy.replace("_", " ")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="speciality_name">Speciality</SelectItem>
              <SelectItem value="disease_name">Disease</SelectItem>
              <SelectItem value="degree_name">Degree</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-6 border-l border-gray-300 mx-1"></div>

        <div className="flex-grow relative">
          <Input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder={`Search Doctors By ${searchBy.replace("_", " ")}...`}
            className="w-full py-2 px-4 text-sm focus:outline-none border-none focus-visible:outline-0 focus-visible:ring-0 focus-visible:border-0"
          />

          {!isSelected && suggestions.length > 0 && (
            <div className="absolute w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-60 overflow-auto z-10">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSuggestionClick(item)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={handleSearch}>
          <MdOutlineSearch className='text-primary mr-2' fontSize={20} />
        </button>
      </div>
    </div>
  );
};

export default DoctorSearchBar;
