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

  // const URL = "http://localhost:3000/";
  const URL = "https://flowst-backend.vercel.app/";

  const [ hashtag, setHashtag] = useState(null);
  const [ tweetsLiked, setTweetsLiked] = useState([]);
  const [ isLoading, setIsLoading] = useState(false);
  const [ allTweet, setAllTweet ] = useState(null);
  const [ nbMatch, setNbMatch ] = useState(null);

  

  useEffect(() => {
    setHashtag(router.query.hashtagName);
    fetchTweet();
  }, [router.query.hashtagName]);

  const allMatchingTweets = allTweet?.filter(tweet => {
    const allMatchingHashtags = tweet.hashtags?.filter(tag => tag.toLowerCase().startsWith(hashtag?.toLowerCase()));
    return allMatchingHashtags.length > 0;
  });

  useEffect(()=> {
    setNbMatch(allMatchingTweets?.length);
  },[allMatchingTweets])

  const fetchTweet = async () => {
    setIsLoading(true)
    try {
      setAllTweet(null);
      const res = await fetch(`${URL}tweets/lastTweet`);
      const data = await res.json();
      //console.log(data.tweets);
      setAllTweet(data.tweets.reverse());
    } catch(error) {
        console.error("Error in fetchTweet:", error);
      };
      setIsLoading(false);
  };


  

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

  const handleDelete = (id) => {
    fetch(`${URL}tweets/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => res.json())
      .then(() => {
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

 
 
const afficheTweet = allTweet?.map((tweet, i) => {
    const isMatchingHashtags = tweet.hashtags?.some(tag => tag.toLowerCase().startsWith(hashtag?.toLowerCase()));
    if (isMatchingHashtags ) {
        return (
          <Tweet
            {...tweet}
            key={i}
            handleLike={handleLike}
            isLiked={tweetsLiked.some((e) => !!e && e === tweet._id)}
            handleDelete={handleDelete}
          />
        );
    } 
});


  return (
    <div className={styles.PageAcceuil}>
      <div className={`${styles[theme]} ${styles.hashtagPage}`}> 
      {/* { nbMatch && nbMatch > 0 ? 
      <h3 className={`${styles[theme]} ${styles.titlePage}`}> {nbMatch} post{nbMatch > 1 && "s"}</h3> : 
      !isLoading && <div className={styles.noFound}>Pas de <span className={styles.postNoFound}>post</span> trouvé </div> } */}
        <div className={styles.tweetContainer}>
          { 
            isLoading ? <div className={styles.spinner}><BeatLoader color="#EA3680"/></div> : afficheTweet 
          }
        </div>
      </div>
    </div>
  );
}

export default Hashtag;
