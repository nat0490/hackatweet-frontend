import React, { forwardRef, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faCommentDots, faXmark, faTrash } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/Tweet.module.css";
import Comment from './Comment';
import { addLikedComment, rmvLikedComment, rmvAllComment } from '../reducers/likes';
import { addShowComment, rmvShowComment, rmvAllShowComment} from '../reducers/showComment';
import { tempsEcoule, detectClickOutside } from '../utils';
import Link from 'next/link';

  const Tweet = forwardRef((props, ref) => {

    const commentRef = useRef(null);
    const dispatch= useDispatch();
    // const URL = "http://localhost:3000/";
    const URL = "https://hackatweet-backend-iota-three.vercel.app/";
    const user = useSelector(state => state.users.value);
    const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light'); 
    const commentILkd = useSelector(state => state.likes.value.find(e => e.user === user.token)?.comment);
    const commentILook = useSelector(state => state.showComment.value);

    const [ upLikes, setUpLikes] = useState(0);
    const [ comment, setComment] = useState(props.comment);
//Commentaire d'un post
    const [ showInputAddComment, setShowInputAddComment ] = useState(false);
    const [ textComment, setTextComment] = useState("");
//Image en grand
    const [ selectedPic, setSelectedPic ] = useState(null);
    const bigPicContainerRef = useRef(null);
//Popup d'alert
    const [activeToggle, setActiveToggle] = useState(false);

    const [activeToggleConnection, setActiveToggleConnection] = useState(false);
    
    
  

  useEffect(() => {
    setShowInputAddComment(commentILook.includes(props._id));
  },[props._id]);
 

  useEffect(() => {
    //console.log("selected Pic:", selectedPic);
    const handleClickOutside = (event) => {
  //Si il y a selectedPic && onClick en dehors de la zone
        if (selectedPic && bigPicContainerRef.current && !bigPicContainerRef.current.contains(event.target)) {
            setSelectedPic(null);
        }
    };
    let timeoutId;
//Ajout de timeout afin de laisser la "fenêtre" s'ouvrir pour afficher l'image avant de d'éclancher l'evènement d'écoute du click
    if (selectedPic) {
        timeoutId = setTimeout(() => {
          //console.log("add event");
            document.addEventListener('click', handleClickOutside);
        }, 100); // Ajoutez un délai de 100 millisecondes (ou ajustez selon vos besoins)
    } else {
      //console.log("remove event");
        document.removeEventListener('click', handleClickOutside);
    }

    return () => {
        clearTimeout(timeoutId); // Nettoyez le timeOut avant de retirer l'écouteur
        document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedPic]);

  // useEffect(()=>{
  //   detectClickOutside(selectedPic, setSelectedPic, null, bigPicContainerRef);
  // }, [selectedPic])



//Ouvrir l'image en grand en cliquant dessus
  const handleOpenPic = (path) => {
    //console.log("click");
    setSelectedPic(path);
    };

//Mettre à jour les commentaire liké de l'utilisateur
  const updateLikedCom = (comId) => {
    if (commentILkd.some(com => com === comId)) { 
      dispatch(rmvLikedComment({user: user.token, comment: comId}));     
    } else {   
      dispatch(addLikedComment({user: user.token, comment: comId}));
    } 
  };

//Recuperer tous les tweet
  const fetchTweet = () => {
    props.fetchTweet();
  };

//Bouton Supprimer un tweet
  const handleDelete = () => {
    props.handleDelete(props._id)
  };

//Bouton Like d'un tweet
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

  const allPic = props.pictures?.length > 0 && props.pictures.map((pic, i) => {
    return (
      <div style={{display:'flex',}} key={i}> 
        <img 
          
          src={pic}
          alt={`image ${i}`}
          name={`image ${i}`}
          className={styles.picOfTweet}
          onClick={() => handleOpenPic(pic)}
        />
      </div>
    )
  })



  const formatDescription = (description) => {
    if (!description) {
      return null;
    }

    // let tags = tweet.match(/#(\w+)/g) || []; 
    // let hashtags = tags.map((tag) => tag.substring(1)); //

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
  

//   const togglePop = () => {
//     let popup = document.getElementById('popAlert');
//     popup.classList.toggle('active');
// }
  

  return (
    <section ref={ref}> 



    <div className={`${styles[theme]} ${styles.oneTweet}`} >
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
            {/* {user.id === props.user._id && (
              <div onClick={handleDelete} className={styles.xDelete}>
                <FontAwesomeIcon icon={faXmark} style={{ cursor: 'pointer'}}/>
              </div>
            )} */}
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
        
          {props.pictures && props.pictures.length > 0 ?
            <div className={styles.picContainer} style={{ justifyContent: props.pictures?.length > 3 ? 'flex-start': 'center'}}>
              {allPic}
            </div> 
            : ""}

      {selectedPic && (
        <div className={styles.bigPicContainer} ref={bigPicContainerRef} >
          <div onClick={()=> setSelectedPic(null)} className={styles.xClosePic}>
            <FontAwesomeIcon 
              icon={faXmark} 
              style={{ 
                cursor: 'pointer', 
                color:'#fff',
                marginRight: '2rem',
                marginTop:'1rem',
                }}
        
                />
          </div>
          <img 
            src={selectedPic}
            alt={`image Zoom`}
            name={`image Zoom`}
            className={styles.bigPic} />
        </div>
      )}
        
        <div className={styles.logo}>
          <div className={styles.oneLogo}>
            <FontAwesomeIcon
              icon={faHeart}
              size="xs"
              style={{ cursor: 'pointer', ...(props.isLiked && { color: '#EA3680' }) }}
              onClick={user.token? handleLikeTweet : ()=>setActiveToggleConnection(!activeToggleConnection)}
            />   <span className={styles.likesText}>    {   props.nbLike + upLikes } </span>
          </div>
          <div className={styles.oneLogo}>
            <FontAwesomeIcon
              icon={faCommentDots}
              size="xs"
              onClick={user.token? handleShowAddComment : ()=>setActiveToggleConnection(!activeToggleConnection)}
              // onClick={handleShowAddComment}
              style={{ cursor: 'pointer'}}
            />   <span className={styles.likesText}>    {   props.comment.length > 0 ? props.comment.length : ""} </span>
          </div> 

           {user.id === props.user._id && (
              <div className={styles.xDelete} onClick={()=>setActiveToggle(!activeToggle)} /*onClick={handleDelete}*/>
              <FontAwesomeIcon
                icon={faTrash}
                size="xs"
                style={{ cursor: 'pointer'}}
              />   
            </div> 
            )}
          
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
      
{ activeToggle && 
  <section className={`${styles[theme]} ${styles.popAlert}`} >
    <aside>
        <h4 className={styles.titleAlert}>Voulez vous vraiment supprimer ce post?</h4>
        <p>Cette action est définitive</p>
        <button type="button" className={`${styles[theme]} ${styles.btnAlert}`} onClick={handleDelete}>Oui</button>
        <button type="button" className={`${styles[theme]} ${styles.btnAlert}`} onClick={()=>setActiveToggle(!activeToggle)}>Non</button>
    </aside>
  </section>
}

{ activeToggleConnection && 
  <section className={`${styles[theme]} ${styles.popAlert}`} >
    <aside>
        <h4 className={styles.titleAlert}>Vous devez vous connecter</h4>
        <button type="button" className={`${styles[theme]} ${styles.btnAlert}`} onClick={()=>setActiveToggleConnection(!activeToggleConnection)}>Ok</button>
    </aside>
  </section>
}
     

    </ section>
  );
});

export default Tweet;
