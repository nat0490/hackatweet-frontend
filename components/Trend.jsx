import React, { useEffect, useState } from 'react';
import Link from "next/link";
import styles from "../styles/Trend.module.css";
import { useSelector } from "react-redux";
import { fetchAllTags } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faX } from "@fortawesome/free-solid-svg-icons";

function Trend() {

  const hashtag = useSelector((state) => state.hashtags.value);
  const user = useSelector(state => state.users.value);
  const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light'); 
  //console.log(hashtag);

  const [ findTag, setFindTag ] = useState(null);
  const [ noResult, setNoResult ] = useState(null);
  const [ saisieEnCours, setSaisieEnCours ] = useState(false);

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
              <Link href={`/hashtag/${key}`}>
                 <div key={i} className={styles.oneTweet}>
                  <a className={`${styles[theme]} ${styles.hashtagName}`}> #{key}</a>
                  <p className={styles.totalTweet}>{value} post</p>
                </div>
              </Link>
          );
        };
      } else {
        return (
          <Link 
            href={`/hashtag/${key}`}
            // onClick={() => setSaisieEnCours(false)}
            >
            <div key={i} className={styles.oneTweet}>
              <a className={`${styles[theme]} ${styles.hashtagName}`}> #{key}</a>
              <p className={styles.totalTweet}>{value} post</p>
            </div>
          </Link>
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
          onFocus={() => setSaisieEnCours(true)}
          onBlur={() => { !findTag && setSaisieEnCours(false)}}
          className={`${styles[theme]} ${styles.inputHashtag}`}
        />
        { findTag && 
        <div className={styles.icon}>
          <FontAwesomeIcon
                icon={faX}
                size="xs"
                onClick={() =>setFindTag("")}
                style={{ cursor: 'pointer', color: "grey" }}
              />  
        </div>
        
        }   
        { saisieEnCours && (window.innerWidth <= 600) ? "" :
          <div className={styles.oneLogo}>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size="xl"
            /> 
          </div>
        }

        {!saisieEnCours && (window.innerWidth <= 600) && (
          <div className={styles.oneLogo}>
            <FontAwesomeIcon icon={faMagnifyingGlass} size="xl" />
          </div>
        )}
      </div>
      <div className={`${styles[theme]} ${styles.hashtagContainer}`}>{ noResult?<span className={styles.noResult}>Pas de post</span> : hashs }</div>
    </div>
  );
}

export default Trend;
