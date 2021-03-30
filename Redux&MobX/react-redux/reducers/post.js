const { ADD_POST } = require('../actions/constantAction');
const { produce } = require('immer');

const initialState = [];

const postReducer = (prevState = initialState, action) => {
  return produce(prevState, (draft) => {
    switch (action.type) {
      case ADD_POST:
        draft.push(action.data);
        break;
      default:
        break;
    }
  });
};

module.exports = postReducer;
