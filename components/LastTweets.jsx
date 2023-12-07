import { useEffect, useState } from "react";
import Tweet from "./Tweet";
import { useSelector } from "react-redux";
import styles from "../styles/LastTweet.module.css";

function LastTweets() {
  const user = useSelector((state) => state.users.value);

  console.log(user);

  const [tweetsData, setTweetsData] = useState([]);
  const [tweet, setTweet] = useState("");
  const [tweetsLiked, setTweetsLiked] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/tweets/lastTweet")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.tweets);
        const likes = [];
        data.tweets.map((tweet) => {
          if (tweet.whoLike.includes(user.id)) {
            likes.push(tweet);
          }
        });
        setTweetsLiked(likes);
        setTweetsData(data.tweets.reverse());
      });
  }, []);

  const handleAddTweet = () => {
    let hashtags = tweet.split(" ").filter((e) => new RegExp("#").test(e));
    hashtags = hashtags.map((e) => e.split("#")[1]);
    fetch("http://localhost:3000/tweets/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user.id,
        description: tweet,
        hashtags: hashtags,
      }),
    })
      .then((res) => res.json())
      .then((createdTweet) => {
        console.log(createdTweet);
        setTweetsData([...tweetsData, createdTweet.tweet]);
        if (!createdTweet.result) {
          return;
        }
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
              console.log(updatedData);
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
                    console.log(createdHashtag);
                  });
              }
            });
        });
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

  const tweets = tweetsData.map((tweet) => {
    console.log(tweet.user);
    return (
      <Tweet
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
      <h2 className={styles.titlePage}>Home</h2>
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
      <div>{tweets}</div>
    </div>
  );
}

export default LastTweets;
