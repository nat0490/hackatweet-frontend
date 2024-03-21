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
import { RiseLoader } from 'react-spinners';



function LastTweets() {

  const tweetRef = useRef();
  const dispatch = useDispatch();

  // const URL = "http://localhost:3000/";
  const URL = "https://hackatweet-backend-iota-three.vercel.app/";

  const user = useSelector((state) => state.users.value);
  const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light'); 
  const tweetILkd = useSelector(state => state.likes.value.find(e=> e.user === user.token)?.tweet); 
  //const tweetILkd = [];

  const [ tweetsData, setTweetsData] = useState([]);
  const [ tweet, setTweet] = useState("");
  const [ privat, setPrivat ] = useState(false);
  const [ addPic, setAddPic ] = useState(false);
  const [ loadPic, setLoadPic ] = useState([]);

  const [ resetChild, setResetChild ] = useState(false);
  const [ isLoadingChild, setIsLoadingChild] = useState(false);

  const [ start, setStart ] = useState(false);
  const [activeToggle, setActiveToggle] = useState(false);


  useEffect(() => {
//Charger les tweets au chargemet de la page
    fetchTweet();
  }, []);

  useEffect(()=>{
    //Quand il y a des données dans loadPic (envoyé de la page addPic après le téléchargement sur cloudy), poster la publication
        if(loadPic.length > 0){
          //console.log("lancer le post")
          postTweet()
        }
      },[loadPic])


  const fetchTweet = () => {
//Fetcher les tweets
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
    setResetChild(false);
    setLoadPic(picPath)
  };

// Changez la valeur de resetChild à false après que les actions sont terminées
  const handleChildReset = () => {
    setResetChild(false); 
  };
 
//AU CHARGEMENT DES IMAGE CHEZ L'ENFANT: isLoading change de status
const handleLoadingChange = (loading) => {
  setIsLoadingChild(loading);
};

  
//Poster un tweet
  const postTweet = () => {
    //let hashtags = tweet.split(" ").filter((e) => new RegExp("#").test(e));
   // let tags = tweet.split(/[ ,;.!@$%^&*()_+{}\[\]:;<>,.?~\\/-]+/).filter((e) => e.startsWith("#"));

   //A MODIFIER pour séparer 2 # collé "actuellement #manger#boire s'envoie sur un hash manger#boire en BDD"
    let tags = tweet.match(/#(\w+)/g) || []; 
    let hashtags = tags.map((tag) => tag.substring(1)); 
    let pictures = [];

    if(loadPic.length > 0) {
      loadPic.forEach((pic=>{
        pictures.push(pic.toString())
      }))
    };

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
          if (createdTweet.tweet.hashtags.length > 0) {
            fetchAllTags(dispatch);
          };
        } else {
          console.log(createdTweet.error);
          setActiveToggle(!activeToggle);
        }
       
      });
      setStart(false);
  };

//Appuie sur le boutton POST
//ATTENTION:: Manque le cas ou la page est ouverte mais sans photo!!!! Rien ne se passe actuellement!!! 
  const handlePost = () => {
    //Si page addPic ouvert, passer start à true pour lancer le téléchargement des pic sur cloudy
    if (addPic) {
      setStart(true)
    //Si la page addPic est fermé, poster le tweet
    } else {
      postTweet()
    }
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
      <h3 className={styles.titlePage}>Flowst</h3>
      <div className={`${styles[theme]} ${styles.addTweet}`}>
        <input
          type="text"
          name="createPost"
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          className={`${styles[theme]} ${styles.inputLastTweets}`}
        />
        <div className={styles.addPictureContainer}> 

          { addPic && 
            <AddPicture
            //Appuie sur boutton POST
              onStart={start}
              onImagesLoaded={onImagesLoaded}
              //Changement du status is Loading
              onLoadingChange={handleLoadingChange}
            //Post effectué, mettre à blanc toutes les données pictures
              resetChild={resetChild}
            //Communication pic => lastTweet pour les données mise à vide
              onChildReset={handleChildReset}
              //Activité de l'affichage de la page addPicture
              onAddPic={addPic}
              onHandleAddTweet={postTweet}

            />}  
        </div>

        <div className={styles.dessousInput}>
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
              onClick={handlePost} 
              className={`${styles.addButton} `}
              >
            Post
          </button> 
          
        </div>

        { activeToggle && 
          <section className={`${styles[theme]} ${styles.popAlert}`} >
            <aside>
                <h4 className={styles.titleAlert}>Vous devez mettre quelque chose à poster...</h4>
                <button type="button" className={`${styles[theme]} ${styles.btnAlert}`} onClick={()=>setActiveToggle(!activeToggle)}>Ok</button>
            </aside>
          </section>

        }
        
      </div>
      <div className={styles.lastTweetsContainer}>
        {tweetsData.length === 0 ? 
          <div className={styles.spinner}><BeatLoader color="#EA3680"/>
          </div> : 
          tweets}
      </div>

      
    </div>
  );
}

export default LastTweets;
