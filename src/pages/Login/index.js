import React, { useContext } from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { ErrorMessage, Formik, Form, Field } from 'formik';
import * as yup from 'yup';

import { Context } from '../../Context/AuthContext';

import logoImg from '../../assets/wherebotLetras.png';
import './styles.css';

export default function Login(){
  const {loginError, handleLogin} = useContext(Context);

  const errorDiv = loginError ? <span className="server-error">{loginError}</span> : '';

  const validations = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  return (
    <div className="login-container">
      <div className="info">
        <div>
          <img src= {logoImg} alt="Be The Hero"/>
        </div>
        <h1>
          Sign in on
          <br />
          the platform
        </h1>
      </div>
      <div className="content">
        <section className="form">
          <Formik 
            initialValues={{email: '', password: ''}} 
            onSubmit={handleLogin} 
            validationSchema={validations}
          >
            <Form className="form">
              <Field 
                name="email" 
                placeholder="E-mail" 
                className="Form-field"
              />
              <ErrorMessage component="span" name="email" className="Form-error"/>
              <Field 
                name="password" 
                type="password" 
                placeholder="Password"
                className="Form-field"/>
              <ErrorMessage component="span" name="password" className="Form-error"/>
              {errorDiv}
              <button className="button" type="submit">Login</button>
              <Link className="back-link" to="/register" >
                <FiLogIn size={16} color="#238956"/>
                Sign Up
              </Link>
            </Form>
          </Formik>
          </section>
      </div>
    </div>
  )
}