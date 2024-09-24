import { FaUserDoctor, FaNotesMedical } from 'react-icons/fa6';
import { FaLaptopHouse, FaUserEdit, FaFileMedical, FaMicrophoneAlt, FaUsersCog } from "react-icons/fa";

export const doctorFeatures = [
    {
        icon: <FaMicrophoneAlt size={30} />,
        title: "Transcription Services",
        description: "Efficiently record and transcribe consultations for ease.",
    },
    {
        icon: <FaFileMedical size={30} />,
        title: "Automated Notes",
        description: "Automatically generate and manage SOAP notes and prescriptions.",
    },
    {
        icon: <FaUsersCog size={30} />,
        title: "Manage Consultations",
        description: "Schedule, reschedule, or cancel appointments with ease.",
    },
    {
        icon: <FaUserEdit size={30} />,
        title: "Manage Profile ",
        description: "Easily update and manage your profile information.",
    },
];

export const patientFeatures = [
    {
        icon: <FaUserDoctor size={30} />,
        title: "Find Doctors",
        description: "Find healthcare providers by specialty, location, and symptoms.",
    },
    {
        icon: <FaLaptopHouse size={30} />,
        title: "Book Consultations",
        description: "Easily schedule consultations online or visit clinics in person.",
    },
    {
        icon: <FaUserEdit size={30} />,
        title: "Manage Profile ",
        description: "Easily update and manage your profile information.",
    },
    {
        icon: <FaNotesMedical size={30} />,
        title: "Consultation History",
        description: "Review past consultations and notes anytime for informed follow-ups.",
    },
];