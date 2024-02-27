import React, { forwardRef, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCommentDots, faXmark } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/Tweet.module.css";
import Comment from './Comment';
import { addLikedComment, rmvLikedComment, rmvAllComment } from '../reducers/likes';
import { addShowComment, rmvShowComment, rmvAllShowComment} from '../reducers/showComment';
import { tempsEcoule } from '../utils';
import Link from 'next/link';

const Tweet = forwardRef((props, ref) => {

  const commentRef = useRef();
  const dispatch= useDispatch();
  // const URL = "http://localhost:3000/";
  const URL = "https://hackatweet-backend-iota-three.vercel.app/";
  const user = useSelector(state => state.users.value);
  const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light'); 
  const commentILkd = useSelector(state => state.likes.value.find(e => e.user === user.token)?.comment);
  
  //const commentILkd = [];
  //const commentILkd = useSelector(state => state.likes.value.comment);
  const commentILook = useSelector(state => state.showComment.value);

  //console.log(commentILkd);

  const tweetComment = useSelector(state => state.likes.value); 
  //console.log("tweet & comment:", tweetComment);

  const [ likes, setLikes ] = useState("");
  const [ upLikes, setUpLikes] = useState(0);
  const [ comment, setComment] = useState(props.comment);

  const [ showInputAddComment, setShowInputAddComment ] = useState(false);
  const [ textComment, setTextComment] = useState("");
  
  
  //console.log(upLikes);
 

  useEffect(() => {
    setShowInputAddComment(commentILook.includes(props._id));
  },[props._id]);

  
  const updateLikedCom = (comId) => {
    if (commentILkd.some(com => com === comId)) { 
      dispatch(rmvLikedComment({user: user.token, comment: comId}));     
    } else {   
      dispatch(addLikedComment({user: user.token, comment: comId}));
    } 
  };

  const fetchTweet = () => {
    props.fetchTweet();
  };

  const handleDelete = () => {
    props.handleDelete(props._id)
  };
  
  const handleLikeTweet = () => {
    props.updateLikedTweet(props._id);
    //console.log(props);
    if (props.isLiked) {
      if (props.nbLike >0) {
        fetch(`${URL}tweets/rmvNbLike/${props._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(),
        })
          .then(res => res.json())
          .then(data => {
            if (data.result) {
              props.nbLike > 0 && setUpLikes(upLikes - 1);
              console.log("like --");
            }
          });
      } else {
        console.log("props nb like = 0", props.nbLike)
      }
    } else { 
      const notification = {
        tweetDescription: props.description,
        fromUserId: user.id,
        fromUserName: user.username,
        toUserId: props.user._id,
      };
    fetch(`${URL}tweets/addNbLike/${props._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify( /*{ whoLike: user.id, push: !props.isLiked },*/ notification ),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setUpLikes(upLikes + 1);
        }
      });
    };
  };

  const handleShowAddComment = () => {
    showInputAddComment ? dispatch(rmvShowComment(props._id)) : dispatch(addShowComment(props._id));
    setShowInputAddComment(!showInputAddComment);
  };  


  const handleAddComment = () => {
    const newCom = {
      userId: user.id,
      text: textComment,
      userName: user.username,
    }
    fetch(`${URL}tweets/addComment/${props._id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json", },
      body: JSON.stringify(newCom)
    })
    .then(res => res.json())
    .then(data => {
      //console.log(data.comment);
      const com = data.comment;
      const newAddCom = {
        date : com.date,
        userFrom : user,
        text: com.text,
        nbLike: com.nbLike,
        _id: com._id,
      }
      setComment([...comment, newAddCom])
      setTextComment("");
      fetchTweet();
    })
  };

  const handleDeleteComment = (id) => {
    fetch(`${URL}tweets/${props._id}/removeComment/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(),
    })
      .then((res)=> res.json())
      .then((data) => {
        //console.log(data);
        if (data.result) {
          setComment(comment.filter((e)=> e._id !== id));
          fetchTweet();
        } else {
          console.log(data.error);
        }
      })
  };


  const allComment2 = props.comment.length > 0 && props.comment.map((com,i) => {
    //console.log(com);
    return (
      <Comment
        ref={commentRef}
        key={com._id}
        {...com}
        isLiked={commentILkd?.some( e => e === com._id )}   
        tweetId={props._id}
        handleDeleteComment={handleDeleteComment}
        updateLikedCom={updateLikedCom}
      />
    )
  });



  // const formatDescription = (description) => {
  //   if (!description) {
  //     return null;
  //   }

  //   const hashtags = description.match(/#(\w+)/g) || [];
  //   const formattedText = description
  //     .split(/[\s,;.!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+/)
  //     //.split(/\s+/)
  //     //.split(" ")
  //     .map((word, index) => {
  //       console.log(word);
  //       if (hashtags.includes(`#${word}`)) {
  //         return <span className="hashtag" key={index}>{` #${word} `}</span>;
  //       } else {
  //         return ` ${word} `;
  //       }
  //     });

  //   return formattedText;
  // };



  // const formatDescription = (description) => {
  //   if (!description) {
  //     return null;
  //   }

  //   const wordsAndPunctuations = description.split(/(\s|[^\w#']+)/);
    

  //   const formattedText = wordsAndPunctuations.map((wordOrPunctuation, index, array) => {
  //     const isHashtag = wordOrPunctuation.startsWith('#');
  //     const isPunctuation = /[,;.!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]+/.test(wordOrPunctuation);
  //     console.log(wordOrPunctuation);

  //     if (isHashtag) {
  //       const newWord = wordOrPunctuation.split(/(\s|[^\w#']+)/);
  //       console.log(newWord);

  //       return (
  //         <Link key={index} href='#' className={styles.oneTag}>
  //           <span className="hashtag">{wordOrPunctuation}</span>
  //         </Link>
  //       );
  //     } else if (isPunctuation) {
  //       return `${wordOrPunctuation} `;
  //     } else {
  //       // Ajouter un espace après un hashtag, sauf si c'est le dernier élément du tableau
  //       const nextIsHashtag = array[index + 1] && array[index + 1].startsWith('#');
  //       return `${wordOrPunctuation}${isHashtag && !nextIsHashtag ? ' ' : ''}`;
  //     }
  //   });

  //   return formattedText;
  // };




  const formatDescription = (description) => {
    if (!description) {
      return null;
    }

    //const hashtagRegex = /(?:^|\s)(#\w+)/g;
    //const hashtagRegex = /(?:^|\s)(#[^\s,;!?'"%=\)\]]+)/g;
    const hashtagRegex = /(?:^|\s)(#[^\s,;!?'"%=\)\]]+[\s,;!?'"%=\)\]]*)/g;
    const combinedRegex = /(?:^|\s)(#\w+)|(?:^|\s)(#[^\s,;!?'"%=\)\]]+(?=\s|$))/g;
  
    const formattedText = description.split(combinedRegex).map((segment, index) => {
      if (segment && typeof segment === 'string' && segment.startsWith('#')) {
        return (
          <Link key={index} href='#'>
            <span className="hashtag">{segment}</span>
          </Link>
        );
      } else {
        return segment;
      }
    });

    return formattedText;
  };



//   const formatDescription = (description) => {
//   if (!description) {
//     return null;
//   }

//   // Définir la regex pour extraire les hashtags
//   const hashtagRegex = /#[^\s,;!?'"%=\)\]]+/g;
//   const hashtags = description.match(hashtagRegex) || [];

//   // Définir la regex combinée pour diviser la chaîne
//   const combinedRegex = /(?:^|\s)(#\w+)|(?:^|\s)(#[^\s,;!?'"%=\)\]]+(?=\s|$))/g;

//   // Diviser la chaîne et formater le texte
//   const formattedText = description.split(combinedRegex).map((segment, index) => {
//     return (
//       <React.Fragment key={index}>
//         {segment}
//         {index < hashtags.length && (
//           <Link href='#'>
//             <span className="hashtag">{hashtags[index]}</span>
//           </Link>
//         )}
//       </React.Fragment>
//     );
//   });

//   return formattedText;
// };
  


 
  



  return (
    <> 



    <div className={`${styles[theme]} ${styles.oneTweet}`} ref={ref}>
        <div className={styles.blocUser}>
          <Image
            src={"/user.jpg"}
            width={40}
            height={40}
            className={styles.userPhoto}
          />
          <div className={styles.userNameAndDelete}> 
            <p className={styles.allInfoUser}>
              <span className={`${styles[theme]} ${styles.infoUser}`}>
                {" "} 
                {props.user.username} - {tempsEcoule(props.date)}
              </span>
            </p>
            {user.id === props.user._id && (
              <div onClick={handleDelete} className={styles.oneLogo}>
                <FontAwesomeIcon icon={faXmark} style={{ cursor: 'pointer'}}/>
              </div>
            )}
          </div>
        </div>
        <div>
          {/* <p className={styles.description}>
            {props.description?.split(" ").map((e, i) => {
              if (new RegExp("#").test(e)) {
                return <span className="hashtag" key={i}> {e} </span>;
              } else {
                return ` ${e} `;
              }
            })}
          </p> */}

          <p className={styles.description}>
            {formatDescription(props.description)}
          </p>

        </div>
        <div className={styles.logo}>
          <div className={styles.oneLogo}>
            <FontAwesomeIcon
              icon={faHeart}
              size="xs"
              style={{ cursor: 'pointer', ...(props.isLiked && { color: '#EA3680' }) }}
              onClick={handleLikeTweet}
            />   <span className={styles.likesText}>    {   props.nbLike + upLikes } </span>
          </div>
          <div className={styles.oneLogo}>
            <FontAwesomeIcon
              icon={faCommentDots}
              size="xs"
              onClick={handleShowAddComment}
              style={{ cursor: 'pointer'}}
            />   <span className={styles.likesText}>    {   props.comment.length > 0 ? props.comment.length : ""} </span>
          </div> 
        </div>
      </div>
      
    

{ showInputAddComment  &&
      <div>

        { props.comment.length > 0  && 
        <div className={`${styles[theme]} ${styles.borderComments}`}>
          <div className={`${styles[theme]} ${styles.allComment}`}>
            {allComment2}
            </div>
        </div> }      
        
        <div className={`${styles[theme]} ${styles.addComment}`}>
          <input
            type="text"
            value={textComment}
            onChange={(e) => setTextComment(e.target.value)}
            className={`${styles[theme]} ${styles.inputComment}`}            
          />
          <div className={styles.dessousInput}>            
            <button className={styles.addButton} onClick={handleAddComment}> Post </button>
          </div>
        </div>

      </div>  }
      

    </>
  );
});

export default Tweet;
