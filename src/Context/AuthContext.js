import React, {createContext, useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';

import api from '../api';

const Context = createContext();

function AuthProvider({children}){
  const [loading, setLoading] = useState(true);
  const [loginError, setloginError] = useState(null);
  const [registerError, setregisterError] = useState(null);
  const [authenticated, setAuthenticate] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  let history = useHistory()

  useEffect(()=> {
    const token = localStorage.getItem('wherebot-token');
    const user = localStorage.getItem('wherebot-user');

    if(token){
      api.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(token)}`;
      setAuthenticate(true);
    }
    if(user){
      setAuthenticatedUser(JSON.parse(user));
    }

    if(user && token){
      history.push('/dashboard');
    }

    setLoading(false);
  }, [history]);

  function handleLogin(values){

    api.post('auth/authenticate', values )
    .then(response => {
      localStorage.setItem('wherebot-token', JSON.stringify(response.data.token))
      localStorage.setItem('wherebot-user', JSON.stringify(response.data.user))
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      setAuthenticatedUser(response.data.user)
      setAuthenticate(true);
      
      history.push('/dashboard');
    })
    .catch(error => {
      if (error.response) {
        setloginError(error.response.data.error);
        console.log(error.response.data);
      }
    })
  };

  function handleLogout(){
    setAuthenticate(false);
    localStorage.removeItem('wherebot-token')
    localStorage.removeItem('wherebot-user')
    api.defaults.headers.Authorization = undefined;
    history.push('/');
  };

  function handleRegister(values){
    console.log(values);
    api.post('auth/register', values )
    .then(response => {
      history.push('/');
    })
    .catch(error => {
      if (error.response)
        setregisterError(error.response.data.error);
        console.log(error.response.data);
    })
  }

  return(
    <Context.Provider value={{authenticated, authenticatedUser, loading, loginError, registerError, handleLogin, handleLogout, handleRegister}}>
      {children}
    </Context.Provider>
  )
};

export { Context, AuthProvider };