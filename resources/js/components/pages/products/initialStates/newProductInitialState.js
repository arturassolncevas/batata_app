const initialState = {
  initialForm: {
    category_id: null,
    title: "Title",
    description: "Description",
    measurement_unit_id: null,
    price: null,
    quantity: 1,
    packed: false,
    quantity_in_stock: null,
    product_attributes: [],
    title: null,
    description: null
  },

  error: {
    message: null,
    errors: {
      price: null,
      min_quantity: null,
      max_quantity: null,
      quantity: null,
      measurement_unit_id: null,
      product_attributes: [],
      title: null,
      description: null
    }
  },

  wizardStep: 1,
  isFetching: true,
  category: {},
  measurementUnits: [],
  attributes: [],
  successfully_submitted: false,
}

exports.initialState = initialState