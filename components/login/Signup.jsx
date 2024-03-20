import React from 'react';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../../styles/Signup.module.css";
import Image from "next/image";
import { login } from "../../reducers/user";
import { addHashtag, removehashTag } from '../../reducers/hashtags';
import { addTheme } from '../../reducers/theme';
import { Eye, EyeOff } from 'react-feather';

function SignUp({ closeModal }) {
  const [signUpFirstname, setSignUpFirstname] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpCheckPassword, setSignUpCheckPassword] = useState("");

  const [ errorMsg, setErrorMsg] = useState(null);
  const [ errorMsgPw, setErrorMsgPw] = useState(null);
  const [ showEye, setShowEye] = useState(true);
  const [ showEye2, setShowEye2] = useState(true);

  const dispatch = useDispatch();

  // const URL = "http://localhost:3000/";
  const URL = "https://hackatweet-backend-iota-three.vercel.app/";

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
    setErrorMsg(null);
    setErrorMsgPw(null);
    if ( signUpPassword === signUpCheckPassword) {
      fetch(`${URL}users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: signUpFirstname,
          username: signUpUsername,
          password: signUpPassword
        }),
      }).then((response) => response.json())
        .then((data) => {
          //console.log(data);
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
            setSignUpCheckPassword("");
            setErrorMsgPw(null);
            setErrorMsgUserName(null);
            setShowEye(true);
            setShowEye2(true);
            fetchAllHashtag();
            dispatch(addTheme(data.newDoc.token));
          } else {
            console.log(data.message);
            setErrorMsg(data.message);
          }
        });
    } else {
      setErrorMsgPw("Mots de passe différents")
    }
    
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
          <div className={styles.inputs}>
            <label className={styles.onlyInputs}> 
              <input
                type="text"
                placeholder="Prenom"
                onChange={(e) => setSignUpFirstname(e.target.value)}
                value={signUpFirstname}
                style={{ 
                  backgroundColor: '#fff', 
                  fontSize: '12px',
                  color: '#000', 
                  borderRadius: '5px', 
                  width: '80%'}}
              />
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                onChange={(e) => setSignUpUsername(e.target.value)}
                value={signUpUsername}
                style={{ 
                  backgroundColor:'#fff', 
                  fontSize: '12px',
                  color: '#000', 
                  borderRadius: '5px', 
                  width: '80%', 
                  }}
              /> 
              <input
                type={showEye? "password": "text"}
                placeholder="Mot de passe"
                onChange={(e) => setSignUpPassword(e.target.value)}
                value={signUpPassword}
                style={{ 
                  backgroundColor: '#fff', 
                  fontSize: '12px',
                  color: '#000', 
                  borderRadius: '5px', 
                  width: '80%',
                  border: errorMsgPw ? '1.5px solid black': 'none', 
                  fontWeight: errorMsgPw? 'bold': 'none',
                  fontStyle: errorMsgPw? 'italic': 'none',}}
              />

              <div class="password-icon">
                  {showEye ? <Eye onClick={() => setShowEye(!showEye)}/> : <EyeOff onClick={() => setShowEye(!showEye)}/> }
              </div>
              
              
              <input
                 type={showEye2? "password": "text"}
                placeholder="Vérification du Mot de passe"
                onChange={(e) => setSignUpCheckPassword(e.target.value)}
                value={signUpCheckPassword}
                style={{ 
                  backgroundColor: '#fff', 
                  fontSize: '12px',
                  color: '#000', 
                  borderRadius: '5px', 
                  width: '80%',
                  border: errorMsgPw ? '1.5px solid black': 'none', 
                  fontWeight: errorMsgPw? 'bold': 'none',
                  fontStyle: errorMsgPw? 'italic': 'none',}}
              />

              <div class="password-icon2">
                  {showEye2 ? <Eye onClick={() => setShowEye2(!showEye2)}/> : <EyeOff onClick={() => setShowEye2(!showEye2)}/> }
              </div>

            
          
            </label>

          { errorMsg && <span className={styles.errorMsg}>*{errorMsg}</span>}
          { errorMsgPw && <span className={styles.errorMsg}>*{errorMsgPw}</span>}
            
            <button className={styles.btnSign} onClick={() => handleRegister()}>
              Crée ton compte
            </button>

          
          </div>
        </div>


      </div>
    
  );
}

export default SignUp;
