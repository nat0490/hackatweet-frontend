import React, {useEffect, useRef, useState} from 'react';
import { useSelector } from 'react-redux';
import styles from '../styles/AddPicture.module.css';
import Image from 'next/image';
import { RiseLoader } from 'react-spinners';

function AddPicture(props) {
    
    const user = useSelector((state)=> state.users.value);
    const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light'); 
    
    // const URL = "http://localhost:3000/";
  const URL = "https://hackatweet-backend-iota-three.vercel.app/";

  const [ isLoading, setIsLoading] = useState(false);
  const [ picToLoad, setPicToLoad] = useState([]);
  const [ picPath, setPicPath] = useState([]);
  const [ errorMsg, setErrorMsg] = useState(null);

 
  //CLOUDINARY_URL

  //console.log(pic);

  //console.log(props.resetChild);

  useEffect(()=> {
    {!Array.isArray(picPath) && (() => {setPicPath([]); console.log("reset picpath");})()}
  },[])

  useEffect(() => {
//Quand le post est publié, tous mettre à vide
    if(props.resetChild) {
      setPicToLoad([]);
      setPicPath([]);
      setErrorMsg(null);
      props.onChildReset();
    }
  },[props.resetChild])

  useEffect(()=>{
//Si l'utilisateur charge des images puis change d'avis (ne publis pas): effacer les images
    if(!props.onAddPic) {
      setPicToLoad([]);
      setPicPath([]);
      setErrorMsg(null);
    }
  },[props.onAddPic])

  
  useEffect(() => {
    if (picPath.length > 0 && !isLoading) {
      // Appel de la fonction de rappel avec les informations nécessaires
      props.onImagesLoaded(picPath);
    }
  }, [picPath, isLoading]);

  useEffect(() => {
    // Appel de la fonction de rappel avec la nouvelle valeur de isLoading
    props.onLoadingChange(isLoading);
  }, [isLoading]);

 

    const selectPicture = async (pic) => {
        event.preventDefault();
       // console.log(pic);


        if (!pic || pic.length === 0) {
            return; 
          }
        if (Array.from(pic).length > 6) {
          setErrorMsg("* Maximum 6 éléments");
          return;
        }
        if (picToLoad.length + Array.from(pic).length > 6 ) {
          setErrorMsg("* Maximum 6 éléments");
          return;
        }

        setErrorMsg(null);

        
        setPicToLoad(prevPicToLoad => pic ? [...prevPicToLoad, ...pic] : prevPicToLoad);
        setIsLoading(true);

          try {
           
              for (let i = 0; i < pic.length; i++) {
                //INITALISATION DU FORMDATA DANS LA BOUCLE POUR QUIL ENVOIE UNE IMAGE A LA FOIS
                
                const formData = new FormData(); 
                const file = pic[i];

                const blobbURL = window.URL.createObjectURL(file);
                
                
                console.log("blob:", blobbURL);
                // console.log(objectURL.slice(5));
                const objectURL = blobbURL.slice(5);

                // const reader = new FileReader();
                // reader.readAsDataURL(objectURL); 
                // reader.onloadend = function() {
                //   const base64data = reader.result;                
                //   console.log("base64",base64data);
                // }

//DEVRAIS MARCHER EN PROD  

                const imageType = /image.*/;
                if (!file.type.match(imageType)) return;
                formData.append(`files[${i}]`, (file, objectURL));
                // console.log("before fetch");

                // console.log("file:", file);
                // console.log("pic:", pic);
                // console.log("formData:",formData);

                const res = await fetch(`${URL}tweets/upload`, {
                      method: "POST",
                      body: formData,
                  });
                const data = await res.json();
                console.log(data);
                // if (data.result) {
                //   //ENREGISTRER LURL DE LIMAGE DANS PICPATH
                //   setPicPath(prevPicPath => [...prevPicPath, data.uploadedImages[0]])
                // } else {
                //   setErrorMsg(data.error)
                // }

                window.URL.revokeObjectURL(blobbURL);
                console.log("blob after revoc:", blobbURL);
            };
          } catch (error) {
                console.log(error)
          }
          setIsLoading(false);
    };

   

  const loadPic = picPath.map((pic,i) => {
    //console.log(pic);
    return (
      <div key={`${pic} ${i}`}  style={{margin:"0.25rem"}}>
              <img 
                src={pic} 
                alt={`image ${i}`}
                name={`image ${i}`}
                className={styles.loadPicture}
              />
      </div>
    )
  }) ;

 
  return (
    <div className={styles.addPictureContainer} picPath={picPath}>
        <label 
          for="files" 
          className={styles.drop_container} 
          id="dropcontainer"
          onDragOver={() => console.log("dragOver")}
          onDragEnd={(e) => console.log("e:",e.target)}
          >
          <span className={styles.drop_title}>Déposer vos fichiers</span>
            <span style={{fontSize:'12px', marginBottom:'0.5rem'}}>ou</span>
            
          <form encType="multipart/form-data"   >
            <div className={styles.inputLine}> 

            <input
                id="files"
                type="file"
                name="files"
                accept="image/*"
                onChange={(e) => selectPicture(e.target.files)}
                multiple
                webkitdirectory
                style={{
                    width: '100%',
                    borderRadius: '5px', 
                    backgroundColor: '#fff', 
                    fontSize: '12px',
                    color: '#000',
                }}
               
                />
           
            </div>
          </form> 
          
        
          { isLoading && <RiseLoader color="#EA3680" size="10px"/> }
          { errorMsg &&  <div className={styles.errorMsg}> {errorMsg}  </div>}
         
          <div className={styles.loadPicContainer} style={{ justifyContent: loadPic?.length > 3 ? 'flex-start': 'center'}}> 
          
           { loadPic }
            
          </div>

          <div className={styles.total}>
            { picToLoad.length > 0 ? <span className={styles.suiviLoad}> {picPath.length}/{picToLoad.length}</span> : <span className={styles.maxPicText}>*6 MAX</span>}
          </div>
         
         
        </label>
          
    </div>



  );
}

export default AddPicture;