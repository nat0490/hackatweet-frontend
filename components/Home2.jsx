import React, {useRef, useState} from 'react';
import UserInfo from "./UserInfo";
import Hashtag from './Hashtag';
import Trend from "./Trend";
import styles from '../styles/Home.module.css';
import { useSelector } from 'react-redux';

function Home2() {

    const userRef = useRef(null);
    const user = useSelector((state)=> state.users.value);

  // const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light');
  const userToken = user.token; 
  const defaultTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  let theme = useSelector(state => state.theme.value.find(e => e.user === userToken)?.style);
  
  // const [theme, setTheme] = useState(userToken ? themeFromStore : defaultTheme);

  if(!userToken){
    theme = defaultTheme;
  };

  return (
    <div className={`${styles[theme]} ${styles.PageAcceuil}`}>
      {/* <img
        src={theme === "light" ? "/background.jpg" :"/backgroundBW.jpg" }
        name="background"
        alt="background" 
        className={`background ${theme}`}
      /> */}
      <div  className={`background ${theme}`}></div>
      <div className={styles.userInfo}>
        <UserInfo /*customClassName={styles.userInfo} */ref={userRef}/>
      </div>
      
      <div className={`${styles[theme]} ${styles.lastTweetsContainer} `}>
        <Hashtag className={styles.Hashtag}/>
      </div>
      <div className={styles.trend}>
        <Trend />
      </div>
    </div>
  );
}

export default Home2;
