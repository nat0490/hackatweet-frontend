import React, { forwardRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from '../styles/Setting.module.css';
import { changeTheme } from '../reducers/theme';


const Setting = forwardRef((props, ref) => {

  const user = useSelector(state => state.users.value);
  const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light'); 
    
    const dispatch = useDispatch();

    const handleTheme = () => {
      dispatch(changeTheme(user.token));    
    };

//Dimension écran
  const getScreenWidth = () => {
  return window.innerWidth;
};

//Position de la modale en fonction de l'écran
  const getModaleStyle = () => {
    if(getScreenWidth() < 600) {
      return { transform: 'translate(5%, 60%)'}
    } else {
      return { transform: 'translate(105%, -10%)'}
    }
  };
  
  return (
    <div className={`${styles.modalContainer} ${styles[theme]}`} style={getModaleStyle()} ref={ref}>
        <h3 className={styles.title}>Settings</h3>
      <div >
        <div className={styles.lineTheme}> 
          <p>Changer le Theme</p>

            <button 
              onClick={handleTheme}
              className={`${styles.toggleBtn} ${styles[theme]}`}
              >
              <div className={styles.thumb}></div>
            </button>
          
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
});

export default Setting;

