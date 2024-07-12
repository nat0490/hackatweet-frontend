import React, { forwardRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCommentDots, faXmark } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/Comment.module.css";
import { tempsEcoule } from '../utils';

const Comment = forwardRef((props, ref) => {

  const user = useSelector(state => state.users.value);
  
  // const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light');
  const userToken = user.token; 
  const defaultTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  let theme = useSelector(state => state.theme.value.find(e => e.user === userToken)?.style);
  // const [theme, setTheme] = useState(userToken ? themeFromStore : defaultTheme);

  if(!userToken){
    theme = defaultTheme;
  };

  
  // const URL = "http://localhost:3000/";
  const URL = "https://flowst-backend.vercel.app/";

  const likesCommentReducer = useSelector(state => state.likesComment.value);

  // console.log(props);

  const [ likes, setLikes ] = useState(props.nbLike);

  const handleLikeComment = () => {
    props.updateLikedCom(props._id);
    //console.log(user);
    if (!props.isLiked) {
      const newNotification = {
        commentText: props.text, 
        fromUserName: user.username,
        fromUserToken: user.token,
        toUserId: props.userFrom.id || props.userFrom._id ,
        };
      fetch(`${URL}tweets/${props.tweetId}/addLikeComment/${props._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNotification),
    })
      .then(res => res.json())
      .then(data => {
        setLikes(likes + 1);
      });
    } else {    
    fetch(`${URL}tweets/${props.tweetId}/rmvLikeComment/${props._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setLikes(likes -1);
        }
      });
    };
  }

  const handleDeleteComment = () => {
    props.handleDeleteComment(props._id)
  };

  
//console.log(props.userFrom);
  return (
    <section ref={ref}> 
      <div className={`${styles[theme]} ${styles.oneCom}`}>
        <div className={styles.blocPhoto}> 
          <Image
                src={"/user.jpg"}
                width={30}
                height={30}
                className={styles.userPhotoCom}
              />
          <div className={styles.blocUserCom}>
            <div className={styles.userNameAndDeleteCom}> 
              <p className={styles.infoUserCom}>{props.userFrom?.username} - {tempsEcoule(props.date)}</p> 
              {user.token === (props.userFrom?.token) && (
                  <div className={styles.oneLogo}>
                    <FontAwesomeIcon 
                      onClick={handleDeleteComment} 
                      color={`${theme === "light" ? "#000" : "#ddd"}`} 
                      icon={faXmark} style={{ cursor: 'pointer'}} 
                      size="xs"/>
                  </div>
                )}
            </div>
            <p className={styles.textCom}>{props.text}</p>
          </div>
        </div>

        <div className={styles.logoCom}>
              <FontAwesomeIcon
                icon={faHeart}
                size="2xs"
                color={`${theme === "light" ? "#000" : "#ddd"}`}
                style={{ cursor: 'pointer', ...(props.isLiked && { color: '#EA3680' }) }}
                onClick={() => handleLikeComment(props._id)}
              />    <span className={styles.likesText}>{likes} </span>
              <div className={`${styles[theme]} ${styles.unTrait}`}></div>
        </div>
      </div>
    </section>
  );
});



export default Comment;
