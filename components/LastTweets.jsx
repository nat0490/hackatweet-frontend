import React, {useRef} from 'react';
import { useEffect, useState } from "react";
import Tweet from "./Tweet";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/LastTweet.module.css";
import { addLikedTweet, rmvLikedTweet, rmvAlltweet, rmvAllTweetAndComment } from '../reducers/likes';
import { addTheme, resetTheme,changeTheme } from '../reducers/theme';
import { fetchAllTags} from '../utils';
import { BeatLoader } from 'react-spinners';



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

  const [tweetsData, setTweetsData] = useState([]);
  const [tweet, setTweet] = useState("");


  //console.log("tweetILkd:", tweetComment);
  //console.log("tweet & comment:", tweetComment);
  
  
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


  const handleAddTweet = () => {
    //let hashtags = tweet.split(" ").filter((e) => new RegExp("#").test(e));
   // let tags = tweet.split(/[ ,;.!@$%^&*()_+{}\[\]:;<>,.?~\\/-]+/).filter((e) => e.startsWith("#"));
    //let hashtags = tags.map((e) => e.substring(1)); 
    let tags = tweet.match(/#(\w+)/g) || []; 
    let hashtags = tags.map((tag) => tag.substring(1)); //
    //console.log(hashtags); 
    const newPost = {
      user: user.id,
      description: tweet,
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
        fetchTweet();
        setTweet("");
        if (!createdTweet.result) {
          return;
        };
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
        <div className={styles.dessousInput}>
          {/* <span className={styles.lengthText}>{tweet.length}/280</span> */}
          <button onClick={handleAddTweet} className={styles.addButton}>
            Post
          </button>
        </div>
        
      </div>
      <div className={styles.lastTweetsContainer}>{tweetsData.length === 0 ? <div className={styles.spinner}><BeatLoader color="#EA3680"/></div> : tweets}</div>
    </div>
  );
}

export default LastTweets;
