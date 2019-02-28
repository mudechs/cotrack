'use strict';

class Settings {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      company: 'required',
      contact_person: 'required',
      address: 'required',
      zip_code: 'required',
      city: 'required',
      country: 'required',
      email: 'required',
      app_name: 'required'
    };
  }

  get messages() {
    return {
      'company.required': 'Pflichteld',
      'contact_person.required': 'Pflichteld',
      'address.required': 'Pflichteld',
      'zip_code.required': 'Pflichteld',
      'city.required': 'Pflichteld',
      'country.required': 'Pflichteld',
      'email.required': 'Pflichteld',
      'app_name.required': 'Pflichteld'
    };
  }
}

module.exports = Settings;
