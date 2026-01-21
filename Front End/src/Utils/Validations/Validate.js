import { kRegExpEmail, kRegExpPassword, kRegExpPhone, kRegExpUserName } from './Constants';

function isEmpty(str) {
  return !str || str.length === 0;
}

class Validators {
  
  static noValidator() {
    return null;
  }

  static checkBox(name, value) {
    if (!value) {
      return { error:`Please ${name} proceed`, [`${name}`]:true};
    }
    return null;
  }

  static addressValidator(name, label, zip, city) {
    if (isEmpty(label) || isEmpty(zip) || isEmpty(city)) {
      return `Not valid ${name}, Select the address from the drop-down list`;
    }
    return null;
  }

  static nullValidator(name, value) {
    if (isEmpty(value)) {
      return { error:`${name} is required`, [`${name}`]:true}
    }
    return null;
  }

  static selectValidator(name, value) {
    if (isEmpty(value)) {
      return `${name} must be selected`;
    }
    return null;
  }

  static lengthValidator(name, value, length) {
    if (isEmpty(value)) {
      return `${name} can not be empty`;
    }

    if (String(value).length < length) {
      return `${name} cannot be less than ${length} characters`;
    }

    return null;
  }

  static emailValidator(name, value) {
    
    if (isEmpty(value)) {
      return { error:`${name} is required`, [`${name}`]:true}
    }
    
    

    const regexMatch = value.match(kRegExpEmail);

    if (!regexMatch) {
      return { error:`Your ${name} is Invalid`, [`${name}`]:true};
    }

    return null;
  }

  static passwordValidator(name, value) {
    if (isEmpty(value)) {
      return { error:`Your ${name} is Invalid`, [`${name}`]:true};
      return `${name} can not be empty`;
    }

    const regexMatch = value.match(kRegExpPassword);

    if (!regexMatch) {
      return `${name} must be 8 characters and include uppercase, lowercase, special characters and numbers`;
    }

    return null;
  }

  static phoneNoValidator(name, value) {
    if (isEmpty(value)) {
      return `${name} can not be empty`;
    }

    const regexMatch = value.match(kRegExpPhone);

    if (!regexMatch) {
      return `${name} is invalid`;
    }

    return null;
  }

  static userNameValidator(name, value) {
    if (isEmpty(value)) {
      return `${name} can not be empty`;
    }

    const regexMatch = value.match(kRegExpUserName);

    if (!regexMatch) {
      return `${name} can only contain letters, numbers or an underscore`;
    }

    return null;
  }

  static moneyValidator(name, value) {
    if (isEmpty(value)) {
      return `${name} can not be empty`;
    }

    if (parseInt(value) > 10000) {
      return `${name} cannot be greater than 10000`;
    }

    return null;
  }
}

function formValidator(data, objsArr) {
  for (let i = 0; i < objsArr.length; i++) {
    const objDataValidationError = objsArr[i].validationFunction
      ? objsArr[i].validationFunction()
      : Validators.nullValidator(objsArr[i].name, data.get(objsArr[i].name));

    if (objDataValidationError) {
      return {
        ...objDataValidationError,
        validation:false
      };
    }
  }

  return true;
}

export { formValidator, Validators };

