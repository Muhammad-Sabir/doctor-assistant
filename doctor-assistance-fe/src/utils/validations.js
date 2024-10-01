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
    doctorBirthDate: {
        test: (value) => {
            if (!isDateSelected(value)) {
                validationRules.doctorBirthDate.message = "Please select date of birth.";
                return false;
            }
            if (!isDateValid(value, 20)) {
                validationRules.doctorBirthDate.message = "You must be at least 20 years old";
                return false;
            }
            validationRules.doctorBirthDate.message = "";
            return true;
        },
    },
    birthDate: {
        test: (value) => {
            if (!isDateSelected(value)) {
                validationRules.birthDate.message = "Please select date of birth.";
                return false;
            }
            if (!isDateValid(value, 13)) {
                validationRules.birthDate.message = "You must be at least 13 years old";
                return false;
            }
            validationRules.birthDate.message = "";
            return true;
        },
    },
    registrationNo: {
        test: (value) => /^[A-Z0-9]{5,}$/i.test(value),
        message: "PMDC Registration No. must be valid",
    },
    picture: {
        test: (file) => {
            const maxFileSize = 2 * 1024 * 1024;
            const allowedFileTypes = ['image/jpeg', 'image/png', 'image/webp'];

            if (!file) return true;
            if (!allowedFileTypes.includes(file.type)) return false;
            if (file.size > maxFileSize) return false;
            return true;
        },
        message: "Image must be a JPEG, PNG, or WEBP and less than 2MB",
    },
    gender: {
        test: (value) => value === 'M' || value === 'F',
        message: "Please select your gender",
    },
    experience: {
        test: (value) => {
            if (!isDateSelected(value)) {
                validationRules.experience.message = "Please select date of experience.";
                return false;
            }
            if (!isDateValid(value,1)) {
                validationRules.experience.message = "At least 1 year experience required.";
                return false;
            }
            validationRules.experience.message = "";
            return true;
        },
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

const isDateSelected = (value) => value !== "none" && value !== "";

const isDateValid = (value, minYears) => {
    const diff = new Date().getFullYear() - new Date(value).getFullYear();
    return diff > minYears || (diff === minYears && new Date().getMonth() >= new Date(value).getMonth());
};
