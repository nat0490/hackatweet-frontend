import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import styles from "../styles/Signup.module.css";
import Image from "next/image";
import { login } from "../reducers/user";

function SignUp({ closeModal }) {
  const [signUpFirstname, setSignUpFirstname] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const dispatch = useDispatch();

  const handleRegister = () => {
    console.log('click signup');
    fetch('http://localhost:3000/users/signup', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstname: signUpFirstname,
        username: signUpUsername,
        password: signUpPassword
      }),
    }).then((response) => response.json())
      .then((data) => {
        console.log(data)
        if (data.result) {
          console.log(data)
          dispatch(
            login({
              firstname: signUpFirstname,
              username: signUpUsername,
              token: data.newDoc.token,
              //id: data.newdoc._id,
            })
          );
          setSignUpFirstname("");
          setSignUpUsername("");
          setSignUpPassword("");
        }
      });
  };

  return (
    
      <div className={styles.modalContainer}>

        <div className={styles.topPage}> 
          <div>
            <Image
              src="/Dessin.png"
              width={100}
              height={100}
              alt="logo"
              />
          </div>
          
            <button 
              className={styles.btnToClose} 
              onClick={() => closeModal(false)}
            >X</button>
          
        </div>


        <div>
          
        
          <div className={styles.title}> 
            <h1>Create your Flower account</h1>
          </div>
          
          
          <div className={styles.inputs}>
            <input
              type="text"
              placeholder="Firstname"
              onChange={(e) => setSignUpFirstname(e.target.value)}
              value={signUpFirstname}
            />
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setSignUpUsername(e.target.value)}
              value={signUpUsername}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setSignUpPassword(e.target.value)}
              value={signUpPassword}
            />
            <button className={styles.btnSign} onClick={() => handleRegister()}>
              Sign up
            </button>
          </div>
        </div>


      </div>
    
  );
}

export default SignUp;
