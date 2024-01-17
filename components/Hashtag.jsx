import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Tweet from "./Tweet";
import styles from "../styles/Hashtag.module.css";
import UserInfo from "./UserInfo";
import Trend from "./Trend";
import { addHashtag, removehashTag } from '../reducers/hashtags';
import { useDispatch } from "react-redux";


function Hashtag() {
  const router = useRouter();
  const dispatch = useDispatch();
  

  const [hashtag, setHashtag] = useState(router.query.hashtagName);
  const [tweetMatch, setTweetMatch ] = useState([]);
  const [hashtagArray, setHashtagArray] = useState([]);
  const [tweetsLiked, setTweetsLiked] = useState([]);

  const fetchTweetForHashtag = (hash) => {
    fetch(`http://localhost:3000/tweets/hashtagNumber/${hash}`)
      .then(res => res.json())
      .then(hashtag => {
        console.log(hashtag.tweets);
        setTweetMatch([]);
        setTweetMatch(hashtag.tweets.reverse());
      })
  }

  useEffect(() => {
    setHashtag(router.query.hashtagName);
    //console.log(router.query.hashtagName)
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
    fetch("http://localhost:3000/tweets/delete", {
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
    fetch("http://localhost:3000/tweets/lastTweet")
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

  const allArrayForHashtag = hashtagArray.map((tweet, i) => (
    <Tweet
      {...tweet}
      key={i}
      handleLike={handleLike}
      isLiked={tweetsLiked.some((e) => !!e && e === tweet._id)}
    />
  ));

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
      <UserInfo className={styles.userInfo} />
      <div className={styles.hashtagPage}> 
        <div>
          <h2 className={styles.titlePage}>Hashtag Match</h2>
          <div className={styles.addTweet}>
            <input
              type="text"
              value={"#" + hashtag}
              onChange={(e) => setHashtag(e.target.value.replace(/^#/, ""))}
              className={styles.inputLastTweets}
            />
            <div className={styles.dessousInput}>
              {/*<span className={styles.lengthText}>{tweet.length}/280</span>*/}
              <button className={styles.addButton} onClick={handleFindTweetForHashtag}> Rechercher </button>
            </div>
          </div>



          
        </div>
        <div className={styles.tweetContainer}>{afficheTweet ? afficheTweet : "No tweets found with #hashtagname"}</div>
      </div>
      <Trend className={styles.trend}/>
    </div>
  );
}

export default Hashtag;
