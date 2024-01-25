import React, {forwardRef} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/user";
import { changeTheme } from "../reducers/theme";
import Image from "next/image";
import Link from "next/link";
import {} from "@fortawesome/free-solid-svg-icons";
import styles from '../styles/UserInfo.module.css'





const UserInfo = forwardRef((props, ref) => {

  const { customClassName } = props;

  const user = useSelector((state) => state.users.value);
  const theme = useSelector( state => state.theme.value);
  const dispatch = useDispatch();

 
  const handleLogout = () => {
    dispatch(logout());
    window.location.assign('/');
  };

  const handleTheme = () => {
    dispatch(changeTheme());    
  };

    
  return (
    <div className={`${styles[theme]} ${styles.userInfoPage} ${customClassName}`} ref={ref}>
      <Link href="/"><Image src={"/Dessin.png"} width={100} height={100} className={styles.logoLink} /></Link>
      <button onClick={handleTheme} className={styles.btnTheme}>
        { theme === 'light' ? 'GO Dark' : 'GO Light' }
      </button>
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
