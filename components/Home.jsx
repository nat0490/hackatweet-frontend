import React, {useRef, useEffect, useState} from 'react';
import UserInfo from "./UserInfo";
import LastTweets from "./LastTweets";
import Trend from "./Trend";
import styles from '../styles/Home.module.css';
import { useDispatch, useSelector} from 'react-redux';
import { addNotification, rmvNotification, rmvAllNotification, updateNotification } from '../reducers/notifications';


function Home() {
  const userRef = useRef(null);
  const dispatch = useDispatch();
  // const URL = "http://localhost:3000/";
  const URL = "https://flowst-backend.vercel.app/";
  const user = useSelector((state)=> state.users.value);

  // const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light');
  const userToken = user.token; 
  const defaultTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const themeFromStore = useSelector(state => state.theme.value.find(e => e.user === userToken)?.style);
  const [theme, setTheme] = useState(userToken ? themeFromStore : defaultTheme);
  //console.log("them:",theme);

  useEffect(()=> {
    if(user.token){
      getMyNotif();
    }
  }, []);

  //Dimension écran
// const getScreenWidth = () => {
//   return window.innerWidth;
// };


  const getMyNotif = async() => {
      try {
          const res = await fetch(`${URL}notification/findNotification/${user.token}`);
          const data = await res.json();
          // console.log(data);
          if (data?.result) {
            let allNotifs = data.userNotif;
            let onlyMine = allNotifs.filter(e => e.fromUserName !== user.username );
            dispatch(rmvAllNotification());
            dispatch(addNotification(onlyMine.reverse()));
          } else {
              console.log(data?.comment)
          }
      } catch(error) {
          console.log(error.message , "Failed to fetch");
  }};


  return (
    <div className={`${styles[theme]} ${styles.PageAcceuil}`}>
      <img
        src={theme === "light" ? "/background.jpg" :"/backgroundBW.jpg" }
        name="background"
        alt="background" 
        className={`background ${theme}`}
      />
      <div className={styles.userInfo}>
        <UserInfo /*customClassName={styles.userInfo} */ref={userRef}/>
      </div>

      <div className={`${styles[theme]} ${styles.lastTweetsContainer} `}>
        <LastTweets />
      </div>
      <div className={styles.trend}>
        <Trend />
      </div>

    </div>
  );
};

export default Home;
