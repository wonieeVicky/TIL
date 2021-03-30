const { createStore } = require('redux');

const initialState = {
  user: null,
  posts: [],
};

const reducer = (prevState, action) => {
  switch (action.type) {
    case 'LOG_IN':
      return {
        ...prevState,
        user: action.data,
      };
    case 'LOG_OUT':
      return {
        ...prevState,
        user: null,
      };
    case 'ADD_POST':
      return {
        ...prevState,
        posts: [...prevState.posts, action.data],
      };
    default:
      return prevState;
  }
};

const store = createStore(reducer, initialState);

store.subscribe(() => {
  console.log('changed!');
});

console.log(store.getState()); // { user: null, posts: [] }

// -------------------------------------------------------

// action
const logIn = (data) => ({ type: 'LOG_IN', data });
const logOut = () => ({ type: 'LOG_OUT' });
const addPost = (data) => ({ type: 'ADD_POST', data });

store.dispatch(logIn({ id: 1, name: 'vicky', admin: true }));
store.dispatch(addPost({ userId: 1, id: 1, content: 'hi redux!' }));
store.dispatch(addPost({ userId: 1, id: 2, content: 'seconds redux :)' }));
store.dispatch(logOut());

console.log('3:', store.getState()); // { user: null, posts: [ { userId: 1, id: 1, content: 'hi redux!' } ] }
