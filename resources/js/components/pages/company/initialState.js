const initialState = {
  form1EditEnabled: false,
  form2EditEnabled: false,
  form1: {
    company_profile: {
      description: "<p>papa</p>",
      website_url: null,
      facebook_url: null
    }
  },
  form2: {
    company_profile: {
      description: "<p>papa</p>",
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
    }
  },

  error: {
    message: null,
    errors: {
      form1: {
        company_profile: {
          description: null,
          website_url: null,
          facebook_url: null
        }
      },
      form2: {
        company_profile: {
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
        }
      }
    }
  },

  countries: [],
  isFetching: true,
  editEnabled: true,
  fileList: [],
}

exports.initialState = initialState