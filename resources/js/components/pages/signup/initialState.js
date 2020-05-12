const initialState = {
  formInitial: {
    name: '',
    company_name: '',
    email: '',
    country: 'dk',
    phone: '',
    agree_to_be_contacted: false
  },
  errors: {
    general: {
      message: null,
    },
    name: { message: null, status: 'success' },
    company_name: { message: null, status: 'success' },
    email: { message: null, status: 'success' },
    phone: { message: null, status: 'success' },
    agree_to_be_contacted: false
  },
}

exports.initialState = initialState