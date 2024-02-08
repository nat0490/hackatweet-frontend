import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/Setting.module.css';
import { changeTheme } from '../reducers/theme';


export default function Setting() {

    const theme = useSelector(state => state.theme.value);
    const dispatch = useDispatch();

    const handleTheme = () => {
      dispatch(changeTheme());    
    };
  
  return (
    <div className={`${styles.modalContainer} ${styles[theme]}`}>
        <h3 className={styles.title}>Settings</h3>
      <div >
        <div className={styles.lineTheme}> 
          <p>Changer le Theme</p>
          <div className={`${styles.buttonContent} ${styles[theme]}`}> 
            <button onClick={handleTheme} className={`${styles.btnTheme} ${styles[theme]}`}>
            </button> 
          </div>
        </div>
        <div className={styles.lineTheme}> 
          <p>Voir mon profil</p>
        </div>
        <div className={styles.lineTheme}> 
          <p>Modifier mon profil</p>
        </div>
      </div>
    </div>
  );
};

