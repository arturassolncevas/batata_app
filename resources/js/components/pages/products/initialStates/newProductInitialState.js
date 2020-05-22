const initialState = {
  initialForm: { },

  error: {
    message: null,
    errors: { }
  },

  types: [],
  isFetching: true,
  searchOptions: [],
  successfully_submitted: false,
  selectedCategoryChain: [],
  selectedSearchValue: null
}

exports.initialState = initialState