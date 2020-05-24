import React from 'react';
import { Provider } from 'react-redux'
import createStore from './store'
import Router from './router';
import reducers from './store/reducers'
import 'antd/dist/antd.css';
import './App.css';
import './override.sass'
const store = createStore(reducers)

function App() {
  return (
   <Provider store={store}>
     <Router></Router>
   </Provider>
  );
}

export default App;
