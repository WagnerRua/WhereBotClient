import React, { useContext } from 'react';
import { BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';

import { Context, AuthProvider } from './Context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function CustomRoute({ isPrivate, ...rest }) {
  const { authenticated, loading } = useContext(Context);
  
  if(loading){
    return <h1>Loading...</h1>;
  }

  if(isPrivate && !authenticated){
    return <Redirect to="/"/>;
  };


  return <Route {...rest} />;
}

export default function Routes(){
  return (
    <BrowserRouter>
      <AuthProvider>
        <Switch>
          <CustomRoute exact path="/" component={Login} />
          <CustomRoute exact path="/register" component={Register} />
          <CustomRoute isPrivate exact path="/dashboard" component={Dashboard} />
        </Switch>
      </AuthProvider>
    </BrowserRouter>
  )
}