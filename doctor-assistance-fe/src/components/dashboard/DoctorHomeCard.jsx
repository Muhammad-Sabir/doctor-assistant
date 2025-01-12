import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineArrowForwardIos } from "react-icons/md";

import { Button } from "@/components/ui/button";

import heroImg from "@/assets/images/webp/doctorProfileBanner.webp";

export default function DoctorHomeCards() {
  return (
    <>
      <section className="px-2 pt-2 pb-1">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative w-full md:col-span-2 h-52">
            <div className="flex h-full rounded-md bg-violet-100">
              <div className="flex flex-col justify-center w-full p-5 xl:p-8 md:w-1/2">
                <h3 className="pb-2 text-lg font-bold text-primary">
                  Manage Your Schedule and Availability
                </h3>
                <p className="mb-4 text-sm text-gray-600">
                  Ensure patients know when you are available by managing your
                  schedule.
                </p>
                <Button
                  variant="outline"
                  className="self-start block bg-violet-100"
                >
                  <Link className="flex" to="/doctor/schedule">
                    Go To My Schedule{" "}
                    <MdOutlineArrowForwardIos className="mt-1 ml-1" />
                  </Link>
                </Button>
              </div>
              <div className="relative hidden pr-6 sm:w-full md:w-1/2 sm:block">
                <img
                  src={heroImg}
                  alt="Header tailwind Section"
                  className="object-cover w-full rounded-md h-52"
                />
              </div>
            </div>
          </div>

          <div className="relative hidden w-full h-52 lg:block">
            <div className="flex flex-col justify-center h-full p-5 rounded-md bg-secondary xl:p-8">
              <h3 className="pb-2 text-lg font-bold text-white capitalize">
                Keep Track and Stay Updated on Your Patients
              </h3>
              <p className="mb-4 text-sm font-normal text-white">
                Manage and track your patients' online and in-person seamlessly
                in one place.
              </p>
              <Button
                variant="outline"
                className="self-start block text-white border-white bg-secondary hover:text-white"
              >
                <Link className="flex" to="/doctor/patients">
                  Go to My Patients{" "}
                  <MdOutlineArrowForwardIos className="mt-1 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
