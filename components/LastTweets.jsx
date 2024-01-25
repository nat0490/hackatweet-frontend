import React, {useRef} from 'react';
import { useEffect, useState } from "react";
import Tweet from "./Tweet";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/LastTweet.module.css";
import { addHashtag, removehashTag } from '../reducers/hashtags';
import { addLikedTweet, rmvLikedTweet, rmvAlltweet } from '../reducers/likes';

function LastTweets() {

  const tweetRef = useRef();
  const dispatch = useDispatch();
  const URL = 'http://localhost:3000/';
  const user = useSelector((state) => state.users.value);
  const theme = useSelector(state => state.theme.value); 
  const tweetILkd = useSelector(state => state.likes.value.tweet); 
  //console.log(tweetILkd);

  const [tweetsData, setTweetsData] = useState([]);
  const [tweet, setTweet] = useState("");

  useEffect(() => {
    fetchTweet();
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
          setTweetsData(data.tweets.reverse());
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
        } else {
          console.error("Error in fetchHashtag: Response is missing 'tweets' field", data);
        }
      });
  }

  const handleAddTweet = () => {
    let hashtags = tweet.split(" ").filter((e) => new RegExp("#").test(e));
    hashtags = hashtags.map((e) => e.split("#")[1]);
    const newPost = {
      user: user.id,
      description: tweet,
      hashtags: hashtags,
    }
    console.log(newPost);
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
        fetchTweet();
        setTweet("");
        //setTweetsData([...tweetsData, createdTweet.tweet]);
        if (!createdTweet.result) {
          return;
        };
        if (createdTweet.tweet.hashtags.length > 0) {
          console.log(createdTweet.tweet.hashtags);
          fetchAllHashtag();
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
        fetchAllHashtag();
      });
  };

  const updateLikedTweet = (tweetId) => {
    //dispatch(rmvAlltweet());
    if (tweetILkd.some(tweet => tweet === tweetId)) {  
      dispatch(rmvLikedTweet(tweetId));    
    } else {     
      dispatch(addLikedTweet(tweetId));
    } 
  };

  const tweets = tweetsData.map((tweet, i) => {
    return (
      <Tweet
        ref={tweetRef}
        key={i}
        {...tweet}
        updateLikedTweet={updateLikedTweet}
        isLiked={tweetILkd.some( e => e === tweet._id )}        
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
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          className={`${styles[theme]} ${styles.inputLastTweets}`}
          maxLength={280}
        />
        <div className={styles.dessousInput}>
          <span className={styles.lengthText}>{tweet.length}/280</span>
          <button onClick={handleAddTweet} className={styles.addButton}>
            Post
          </button>
        </div>
      </div>
      <div className={styles.lastTweetsContainer}>{tweets}</div>
    </div>
  );
}

export default LastTweets;
