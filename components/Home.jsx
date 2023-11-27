import UserInfo from "./UserInfo";
import LastTweets from "./LastTweets";
import Trend from "./Trend";
import styles from '../styles/Home.module.css';

function Home() {
  return (
    <div className={styles.PageAcceuil}>
      <UserInfo className={styles.userInfo} />
      <LastTweets className={styles.lastTweets}/>
      <Trend className={styles.trend}/>
    </div>
  );
}

export default Home;
