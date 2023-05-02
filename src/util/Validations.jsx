
export const isValidEmail = (email) => {
    const validEmailRegex = RegExp(/^[a-zA-Z0-9+.]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/)
    return validEmailRegex.test(email);
}

export const isFieldEmpty = (field) => {
    return (!field || field?.trim().length === 0)
}
export const isSelectEmpty = (field) => {
    return (Object.keys(field)?.length === 0)
}

export const validatedigitsRegExp = (value) => {
    let re = /^\s*\d+$/;
    return re.test(value);
}

export const skuRegex = /^[A-Z]{3}-[0-9]{5}$/;
export const uppercaseRegExp = /(?=.*?[A-Z])/;
export const lowercaseRegExp = /(?=.*?[a-z])/;
export const digitsRegExp = /(?=.*?\d)/;
export const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
export const minLengthRegExp = /.{8,}/;
export const whiteSpaceValidation = (str) => {
    const validEmailRegex = RegExp('^[a-zA-Z0-9_]*$')
    return validEmailRegex.test(str);
}

export const validateName = (name) => {
    let re = /^[a-zA-Z ]{3,30}$/;
    return re.test(String(name).toLowerCase());
}
export const validateMaxName = (name) => {
    let re = /^[a-zA-Z ]{4,150}$/;
    return re.test(String(name).toLowerCase());
}
export const validateNameLength=(name)=>{
    let re=/^(?=.{0,30}$)([-'\w]+\s)*[-'\w]+$/;
    return re.test(name)
}
export const validateMaxProduct = (name) => {
    let re = /^[a-zA-Z ]{4,50}$/;
    return re.test(String(name).toLowerCase());
}
export const validateSku = (name) => {
    let re = /^[a-zA-Z0-9\s,.'-]{4,50}$/;
    return re.test(name);
}
export const validateMaxAddress = (name) => {
    let re = /^[a-zA-Z0-9\s,.'-]{4,200}$/;
    return re.test(name);
}
export const validateMobileNumnber = (number) => {
    let re = /^(\+91[\-\s]?)?[0]?(91)?[789654321]\d{9}$/;
    return re.test(number);
}
export const validateZeroNumber=(number)=>{
    let re =/[1-9][0-9]*$/;
    return re.test(number)
}
export const validateuppercaseRegExp = (name) => {
    let re = /(?=.*?[A-Z])/;
    return re.test(String(name));
}
export const validatelowercaseRegExp = (name) => {
    let re = /(?=.*?[a-z])/;
    return re.test(String(name));
}

export const validatespecialCharRegExp = (name) => {
    let re = /(?=.*?[#?!@$%^&*-])/;
    return re.test(name);
}
export const validateminLengthRegExp = (name) => {
    let re = /.{5,}/;
    return re.test(name);
}
export const validateminLength = (name) => {
    let re = /.{4,}/;
    return re.test(name);
}
export const validateminserverLengthRegExp = (name) => {
    let re = /.{3,}/;
    return re.test(name);
}
export const validateminLengthReg = (name) => {
    let re = /.{4,}/;
    return re.test(name);
}
export const validatemaxLengthZipReg = (name) => {
    let re = /^.{50,}$/;
    return re.test(name);
}
export const validatemaxLength = (name) => {
    let re = /^.{200,}$/;
    return re.test(name);
}
export const validatemaxLengthZipRegExp = (name) => {
    let re = /^.{10,}$/;
    return re.test(name);
}
export const validatemaxLengthNumeberRegExp = (name) => {
    let re = /^.{10,}$/;
    return re.test(name);
}
export const checkPercentage = (field) => {
    return (Math.ceil(field) > 100)
}


export const ContactValidation = (validationObj, fieldArray) => {
    let validationError = {}
    for (const [key, value] of Object.entries(validationObj)) {
        switch (key) {
            case fieldArray[0]:
                if (isFieldEmpty(value)) {
                    validationError[key] = "Please enter the name"
                    break;
                }else if(!validateNameLength(value)){
                    validationError[key] = "Please enter the valid name"
                    break;
                } else {
                    validationError[key] = '';
                    break;
                }
            case fieldArray[1]:
                if (isFieldEmpty(value) || !isValidEmail(value)) {
                    validationError[key] = "Please enter the email"
                    break;
                } else {
                    validationError[key] = ''
                    break;
                }
            case fieldArray[2]:
                if (isFieldEmpty(value) || !validateMobileNumnber(value)) {
                    validationError[key] = "Please enter the valid phone number"
                    break;
                } else {
                    validationError[key] = ''
                    break;
                }
            case fieldArray[3]:
            if (isFieldEmpty(value) || !validateminLength(value)) {
                validationError[key] = "Please enter the valid address"
                break;
            } else if (validatemaxLength(value)) {
                validationError[key] = "Please enter the valid address"
                break;
            } else {
                validationError[key] = ''
                break;
            }
            default:
                break;
        }
    }
    return validationError;
}

export const PartyOrderValidation = (validationObj, fieldArray) => {
    let validationError = {}
    for (const [key, value] of Object.entries(validationObj)) {
        switch (key) {
            case fieldArray[0]:
                if (isFieldEmpty(value)) {
                    validationError[key] = "Please enter the name"
                    break;
                }else if(!validateNameLength(value)){
                    validationError[key] = "Please enter the valid name"
                    break;
                } else {
                    validationError[key] = '';
                    break;
                }
            case fieldArray[1]:
                if (isFieldEmpty(value) || !isValidEmail(value)) {
                    validationError[key] = "Please enter the email"
                    break;
                } else {
                    validationError[key] = ''
                    break;
                }
            case fieldArray[2]:
                if (isFieldEmpty(value) || !validateMobileNumnber(value)) {
                    validationError[key] = "Please enter the valid phone number"
                    break;
                } else {
                    validationError[key] = ''
                    break;
                }
            case fieldArray[3]:
            if (isFieldEmpty(value) || !validateminLength(value)) {
                validationError[key] = "Please enter the valid instruction"
                break;
            } else if (validatemaxLength(value)) {
                validationError[key] = "Please enter the valid instruction"
                break;
            } else {
                validationError[key] = ''
                break;
            }
            default:
                break;
        }
    }
    return validationError;
}

export const RefundValidation = (validationObj, fieldArray) => {
    let validationError = {}
    for (const [key, value] of Object.entries(validationObj)) {
        switch (key) {
            case fieldArray[0]:
                if (isFieldEmpty(value)) {
                    validationError[key] = "Please enter the order Id"
                    break;
                } else {
                    validationError[key] = '';
                    break;
                }
            case fieldArray[1]:
                if (isFieldEmpty(value) || !isValidEmail(value)) {
                    validationError[key] = "Please enter the email"
                    break;
                } else {
                    validationError[key] = ''
                    break;
                }
            case fieldArray[2]:
                if (isFieldEmpty(value) || !validateminLength(value)) {
                    validationError[key] = "Please enter the valid cancellation reason"
                    break;
                } else if (validatemaxLength(value)) {
                    validationError[key] = "Please enter the valid cancellation reason"
                    break;
                } else {
                    validationError[key] = ''
                    break;
                }
            default:
                break;
        }
    }
    return validationError;
}
