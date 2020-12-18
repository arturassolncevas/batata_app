const initialState = {
  initialForm: {
    user: {
      name: null,
      email: null,
      password: null,
      repeat_password: null
    },
    company: {
      name: null,
      local_code: "",
      type: null,
      address: {
        email: null,
        address_1: null,
        city: null,
        email: null,
        phone: null,
        zipcode: null,
        country: {
          id: null
        }
      }
    },
    accept_terms_and_conditions: false,
    recaptcha_value: null,
  },

  error: {
    message: null,
    errors: {
      user: {
        name: null,
        email: null,
        password: null,
        repeat_password: null
      },
      company: {
        local_code: null,
        name: null,
        email: null,
        type: null,
        address: {
          phone: null,
          address_1: null,
          zipcode: null,
          city: null,
          country: {
            id: null,
          }
        }

      },
      name: null,
      company_name: null,
      email: null,
      country_id: null,
      area_code_country_id: null,
      phone: null,
      accept_terms_and_conditions: false
    }
  },

  countries: [],
  country: { id: '', area_code: '' },
  isFetching: true,
  successfully_submitted: false,
  recaptcha_value: null,
}

exports.initialState = initialState