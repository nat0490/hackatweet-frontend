import React from "react";
import styles from "../styles/Signin.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../reducers/user";

function SignIn({ closeModal }) {
  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const dispatch = useDispatch();

  const handleConnection = () => {
    //console.log('click signin')
    fetch("http://localhost:3000/users/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: signInUsername,
        password: signInPassword,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.data);
        if (data.result) {
          dispatch(
            login({
              firstname: data.data.firstname,
              username: signInUsername,
              token: data.data.token,
              id: data.data._id,
            })
          );
          setSignInUsername("");
          setSignInPassword("");
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
                className={styles.logoStyle}
                />
            </div>
            
              <button 
                className={styles.btnToClose} 
                onClick={() => closeModal(false)}
              >X</button>
            
          </div>


          <div className={styles.body}>
            
            <div className={styles.title}>
              <h1>Connect to Flower</h1>
            </div>
            
            <div className={styles.inputs}>
              <input
                type="text"
                placeholder="Username"
                onChange={(e) => setSignInUsername(e.target.value)}
                value={signInUsername}
                style={{ backgroundColor: '#fff', color: '#000', borderRadius: '5px'}}
              />
              <input
                type="password"
                placeholder="enter your password"
                onChange={(e) => setSignInPassword(e.target.value)}
                value={signInPassword}
                style={{ backgroundColor: '#fff', color: '#000', borderRadius: '5px'}}
              />
              <button id="signup" className={styles.btnSign} onClick={() => handleConnection()}> Sign in </button>
            </div>

          </div>
        </div>
      
      
   

  );
};

export default SignIn;
