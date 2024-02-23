import React from "react";
import styles from "../styles/Signin.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../reducers/user";
import { addHashtag, removehashTag } from "../reducers/hashtags";
import { addTheme } from "../reducers/theme";

function SignIn({ closeModal }) {
  const [signInUsername, setSignInUsername] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

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
        // console.log(data.data);
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
          fetchAllHashtag();
          dispatch(addTheme(data.data.token));
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
              <h1>Connexion</h1>
            </div> */}
            
            <div className={styles.inputs}>
              <input
                type="text"
                placeholder="Nom d'utilisteur"
                onChange={(e) => setSignInUsername(e.target.value)}
                value={signInUsername}
                style={{ backgroundColor: '#fff', color: '#000', borderRadius: '5px', width: '80%'}}
              />
              <input
                type="password"
                placeholder="Mots de passe"
                onChange={(e) => setSignInPassword(e.target.value)}
                value={signInPassword}
                style={{ backgroundColor: '#fff', color: '#000', borderRadius: '5px', width: '80%'}}
              />
              <button id="signup" className={styles.btnSign} onClick={() => handleConnection()}> Se connecter </button>
            </div>

          </div>
        </div>
      
      
   

  );
};

export default SignIn;
