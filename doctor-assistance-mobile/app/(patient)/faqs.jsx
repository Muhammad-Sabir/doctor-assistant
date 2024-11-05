import React, { useState } from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

import { HeaderBackButton } from '@/components/ui/HeaderBackButton';
import CustomKeyboardView from '@/components/ui/CustomKeyboardView';
import faqData from '@/assets/data/faqData';

const FAQs = () => {

    const screenWidth = Dimensions.get('window').width;

    const [faqs, setFaqs] = useState(faqData);

    const toggleFAQ = (index) => {
        setFaqs(faqs.map((faq, i) => (i === index ? { ...faq, isOpen: !faq.isOpen } : faq)));
    };

    return (
        <>
            <View className="border border-r-0 border-t-0 border-l-0 border-gray-300 flex-row justify-between items-center bg-white p-4 rounded-b z-1" style={{ height: screenWidth * 0.14, marginTop: screenWidth * 0.09 }}>
                <HeaderBackButton />
                <Text className="text-xl font-semibold text-primary flex-1 text-center">Frequently Asked Questions</Text>
            </View>
            <CustomKeyboardView>
                <View className='flex-1 px-5 py-5 bg-white'>
                    {faqs.map((faq, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => toggleFAQ(index)}
                            className={`bg-white rounded-md p-3 mb-5 border`} style={{ borderColor: faq.isOpen ? 'hsl(203, 87%, 30%)' : '#D1D1D1'}}
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
            </CustomKeyboardView>
        </>
    );
};

export default FAQs;
