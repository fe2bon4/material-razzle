import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './pages/Home';

import './App.css';
const App = () => {
  if (typeof window !== 'undefined') {
    console.log('@Window', window?.env);
  }
  return (
    <Switch>
      <Route exact={true} path='/home' component={Home} />
      <Route path='*'>
        <Redirect to='/home' />
      </Route>
    </Switch>
  );
};

export default App;
