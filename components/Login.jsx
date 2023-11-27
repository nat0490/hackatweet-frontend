import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//import React from 'react';
import SignUp from './Signup';
import SignIn from './Signin';
import styles from '../styles/Login.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark, faEye} from '@fortawesome/free-solid-svg-icons';
//import Moment from 'react-moment';
//import { Modal } from 'antd';
import Link from 'next/link';
import Image from 'next/image'



function Login() {
const dispatch = useDispatch();
//const user = useSelector((state) => state.user.value);

/*const [signUpFirstname, setSignUpFirstname] = useState ('');
const [signUpUsername, setSignUpUsername] = useState('');
const [signUpPassword, setSignUpPassword] = useState('');
const [signInUsername, setSignInUsername] = useState('');
const [signInPassword, setSignInPassword] = useState('');*/

const[openModal1, setOpenModal1] = useState(false);
const[openModal2, setOpenModal2] = useState(false);

const handleRegister = () => {
  fetch('http://localhost:3000/users/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstname: signUpFirstname, username: signUpUsername, password: signUpPassword }),
  }).then(response => response.json())
    .then(data => {
      if (data.result) {
        dispatch(login({ firstname: signUpFirstname, username: signUpUsername, token: data.token }));
        setSignUpFirstname('');
        setSignUpUsername('');
        setSignUpPassword('');
        
      }
    });
};

const handleConnection = () => {
 fetch('http://localhost:3000/users/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: signInUsername, password: signInPassword }),
  }).then(response => response.json())
    .then(data => {
      if (data.result) {
        dispatch(login({ firstname: data.firstname, username: signInUsername, token: data.token }));
        setSignInUsername('');
        setSignInPassword('');
        
      }
    });
};

/*const handleLogout = () => {
  dispatch(logout());
};*/


  return (
    <div className={styles.container}>
      <div className={styles.leftContainer}>
        <img className={styles.img} src="xtwitter.png" alt="xtwitter" />
        
      </div>
      <div className={styles.rightContainer}>
        <div>
      <Image className={styles.logoLeftContainer} src="/twitterLogo.png" width={100} height={100} alt="logo xtwitter" />
      </div>
      <h1 className={styles.title}>See what's <br />happening</h1>
      <p className={styles.text1}>Join Hackatweet today</p>

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
