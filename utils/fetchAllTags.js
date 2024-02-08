import { addHashtag, removehashTag } from "../reducers/hashtags";

export const fetchAllTags = async (dispatch) => {
  const URL = 'http://localhost:3000/';

  const nbrOccurrence = (tab) => {
    const occurrences = {};
    for (let i = 0; i < tab.length; i++) {
      const element = tab[i];
      occurrences[element] = (occurrences[element] || 0) + 1;
    }
    dispatch(removehashTag());
    dispatch(addHashtag(occurrences));
  };

  try {
    const res = await fetch(`${URL}tweets/lastTweet`);
    const json = await res.json();

    if (json.tweets) {
      const hashtagsFind = [];
      json.tweets.forEach((tweet) => {
        let hashT = tweet.hashtags;
        if (hashT && hashT.length > 0) {
          hashtagsFind.push(...hashT);
        }
      });
      nbrOccurrence(hashtagsFind);
      //console.log("All Tags fetch");
    } else {
      console.error("Error in fetchHashtag: Response is missing 'tweets' field", json);
    }
  } catch (error) {
    console.log(error);
  }
};