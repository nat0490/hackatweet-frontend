import React, {useRef} from 'react';
import UserInfo from "./UserInfo";
import Hashtag from './Hashtag';
import Trend from "./Trend";
import styles from '../styles/Home.module.css';

function Home2() {

    const userRef = useRef(null);

  return (
    <div className={styles.PageAcceuil}>
      <UserInfo customClassName={styles.userInfo} ref={userRef}/>
      <div className={styles.lastTweetsContainer}>
        <Hashtag className={styles.Hashtag}/>
      </div>
      <Trend className={styles.trend}/>
    </div>
  );
}

export default Home2;
