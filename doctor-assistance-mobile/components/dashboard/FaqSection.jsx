import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

const FAQSection = () => {
    const [faqs, setFaqs] = useState([
        { question: 'How do I book an appointment?', answer: 'Find Doctor and select online or physical appointment.', isOpen: false },
        { question: 'Can I reschedule or cancel my appointment?', answer: 'Yes, you can cancel or reshedule your appointment before it gets approved.', isOpen: false },
        { question: 'Is my information safe?', answer: 'Yes, we follow security policies to protect your information.', isOpen: false },
    ]);

    const toggleFAQ = (index) => {
        setFaqs(faqs.map((faq, i) => (i === index ? { ...faq, isOpen: !faq.isOpen } : faq)));
    };

    return (
        <View>
            {faqs.map((faq, index) => (
                <TouchableOpacity 
                    key={index} 
                    onPress={() => toggleFAQ(index)} 
                    className="bg-gray-100 rounded-lg p-3 mt-3 border-b border-gray-300"
                >
                    <View className="flex-row justify-between items-center">
                        <Text className="text-base text-gray-700">{faq.question}</Text>
                        {faq.isOpen ? (
                            <ChevronUp size={20} color="#007AFF" />
                        ) : (
                            <ChevronDown size={20} color="#A0A0A0" />
                        )}
                    </View>
                    {faq.isOpen && <Text className="text-sm text-gray-600 mt-2">{faq.answer}</Text>}
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default FAQSection;
