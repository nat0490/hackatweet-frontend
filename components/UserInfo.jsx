import React, {forwardRef, useRef, useEffect, useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/user";
import { rmvAllShowComment } from '../reducers/showComment';
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
        if (openNotifModal && notificationContainerRef.current && !notificationContainerRef.current.contains(event.target)) {
          setOpenNotifModal(false);
        };
        if (openSettingModal && settingContainerRef.current && !settingContainerRef.current.contains(event.target)) {
          setOpenSettingModal(false);
        };
    };
    let timeoutId;
    if (openNotifModal) {
        timeoutId = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 100); 
        document.removeEventListener('click', handleClickOutside);
    };

    if (openSettingModal) {
      timeoutId = setTimeout(() => {
          document.addEventListener('click', handleClickOutside);
      }, 100); 
  } else {
      document.removeEventListener('click', handleClickOutside);
  };
    return () => {
        clearTimeout(timeoutId); 
        document.removeEventListener('click', handleClickOutside);
    };
  }, [openNotifModal, openSettingModal]);


//Ecoute pour détecter le click en dehors dees signIn/signUp pour fermer les onglets 
useEffect(() => {
  const handleClickOutside = (event) => {
      if (openModalSignIn && signInModalRef.current && !signInModalRef.current.contains(event.target)) {
        setOpenModalSignIn(false);
      };
      if (openModalSignUp && signUpModalRef.current && !signUpModalRef.current.contains(event.target)) {
        setOpenModalSignUp(false);
      };
  };
  let timeoutId;
  if (openModalSignIn) {
      timeoutId = setTimeout(() => {
          document.addEventListener('click', handleClickOutside);
      }, 100); 
  } else {
      document.removeEventListener('click', handleClickOutside);
  };
  if (openModalSignUp) {
    timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
    }, 100);
} else {
    document.removeEventListener('click', handleClickOutside);
};
  return () => {
      clearTimeout(timeoutId); 
      document.removeEventListener('click', handleClickOutside);
  };
}, [openModalSignIn, openModalSignUp]);


const handleLogout = () => {
  dispatch(logout());
  dispatch(rmvAllShowComment());

};

  return (
    <ErrorBoundary fallback={
      <section style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}> 
      <div className="errorMsg">Oups, il y a eu un soucis ...</div>
      <FontAwesomeIcon
                icon={faFaceSadTear}
                size="8x"
                color="#000"
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
                />
              <p className={styles.username}> @{user.username && user.username.slice(0, 8) }</p>
            </div>
            <div className={styles.logo}>
              <div className={styles.oneLogo}>
                <FontAwesomeIcon
                  icon={faBell}
                  size="xl"
                  color="#000"
                  onClick={() =>{setOpenNotifModal(!openNotifModal); setOpenSettingModal(false)}}
                /> {notifNonLues > 0 && <span className={styles.nbrNotif}></span> }
              </div> 
              <div className={styles.oneLogo}>
                <FontAwesomeIcon
                  icon={faUser}
                  size="xl"
                  color="#000"
                />
              </div> 
              <div className={styles.oneLogo} style={{marginRight:"-0.1rem"}}>
                <FontAwesomeIcon
                  icon={faGear}
                  size="xl"
                  color="#000"
                  onClick={() =>{setOpenSettingModal(!openSettingModal); setOpenNotifModal(false) }}
                /> 
              </div>
              <div className={styles.oneLogo}>
              <Link href="/">
                <FontAwesomeIcon
                  icon={faHome}
                  size="lg"
                  color="#000"
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
                color="#000"
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
       <div 
        className={styles.oneLogoConnection} 
        onClick={() => {setOpenModalSignIn(true), setOpenModalSignUp(false)}}
        >
        <p className={styles.connection}>Se connecter</p>
        <FontAwesomeIcon
          icon={faUser}
          size="xl"
          color="#000"
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
      <div 
        className={styles.oneLogoConnection}
        onClick={() =>{ setOpenModalSignUp(true), setOpenModalSignIn(false)}}
        style={{ cursor: 'pointer'}}>
        <p className={styles.connection2}>S'inscrire</p>
        <FontAwesomeIcon
          icon={faUserPlus}
          size="xl"
          color="#000"
        />
    </div> 
      <SignIn 
        ref={signInModalRef} 
        closeModal={setOpenModalSignIn} 
        openOtherModal={() => setOpenModalSignUp(true)}
        />
    </aside>}
    {!openModalSignUp && !openModalSignIn && 
      <div 
        className={styles.oneLogoConnection}
        onClick={() => setOpenModalSignIn(true)}
        style={{ cursor: 'pointer'}}
        >
        <p className={styles.connection}>Se connecter</p>
        <FontAwesomeIcon
          icon={faUser}
          size="xl"
          color="#000"
        />
    </div> }
  </section>
}
    </div>
    </ErrorBoundary>
  );
});

export default UserInfo;
