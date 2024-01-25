import React, {useRef} from 'react';
import UserInfo from "./UserInfo";
import LastTweets from "./LastTweets";
import Trend from "./Trend";
import styles from '../styles/Home.module.css';

function Home() {

  const userRef = useRef(null);

  return (
    <div className={styles.PageAcceuil}>
      <UserInfo customClassName={styles.userInfo} ref={userRef}/>
      <div className={styles.lastTweetsContainer}>
        <LastTweets className={styles.lastTweets}/>
      </div>
      <Trend className={styles.trend}/>
    </div>
  );
};

export default Home;
