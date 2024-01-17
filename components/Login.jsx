import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SignUp from './Signup';
import SignIn from './Signin';
import styles from '../styles/Login.module.css';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Image from 'next/image';


function Login() {

const dispatch = useDispatch();

const[openModal1, setOpenModal1] = useState(false);
const[openModal2, setOpenModal2] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <img className={styles.img} src="depo.jpg" alt="logo" />
      </div>
      <div className={styles.rightContainer}>
        <div>
          <Image className={styles.logoLeftContainer} src="/Dessin.png" width={100} height={100} alt="logo" />
          </div>
          <h1 className={styles.title}>See what's <br />happening</h1>
          <p className={styles.text1}>Join Flower today</p>
          <button className={styles.btnSignUp} onClick={() => setOpenModal1(true)}>Sign up</button>
          <p className={styles.text2}>Already have an account ?</p>
          <button className={styles.btnSignIn} onClick={() => setOpenModal2(true)}>Sign in</button>
        </div>
        {openModal1 && <SignUp closeModal={setOpenModal1} />}
        {openModal2 && <SignIn closeModal={setOpenModal2} />}
      </div>
 
  );
}

export default Login;
