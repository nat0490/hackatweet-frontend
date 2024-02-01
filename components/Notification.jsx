import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styles from "../styles/Notification.module.css";
import Image from 'next/image';
import moment from "moment";
import { faHeart, faCommentDots, faXmark } from "@fortawesome/free-solid-svg-icons";

export default function Notification() {

    const user = useSelector(state => state.users.value);
    const theme = useSelector(state => state.theme.value); 
    const URL = "http://localhost:3000/";


    //console.log(user)

    const [ myNotifications, setMyNotification] = useState([]);

    useEffect(()=> {
        fetchMyNotifications();
    }, [])

//Laisser ici? ou reducer et faire le fetch sur l'acceuil?? => A voir avec notif push

    const fetchMyNotifications = async () => {
        try {
            const response = await fetch(`${URL}notification/findNotification/${user.id}`);
            if(!response.ok) {
                throw new Errow('Network response was not ok')
            }
            const data = await response.json();
            if (data.result) {
                let allNotifs = data.notifs;
                let onlyMine = allNotifs.filter(e => e.fromUserId !== user.id );
                //console.log("onlyMine:", onlyMine);
                setMyNotification(onlyMine.reverse());
            } else {
                console.log(data.comment)
            }
        } catch {
            console.error('Error during fetchMyNotification');
        }
    };

    const fetchUpdateRead = async(notifId) => {
        try {
            const reponse = await fetch(`${URL}notification/updateRead/${notifId}`, {
                method: "PUT",
                headers: {
                    "Content-type" : "application/json",
                },
                body: JSON.stringify(),
            });
            if(!reponse.ok) {
                throw new Errow('Netword response was not ok')
            }
            const data = await reponse.json();
            if(data.result) {
                fetchMyNotifications();
            } else {
                console.log(data.error);
            }
        } catch {
            console.error('Error during fetchUpdateRead');
        }
    };

    const tempsEcoule = (datePost) => {
        const dateActuelle = moment();
        const datePoste = moment(datePost);
        const difference = dateActuelle.diff(datePoste);
        return moment.duration(difference);
      };
  
    const notif = myNotifications?.map((note, i) => {
        return(
             <div 
                key={note._id} 
                className={`${styles[theme]} ${styles.oneNote} ${ !note.isRead && styles.noteUnread}`}
                onClick={() => fetchUpdateRead(note._id)}>
                {note.isRead && <p className={styles.noteLu}>lu</p> }
                <div className={styles.photoAndInfo}> 
                
                    <Image
                        src={"/user.jpg"}
                        width={20}
                        height={20}
                        className={styles.userPhoto}
                    />
                    <div> 
                        <p className={styles.infoNote}>{note.fromUserName}.  <span className={styles.dateNotif}> {moment.duration(tempsEcoule(note.time)).humanize()} </span> </p>
                        <p className={styles.infoNote}> A { note.type === "Like" && "aimé" || note.type === "Comment" && "commenté"} ton post<span className={styles.noteDescript}> " { note.tweetDescription } "</span>   </p>
                    </div>
                    
                </div>
                <div className={styles.contenteLine}><div className={styles.bottomLine}></div></div>               
             </div>
    )})
  
  return (
    <div className={`${styles.modalContainer} ${styles[theme]}`}>
        <h3 className={styles.title}>Notifications</h3>
      <div > {notif}</div>
    </div>
  );
};

