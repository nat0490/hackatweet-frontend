import React, {useRef, useEffect} from 'react';
import UserInfo from "./UserInfo";
import LastTweets from "./LastTweets";
import Trend from "./Trend";
import styles from '../styles/Home.module.css';
import { useDispatch } from 'react-redux';
import { addHashtag, removehashTag } from '../reducers/hashtags';

function Home() {

  const userRef = useRef(null);
  const dispatch = useDispatch();
  const URL = 'http://localhost:3000/';

  useEffect(() => {
    //fetchTweet();
    fetchAllHashtag();
  }, []);

  const fetchTweet = () => {
    //console.log('fetch tweet');
    fetch(`${URL}tweets/lastTweet`)
      .then((res) => res.json())
      .then((data) => {
        if (data.tweets) {
          const likes = [];
          data.tweets.map((tweet) => {
            let liker = tweet.nbLike;
            if (liker && liker.length > 0) {
              if (liker.includes(user.id)) {
                likes.push(tweet);
              }
            }          
          });
          //setTweetsLiked(likes);
          //setTweetsData(data.tweets.reverse());
        } else {
          console.error("Error in fetchTweet: Response is missing 'tweets' field", data);
        }
      })
      .catch((error) => {
        console.error("Error in fetchTweet:", error);
      });
  };


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
          //console.log("tag ajouté")
        } else {
          console.error("Error in fetchHashtag: Response is missing 'tweets' field", data);
        }
      });
  }


  return (
    <div className={styles.PageAcceuil}>
      <UserInfo customClassName={styles.userInfo} ref={userRef}/>
      <div className={styles.lastTweetsContainer}>
        <LastTweets className={styles.lastTweets}/>
      </div>
      <Trend className={styles.trend}/>
    </div>
  );
};

export default Home;
