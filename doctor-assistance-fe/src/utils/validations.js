const validationRules = {
    name: {
        test: (value) => /^[a-zA-Z]+( [a-zA-Z]+)+$/.test(value),
        message: "Name must include both first and last name",
    },
    username: {
        test: (value) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value) || /^(?:\+92|0)?\d{10}$/.test(value),
        message: "Username must be a valid email or phone number",
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
        test: (value) => /^(?:\+92|0)?\d{10}$/.test(value),
        message: "Phone number must be in the format '+923039916210' or '03039916210'.",
    },    
    confirmPassword: {
        test: (value, password) => value === password,
        message: "Passwords do not match",
    },
    age: {
        test: (value) => value > 24,
        message: "Age must be greater than 24",
    },
    specialization: {
        test: (value) => value !== "none" && value !== "",
        message: "Specialization is required",
    },
    degree: {
        test: (value) => value?.trim() && /^([A-Z]+(\([A-Z][a-z]*\))?(,\s?[A-Z]+(\([A-Z][a-z]*\))?)*?)$/.test(value.trim()),
        message: "Degree must be uppercase, with optional country or specialization, separated by commas.",
    },
    registrationNo: {
        test: (value) => /^[A-Z0-9]{5,}$/i.test(value),
        message: "PMDC Registration No. must be valid",
    },
    experience: {
        test: (value) => value !== '' && value >= 0,
        message: "Experience cannot be negative or empty",
    },
    designation: {
        test: (value) => value.trim() !== "",
        message: "Designation is required",
    },
}

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

export const hasNoFieldErrors = (inputErrors) => {
    return Object.keys(inputErrors).length === 0;
};
