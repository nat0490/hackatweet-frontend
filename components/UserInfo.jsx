import React, {forwardRef, useRef, useEffect, useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/user";
import Image from "next/image";
import Link from "next/link";
import {} from "@fortawesome/free-solid-svg-icons";
import styles from '../styles/UserInfo.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faGear, 
  faBell, 
  faUser, 
  faUserPlus, 
  faRightFromBracket, 
  faFaceSadTear, 
  faHome 
} from "@fortawesome/free-solid-svg-icons";
import Notification from './Notification';
import Setting from './Setting';
import SignUp from './login/Signup';
import SignIn from './login/Signin';
import { ErrorBoundary } from "react-error-boundary";
// import { fetchAllTags } from '../utils';

const UserInfo = forwardRef((props, ref) => {

  const dispatch = useDispatch();
  const { customClassName } = props;
  const user = useSelector(state => state.users.value);
  const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light'); 
  const notifNonLues = useSelector(state => state.notifications.value.nonLu);
  //console.log("reducer non lu:", notifNonLues);

  const [ openNotifModal, setOpenNotifModal] = useState(false);
  const [ openSettingModal, setOpenSettingModal] = useState(false);
  const[openModalSignUp, setOpenModalSignUp] = useState(false);
  const[openModalSignIn, setOpenModalSignIn] = useState(false);

  const notificationContainerRef = useRef(null);
  const settingContainerRef = useRef(null);
  const signInModalRef = useRef(null);
  const signUpModalRef = useRef(null);
 
//Ecoute pour détecter le click en dehors des notif/setting pour fermer les onglets 
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


//Ecoute pour détecter le click en dehors dees signIn/signUp pour fermer les onglets 
useEffect(() => {
  const handleClickOutside = (event) => {
//Si il y a selectedPic && onClick en dehors de la zone
      if (openModalSignIn && signInModalRef.current && !signInModalRef.current.contains(event.target)) {
        setOpenModalSignIn(false);
      };
      if (openModalSignUp && signUpModalRef.current && !signUpModalRef.current.contains(event.target)) {
        setOpenModalSignUp(false);
      };
  };
  let timeoutId;
//Ajout de timeout afin de laisser la "fenêtre" s'ouvrir pour afficher l'image avant de d'éclancher l'evènement d'écoute du click
  if (openModalSignIn) {
      timeoutId = setTimeout(() => {
          document.addEventListener('click', handleClickOutside);
      }, 100); // Ajoutez un délai de 100 millisecondes (ou ajustez selon vos besoins)
  } else {
      document.removeEventListener('click', handleClickOutside);
  };


  if (openModalSignUp) {
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
}, [openModalSignIn, openModalSignUp]);


const handleLogout = () => {
  dispatch(logout());
  // window.location.assign('/');
  // fetchAllTags(dispatch);
};




  return (
    <ErrorBoundary fallback={
      <section style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}> 
      <div className="errorMsg">Oups, il y a eu un soucis ...</div>
      <FontAwesomeIcon
                icon={faFaceSadTear}
                size="8x"
              /> 
    </section>}>



    <div className={`${styles[theme]} ${styles.userInfoPage} ${customClassName}`} ref={ref}>
{ user.token ?
// UTILISATEUR CONNECTE
      <>
      <div className={styles.topPage}> 
        <div className={styles.topPage2}> 
        
       
        <div className={styles.blocUser}>
          <img 
            className={styles.photoProfil} 
            name="profil picture"
            alt="profil picture"
            src={"/user.jpg"} 
            // width={50} 
            // height={50} 
            />
          <p className={styles.username}> @{user.username && user.username.slice(0, 8) }</p>
         
        </div>


        <div className={styles.logo}>
            <div className={styles.oneLogo}>
            {/* <div className={{marginRight: "-0.25rem", ...styles.oneLogo }}> */}
              <FontAwesomeIcon
                icon={faBell}
                size="xl"
                onClick={() =>{setOpenNotifModal(!openNotifModal); setOpenSettingModal(false)}}
              /> {notifNonLues > 0 && <span className={styles.nbrNotif}></span> }
            </div> 

            <div className={styles.oneLogo}>
              <FontAwesomeIcon
                icon={faUser}
                size="xl"
                // onClick={() =>{setOpenNotifModal(!openNotifModal); setOpenSettingModal(false)}}
              />
            </div> 
            
            <div className={styles.oneLogo}>
              <FontAwesomeIcon
                icon={faGear}
                size="xl"
                onClick={() =>{setOpenSettingModal(!openSettingModal); setOpenNotifModal(false) }}
              /> 
            </div>

            <div className={styles.oneLogo}>
            <Link href="/">
              <FontAwesomeIcon
                icon={faHome}
                size="lg"
                // onClick={() =>{setOpenSettingModal(!openSettingModal); setOpenNotifModal(false) }}
              /> 
              </Link> 
            </div>
          { openNotifModal && 
              <Notification ref={notificationContainerRef}/>
            }
          { openSettingModal && 
           <Setting  ref={settingContainerRef}/>
           }
            
          </div>
        </div>
      </div>

      
      <div className={styles.bottom}> 
        <div className={styles.logo}>
          <div className={styles.oneLogo}>
            <FontAwesomeIcon
              icon={faRightFromBracket}
              size="xl"
              onClick={handleLogout}
            /> 
          </div>
        </div>


      </div>
      </>
: 

// PAS DUTILISATEUR CONNECTE
  <section className={styles.noUser}>
   
   

    {openModalSignUp && 
    <aside>
       {/* <button className={styles.btnSignIn} onClick={() => {setOpenModalSignIn(true), setOpenModalSignUp(false)}}>Connexion</button> */}
       <div 
        className={styles.oneLogoConnection} 
        onClick={() => {setOpenModalSignIn(true), setOpenModalSignUp(false)}}
        // style={{ cursor: 'pointer'}}
        >
        <p className={styles.connection}>Se connecter</p>
        <FontAwesomeIcon
          icon={faUser}
          size="xl"
        />
      </div>
       <SignUp 
        ref={signUpModalRef} 
        closeModal={setOpenModalSignUp}
        openOtherModal={() => setOpenModalSignIn(true)}
         />
    </aside>}
    {openModalSignIn && 
    <aside>
      {/* <button className={styles.btnSignUp} onClick={() =>{ setOpenModalSignUp(true), setOpenModalSignIn(false)}}>Inscription</button> */}
      <div 
        className={styles.oneLogoConnection}
        onClick={() =>{ setOpenModalSignUp(true), setOpenModalSignIn(false)}}
        style={{ cursor: 'pointer'}}>
        <p className={styles.connection2}>S'inscrire</p>
        <FontAwesomeIcon
          icon={faUserPlus}
          size="xl"
        />
    </div> 
      <SignIn 
        ref={signInModalRef} 
        closeModal={setOpenModalSignIn} 
        openOtherModal={() => setOpenModalSignUp(true)}
        />
    </aside>}

    {/* <button className={styles.btnSignUp} onClick={() => setOpenModalSignUp(true)}>Inscription</button> */}
    {!openModalSignUp && !openModalSignIn && 
      // <button className={styles.btnSignIn} onClick={() => setOpenModalSignIn(true)}>Connexion</button>
      <div 
        className={styles.oneLogoConnection}
        onClick={() => setOpenModalSignIn(true)}
        style={{ cursor: 'pointer'}}
        >
        <p className={styles.connection}>Se connecter</p>
        <FontAwesomeIcon
          icon={faUser}
          size="xl"
        />
    </div> }

  </section>

}
    </div>
    </ErrorBoundary>
  );
});

export default UserInfo;
