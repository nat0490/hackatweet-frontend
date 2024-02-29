import React, { useEffect, useState } from 'react';
import Link from "next/link";
import styles from "../styles/Trend.module.css";
import { useSelector } from "react-redux";
import { fetchAllTags } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function Trend() {

  const hashtag = useSelector((state) => state.hashtags.value);
  const user = useSelector(state => state.users.value);
  const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light'); 
  //console.log(hashtag);

  const [ findTag, setFindTag ] = useState(null);
  const [ noResult, setNoResult ] = useState(null);

  useEffect(()=> {
    if (hashs.every(e => e === undefined)) {
      setNoResult(true);
     } else {
       setNoResult(false);
     }
  }, [hashs, findTag])

  const hashs = Object.entries(hashtag[0])
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value], i) => {
      if (findTag) {
        if (key.includes(findTag.toLowerCase())) {
          return (
            <div key={i} className={styles.oneTweet}>
              <Link href={`/hashtag/${key}`}>
                <a className={`${styles[theme]} ${styles.hashtagName}`}> #{key}</a>
              </Link>
              <p className={styles.totalTweet}>{value} post</p>
            </div>
          );
        };
      } else {
        return (
          <div key={i} className={styles.oneTweet}>
            <Link href={`/hashtag/${key}`}>
              <a className={`${styles[theme]} ${styles.hashtagName}`}> #{key}</a>
            </Link>
            <p className={styles.totalTweet}>{value} post</p>
          </div>
        );
      }
  });


  return (
    <div className={`${styles[theme]} ${styles.trendPage}`}>
      <div className={styles.findHashtag}> 
        <input
          type="text"
          name="rechercheTag"
          value={findTag}
          onChange={e => setFindTag(e.target.value)}
          className={`${styles[theme]} ${styles.inputHashtag}`}
        />
        
        <div className={styles.oneLogo}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size="xl"
          /> 
        </div>
      </div>
      <div className={`${styles[theme]} ${styles.hashtagContainer}`}>{ noResult?<span className={styles.noResult}>Pas de résultat</span> : hashs }</div>
    </div>
  );
}

export default Trend;
