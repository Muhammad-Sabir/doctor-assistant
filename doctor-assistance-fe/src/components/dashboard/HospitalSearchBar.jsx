import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdOutlineSearch } from "react-icons/md";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { useFetchQuery } from "@/hooks/useFetchQuery";
import { fetchWithAuth } from "@/utils/fetchApis";

const HospitalSearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("street_address");
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();

  const labels = {
    street_address: `street_address`,
    name: `name`,
  };

  const { data } = useFetchQuery({
    url: `hospitals?${labels[searchBy]}=${searchQuery}`,
    queryKey: ["suggestions", searchBy, searchQuery],
    fetchFunction: fetchWithAuth,
    enabled: searchQuery.length > 0 && !selectedItem,
  });

  const suggestions = data?.results || [];

  const handleSuggestionClick = (item) => {
    setSearchQuery(item.name);
    navigate(`/patient/hospital/${item.id}`);
    setSelectedItem(item);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setSelectedItem(null);
  };

  return (
    <div className="px-2 mt-1">
      <div className="flex items-center justify-between px-1 py-1 border border-gray-300 rounded-lg">
        <div className="font-semibold text-primary">
          <Select onValueChange={setSearchBy} value={searchBy}>
            <SelectTrigger className="border-none w-28">
              <SelectValue placeholder={searchBy.replace("_", " ")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="street_address">Address</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-6 mx-1 border-l border-gray-300"></div>

        <div className="relative flex-grow">
          <Input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder={`Search hospital by ${searchBy.replace("_", " ")}...`}
            className="w-full px-4 py-2 text-sm border-none focus:outline-none focus-visible:outline-0 focus-visible:ring-0 focus-visible:border-0"
          />

          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 overflow-auto bg-white border border-gray-300 rounded shadow-lg max-h-60">
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

        <button>
          <MdOutlineSearch className="mr-2 text-primary" fontSize={20} />
        </button>
      </div>
    </div>
  );
};

export default HospitalSearchBar;
