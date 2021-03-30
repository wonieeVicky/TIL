import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import ClassApp from './ClassApp';

ReactDOM.render(
  <Provider store={store}>
    <ClassApp />
  </Provider>,
  document.querySelector('#root')
);
