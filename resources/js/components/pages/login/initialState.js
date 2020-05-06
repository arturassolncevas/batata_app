const initialState = {
    formInitial: {
        email: '',
        password: ''
    },
    errors: {
        name: {
            message: null,
            status: "success"
        }
    },
    generalError: {
        message: null,
    },
}

exports.initialState = initialState