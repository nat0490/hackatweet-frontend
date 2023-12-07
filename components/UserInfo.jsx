import { useDispatch, useSelector } from "react-redux";
import { logout } from "../reducers/user";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {} from "@fortawesome/free-solid-svg-icons";

import styles from '../styles/UserInfo.module.css';




function UserInfo() {
  const user = useSelector((state) => state.users.value);
  const dispatch = useDispatch();
  return (
    <div className={styles.userInfoPage}>
    
      <Link href="/"><Image src={"/Dessin.png"} width={100} height={100} className={styles.logoLink} /></Link>
      <div className={styles.bottom}> 
        <div className={styles.blocUser}>
          <Image className={styles.photoProfil} src={"/user.jpg"} width={50} height={50} />
          <div className={styles.userLog} >
            <span>{user.firstname}</span>
            <span className={styles.username}> @{user.username}</span>
          </div>
        </div>
      
        <button onClick={() => dispatch(logout())} className={styles.logoutButton}>Logout</button>
      </div>
    </div>
  );
}

export default UserInfo;
