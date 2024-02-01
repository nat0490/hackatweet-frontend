import React, {forwardRef, useState} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/user";
import { changeTheme } from "../reducers/theme";
import Image from "next/image";
import Link from "next/link";
import {} from "@fortawesome/free-solid-svg-icons";
import styles from '../styles/UserInfo.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faBell } from "@fortawesome/free-solid-svg-icons";
import Notification from './Notification';
import Setting from './Setting';

const UserInfo = forwardRef((props, ref) => {

  const { customClassName } = props;
  const user = useSelector((state) => state.users.value);
  const theme = useSelector( state => state.theme.value);
  const dispatch = useDispatch();

  const [openNotifModal, setOpenNotifModal] = useState(false);
  const [ openSettingModal, setOpenSettingModal] = useState(false);

 
  const handleLogout = () => {
    dispatch(logout());
    window.location.assign('/');
  };

    
  return (
    <div className={`${styles[theme]} ${styles.userInfoPage} ${customClassName}`} ref={ref}>
      <div className={styles.topPage}> 
      <Link href="/"><Image src={"/Dessin.png"} width={100} height={100} className={styles.logoLink} /></Link>

      <div className={styles.logo}>

          <div className={styles.oneLogo}>
          {/* <div className={{marginRight: "-0.25rem", ...styles.oneLogo }}> */}
            <FontAwesomeIcon
              icon={faBell}
              size="xl"
              onClick={() =>{setOpenNotifModal(!openNotifModal); setOpenSettingModal(false)}}
              style={{ cursor: 'pointer'}}
            />
          </div> 
          <div className={styles.oneLogo}>
            <FontAwesomeIcon
              icon={faGear}
              size="xl"
              style={{ cursor: 'pointer' }}
              onClick={() =>{setOpenSettingModal(!openSettingModal); setOpenNotifModal(false) }}
            /> 
          </div>

        { openNotifModal && <Notification />}
        { openSettingModal && <Setting />}
          
        </div>
      </div>

      
      <div className={styles.bottom}> 
        <div className={styles.blocUser}>
          <Image className={styles.photoProfil} src={"/user.jpg"} width={50} height={50} />
          <div className={styles.userLog} >
            <span>{user.firstname}</span>
            <span className={styles.username}> @{user.username}</span>
          </div>
        </div>
       <button onClick={handleLogout} className={styles.logoutButton}>Logout</button> 
      </div>
    </div>
  );
});

export default UserInfo;
