import { Validators, formValidator } from "./Validate";

function AddPatientDemographicsValid(data) {

  const valArr = [
    {
      validationFunction: () =>
        Validators.nullValidator("firstName", data["firstName"]),
    },
    {
      validationFunction: () =>
        Validators.nullValidator("lastName", data["lastName"]),
    },
    {
      validationFunction: () =>
        Validators.nullValidator("dateOfBirth", data["dateOfBirth"]),
    },
    {
      validationFunction: () => Validators.checkBox("gender", data["gender"]),
    },
    {
      validationFunction: () =>
        Validators.checkBox("patientType", data["patientType"]),
    },
    {
      validationFunction: () =>
        Validators.nullValidator("address1", data["address1"]),
    },
    {
      validationFunction: () =>
        Validators.nullValidator("zipCode", data["zipCode"]),
    },
    {
      validationFunction: () => Validators.nullValidator("city", data["city"]),
    },
    {
      validationFunction: () =>
        Validators.nullValidator("state", data["state"]),
    },
    {
      validationFunction: () =>
        Validators.nullValidator("country", data["country"]),
    },
    {
      validationFunction: () =>
        Validators.nullValidator("county", data["county"]),
    },
    {
      validationFunction: () =>
        Validators.nullValidator("mobile", data["mobile"]),
    },
    {
      validationFunction: () =>
        Validators.emailValidator("email", data["email"]),
    },
  ];

  const validated = formValidator(data, valArr);
  return validated;
}

function ValidateFacility(data) {

  const valArr = [
    {
      validationFunction: () =>
        Validators.nullValidator("firstName", data["firstName"]),
    },
    {
      validationFunction: () =>
        Validators.nullValidator("lastName", data["lastName"]),
    },
  ];
  const validated = formValidator(data, valArr);
  return validated;
}

// function login(data) {
//   const valArr = [
//     {
//       validationFunction: () => Validators.emailValidator('Email', data.get('Email')),
//     },
//     {
//       validationFunction: () => Validators.lengthValidator('Password', data.get('Password'), 8),
//     },
//   ];

//   const validated = formValidator(data, valArr);

//   return validated;
// }

// function clientRegister(data) {
//   const valArr = [
//     {
//       validationFunction: () => Validators.emailValidator('Email', data.get('Email')),
//     },
//     {
//       validationFunction: () => Validators.lengthValidator('Password', data.get('Password'), 8),
//     },
//   ];

//   const validated = formValidator(data, valArr);

//   return validated;
// }

// function clientVerifyEmail(data) {
//   const valArr = [
//     {
//       validationFunction: () => Validators.lengthValidator('Verification Code', data.get('Verification Code'), 6),
//     },
//   ];

//   const validated = formValidator(data, valArr);

//   return validated;
// }

// function clientCreateAccount(data) {
//   const valArr = [
//     {
//       name: 'Full Name',
//     },
//   ];

//   const validated = formValidator(data, valArr);

//   return validated;
// }

// function tailorRegister(data) {
//   const valArr = [
//     {
//       validationFunction: () => Validators.emailValidator('Email', data.get('Email')),
//     },
//     {
//       validationFunction: () => Validators.lengthValidator('Password', data.get('Password'), 8),
//     },
//   ];

//   const validated = formValidator(data, valArr);

//   return validated;
// }

// function tailorVerifyEmail(data) {
//   const valArr = [
//     {
//       validationFunction: () => Validators.lengthValidator('Verification Code', data.get('Verification Code'), 6),
//     },
//   ];

//   const validated = formValidator(data, valArr);

//   return validated;
// }

// function tailorCreateAccount(data) {
//   const valArr = [
//     {
//       name: 'Name',
//     },
//     {
//       name: 'Phone No',
//     },
//   ];

//   const validated = formValidator(data, valArr);

//   return validated;
// }

// function parseAdBasicSection(data) {
//   
//   const valArr = [
//     {
//       validationFunction: () => Validators.selectValidator("Gender", data["gender"]),
//     },
//     {
//       validationFunction: () => Validators.selectValidator('Category', data['category']),
//     },
//     {
//       validationFunction: () => Validators.nullValidator('Name', data['name']),
//     },
//     {
//       validationFunction: () => Validators.selectValidator('Cut', data['cut']),
//     },
//     {
//       validationFunction: () => Validators.selectValidator('Color', data['color']),
//     },
//     {
//       validationFunction: () => Validators.selectValidator('Fabric', data['fabric']),
//     },
//     {
//       validationFunction: () => Validators.selectValidator('Fabric Type', data['fabric_type']),
//     },
//     {
//       validationFunction: () =>
//         data['fabric_type'] == 'Patterned Fabric'
//           ? Validators.selectValidator('Fabric description', data['fabric_description'])
//           : '',
//     },
//     // {
//     //   validationFunction: () => Validators.checkBox('accept policies', data['create_catalog_after_completion']),
//     // },
//   ];

//   if (data['cut']) {
//     valArr.push({
//       validationFunction: () => Validators.nullValidator('Size', data['cut']),
//     });
//   } else {
//     if (data['measurements'].type == 'static') {
//       valArr.push({
//         validationFunction: () => Validators.nullValidator('Measurements', data['measurements'].value),
//       });
//     }
//   }

//   const validated = formValidator(null, valArr);

//   return validated;
// }

