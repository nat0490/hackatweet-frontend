import React, {useRef} from 'react';
import { useEffect, useState } from "react";
import Tweet from "./Tweet";
import AddPicture from './AddPicture';
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/LastTweet.module.css";
import { addLikedTweet, rmvLikedTweet, rmvAlltweet, rmvAllTweetAndComment } from '../reducers/likes';
import { fetchAllTags} from '../utils';
import { BeatLoader } from 'react-spinners';
import { faImage, faLock, faLockOpen, faFaceSadTear, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorBoundary } from "react-error-boundary";
// import axios from "axios";




function LastTweets() {

  const tweetRef = useRef(null);
  const toggleSuccesPostRef = useRef(null);
  const dispatch = useDispatch();

  // const URL = "http://localhost:3000/";
  const URL = "https://flowst-backend.vercel.app/";

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
  const [ activeToggle, setActiveToggle] = useState(false);
  const [ activeToggleSuccesPost, setActiveToggleSuccesPost] = useState(false);


  useEffect(() => {
//Charger les tweets au chargemet de la page
    fetchTweet();
  }, []);

//Quand il y a des données dans loadPic (envoyé de la page addPic après le téléchargement sur cloudy), poster la publication
  useEffect(()=>{
    if(loadPic.length > 0){
      postTweet()
    }
  },[loadPic]);

//Ecoute pour détecter le click en dehors du toggle SuccesPost
  useEffect(() => {
    let timeoutId;
    if (activeToggleSuccesPost) {
      timeoutId = setTimeout(()=> {
        document.addEventListener('click', () => setActiveToggleSuccesPost(false))
      }, 100);
    }
  }, [activeToggleSuccesPost]);



  const fetchTweet = async() => {
//Fetcher les tweets
try {
  const res = await fetch(`${URL}tweets/lastTweet`);
  const data = await res.json();
  if (data.tweets) {
      setTweetsData(data.tweets.reverse());
    } else {
      console.error("Error lors du fetchTweet:", data);
    }
  } catch(error) {
    console.log("Erreur serveur")
  }
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
  const postTweet = async() => {
    //let hashtags = tweet.split(" ").filter((e) => new RegExp("#").test(e));
   // let tags = tweet.split(/[ ,;.!@$%^&*()_+{}\[\]:;<>,.?~\\/-]+/).filter((e) => e.startsWith("#"));

   //A MODIFIER pour séparer 2 # collé "actuellement #manger#boire s'envoie sur un hash manger#boire en BDD"
    let tags = tweet.match(/#(\w+)/g) || []; 
    let hashtags = tags.map((tag) => tag.substring(1)); 
    let pictures = [];

    if(loadPic.length > 0) {
      // loadPic.forEach((pic=>{
      //   pictures.push(pic)
      // }))
      pictures = loadPic;
    };

    // console.log(pictures);

    const newPost = {
      user: user.id,
      description: tweet,
      privat: privat,
      pictures: pictures,
      hashtags: hashtags,
    };

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
          setActiveToggleSuccesPost(true);
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
  const handlePost = () => {
    // console.log("click");
    // console.log(start);
        //Si page addPic ouvert, passer start à true pour lancer le téléchargement des pic sur cloudy
    if (addPic) {
      setStart(true)
    //Si la page addPic est fermé, poster le tweet
    } else {
      postTweet()
    }
  };
  
//Supprimer un post
  const handleDelete = async(id) => {
    try {
      const res = await fetch(`${URL}tweets/delete2`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      });
      const data = await res.json();
      if (data.result){
        setTweetsData(tweetsData.filter((e) => e._id !== id));
        fetchAllTags(dispatch);
      } else {
        console.log("erreur lors de la suppression:",data.error)
      }
    } catch(error){
      console.log("erreur lors de la suppression:", error)
    }
  };



// //Supprimer les images d'un post
//  const handleDeletePic = async(allPic) => {
//   // console.log(allPic);
//   allPic?.forEach(async (pic) => {
//     // console.log(pic);
//     const encodedCloudId = encodeURIComponent(pic.cloudId);
//   try {
//     const res = await axios.post(`${URL}tweets/destroy/${encodedCloudId}`);
//     // console.log("ok:", res.status);
//     if(res.status === 200) {
//       console.log("picture delete from cloudinary")
//     } else {
//       console.log("error: failed to delete picture from cloudinary")
//     }
//   } catch(error) {
//     console.log({error: error});
//   }
//   })
//  };

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

  const tweets = tweetsData.length > 0 && tweetsData.map((tweet) => {
    return (
      <Tweet
        ref={tweetRef}
        key={tweet._id}
        {...tweet}
        updateLikedTweet={updateLikedTweet}
        // isLiked={tweetILkd?.some( e => e === tweet._id )}        
        handleDelete={handleDelete}
        fetchTweet={fetchTweet}
      />
    );
  });

  const updateFailedStart = () => {
    setStart(!start);
  }

  return (
    <ErrorBoundary fallback={
      <section style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}> 
      <div className="errorMsg">Oups, il y a eu un soucis ...</div>
      <FontAwesomeIcon
                icon={faFaceSadTear}
                size="8x"
              /> 
    </section>}>



    <div className={`${styles[theme]} ${styles.tweetPage}`}>
      {/* <h3 className={styles.titlePage}>Flowst</h3> */}
    { user.token &&
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
          // <div style={{height: start ? "10rem" : ""}}>
            <AddPicture
              
            //Appuie sur boutton POST
              onStart={start}
              updateFailedStart={updateFailedStart}
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

            />
            // </div>
            }  
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

        { activeToggleSuccesPost &&
          <section className={`${styles[theme]} ${styles.popAlert}`} ref={toggleSuccesPostRef}>
          <aside>
              <h4 className={styles.titleAlert}>Post publié!</h4>
              <FontAwesomeIcon
                icon={faCheck}
                size="2x"
                onClick={() =>setPrivat(false)}
                style={{ color: "#EA3680" }}
                className={styles.icon}
              /> 
          </aside>
        </section>
         }  


      </div>
        
      }  


      <div className={styles.lastTweetsContainer}>
        {tweetsData.length === 0 ? 
          <div className={styles.spinner}><BeatLoader color="#EA3680"/>
          </div> : 
          tweets}
      </div>

      
    </div>
    </ErrorBoundary>
  );
}

export default LastTweets;
