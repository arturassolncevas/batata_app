const initialState = {
  initialForm: {
    profile: {
      name: null,
      email: null,
      phone: null,
      area_code: "+45",
      language: {
        id: null,
      }
    }
  },

  error: {
    message: null,
    errors: {
      profile: {
        name: null,
        email: null,
        phone: null,
        area_code: null,
        language: {
          id: null
        }
      },
    }
  },

  countries: [],
  languages: [],
  isFetching: true,
  fileList: [],
  editEnabled: false
}

exports.initialState = initialState