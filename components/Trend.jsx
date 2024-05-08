import React, { useEffect, useState } from 'react';
import Link from "next/link";
import styles from "../styles/Trend.module.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllTags } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faX, faFaceSadTear } from "@fortawesome/free-solid-svg-icons";
import { ErrorBoundary } from "react-error-boundary";
import { useWindowSize } from '../utils';
function Trend() {
  const dispatch = useDispatch();
  const { width } = useWindowSize();

  const hashtag = useSelector((state) => state.hashtags.value);
  const user = useSelector(state => state.users.value);
  const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light'); 

  const [ findTag, setFindTag ] = useState("");
  const [ saisieEnCours, setSaisieEnCours ] = useState(false);
  const [ activeToggleConnection, setActiveToggleConnection ] = useState(false);
  const [ showAllTags, setShowAllTag ] = useState(false);
  
  useEffect(() => {
    if (width > 600) {
      setShowAllTag(true);
    } else {
      setShowAllTag(false);
    }
  }, [width]);

  useEffect(()=>{
    if(saisieEnCours || showAllTags ) {
      fetchAllTags(dispatch);
      // console.log(hashtag);
    }
  },[saisieEnCours, showAllTags])


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
                color="#000"
              /> 
    </section>}>
    <div className={`${styles[theme]} ${styles.trendPage}`}>
      <div className={styles.findHashtag}> 
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
          <div className={styles.oneLogo} onClick={()=>setShowAllTag(!showAllTags)}>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              cursor="pointer"
              size="xl"
              color="#000"
            /> 
          </div>
        }

        {!saisieEnCours && (window.innerWidth <= 600) && (
          <div className={styles.oneLogo}>
            <FontAwesomeIcon icon={faMagnifyingGlass} size="xl" color="#000" />
          </div>
        )}
        
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
    </div>
      {((hashs.length > 0 && findTag !== "") || showAllTags) && 
        <div className={`${styles[theme]} ${styles.hashtagContainer}`}>
          {hashs}
        </div>}
      </div>
    </ErrorBoundary>
  );
}

export default Trend;
