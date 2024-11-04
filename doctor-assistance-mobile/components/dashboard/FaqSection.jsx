import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

import faqData from '@/assets/data/faqData';

const FAQSection = () => {
    
    const [faqs, setFaqs] = useState(faqData.slice(0, 3));

    const toggleFAQ = (index) => {
        setFaqs(faqs.map((faq, i) => (i === index ? { ...faq, isOpen: !faq.isOpen } : faq)));
    };

    return (
        <View className='mt-4'>
            {faqs.map((faq, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => toggleFAQ(index)}
                    className={`bg-white rounded-md p-3 mb-5 border`} style={{ borderColor: faq.isOpen ? 'hsl(203, 87%, 30%)' : '#D1D1D1' }}
                >
                    <View className="flex-row justify-between items-center">
                        <Text className="text-base text-gray-700">{faq.question}</Text>
                        {faq.isOpen ? (
                            <ChevronUp size={20} color="hsl(203, 87%, 30%)" />
                        ) : (
                            <ChevronDown size={20} color="gray" />
                        )}
                    </View>
                    {faq.isOpen && <Text className="text-base text-gray-500 mt-2">{faq.answer}</Text>}
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default FAQSection;
