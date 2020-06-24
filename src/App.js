import React from 'react';
import './index.css'

// import reducers, store
import reducer from './reducers/index'
import {createStore} from 'redux'
import {Provider} from 'react-redux'

// import components
import Layout from './components/Layout'

const store = createStore(reducer)

function App() {
  console.log('init state: ',store.getState())

  return (
    <Provider store={store}>
      <Layout/>
    </Provider>
  );
}

export default App;
