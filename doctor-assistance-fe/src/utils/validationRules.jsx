const validationRules = {
    name: {
        test: (value) => /^[a-zA-Z]+ [a-zA-Z]+$/.test(value),
        message: "Name must include both first and last name",
    },
    email: {
        test: (value) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value),
        message: "Email is invalid",
    },
    password: {
        test: (value) => value.length >= 8,
        message: "Password must be at least 8 characters long",
    },
    phoneNo: {
        test: (value) => /^\+92 \d{3} \d{7}$/.test(value),
        message: "Phone number must be in the format +92 000 0000000",
    },
    confirmPassword: {
        test: (value, password) => value === password,
        message: "Passwords do not match",
    },
};

export const validateField = (id, value, inputErrors, password = '') => {
    const errors = { ...inputErrors };

    if (validationRules[id]) {
        if (!validationRules[id].test(value, password)) {
            errors[id] = validationRules[id].message;
        } else {
            delete errors[id];
        }
    }
    
    return errors;
};
