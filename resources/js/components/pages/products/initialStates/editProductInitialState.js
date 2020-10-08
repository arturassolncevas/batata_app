const initialState = {
  initialForm: {
    category_id: null,
    title: null,
    description: null,
    measurement_unit_id: null,
    price: null,
    quantity: null,
    packed: false,
    max_quantity: null,
    min_quantity: null,
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

  isFetching: true,
  category: {},
  measurementUnits: [],
  attributes: [],
  successfully_submitted: false,
}

exports.initialState = initialState