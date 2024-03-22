import React, {useRef, useEffect} from 'react';
import UserInfo from "./UserInfo";
import LastTweets from "./LastTweets";
import Trend from "./Trend";
import styles from '../styles/Home.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification, rmvNotification, rmvAllNotification, updateNotification } from '../reducers/notifications';
import { useFetch } from '../hooks/useFetch';
import { fetchAllTags } from '../utils';

function Home() {

  const userRef = useRef(null);
  const dispatch = useDispatch();
  // const URL = "http://localhost:3000/";
  const URL = "https://hackatweet-backend-iota-three.vercel.app/";
  const user = useSelector((state)=> state.users.value);
  const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light');  

  //console.log("them:",theme);
  
  useEffect(()=> {
    getMyNotif();
    fetchAllTags(dispatch);
    
  }, []);

  const getMyNotif = () => {
    (async()=> {
      try {
          const res = await fetch(`${URL}notification/findNotification/${user.id}`);
          const data = await res.json();
          if (data?.result) {
            let allNotifs = data.notifs;
            let onlyMine = allNotifs.filter(e => e.fromUserId !== user.id );
            dispatch(rmvAllNotification());
            dispatch(addNotification(onlyMine.reverse()));
          } else {
              console.log(data?.comment)
          }
      } catch(error) {
          console.log(error.message , "Failed to fetch");
  }})();
};

  return (
    <div className={`${styles[theme]} ${styles.PageAcceuil}`}>
      <div className={styles.userInfo}>
        <UserInfo /*customClassName={styles.userInfo} */ref={userRef}/>
      </div>
      
      <div className={`${styles[theme]} ${styles.lastTweetsContainer} `}>
        <LastTweets /*customClassName={`${styles[theme]}  ${styles.lastTweets} `}*//>
      </div>
      <div className={styles.trend}>
        <Trend />
      </div>
      
    </div>
  );
};

export default Home;
