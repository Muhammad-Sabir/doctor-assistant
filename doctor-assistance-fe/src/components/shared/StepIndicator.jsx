import React from 'react';

const StepIndicator = () => {
    const currentStep = parseInt(sessionStorage.getItem('currentStep')) || 1;

    const stepNames = {
        1: 'Enter your Personal Info',
        2: 'Enter your Education Details',
        3: 'Enter your Work Details',
        4: 'Enter your Professional Details'
    };

    const getStepName = (step) => {
        return stepNames[step] || 'Unknown Step';
    };

    return (
        <div className='-mt-3'>
            <p className="text-sm font-semibold mb-2">Step {currentStep}: {getStepName(currentStep)}</p>
            <div className="flex gap-2">
                {[...Array(4)].map((_, index) => {
                    const stepNumber = index + 1;
                    const isCurrentStep = stepNumber === currentStep;
                    const isCompletedStep = stepNumber < currentStep;
                    const bgColor = isCompletedStep ? 'bg-accent' : isCurrentStep ? 'bg-primary' : 'bg-gray-300';

                    return (
                        <div
                            key={index}
                            className={`h-2 w-[33.33%] rounded ${bgColor}`}
                        ></div>
                    );
                })}
            </div>
        </div>
    );
};

export default StepIndicator;