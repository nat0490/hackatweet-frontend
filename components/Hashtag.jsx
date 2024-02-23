import React from 'react';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Tweet from "./Tweet";
import styles from "../styles/Hashtag.module.css";
import { addHashtag, removehashTag } from '../reducers/hashtags';
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from 'react-spinners';


function Hashtag() {

  const user = useSelector(state => state.users.value);
  const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light'); 
  const router = useRouter();
  const dispatch = useDispatch();

  const URL = 'http://localhost:3000/'
  

  const [hashtag, setHashtag] = useState(router.query.hashtagName);
  const [tweetMatch, setTweetMatch ] = useState([]);
  const [tweetsLiked, setTweetsLiked] = useState([]);
  const [ isLoading, setIsLoading] = useState(false);

  

  const fetchTweetForHashtag = async (hash) => {
    try {
      setIsLoading(true);
      const data = await fetch(`${URL}tweets/hashtagNumber/${hash}`);
      const hashtag = await data.json();
      setTweetMatch([]);
      setTweetMatch(hashtag.tweets.reverse());
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching tweets:", error);
      setIsLoading(false);
    }
  };
      

  useEffect(() => {
    setHashtag(router.query.hashtagName);
    fetchTweetForHashtag(router.query.hashtagName);
  }, [router.query.hashtagName]);

  const handleLike = (id) => {
    const tweetLiked = tweetsLiked.find((e) => {
      return !!e && e === id;
    });
    if (!!tweetLiked) {
      setTweetsLiked(tweetsLiked.filter((e) => e !== id));
    } else {
      setTweetsLiked([...tweetsLiked, id]);
    }
  };

  const handleFindTweetForHashtag = () => {
    fetchTweetForHashtag(hashtag);
    //setHashtag("");
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
        //setTweetsData(tweetsData.filter((e) => e._id !== id));
        fetchAllHashtag();
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
        const hashtagsFind = [];
        data.tweets.map((tweet) => {
          let hashT = tweet.hashtags;
          if (hashT && hashT.length > 0) {
            hashtagsFind.push(...hashT);
          }          
        }); 
        //console.log(hashtagsFind);
        nbrOccurence(hashtagsFind);
      });
  }


  const afficheTweet = tweetMatch.map((tweet, i) => (
    <Tweet
      {...tweet}
      key={i}
      handleLike={handleLike}
      isLiked={tweetsLiked.some((e) => !!e && e === tweet._id)}
      handleDelete={handleDelete}
    />
  ));

  return (
    <div className={styles.PageAcceuil}>
      
      <div className={`${styles[theme]} ${styles.hashtagPage}`}> 
        <div>
          {/* <h3 className={`${styles[theme]} ${styles.titlePage}`}>Recherche par #</h3> */}
          <div className={`${styles[theme]} ${styles.addTweet}`}>
            <div className={styles.inputLine}> 
              <span className={styles.tag}>#</span>
              <input
                type="text"
                value={hashtag}
                onChange={(e) => setHashtag(e.target.value.replace(/^#/, ""))}
                className={styles.inputLastTweets}
              />
            </div>
            <div className={styles.dessousInput}>
              {/*<span className={styles.lengthText}>{tweet.length}/280</span>*/}
              <button className={styles.addButton} onClick={handleFindTweetForHashtag}> Rechercher </button>
            </div>
          </div>



          
        </div>
       
        <div className={styles.tweetContainer}>
          { isLoading?  <div className={styles.spinner}><BeatLoader color="#EA3680"/></div> : 
            tweetMatch.length > 0 ? afficheTweet : 
              <div className={styles.noFound}>Pas de <span className={styles.postNoFound}>post</span> trouvé </div>}</div>
      </div>
      
    </div>
  );
}

export default Hashtag;
