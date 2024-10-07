import React, { useState, useEffect, useRef } from 'react';
import { BiSolidError } from "react-icons/bi";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { fetchApi } from '@/utils/fetchApis';

const SearchField = ({
    placeholder,
    onSelect,
    inputValues,
    setInputError,
    inputErrors,
    labelClassName = '',
    id,
    singleSelect = false
}) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState(inputValues);
    const ref = useRef();

    const handleChange = async (e) => {
        const value = e.target.value;
        setQuery(value);

        const shouldFetch = value && value.length >= 1;
        if (shouldFetch) {
            const fetchedResults = await fetchOptions(value);
            setResults(fetchedResults);
            setIsOpen(true);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    };

    const fetchOptions = async (name) => {
        try {
            const { data } = await fetchApi(`${id}?name=${name}`);
            return data.results || [];
        } catch (error) {
            console.error("Error fetching options:", error);
            return [];
        }
    };

    const handleSelect = (item) => {
        if (singleSelect) {
            setSelectedItems([item]);
            onSelect([item]);
        } else {
            const isAlreadySelected = selectedItems.some(selected => selected.id === item.id);
            if (!isAlreadySelected) {
                const updatedItems = [...selectedItems, item];
                setSelectedItems(updatedItems);
                onSelect(updatedItems);
            }
        }
        setQuery('');
        setIsOpen(false);
    };

    const handleDeselect = (id) => {
        const updatedItems = selectedItems.filter(item => item.id !== id);
        setSelectedItems(updatedItems);
        onSelect(updatedItems);
    };

    useEffect(() => {
        setSelectedItems(inputValues);
    }, [inputValues]);

    const isClickOutside = (ref, target) => {
        return ref.current && !ref.current.contains(target);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isClickOutside(ref, event.target)) {
                setIsOpen(false);
                setQuery('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const hasSelectedItems = () => selectedItems.length > 0;
        if (!hasSelectedItems()) {
            setInputError(prevErrors => ({
                ...prevErrors,
                [id]: "Please select at least one item."
            }));
        } else {
            setInputError(prevErrors => {
                const { [id]: removedError, ...newErrors } = prevErrors;
                return newErrors;
            });
        }
    }, [selectedItems, setInputError, id]);

    return (
        <div className="relative search-field" ref={ref}>
            <div className='grid gap-2'>
                <Label className={labelClassName}>{placeholder}</Label>
                <Input
                    type="text"
                    placeholder={`Search ${placeholder} to select...`}
                    value={query}
                    onChange={handleChange}
                    className={`${inputErrors[id] ? 'border-red-500' : ''}`}
                />
            </div>
            {isOpen && results.length > 0 && (
                <ul className="absolute w-full bg-white border border-gray-300 mt-1 rounded shadow-lg max-h-60 overflow-auto z-10">
                    {results.map((item) => (
                        <li
                            key={item.id}
                            className="p-2 cursor-pointer hover:bg-gray-100"
                            onClick={() => handleSelect(item)}
                        >
                            {item.name}
                        </li>
                    ))}
                </ul>
            )}

            {inputErrors[id] && (
                <div aria-live="assertive" className="flex text-red-500 text-sm mt-2 mb-5">
                    <BiSolidError color='red' className="mr-1 mt-1" /> {inputErrors[id]}
                </div>
            )}

            {selectedItems.length > 0 && (
                <div className={`mt-2 mb-4`}>
                    {selectedItems.map(item => (
                        <span key={item.id} className="m-1 py-1 px-2 bg-accent rounded-md inline-block text-xs font-medium text-primary text-center">
                            {item.name}
                            <button
                                type="button"
                                onClick={() => handleDeselect(item.id)}
                                className="ml-2 text-destructive"
                            >
                                &times;
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchField;
