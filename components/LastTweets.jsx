import { useEffect, useState } from "react";
import Tweet from "./Tweet";
import { useSelector, useDispatch } from "react-redux";
import styles from "../styles/LastTweet.module.css";
import { addHashtag, removehashTag } from '../reducers/hashtags';

function LastTweets() {
  const user = useSelector((state) => state.users.value);
  const hashtag = useSelector((state) => state.hashtags.value);
  const dispatch = useDispatch();

  //console.log(hashtag);

  const [tweetsData, setTweetsData] = useState([]);
  const [tweet, setTweet] = useState("");
  const [tweetsLiked, setTweetsLiked] = useState([]);

  //const [allhashtags, setAllhashtags] = useState([]);

  const fetchTweet = () => {
    fetch("http://localhost:3000/tweets/lastTweet")
      .then((res) => res.json())
      .then((data) => {
        //console.log(data.tweets);
        const likes = [];
        data.tweets.map((tweet) => {
          let liker = tweet.nbLike;
          if (liker && liker.length > 0) {
            if (liker.includes(user.id)) {
              likes.push(tweet);
            }
          }          
        });
        setTweetsLiked(likes);
        setTweetsData(data.tweets.reverse());
      });
  }

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

  useEffect(() => {
    fetchTweet();
  }, []);

  const handleAddTweet = () => {
    let hashtags = tweet.split(" ").filter((e) => new RegExp("#").test(e));
    hashtags = hashtags.map((e) => e.split("#")[1]);
    const newPost = {
      user: user.id,
      description: tweet,
      hashtags: hashtags,
    }
    console.log(newPost);
    fetch("http://localhost:3000/tweets/create", {
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

/*
        createdTweet.tweet.hashtags.map((hashtag) => {
          fetch(`http://localhost:3000/trends/update/${hashtag}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tweetId: createdTweet.tweet._id }),
          })
            .then((res) => res.json())
            .then((updatedData) => {
              if (!updatedData.result) {
                fetch("http://localhost:3000/trends/create", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    hashtag,
                    tweets: createdTweet.tweet._id,
                  }),
                })
                  .then((res) => res.json())
                  .then((createdHashtag) => {
                  });
              }
            });
        });*/
      });
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
        setTweetsData(tweetsData.filter((e) => e._id !== id));
      });
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

  const tweets = tweetsData.map((tweet, i) => {
    //console.log(tweet);
    return (
      <Tweet
        key={i}
        {...tweet}
        handleLike={handleLike}
        isLiked={tweetsLiked.some((e) => {
          console.log(e);
          return !!e && e === tweet._id;
        })}
        handleDelete={handleDelete}
      />
    );
  });

  return (
    <div className={styles.tweetPage}>
      <h2 className={styles.titlePage}>Flower new's</h2>
      <div className={styles.addTweet}>
        <input
          type="text"
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          className={styles.inputLastTweets}
          maxLength={280}
        />
        <div className={styles.dessousInput}>
          <span className={styles.lengthText}>{tweet.length}/280</span>
          <button onClick={handleAddTweet} className={styles.addButton}>
            Tweet
          </button>
        </div>
      </div>
      <div className={styles.lastTweetsContainer}>{tweets}</div>
    </div>
  );
}

export default LastTweets;
