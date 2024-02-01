import React from 'react';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/Signup.module.css";
import Image from "next/image";
import { login } from "../reducers/user";
import { addHashtag, removehashTag } from '../reducers/hashtags';

function SignUp({ closeModal }) {
  const [signUpFirstname, setSignUpFirstname] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");

  const dispatch = useDispatch();

  const nbrOccurence = (tab) => {
    const occurences = [];  
    for (let i = 0; i < tab.length; i++) {
      const element = tab[i];  
      occurences[element] = (occurences[element] || 0) + 1;
    }
    dispatch(removehashTag());
    dispatch(addHashtag(occurences));
  };
  
  const fetchAllHashtag = () => {
    fetch(`${URL}tweets/lastTweet`)
      .then((res) => res.json())
      .then((data) => {
        //console.log(data.tweets);        
        if (data.tweets) {       
          const hashtagsFind = [];
          data.tweets.map((tweet) => {
            let hashT = tweet.hashtags;
            if (hashT && hashT.length > 0) {
              hashtagsFind.push(...hashT);
            }          
          }); 
          //console.log(hashtagsFind);
          nbrOccurence(hashtagsFind);
        } else {
          console.error("Error in fetchHashtag: Response is missing 'tweets' field", data);
        }
      });
  }

  const handleRegister = () => {
    //console.log('click signup');
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
        if (data.result) {
          dispatch(
            login({
              firstname: signUpFirstname,
              username: signUpUsername,
              token: data.newDoc.token,
              id: data.newDoc._id,
            })
          );
          setSignUpFirstname("");
          setSignUpUsername("");
          setSignUpPassword("");
          fetchAllHashtag();
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
              style={{ backgroundColor: '#fff', color: '#000', borderRadius: '5px'}}
            />
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setSignUpUsername(e.target.value)}
              value={signUpUsername}
              style={{ backgroundColor: '#fff', color: '#000', borderRadius: '5px'}}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setSignUpPassword(e.target.value)}
              value={signUpPassword}
              style={{ backgroundColor: '#fff', color: '#000', borderRadius: '5px'}}
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
