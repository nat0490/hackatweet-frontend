import React, {useRef} from 'react';
import { useEffect, useState } from "react";
import Tweet from "./Tweet";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/LastTweet.module.css";
import { addHashtag, removehashTag } from '../reducers/hashtags';
import { addLikedTweet, rmvLikedTweet, rmvAlltweet } from '../reducers/likes';
import { addShowComment, rmvShowComment, rmvAllShowComment} from '../reducers/showComment';


function LastTweets() {

  const tweetRef = useRef();
  const dispatch = useDispatch();
  const URL = 'http://localhost:3000/';
  const user = useSelector((state) => state.users.value);
  const theme = useSelector(state => state.theme.value); 
  const tweetILkd = useSelector(state => state.likes.value.tweet); 
  const commentILook = useSelector(state => state.showComment.value);
  //console.log(commentILook);

  const [tweetsData, setTweetsData] = useState([]);
  const [tweet, setTweet] = useState("");
  
  useEffect(() => {
    fetchTweet();
    //fetchAllHashtag();
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

  const fetchAllHashtag = () => {
    const nbrOccurence = (tab) => {
      const occurences = [];  
      for (let i = 0; i < tab.length; i++) {
        const element = tab[i];  
        occurences[element] = (occurences[element] || 0) + 1;
      }
      dispatch(removehashTag());
      dispatch(addHashtag(occurences));
    };
    fetch(`${URL}tweets/lastTweet`)
      .then((res) => res.json())
      .then((data) => {     
        if (data.tweets) {       
          const hashtagsFind = [];
          data.tweets.map((tweet) => {
            let hashT = tweet.hashtags;
            if (hashT && hashT.length > 0) {
              hashtagsFind.push(...hashT);
            }          
          }); 
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

  const tweets = tweetsData.map((tweet) => {
    return (
      <Tweet
        ref={tweetRef}
        key={tweet._id}
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
          name="createPost"
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