// function parseAdDeliverySection(data) {
//   const valArr = [
//     {
//       validationFunction: () =>
//         Validators.addressValidator('Delivery Address', data.address['label'], data.address['zip'], data.address['city']),
//     },
//     {
//       validationFunction: () => Validators.selectValidator('Delivery Date', data['date']),
//     },
//   ];

//   const validated = formValidator(null, valArr);

//   return validated;
// }

// function parseAdNotesSection(data) {
//   
//   const valArr = [
//     {
//       validationFunction: () =>
//         Validators.selectValidator("Choose Method", data["type"]),
//     },
//     {
//       validationFunction: () => Validators.moneyValidator("Minimum Price", data["min_price"]),
//     },
//     {
//       validationFunction: () => Validators.checkBox('accept terms and condition', data['terms_conditions']),
//     },
//     {
//       validationFunction: () => Validators.moneyValidator('Maximum Price', data['max_price']),
//     },
//   ];

//   const validated = formValidator(null, valArr);

//   return validated;
// }

// function sendQuote(data) {
//   const valArr = [
//     {
//       validationFunction: () => Validators.moneyValidator('Price', data['price']),
//     },
//     {
//       validationFunction: () => Validators.nullValidator('Description', data['description']),
//     },
//   ];

//   const validated = formValidator(null, valArr);

//   return validated;
// }

// function tailorCreateCatalog(data) {
//   const valArr = [
//     {
//       validationFunction: () => Validators.nullValidator('Name', data['name']),
//     },
//      {
//        validationFunction: () => Validators.selectValidator("Gender", data["gender"]),
//      },
//     // {
//     //   validationFunction: () => Validators.selectValidator('Category', data['category']),
//     // },
//     {
//       validationFunction: () => Validators.moneyValidator('Price', data['price']),
//     },
//     {
//       validationFunction: () => Validators.nullValidator('Description', data['description']),
//     },
//   ];

//   const validated = formValidator(null, valArr);

//   return validated;
// }

// function tailorEditProfile(data) {
//   const valArr = [
//     {
//       validationFunction: () => Validators.nullValidator('Phone', data['phone']),
//     },
//   ];

//   const validated = formValidator(data, valArr);

//   return validated;
// }

// function clientEditProfile(data) {
//   const valArr = [
//     {
//       validationFunction: () => Validators.nullValidator('Phone', data['phone']),
//     },
//   ];

//   const validated = formValidator(data, valArr);

//   return validated;
// }

// function tailorCompleteOrder(data) {
//   const valArr = [
//     {
//       validationFunction: () =>
//         Validators.nullValidator("Rating", data["rating"]),
//     },
//     {
//       validationFunction: () => Validators.nullValidator('Details', data['details']),
//     },
//   ];

//   const validated = formValidator(null, valArr);

//   return validated;
// }

// function clientFeedbackOrder(data) {
//   const valArr = [
//     {
//       validationFunction: () =>
//         Validators.nullValidator("Rating", data["rating"]),
//     },
//     {
//       validationFunction: () => Validators.nullValidator('Details', data['details']),
//     },
//   ];

//   const validated = formValidator(null, valArr);

//   return validated;
// }

// function parseMeasurementCircumferenceSection(data) {
//   const valArr = [
//     {
//       validationFunction: () => Validators.nullValidator('Arm', data['arm']),
//     },
//     {
//       validationFunction: () => Validators.nullValidator('Chest', data['chest']),
//     },
//     {
//       validationFunction: () => Validators.nullValidator('Waist', data['waist']),
//     },
//     {
//       validationFunction: () => Validators.nullValidator('Hip', data['hip']),
//     },
//     {
//       validationFunction: () => Validators.nullValidator('Thigh', data['thigh']),
//     },
//     {
//       validationFunction: () => Validators.nullValidator('Calf', data['calf']),
//     },
//     {
//       validationFunction: () => Validators.nullValidator('Ankle', data['ankle']),
//     },
//   ];

//   const validated = formValidator(null, valArr);

//   return validated;
// }

// function parseMeasurementLengthSection(data) {
//   const valArr = [
//     {
//       validationFunction: () => Validators.nullValidator('Head to floor height', data['head_to_floor']),
//     },
//     {
//       validationFunction: () => Validators.nullValidator('From shoulder to floot', data['shoulder_to_floor']),
//     },
//     {
//       validationFunction: () => Validators.nullValidator('From waist to floor', data['waist_to_floor']),
//     },
//     {
//       validationFunction: () => Validators.nullValidator('Arm length', data['arm_length']),
//     },
//     {
//       validationFunction: () => Validators.nullValidator('Leg length', data['leg_length']),
//     },
//   ];

//   const validated = formValidator(null, valArr);

//   return validated;
// }

// function clientContactSupportOrder(data) {
//   const valArr = [
//     {
//       validationFunction: () => Validators.nullValidator('Reason', data['reason']),
//     },
//     {
//       validationFunction: () => Validators.nullValidator('Details', data['details']),
//     },
//   ];

//   const validated = formValidator(null, valArr);

//   return validated;
// }

// function tailorContactSupportOrder(data) {
//   const valArr = [
//     {
//       validationFunction: () => Validators.nullValidator('Reason', data['reason']),
//     },
//     {
//       validationFunction: () => Validators.nullValidator('Details', data['details']),
//     },
//   ];

//   const validated = formValidator(null, valArr);

//   return validated;
// }

export { AddPatientDemographicsValid, ValidateFacility };

