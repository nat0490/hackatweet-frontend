import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash, faCommentDots, faXmark } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/Tweet.module.css";
import moment from "moment";

function Tweet(props) {
  const user = useSelector((state) => state.users.value);
  const [likes, setLikes] = useState(props.nbLike);
  const [ showInputAddComment, setShowInputAddComment ] = useState(false);
  const [ textComment, setTextComment] = useState("");
  //console.log(props);

  
  const handleLikeTweet = () => {
    //console.log(props._id)
    props.updateLikedTweet(props._id);
    if (props.isLiked) {
      fetch(`http://localhost:3000/tweets/rmvNbLike/${props._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(),
    })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          //console.log("remove like");
          setLikes(likes - 1);
        }
      });
    } else {    
    fetch(`http://localhost:3000/tweets/addNbLike/${props._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ whoLike: user.id, push: !props.isLiked }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          //console.log("add one like");
          setLikes(likes + 1);
        }
      });
    };
  };

  let heartIconStyle = { 'cursor': 'pointer' };
  if (props.isLiked) {
    heartIconStyle = { 'color': '#e74c3c', 'cursor': 'pointer' };
  }

  const handleDelete = () => {
    props.handleDelete(props._id);
  };

  const handleShowAddComment = () => {
    setShowInputAddComment(!showInputAddComment);
  };

  

  const handleAddComment = () => {
    console.log("addComment");
    fetch(`http://localhost:3000/tweets/addComment/${props._id}`, {
      method: "PUT",
      header: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userFrom: "A METTRE",
        text: "A METTRE"
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
    })
  };

  const datePoste = moment(props.date);
  const dateActuelle = moment();
  const tempsEcoule = dateActuelle.diff(datePoste);
  //console.log(moment.duration(tempsEcoule).humanize());


  return (
    <> 
          <div className={styles.oneTweet}>
        <div className={styles.blocUser}>
          <Image
            src={"/user.jpg"}
            width={50}
            height={50}
            className={styles.userPhoto}
          />
          <div className={styles.userNameAndDelete}> 
            <p className={styles.allInfoUser}>
              {/* props.user.firstname? props.user.firstname : "" */}
              <span className={styles.infoUser}>
                {" "} 
                {props.user.username} - {moment.duration(tempsEcoule).humanize()} 
              </span>
            </p>
            {user.id === props.user._id && (
              <div onClick={handleDelete} className={styles.oneLogo}>
                <FontAwesomeIcon icon={faXmark} />
              </div>
            )}
          </div>
        </div>
        <div>
          <p className={styles.description}>
            {props.description?.split(" ").map((e, i) => {
              if (new RegExp("#").test(e)) {
                return <span className="hashtag" key={i}> {e} </span>;
              } else {
                return ` ${e} `;
              }
            })}
          </p>
        </div>
        <div className={styles.logo}>
          <div className={styles.oneLogo}>
            <FontAwesomeIcon
              icon={faHeart}
              style={props.isLiked && { 'color': '#e74c3c', 'cursor': 'pointer' }}
              onClick={handleLikeTweet}
            />   <span className={styles.likesText}>    {   likes} </span>
          </div>
          <div className={styles.oneLogo}>
            <FontAwesomeIcon
              icon={faCommentDots}
              onClick={handleShowAddComment}
            />   
          </div> 
        </div>
      </div>

      {showInputAddComment ? 
      <div>
        <div className={styles.addComment}>
          <input
            type="text"
            value={textComment}
            onChange={(e) => setTextComment(e.target.value)}
            className={styles.inputComment}            
          />
          <div className={styles.dessousInput}>            
            <button  className={styles.addButton}> Add </button>
          </div>
        </div>

      </div> : "" }


    </>
  );
}

export default Tweet;
