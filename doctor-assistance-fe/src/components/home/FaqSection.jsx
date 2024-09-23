import React, { useState } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

import faqImage from '@/assets/images/webp/faq.webp';
import Subtitle from '@/components/shared/Subtitle';

const FAQs = [
    {
        question: 'How to create an account?',
        answer: 'To create an account, find the "Sign up", fill out the registration form, and "Sign up." Verify your email address if needed, and then log in to start using the platform.',
    },
    {
        question: 'How do I book an appointment',
        answer: 'To book an appointment, login and simply select a doctor from our list, choose a date and time that works for you, and follow the prompts to confirm your booking.',
    },
    {
        question: 'How can I reset my password?',
        answer: 'If you forgot your password, you can reset it by clicking on the "Forgot Password?" link on the login page and following the instructions sent to your email.',
    }
];

const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-8 lg:py-14 section-padding">
            <div className="flex flex-col justify-center items-center gap-7 gap-y-5 xl:gap-10 lg:flex-row lg:justify-between">

                <div className="w-full lg:w-1/2 order-2 lg:order-none">
                    <img
                        src={faqImage}
                        alt="Faq image"
                        className="object-cover rounded-xl"
                    />
                </div>

                <div className="w-full lg:w-1/2">
                    <div className="text-center lg:text-start lg:max-w-xl">

                        <Subtitle subtitle="FAQ's" />
                        <h2 className="text-primary text-4xl font-bold mb-4 leading-normal mt-3">
                            Frequently Asked Questions
                        </h2>

                        <div>
                            {FAQs.map((faq, index) => (
                                <div className="py-4 border-b border-solid border-gray-200" key={index}>
                                    <button className={`inline-flex items-center justify-between text-md font-normal leading-8 w-full transition duration-500 
                                        ${openIndex === index ? 'text-primary' : 'text-gray-600'} hover:text-primary`}
                                        onClick={() => toggleAccordion(index)}
                                    >
                                        <h5>{faq.question}</h5>
                                        <MdKeyboardArrowDown className={`transition duration-500 group-hover:text-primary ${openIndex === index ? 'rotate-180 text-primary' : 'text-gray-600 '}`} size={22} />
                                    </button>
                                    {openIndex === index && (
                                        <div className="w-full text-left">
                                            <p className="text-md font-normal text-gray-600">{faq.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
};

export default FaqSection;
