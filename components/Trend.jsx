import React, { useEffect } from 'react';
import Link from "next/link";
import styles from "../styles/Trend.module.css";
import { useSelector } from "react-redux";
import { fetchAllTags } from '../utils';

function Trend() {

  const hashtag = useSelector((state) => state.hashtags.value);
  const user = useSelector(state => state.users.value);
  const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light'); 
  console.log(hashtag);

  const hashs = Object.entries(hashtag[0])
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value], i) => {
    return (
      <div key={i} className={styles.oneTweet}>
        <Link href={`/hashtag/${key}`}>
          <a className={`${styles[theme]} ${styles.hashtagName}`}> #{key}</a>
        </Link>
        <p className={styles.totalTweet}>{value} post</p>
      </div>
    );
  });
  

  return (
    <div className={`${styles[theme]} ${styles.trendPage}`}>
      <div className={`${styles[theme]} ${styles.hashtagContainer}`}>{ hashs }</div>
    </div>
  );
}

export default Trend;
