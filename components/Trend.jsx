import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/Trend.module.css";

function Trend() {
  const [hashtags, setHashtags] = useState([]);

  //A MODIFIER: METTRE A JOUR A CHAQUE NOUVEAU HASHTAG: à rajouter dans l'évenement onClick d'ajout d'un tweet?
  useEffect(() => {
    fetch("http://localhost:3000/trends/all")
      .then((response) => response.json())
      .then((hashtags) => {
        console.log(hashtags);
        if (hashtags.result) {
          setHashtags(hashtags.hashtags);
        }
      });
  }, []);

  const hashs = hashtags.map((data, i) => {
    return (
      <div key={i} className={styles.oneTweet}>
        <Link href={`/hashtag/${data.hashtag}`}>
          <a className={styles.hashtagName}> #{data.hashtag} </a>
        </Link>
        <p className={styles.totalTweet}>{data.tweets.length} tweet</p>
      </div>
    );
  });

  return (
    <div className={styles.trendPage}>
      <h2 className={styles.titlePage}>Trends</h2>
      <div className={styles.hashtagContainer}>{ hashtags && hashs }</div>
    </div>
  );
}

export default Trend;
