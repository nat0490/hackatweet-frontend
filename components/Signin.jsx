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
    console.log('click signin')
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
        console.log(data);
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
    
    <>
      <div className={styles.modalBackgroung}>
        <div className={styles.modalContainer}>
          <div className={styles.btnContainer}>
            <button className={styles.btnToClose} onClick={() => closeModal(false)}> X </button>
          </div>
          <div className={styles.body}>
            <div className={styles.logo}>
              <Image
                className={styles.logo}
                src="/logo.png"
                width={50}
                height={50}
                alt="logo xtwitter"
              />
            </div>
            <div className={styles.title}>
              <h1>Connect to Hackatweet</h1>
            </div>
            <div className={styles.inputs}></div>
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setSignInUsername(e.target.value)}
              value={signInUsername}
            />
            <input
              type="password"
              placeholder="enter your password"
              onChange={(e) => setSignInPassword(e.target.value)}
              value={signInPassword}
            />
            <button id="signup" onClick={() => handleConnection()}>
              Sign in
            </button>
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.logo}>
          <Image className={styles.logo} src="/logo.png" width={100} height={100} alt="logo xtwitter" />
        </div>
        <div className={styles.title}><h1>Connect to Hackatweet</h1></div>
        <div className={styles.inputs}>
          <input type="text" placeholder="Username" onChange={(e) => setSignInUsername(e.target.value)} value={signInUsername} />
          <input type="password" placeholder="enter your password" onChange={(e) => setSignInPassword(e.target.value)} value={signInPassword}/>
          <button  onClick={() => handleConnection()}>Sign in</button>
        </div>
      </div>
    </> 

  );
};

export default SignIn;
