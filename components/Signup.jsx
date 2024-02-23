import React from 'react';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/Signup.module.css";
import Image from "next/image";
import { login } from "../reducers/user";
import { addHashtag, removehashTag } from '../reducers/hashtags';
import { addTheme } from '../reducers/theme';

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
          dispatch(addTheme(data.newDoc.token));
        }
      });
  };

  return (
    
      <div className={styles.modalContainer}>

        <div className={styles.topPage}> 
          <div className={styles.blockLogo}> 
            <Image
              src="/Logo2.png"
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
          
        
          {/* <div className={styles.title}> 
            <h1>Crée ton compte</h1>
          </div> */}
          
          
          <div className={styles.inputs}>
            <input
              type="text"
              placeholder="Prenom"
              onChange={(e) => setSignUpFirstname(e.target.value)}
              value={signUpFirstname}
              style={{ backgroundColor: '#fff', color: '#000', borderRadius: '5px', width: '80%'}}
            />
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              onChange={(e) => setSignUpUsername(e.target.value)}
              value={signUpUsername}
              style={{ backgroundColor: '#fff', color: '#000', borderRadius: '5px', width: '80%'}}
            />
            <input
              type="password"
              placeholder="Mots de passe"
              onChange={(e) => setSignUpPassword(e.target.value)}
              value={signUpPassword}
              style={{ backgroundColor: '#fff', color: '#000', borderRadius: '5px', width: '80%'}}
            />
            <button className={styles.btnSign} onClick={() => handleRegister()}>
              Crée ton compte
            </button>
          </div>
        </div>


      </div>
    
  );
}

export default SignUp;
