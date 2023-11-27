import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Tweet from "./Tweet";
import styles from "../styles/Hashtag.module.css";
import UserInfo from "./UserInfo";
import Trend from "./Trend";


function Hashtag() {
  const router = useRouter();

  const [hashtag, setHashtag] = useState(router.query.hashtagName);
  const [hashtagArray, setHashtagArray] = useState([]);
  const [tweetsLiked, setTweetsLiked] = useState([]);

  useEffect(() => {
    setHashtag(router.query.hashtagName);
    fetch(`http://localhost:3000/trends/oneHashtag/${hashtag}`)
      .then((response) => response.json())
      .then((hashtags) => {
        if (hashtags.result) {
          if (hashtags.hashtagFind.tweets) {
            setHashtagArray(hashtags.hashtagFind.tweets);
          }
        } else {
          setHashtagArray([]);
        }
      });
  }, [hashtag, router.query]);

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

  const allArrayForHashtag = hashtagArray.map((tweet, i) => (
    <Tweet
      {...tweet}
      key={i}
      handleLike={handleLike}
      isLiked={tweetsLiked.some((e) => !!e && e === tweet._id)}
    />
  ));

  return (
    <div className={styles.PageAcceuil}>
      <UserInfo className={styles.userInfo} />
      <div className={styles.hashtagPage}> 
        <div>
          <h2 className={styles.titlePage}>Hashtag</h2>
          <input
            type="text"
            className={styles.inputHashtag}
            onChange={(e) => setHashtag(e.target.value.replace(/^#/, ""))}
            value={"#" + hashtag}
          />
        </div>
        <div>{hashtagArray ? allArrayForHashtag : "No tweets found with #hashtagname"}</div>
      </div>
      <Trend className={styles.trend}/>
    </div>
  );
}

export default Hashtag;
