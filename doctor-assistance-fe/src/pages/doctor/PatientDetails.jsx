import React from "react";
import { useParams } from "react-router-dom";
import { FaRegCalendarAlt } from "react-icons/fa";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";

import { Button } from "@/components/ui/button";

import { calculateAge } from "@/utils/date";
import { fetchWithAuth } from "@/utils/fetchApis";
import { useFetchQuery } from "@/hooks/useFetchQuery";

import Loading from "@/components/shared/Loading";
import AddAllergy from "@/components/dialogs/AddAllergy";

import userIcon from "@/assets/images/webp/userIcon.webp";
import banner from "@/assets/images/webp/profileBanner.webp";
import PatientAllergies from "@/components/consultation/PatientAllergies";
import PatientDetailedConsultations from "@/components/consultation/PatientDetailedConsultations";

export default function PatientDetail() {
  const { id } = useParams();

  const {
    data: patientData,
    isFetching,
    isError,
    error,
  } = useFetchQuery({
    url: `patients/${id}`,
    queryKey: ["patientDetails"],
    fetchFunction: fetchWithAuth,
  });

  if (isFetching) return <Loading />;
  if (isError)
    return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <section className="relative pt-40 pb-6 mx-1">
      <img
        src={banner}
        alt="cover-image"
        className="w-full absolute top-0 left-0 z-0 h-[10rem] object-cover"
      />

      <div className="w-full px-6 mx-auto bg-white max-w-7xl md:px-8 -mt-28">
        <div className="relative z-10 flex items-center justify-center mt-10 mb-5 sm:justify-start lg:mt-0">
          <img
            src={userIcon}
            alt="user-image"
            className="bg-white h-[120px] lg:h-[152px] w-[120px] lg:w-[152px] object-cover border border-gray-300 rounded-full"
          />
        </div>

        <div className="flex flex-col items-center justify-center mb-5 sm:flex-row max-sm:gap-5 sm:justify-between">
          <div>
            <h3 className="mb-1 text-xl font-bold font-manrope text-primary max-sm:text-center">
              {patientData.name}
            </h3>
            <div className="text-sm font-normal text-gray-500 max-sm:text-center">
              <div className="gap-3 lg:flex">
                <p className="flex justify-center text-sm text-gray-600 sm:justify-start">
                  <FaRegCalendarAlt className="mr-1 mt-0.5" />
                  {calculateAge(patientData.date_of_birth)} years old
                </p>
                <div className="flex items-center justify-center mt-2 lg:mt-0 sm:justify-normal">
                  <span className="flex">
                    {patientData.gender === "F" ? (
                      <>
                        <BsGenderFemale className="mt-1 mr-1 text-pink-700" />{" "}
                        Female{" "}
                      </>
                    ) : (
                      <>
                        <BsGenderMale className="mt-1 mr-1 text-blue-700" />{" "}
                        Male{" "}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="mt-4 border-t border-gray-300" />
        <div className="mt-4">
          <div className="flex justify-between mt-2">
            <h2 className="mb-4 font-semibold text-md text-primary">
              Allergies
            </h2>
            <AddAllergy
              triggerElement={<Button className="ml-3">Add Allergy</Button>}
              patientId={id}
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <PatientAllergies patientId={id} />
          </div>
        </div>

        <hr className="mt-8 border-t border-gray-300" />
        <div className="mt-4">
          <h2 className="mb-4 font-semibold text-md text-primary">
            Past Consultations
          </h2>
          <div className="grid grid-cols-1 gap-4 mt-2 lg:grid-cols-2">
            <PatientDetailedConsultations patientId={id} />
          </div>
        </div>
      </div>
    </section>
  );
}
