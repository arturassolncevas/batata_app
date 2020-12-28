const initialState = {
  initialForm: {
    company: {
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
      }
    }
  },

  countries: [],
  isFetching: true,
  editEnabled: true,
  fileList: [],
}

exports.initialState = initialState