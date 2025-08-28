'use client'

import { useState } from "react";

import styles from './form.module.css';


export default function ContactForm() {
    const [values, setValues] = useState({
        email: '',
        subject: '',
        message: ''
      })
    
    const [didEdit, setDidEdit] = useState({
        email: false,
        subject: false,
        message: false
    })

    const emailIsInvalid = didEdit.email && !values.email.includes('@');
    const subjectIsInvalid = didEdit.subject && values.subject === '';
    const messageIsInvalid = didEdit.message && values.message === '';

    const handleSubmit = (event) => {
      event.preventDefault();

      if (
          emailIsInvalid ||
          subjectIsInvalid ||
          messageIsInvalid
          ) {
              return; // Stop form submission if any validation fails
          }
      
      // 
      console.log(values)
    }


    function handleChange(identifier, value) {
    setValues((prevValues) => ({
        ...prevValues,
        [identifier]: value
    }));

    setDidEdit((prevEdit) => ({
        ...prevEdit,
        [identifier]: false
    }));

    }

    function handleBlur(identifier) {
        setDidEdit((prevEdit) => ({
            ...prevEdit,
            [identifier]: true
        }))
    }
      
  return (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.control}>
            <label htmlFor="email">Email:</label>
            <input
              name='email'
              type='email'
              onBlur={() => handleBlur('email')}
              onChange={(event) => handleChange('email', event.target.value)}
              value={values.email}/>
              <div className={styles.control_error}>
                {emailIsInvalid && <p>Please enter a valid email address</p> }
              </div>
          </div>
          <div className={styles.control}>
            <label htmlFor="subject">Subject:</label>
            <input
              name='subject'
              type='text'
              onBlur={() => handleBlur('subject')}
              onChange={(event) => handleChange('subject', event.target.value)}
              value={values.subject}/>
            <div className={styles.control_error}>
                {subjectIsInvalid && <p>Please enter a subject title</p>}
            </div>
          </div>
          <div className={styles.control}>
            <label htmlFor="message">Message: 
                <span>{`max ${500 - values.message.length}`}</span>
            </label>
            <textarea
              name='message'
              type='text'
              onBlur={() => handleBlur('message')}
              onChange={(event) => handleChange('message', event.target.value)}
              value={values.message}
              maxLength={500}
              />
              <div className={styles.control_error}>
                {messageIsInvalid && <p>Please enter a message to send</p>}
              </div>
          </div>

        <div className={styles.form_actions}>
            <button type='submit' className={styles.btn}>Send</button>
        </div>
        </form>
  )
}
