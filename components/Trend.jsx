import React, { useEffect, useState } from 'react';
import Link from "next/link";
import styles from "../styles/Trend.module.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllTags } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faX, faFaceSadTear } from "@fortawesome/free-solid-svg-icons";
import { ErrorBoundary } from "react-error-boundary";




function Trend() {

  const dispatch = useDispatch();

  const hashtag = useSelector((state) => state.hashtags.value);
  const user = useSelector(state => state.users.value);
  const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light'); 
  //console.log(hashtag);

  const [ findTag, setFindTag ] = useState("");
  const [ saisieEnCours, setSaisieEnCours ] = useState(false);
  const [activeToggleConnection, setActiveToggleConnection] = useState(false);


  //Dimension écran
const getScreenWidth = () => {
  return window.innerWidth;
};
//Style des images en fonction de la taille de l'écran



  const hashs =  hashtag.length > 0 && Object.entries(hashtag[0])
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value], i) => {
      if (findTag) {
        if (key.includes(findTag.toLowerCase())) {
          return (
              <Link href={`/hashtag/${key}`} key={i}>
                 <div  className={styles.oneTweet}>
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
            key={i}
            // onClick={() => setSaisieEnCours(false)}
            >
            <div  className={styles.oneTweet}>
              <a className={`${styles[theme]} ${styles.hashtagName}`}> #{key}</a>
              <p className={styles.totalTweet}>{value} post</p>
            </div>
          </Link>
        );
      }
  });

  return (
    <ErrorBoundary fallback={
      <section style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}> 
      <div className="errorMsg">Oups, il y a eu un soucis ...</div>
      <FontAwesomeIcon
                icon={faFaceSadTear}
                size="8x"
              /> 
    </section>}>
    <div className={`${styles[theme]} ${styles.trendPage}`}>
      <div className={styles.findHashtag}> 
        <input
          type="text"
          name="rechercheTag"
          value={findTag}
          // onChange={user.token? (e) => setFindTag(e.target.value) :()=>setActiveToggleConnection(!activeToggleConnection)}
          onChange={e => setFindTag(e.target.value)}
          onFocus={user.token? () => setSaisieEnCours(true) :()=>setActiveToggleConnection(!activeToggleConnection) }
          onBlur={() => { !findTag && setSaisieEnCours(false)}}
          className={`${styles[theme]} ${styles.inputHashtag}`}
        />

{ activeToggleConnection && 
  <section className={`${styles[theme]} ${styles.popAlert}`} >
    <aside>
        <h4 className={styles.titleAlert}>Vous devez vous connecter</h4>
        <button type="button" className={`${styles[theme]} ${styles.btnAlert}`} onClick={()=>setActiveToggleConnection(!activeToggleConnection)}>Ok</button>
    </aside>
  </section>
}


        { findTag && 
        <div className={styles.icon}>
          <FontAwesomeIcon
                icon={faX}
                size="xs"
                onClick={() => {
                  setFindTag("");
                  setSaisieEnCours(false)
                }}
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
      
       
        {(getScreenWidth() < 600 && findTag === "" )? null : 
          <div className={`${styles[theme]} ${styles.hashtagContainer}`}>
            {hashs}
            </div>}
    
       
        
    </div>
    </ErrorBoundary>
  );
}

export default Trend;
