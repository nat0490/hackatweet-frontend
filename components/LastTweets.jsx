import React, {useRef} from 'react';
import { useEffect, useState } from "react";
import Tweet from "./Tweet";
import AddPicture from './AddPicture';
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/LastTweet.module.css";
import { addLikedTweet, rmvLikedTweet, rmvAlltweet, rmvAllTweetAndComment } from '../reducers/likes';
import { fetchAllTags} from '../utils';
import { BeatLoader } from 'react-spinners';
import { faImage, faLock, faLockOpen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



function LastTweets() {

  const tweetRef = useRef();
  const dispatch = useDispatch();

  // const URL = "http://localhost:3000/";
  const URL = "https://hackatweet-backend-iota-three.vercel.app/";

  const user = useSelector((state) => state.users.value);
  const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light'); 
  const tweetILkd = useSelector(state => state.likes.value.find(e=> e.user === user.token)?.tweet); 
  //const tweetILkd = [];
  const tweetComment = useSelector(state => state.likes.value); 

  const [ tweetsData, setTweetsData] = useState([]);
  const [ tweet, setTweet] = useState("");
  const [ privat, setPrivat ] = useState(false);
  const [ addPic, setAddPic ] = useState(false);
  const [ loadPic, setLoadPic ] = useState([]);

  //console.log("loadpic:", loadPic);

  const [ resetChild, setResetChild ] = useState(false);



  const [ isLoadingChild, setIsLoadingChild] = useState(false);



  //console.log("isLoadingPic:", isLoadingChild);

//AU CHARGEMENT DES IMAGE CHEZ L'ENFANT: isLoading change de status
  const handleLoadingChange = (loading) => {
    setIsLoadingChild(loading);
  };


  useEffect(() => {
    fetchTweet();
  }, []);


  const fetchTweet = () => {
    fetch(`${URL}tweets/lastTweet`)
      .then((res) => res.json())
      .then((data) => {
        if (data.tweets) {
          setTweetsData(data.tweets.reverse());
        } else {
          console.error("Error in fetchTweet: Response is missing 'tweets' field", data);
        }
      })
      .catch((error) => {
        console.error("Error in fetchTweet:", error);
      });
  };


//A LE FIN DU CHARGEMENT DES IMAGES
  const onImagesLoaded = (picPath) => {
    //console.log("image chargé:", picPath);
    setResetChild(false);
    setLoadPic(prevLoadPic => [...prevLoadPic, picPath]);
    // setLoadPic([picPath])
  };


  const handleChildReset = () => {
    // Effectuez les actions nécessaires ici, par exemple, changez la valeur de resetChild
    setResetChild(false); // Changez la valeur de resetChild à false après que les actions sont terminées
  };
 


  const handleAddTweet = () => {
    //let hashtags = tweet.split(" ").filter((e) => new RegExp("#").test(e));
   // let tags = tweet.split(/[ ,;.!@$%^&*()_+{}\[\]:;<>,.?~\\/-]+/).filter((e) => e.startsWith("#"));

   //A MODIFIER pour séparer 2 # collé "actuellement #manger#boire s'envoie sur un hash manger#boire en BDD"
    let tags = tweet.match(/#(\w+)/g) || []; 
    let hashtags = tags.map((tag) => tag.substring(1)); 
    let pictures = loadPic[0].length > 0 ?  loadPic[0] : [];
   
    console.log(pictures);
      
      
      //{loadPic[0] : "";

    const newPost = {
      user: user.id,
      description: tweet,
      privat: privat,
      pictures: pictures,
      hashtags: hashtags,
    }
    fetch(`${URL}tweets/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    })
      .then((res) => res.json())
      .then((createdTweet) => {
        //console.log(createdTweet);
        
        if (createdTweet.result) {
          fetchTweet();
          setTweet("");
          setLoadPic([]);
          setPrivat(false);
          setResetChild(true);
          setAddPic(false);
        } else {
          console.log("erreur")
        }
        if (createdTweet.tweet.hashtags.length > 0) {
          fetchAllTags(dispatch);
        }
      });
  };


  

  const handleDelete = (id) => {
    fetch(`${URL}tweets/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTweetsData(tweetsData.filter((e) => e._id !== id));
        fetchAllTags(dispatch);
      });
  };

  const updateLikedTweet = (tweetId) => {
    //dispatch(rmvAlltweet());
    if (tweetILkd?.some(tweet => tweet === tweetId)) {  
      dispatch(rmvLikedTweet({user: user.token, tweet: tweetId}));  
      //console.log("rmv t:", tweetComment);  
    } else {     
      dispatch(addLikedTweet({user: user.token, tweet: tweetId}));
      //console.log("add t:", tweetComment);
    } 
  };

  const handleAddPictures = () => {
    //console.log("addPictures");
    setAddPic(!addPic);
  };

  const tweets = tweetsData.map((tweet) => {
    return (
      <Tweet
        ref={tweetRef}
        key={tweet._id}
        {...tweet}
        updateLikedTweet={updateLikedTweet}
        isLiked={tweetILkd?.some( e => e === tweet._id )}        
        handleDelete={handleDelete}
        fetchTweet={fetchTweet}
      />
    );
  });

  return (
    <div className={`${styles[theme]} ${styles.tweetPage}`}>
      <h3 className={styles.titlePage}>Flower New's</h3>
      <div className={`${styles[theme]} ${styles.addTweet}`}>
        <input
          type="text"
          name="createPost"
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          className={`${styles[theme]} ${styles.inputLastTweets}`}
          // maxLength={280}
        />
        <div className={styles.addPictureContainer}> 
          { addPic && 
            <AddPicture
              onImagesLoaded={onImagesLoaded}
              onLoadingChange={handleLoadingChange}
              resetChild={resetChild}
              onChildReset={handleChildReset}
              onAddPic={addPic}
            />}  
        </div>
        <div className={styles.dessousInput}>
          
          {/* <span className={styles.lengthText}>{tweet.length}/280</span> */}
          <FontAwesomeIcon
                icon={faImage}
                size="lg"
                onClick={handleAddPictures}
                // style={{ cursor: 'pointer'}}
                className={styles.icon}
              /> 
          <FontAwesomeIcon
                icon={faLock}
                size="lg"
                onClick={() => setPrivat(true)}
                style={{ cursor: 'pointer', color: privat ? 'EA3680' : "" }}
                className={styles.icon}
              /> 
          <FontAwesomeIcon
                icon={faLockOpen}
                size="lg"
                onClick={() =>setPrivat(false)}
                style={{ cursor: 'pointer', color: privat ? '' : "#EA3680" }}
                className={styles.icon}
              /> 

           
            <button 
              onClick={isLoadingChild ? null : handleAddTweet} 
              className={`${styles.addButton} `} 
              style={isLoadingChild ? { cursor: 'progress' } : {}}
              >
            Post
          </button> 
          
        </div>
        
      </div>
      <div className={styles.lastTweetsContainer}>{tweetsData.length === 0 ? <div className={styles.spinner}><BeatLoader color="#EA3680"/></div> : tweets}</div>
    </div>
  );
}

export default LastTweets;
