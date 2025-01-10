import React from "react";

import { useFetchQuery } from "@/hooks/useFetchQuery";
import { fetchWithAuth } from "@/utils/fetchApis";

const HospitalName = ({ id }) => {
    
    const { data, isFetching, isError } = useFetchQuery({
        url: `hospitals/${id}/`,
        queryKey: [`hospitalNameById-${id}`],
        fetchFunction: fetchWithAuth,
    });

    if (isFetching) return <span>Loading...</span>;
    if (isError) return <span>Error fetching hospital</span>;

    return <span>{data?.name || "Unknown"}</span>;
};

export default HospitalName;
