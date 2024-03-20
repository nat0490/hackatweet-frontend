import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SignUp from './Signup';
import SignIn from './Signin';
import styles from '../../styles/Login.module.css';
import Typewriter from 'typewriter-effect';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Image from 'next/image';


function Login() {

const dispatch = useDispatch();

const[openModal1, setOpenModal1] = useState(false);
const[openModal2, setOpenModal2] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        {/* <img className={styles.img} src="depo.jpg" alt="logo" /> */}
        <img className={styles.img} src="Logo3BG.png" alt="logo" />
      </div>
      <div className={styles.rightContainer}>
        <div>
          <Image className={styles.logoLeftContainer} src="/Logo2.png" width={100} height={100} alt="logo" />
          </div>
          <div className={styles.blockLog}> 

            <h1 className={styles.title}>
              <Typewriter 
                options={{
                  autoStart: true,
                  loop: true,
                  delay: 50,
                  cursor: "",
                  strings: ["Quoi de neuf?"]
                }}
              />
            </h1>
          
            <p className={styles.text1}>Rejoins nous!</p>
            <button className={styles.btnSignUp} onClick={() => setOpenModal1(true)}>Inscription</button>

            <p className={styles.text1}>Déjà un compte ?</p>
            <button className={styles.btnSignIn} onClick={() => setOpenModal2(true)}>Connexion</button>
          </div>
        </div>
        {openModal1 && <SignUp closeModal={setOpenModal1} />}
        {openModal2 && <SignIn closeModal={setOpenModal2} />}
      </div>
 
  );
}

export default Login;
