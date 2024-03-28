import React, { useEffect, useRef, forwardRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from "../styles/Notification.module.css";
import Image from 'next/image';
import { updateNotification, addNotification, rmvAllNotification} from "../reducers/notifications";
import { tempsEcoule } from '../utils';


const Notification = forwardRef((props, ref) => {

    const dispatch = useDispatch();
    
    const user = useSelector(state => state.users.value);
    const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light');  
    const notification = useSelector((state)=> state.notifications.value.notification);

    //const URL = "http://localhost:3000/";
    const URL = "https://flowst-backend.vercel.app/";

    useEffect(()=> {
        fetchMyNotifications();
    }, [])


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
                dispatch(rmvAllNotification());
                dispatch(addNotification(onlyMine.reverse()));
            } else {
                console.log(data.comment)
            }
        } catch {
            console.error('Error during fetchMyNotification');
        }
    };

    const fetchUpdateRead = async(notif) => {
        if(!notif.isRead){
            try {
                const reponse = await fetch(`${URL}notification/updateRead/${notif._id}`, {
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
        }
    };

    const LimiterCaracteres = ({ texte, limiteCaracteres }) => {
        const texteTronque = texte.length > limiteCaracteres
          ? `${texte.substring(0, limiteCaracteres)}...`
          : texte;
        return texteTronque
      };
  
    

  
    // const [currentIndex, setCurrentIndex] = useState(0); 
    // const [displayedNotifications, setDisplayedNotifications] = useState([]);

    // useEffect(() => {
    //     const displayNotifications = () => {
    //         if (currentIndex < notification.length) {
    //             const currentNote = notification[currentIndex];
    //             setDisplayedNotifications(prevNotifications => [...prevNotifications, currentNote]); // Ajoutez la nouvelle notification à la liste
    //             fetchUpdateRead(currentNote); // Mettre à jour la notification comme lue
    //             setCurrentIndex(currentIndex + 1); // Passer à la prochaine notification
    //         }
    //     };
    
    //     const intervalId = setInterval(displayNotifications, 30); // Délai entre chaque notification (en millisecondes)
    
    //     return () => clearInterval(intervalId); // Nettoyage de l'intervalle lorsque le composant est démonté
    // }, [currentIndex, notification]);


    const notif = notification?.map((note, i) => {
        return(
             <div 
                key={note._id} 
                className={`${styles[theme]} ${styles.oneNote} ${ !note.isRead && styles.noteUnread}`}
                onClick={() => fetchUpdateRead(note)}>
                {!note.isRead && <div className={styles.pastilleLine}><span className={styles.pastille}></span></div> }
                <div className={styles.photoAndInfo}> 
                    <div className={styles.photoContainer}> 
                        <Image
                            src={"/user.jpg"}
                            width={20}
                            height={20}
                            
                            className={styles.userPhoto}
                        />
                    </div>
                    <div className={styles.blocText}> 
                        <p className={styles.infoNote}>{note.fromUserName}.  <span className={styles.dateNotif}> {tempsEcoule(note.time)} </span> </p>
                        <p className={styles.infoNote}> A { note.type === "Like" && "aimé" || note.type === "Comment" && "commenté"} ton post<span className={styles.noteDescript}> " <LimiterCaracteres texte={note.tweetDescription} limiteCaracteres={28} /> "</span>   </p>
                    </div>
                    
                </div>
                <div className={styles.contenteLine}><div className={styles.bottomLine}></div></div>               
             </div>
    )});


    //Dimension écran
  const getScreenWidth = () => {
    return window.innerWidth;
  };
  
  //Position de la modale en fonction de l'écran
    const getModaleStyle = () => {
      if(getScreenWidth() < 600) {
        return { transform: 'translate(15%, 60%)'}
      } else {
        return { transform: 'translate(105%, -10%)'}
      }
    };
  
  return (
    <div className={`${styles.modalContainer} ${styles[theme]}`} style={getModaleStyle()} ref={ref}>
        <h3 className={styles.title}>Notifications</h3>
      <div > {notif}</div>
    </div>
  );
});



export default Notification;

