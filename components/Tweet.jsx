import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faTrash } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../styles/Tweet.module.css";
import moment from "moment";

function Tweet(props) {
  const user = useSelector((state) => state.users.value);
  const [likes, setLikes] = useState(props.nbLike);
  //console.log(likes);

  const handleLike = () => {
    fetch(`http://localhost:3000/tweets/nbLike/${props._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ whoLike: user.id, push: !props.isLiked }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          console.log("trigger");
          props.handleLike(props._id);
          setLikes(props.isLiked ? likes - 1 : likes + 1);
        }
      });
  };

  const handleDelete = () => {
    props.handleDelete(props._id);
  };

  const datePoste = moment(props.date);
  const dateActuelle = moment();
  const tempsEcoule = dateActuelle.diff(datePoste);
  //console.log(moment.duration(tempsEcoule).humanize());


  return (
    <div className={styles.oneTweet}>
      <div className={styles.blocUser}>
        <Image
          src={"/user.jpg"}
          width={50}
          height={50}
          className={styles.userPhoto}
        />
        <p className={styles.allInfoUser}>
          {/* props.user.firstname? props.user.firstname : "" */}
          <span className={styles.infoUser}>
            {" "} 
            {props.user.username} - {moment.duration(tempsEcoule).humanize()} 
          </span>
        </p>
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
        <div onClick={handleLike}>
          <FontAwesomeIcon
            icon={faHeart}
            style={props.isLiked && { color: "red" }}
          />   <span className={styles.likesText}>    {   likes} </span>
        </div>
        {user.id === props.user._id && (
          <div onClick={handleDelete} >
            <FontAwesomeIcon icon={faTrash} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Tweet;
