const initialState = {
  form1EditEnabled: false,
  form2EditEnabled: false,
  form: {
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
      },
      website_url: null,
      facebook_url: null,
      description: "",
    }
  },

  error: {
    message: null,
    errors: {
      form: {
        company_profile: {
          name: null,
          website_url: null,
          facebook_url: null,
          description: null,
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
  formEditEnabled: true,
  profileImageList: [],
  featureImageList: [],
  company_id: null,
}

exports.initialState = initialState