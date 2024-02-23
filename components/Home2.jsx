import React, {useRef} from 'react';
import UserInfo from "./UserInfo";
import Hashtag from './Hashtag';
import Trend from "./Trend";
import styles from '../styles/Home.module.css';
import { useSelector } from 'react-redux';

function Home2() {

    const userRef = useRef(null);
    const user = useSelector((state)=> state.users.value);
    const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light');  

  return (
    <div className={styles.PageAcceuil}>
      <UserInfo customClassName={styles.userInfo} ref={userRef}/>
      <div className={`${styles[theme]} ${styles.lastTweetsContainer}`}>
        <Hashtag className={styles.Hashtag}/>
      </div>
      <Trend className={styles.trend}/>
    </div>
  );
}

export default Home2;
