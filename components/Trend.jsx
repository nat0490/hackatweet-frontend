import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../styles/Trend.module.css";
import { useSelector, useDispatch } from "react-redux";
import hashtags, { addHashtag, removehashTag } from '../reducers/hashtags';

function Trend() {
  //const [hashtags, setHashtags] = useState([]);

  const dispatch = useDispatch();
  const hashtag = useSelector((state) => state.hashtags.value);
  //console.log(hashtag);

  const nbrOccurence = (tab) => {
    const occurences = [];  
    for (let i = 0; i < tab.length; i++) {
      const element = tab[i];  
      occurences[element] = (occurences[element] || 0) + 1;
    }
    dispatch(removehashTag());
    dispatch(addHashtag(occurences));
  };
  

  const fetchAllHashtag = () => {
    fetch("http://localhost:3000/tweets/lastTweet")
      .then((res) => res.json())
      .then((data) => {
        //console.log(data.tweets);        
        const hashtagsFind = [];
        data.tweets.map((tweet) => {
          let hashT = tweet.hashtags;
          if (hashT && hashT.length > 0) {
            hashtagsFind.push(...hashT);
          }          
        }); 
        //console.log(hashtagsFind);
        nbrOccurence(hashtagsFind);
      });
  }


 
  useEffect(() => {
   fetchAllHashtag();    
  }, []);


  const hashs = Object.entries(hashtag[0]).map(([key, value], i) => {
    return (
      <div key={i} className={styles.oneTweet}>
        <Link href={`/hashtag/${key}`}>
          <a className={styles.hashtagName}> #{key}</a>
        </Link>
        <p className={styles.totalTweet}>{value} tweet</p>
      </div>
    );
  });



  return (
    <div className={styles.trendPage}>
      <h2 className={styles.titlePage}>#Tag</h2>
      <div className={styles.hashtagContainer}>{ hashs }</div>
    </div>
  );
}

export default Trend;
