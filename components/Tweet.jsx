import React, { forwardRef, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHeart, 
  faCommentDots, 
  faXmark, 
  faTrash, 
  faFaceSadTear, 
  faChevronRight, 
  faChevronLeft,
  faCircleXmark,
  faEllipsisVertical
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../styles/Tweet.module.css";
import Comment from './Comment';
// import MenuTweets from './MenuTweets';
import { addLikedComment, rmvLikedComment, rmvAllComment } from '../reducers/likesComment';
import { addShowComment, rmvShowComment} from '../reducers/showComment';
import { tempsEcoule, detectClickOutside } from '../utils';
import Link from 'next/link';
import { ErrorBoundary } from "react-error-boundary";
import SwipeListener from "swipe-listener";




  const Tweet = forwardRef((props, ref) => {

    const commentRef = useRef(null);
    const dispatch= useDispatch();

    // const URL = "http://localhost:3000/";
    const URL = "https://flowst-backend.vercel.app/";

    const user = useSelector(state => state.users.value);

    // const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light');
    const userToken = user.token; 
    const defaultTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const themeFromStore = useSelector(state => state.theme.value.find(e => e.user === userToken)?.style);
    const [theme, setTheme] = useState(userToken ? themeFromStore : defaultTheme);

    // const commentILkd = useSelector(state => state.likes.value.find(e => e.user === user.token)?.comment);

    const commentILkd = useSelector(state => state.likesComment.value.find(e => e.user === user.token)?.comment);

    const likesPostReducer = useSelector(state => state.likesPost.value);
    const likesCommentReducer = useSelector(state => state.likesComment.value);
    // const postILkd = useSelector(state => state.likesPost.value.find(e=> e.user === user.token)?.post);

    // console.log(commentILkd);
    // console.log(likesCommentReducer);

    const commentILook = useSelector(state => state.showComment.value);

    const [ upLikes, setUpLikes] = useState(0);
    const [ comment, setComment] = useState(props.comment);
//Commentaire d'un post
    const [ showInputAddComment, setShowInputAddComment ] = useState(false);
    const [ textComment, setTextComment] = useState("");
//Image en grand
    const [ selectedPic, setSelectedPic ] = useState(null);
    const bigPicContainerRef = useRef(null);
    const bigPicRef = useRef(null);
//Popup d'alert
    const [ activeToggle, setActiveToggle] = useState(false);
    const [ activeToggleConnection, setActiveToggleConnection] = useState(false);
//Modale action Tweet
    const [ openMenuTweet, setOpenMenuTweet] = useState(false);
    const menuTweetContainerRef = useRef(null);
    

    //  console.log(commentILkd)
  
  useEffect(() => {
    setShowInputAddComment(commentILook.includes(props._id));
  },[props._id]);

//Detection & action d'un swipe
  useEffect(()=>{
    const container = document.querySelector("#bigPicContainer");
    const listener = SwipeListener(container);
    if(getScreenWidth() <600 && selectedPic !== null){
      container.addEventListener('swipe', function(e){
        const directions = e.detail.directions;
        // const x = e.detail.x;
        // const y = e.detail.y;
        if (directions.left) {
          handleNextPic();}
       
        if (directions.right) {
          handlePrevpic();
        }
      });
    }
  },[selectedPic])
 
//Detection du click en dehors de la photo pour les mobiles
  useEffect(() => {
    if(getScreenWidth() <600 && selectedPic !== null){
    const handleClickOutside = (event) => {
      // console.log("click");
        if (selectedPic !== null && bigPicRef.current && !bigPicRef.current.contains(event.target)) {
            setSelectedPic(null);
        }
    };
    let timeoutId;
    if (selectedPic !== null) {
        timeoutId = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 100); 
    } else {
        document.removeEventListener('click', handleClickOutside);
    }

    return () => {
        clearTimeout(timeoutId); 
        document.removeEventListener('click', handleClickOutside);
    };
  }
  }, [selectedPic]);

  useEffect(()=>{
    if (!user.token) {
      setShowInputAddComment(false);
    }
  },[user]);



//Mettre à jour les commentaire liké de l'utilisateur
  
const updateLikedCom = (comId) => {
    if (commentILkd?.some(com => com === comId)) { 
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
    props.handleDelete(props._id);
    // props.handleDeletePic(props.pictures);
  };

  // console.log(props.user);

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
              // console.log("like --");
            }
          });
      } 
      // else {
      //   console.log("props nb like = 0", props.nbLike)
      // }
    } else { 
      const notification = {
        tweetDescription: props.description,
        fromUserToken: user.token,
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

//Afficher les commentaire et pouvoir commenter
  const handleShowAddComment = () => {
    showInputAddComment ? dispatch(rmvShowComment(props._id)) : dispatch(addShowComment(props._id));
    setShowInputAddComment(!showInputAddComment);
  };  

//Ajouter un commentaire
  const handleAddComment = () => {
    const newCom = {
      text: textComment,
      userName: user.username,
    }
    fetch(`${URL}tweets/addCommentV3/${props._id}/from/${user.token}`, {
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

//Supprimer un commentaire
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

  // console.log(props);


//Tous les commentaires d'un post
  const allComment2 = props.comment?.length > 0 && props.comment.map((com,i) => {
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
//Toutes les images d'un post
  const allPic = props.pictures?.length > 0 && props.pictures.map((pic, i) => {
   const indexOfPic = props.pictures.indexOf(pic);
  //  console.log(props.pictures[selectedPic]?.url);
    return (
      <div style={{display:'flex',}} key={i}> 
        <img 
          src={pic.url ? pic.url : pic}
          alt={pic.cloudId ? pic.cloudId : `image ${i}`}
          name={`image ${i}`}
          className={styles.picOfTweet}
          onClick={() => setSelectedPic(indexOfPic)}
        />
      </div>
    )
  })


//Mise en forme pour les # 
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
  



//Dimension écran
const getScreenWidth = () => {
  return window.innerWidth;
};
//Style des images en fonction de la taille de l'écran
const getContainerStyle = () => {
  let nbrImage = props.pictures?.length;
  let longueurImg;
  let widthTweet;
  if (getScreenWidth() < 600) {
    longueurImg = nbrImage * 200;
    widthTweet = getScreenWidth()*0.8;
  } else {
    longueurImg = nbrImage * 400;
    widthTweet = getScreenWidth()*0.6;
  };
  if (longueurImg > widthTweet) {
    return { justifyContent: 'flex-start'}
  } else {
    return { justifyContent: 'center'}
  };
};


//Grande image suivante
const handleNextPic = () => {
  if(selectedPic < props.pictures?.length - 1) {
    setSelectedPic(selectedPic + 1);
  }
};

//grande image précédente
const handlePrevpic = () => {
  if (selectedPic > 0) {
    setSelectedPic(selectedPic -1)
  }
};

// console.log(props.pictures.length);
// console.log(selectedPic);

// console.log(props.user);
// console.log(user);

  return (
    <ErrorBoundary fallback={
      <section style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}> 
        <div className="errorMsg">Oups, il y a eu un soucis ...</div>
        <FontAwesomeIcon
                  icon={faFaceSadTear}
                  size="8x"
                /> 
      </section>}
      >

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
          </div>
        </div>

        <div>
          <p className={styles.description}>
            {formatDescription(props.description)}
          </p>
        </div>
        
          {props.pictures && props.pictures.length > 0 ?
            // <div className={styles.picContainer} style={{ justifyContent: props.pictures?.length > 3 ? 'flex-start': 'center'}}>
               <div className={`${styles[theme]} ${styles.picContainer}`}  style={getContainerStyle()}>
              {allPic}
            </div> 
            : ""}

      {selectedPic !== null && (
        <div className={styles.bigPicContainer} id="bigPicContainer" ref={bigPicContainerRef} >
          {/* <div className={styles.bigPicCenter}> */}
            { getScreenWidth() >= 600 && selectedPic > 0 && <div 
              className={`${styles[theme]} ${styles.navigationBtn}`}
              style={{left: 0}} 
              onClick={handlePrevpic} 
              >
              <FontAwesomeIcon 
              icon={faChevronLeft}
              size="xl"
                />
            </div>}
            <img 
              id="bigPic" 
              ref={bigPicRef}
              src={props.pictures[selectedPic].url}
              alt={`image Zoom`}
              name={`image Zoom`}
              className={styles.bigPic} 
              />
            { getScreenWidth() >= 600 && selectedPic < props.pictures?.length - 1 && <div 
              className={`${styles[theme]} ${styles.navigationBtn}`} 
              style={{right: 0}}
              onClick={handleNextPic} 
              >
              <FontAwesomeIcon 
              icon={faChevronRight}
              size="xl"
                />
            </div> }
          {/* </div> */}
          <FontAwesomeIcon 
              icon={faCircleXmark} 
              size="xl"
              onClick={()=> setSelectedPic(null)} 
              className={styles.xClosePic}
              style={{ 
                cursor: 'pointer', 
                color:'#fff',
                // marginRight: '2rem',
                // marginTop:'1rem',
                }}
                />
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
            />   <span className={styles.likesText}>    {   props.comment?.length > 0 ? props.comment?.length : ""} </span>
          </div> 

           {user.token === props.user?.token && (
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
          <div >  

              
            {/* <button className={styles.addButton} onClick={testFindUserId}> Post </button>         */}
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
    </ErrorBoundary>
  );
});

export default Tweet;
