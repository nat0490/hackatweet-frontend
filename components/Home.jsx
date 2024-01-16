import UserInfo from "./UserInfo";
import LastTweets from "./LastTweets";
import Trend from "./Trend";
import styles from '../styles/Home.module.css';

function Home() {
  return (
    <div className={styles.PageAcceuil}>
      <UserInfo className={styles.userInfo} />
      <div className={styles.lastTweetsContainer}>
        <LastTweets className={styles.lastTweets}/>
      </div>
      <Trend className={styles.trend}/>
    </div>
  );
}

export default Home;
