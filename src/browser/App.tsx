import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './pages/Home';

import './App.css';

const App = () => {
  return (
    <Switch>
      <Route exact={true} path="/home" component={Home} />
      <Route path="*" >
        <Redirect to="/home"/>
      </Route>
    </Switch>
  );;
};

export default App;
