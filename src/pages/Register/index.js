import React, { useContext } from 'react';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { ErrorMessage, Formik, Form, Field } from 'formik';

import './styles.css';
import logoImg from '../../assets/wherebot.svg'
import { Context } from '../../Context/AuthContext';

export default function Register(){
  const {registerError, handleRegister} = useContext(Context);

  const errorDiv = registerError ? <span className="server-error">{registerError}</span> : '';

  const validations = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required(),
    robotID: yup.string().required()
  });

  return(
    <div className="register-container">
      <div className="content">
        <section>
          <img src= {logoImg} alt="Be The Hero"/>
          <h1>Sign Up</h1>
          <p>Join the platform and and be part of innovation in the area of wireless site surveys.</p>
          <Link className="back-link" to="/">
            <FiArrowLeft size={16} color="#238956"/>
            I don't need Sign Up
          </Link>
        </section>
        <Formik 
          initialValues={{name: '', email: '', password: ''}} 
          onSubmit={handleRegister} 
          validationSchema={validations}
        >
          <Form className="form">
            <Field 
              name="name"
              placeholder="Name" 
              className="Form-field"
            />
            <ErrorMessage component="span" name="name" className="Form-error"/>
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
            <Field 
              name="robotID" 
              type="text" 
              placeholder="Robot Key"
              className="Form-field"/>
            <ErrorMessage component="span" name="robotID" className="Form-error"/>
            {errorDiv}
            <button className="button" type="submit">Sign Up</button>
          </Form>
        </Formik>
      </div>
    </div>
  )
}