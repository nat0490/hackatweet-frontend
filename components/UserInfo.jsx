import React, {forwardRef, useRef, useEffect, useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/user";
import Image from "next/image";
import Link from "next/link";
import {} from "@fortawesome/free-solid-svg-icons";
import styles from '../styles/UserInfo.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faBell } from "@fortawesome/free-solid-svg-icons";
import Notification from './Notification';
import Setting from './Setting';
import { detectClickOutside } from '../utils';


const UserInfo = forwardRef((props, ref) => {

  const dispatch = useDispatch();

  const { customClassName } = props;
  const user = useSelector(state => state.users.value);
  const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light'); 
  const notifNonLues = useSelector(state => state.notifications.value.nonLu);
  //console.log("reducer non lu:", notifNonLues);

  const [openNotifModal, setOpenNotifModal] = useState(false);
  const [ openSettingModal, setOpenSettingModal] = useState(false);

  const notificationContainerRef = useRef(null);
  const settingContainerRef = useRef(null);


  

 
 
  useEffect(() => {
    const handleClickOutside = (event) => {
  //Si il y a selectedPic && onClick en dehors de la zone
        if (openNotifModal && notificationContainerRef.current && !notificationContainerRef.current.contains(event.target)) {
          setOpenNotifModal(false);
        };
        if (openSettingModal && settingContainerRef.current && !settingContainerRef.current.contains(event.target)) {
          setOpenSettingModal(false);
        };
    };
    let timeoutId;
//Ajout de timeout afin de laisser la "fenêtre" s'ouvrir pour afficher l'image avant de d'éclancher l'evènement d'écoute du click
    if (openNotifModal) {
        timeoutId = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 100); // Ajoutez un délai de 100 millisecondes (ou ajustez selon vos besoins)
    } else {
        document.removeEventListener('click', handleClickOutside);
    };


    if (openSettingModal) {
      timeoutId = setTimeout(() => {
          document.addEventListener('click', handleClickOutside);
      }, 100); // Ajoutez un délai de 100 millisecondes (ou ajustez selon vos besoins)
  } else {
      document.removeEventListener('click', handleClickOutside);
  };



    return () => {
        clearTimeout(timeoutId); // Nettoyez le timeOut avant de retirer l'écouteur
        document.removeEventListener('click', handleClickOutside);
    };
  }, [openNotifModal, openSettingModal]);


 
  const handleLogout = () => {
    dispatch(logout());
    window.location.assign('/');
  };

  return (
    <div className={`${styles[theme]} ${styles.userInfoPage} ${customClassName}`} ref={ref}>
      <div className={styles.topPage}> 
        <div className={styles.topPage2}> 
        
        <Link href="/">
          <Image 
            src={"/Logo2.png"} 
            width={100} 
            height={100} 
            className={styles.logoLink} 
          />
        </Link>
        <div className={styles.logo}>
            <div className={`${styles.oneLogo} ${styles.logoWithNotif}`}>
            {/* <div className={{marginRight: "-0.25rem", ...styles.oneLogo }}> */}
              <FontAwesomeIcon
                icon={faBell}
                size="xl"
                onClick={() =>{setOpenNotifModal(!openNotifModal); setOpenSettingModal(false)}}
                style={{ cursor: 'pointer'}}
              /> {notifNonLues > 0 && <span className={styles.nbrNotif}>{notifNonLues}</span> }
            </div> 
            
            <div className={styles.oneLogo}>
              <FontAwesomeIcon
                icon={faGear}
                size="xl"
                style={{ cursor: 'pointer' }}
                onClick={() =>{setOpenSettingModal(!openSettingModal); setOpenNotifModal(false) }}
              /> 
            </div>
          { openNotifModal && <Notification ref={notificationContainerRef}/>}
          { openSettingModal && <Setting ref={settingContainerRef}/>}
            
          </div>
        </div>
      </div>

      
      <div className={styles.bottom}> 
        <div className={styles.blocUser}>
          <Image className={styles.photoProfil} src={"/user.jpg"} width={50} height={50} />
          <div className={styles.userLog} >
            <span>{user.firstname && user.firstname.slice(0, 8)}</span>
            <span className={styles.username}> @{user.username && user.username.slice(0, 8) }</span>
          </div>
        </div>
        <div className={styles.englobButton}> 
        <button onClick={handleLogout} className={styles.logoutButton}>Quitter</button> 
        </div>
      </div>
    </div>
  );
});

export default UserInfo;
