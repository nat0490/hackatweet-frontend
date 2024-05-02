import React, {useEffect, useRef, useState, useCallback, forwardRef} from 'react';
import { useSelector } from 'react-redux';
import styles from '../styles/AddPicture.module.css';
import { PropagateLoader } from 'react-spinners';
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { ErrorBoundary } from 'react-error-boundary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSadTear, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const AddPicture = forwardRef((props, ref) =>{
    
    const user = useSelector((state)=> state.users.value);
    const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light'); 
    
    // const URL = "http://localhost:3000/";
  const URL = "https://flowst-backend.vercel.app/";

  const [ isLoading, setIsLoading ] = useState(false);
  
  const [ selectedImages, setSelectedImages] = useState([]);
  const [ uploadStatus, setUploadStatus] = useState("");
  const [ picUpload, setPicUpload ] = useState([]);

  const [ popUpError, setPopUpError ] = useState(false);

   
  const onDrop = useCallback((acceptedFiles, rejectedFiles)=> {
    acceptedFiles.forEach((file)=> {
      setSelectedImages((prevState) => [...prevState, file]);
    });
   }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ onDrop, accept: {
                            'image/*': ['.jpeg', '.jpg', '.png'],
                          }, maxFiles: 6});

//Chargement des images du composant enfant une fois téléchargé sur cloudinary                      
  useEffect(() => {
    if (picUpload.length > 0 && uploadStatus !== "") {
      props.onImagesLoaded(picUpload);
      // console.log(picUpload);
    }
  }, [picUpload, uploadStatus]);

//Ecoute pour détecter le click en dehors du toggle SuccesPost
useEffect(() => {
  let timeoutId;
  if (popUpError) {
    timeoutId = setTimeout(()=> {
      document.addEventListener('click', () => setPopUpError(false))
    }, 100);
  }
}, [popUpError]);

//Fonction pour redimensionner une image
function resizeImageToTargetSize(image, targetSizeInKB) {
  return new Promise((resolve, reject) => {
      const MAX_QUALITY = 1;
      const MIN_QUALITY = 0;

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const imageElement = new Image();

      const reader = new FileReader();
      reader.onload = function(event) {
          imageElement.onload = function() {
              let quality = MAX_QUALITY;
              let dataURL = null;
              let blobSizeInKB = 0;

              do {
                  canvas.width = imageElement.width;
                  canvas.height = imageElement.height;
                  context.clearRect(0, 0, canvas.width, canvas.height);
                  context.drawImage(imageElement, 0, 0);

                  dataURL = canvas.toDataURL('image/jpeg', quality);
                  blobSizeInKB = Math.round(dataURL.length / 1024);

                  if (blobSizeInKB <= targetSizeInKB) {
                      resolve(dataURL);
                      return;
                  }

                  quality -= 0.01;
              } while (quality > MIN_QUALITY);

              reject(new Error('Cannot resize image to target size.'));
          };
          imageElement.src = event.target.result;
      };

      reader.readAsDataURL(image);
  });
}


// console.log(selectedImages);



  const onUpload = async () => {
    setIsLoading(true);
    setUploadStatus('Uploading...');
    const formData = new FormData();
    // Utiliser Promise.all pour attendre que toutes les images soient redimensionnées
    await Promise.all(selectedImages.map(async (image, i) => {
        try {
            // Redimensionner l'image
            const resizedDataUrl = await resizeImageToTargetSize(image, 500); // 500 Ko comme taille cible
            // Convertir l'URL de données en Blob
            const blob = await fetch(resizedDataUrl).then(res => res.blob());
            // Ajouter le blob à FormData
            formData.append(`file`, blob);
        } catch (error) {
            console.error("Error resizing image:", error);
        }
    }));
    try {
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };
        const res = await axios.post(`${URL}tweets/upload2`, formData, config);
        setPicUpload(res.data.allCloudinaryRes);
        setUploadStatus("Success");
    } catch(error) {
        console.error("imageUpload", error);
        setUploadStatus("Failed..");
        props.updateFailedStart();
    }
    setIsLoading(false);
};

//Loger le status du téléchargement
  useEffect(()=>{
    if(uploadStatus) {
      console.log(uploadStatus);
    };
    if(uploadStatus === "Failed.." ) {
      setPopUpError(true);
    }
  },[uploadStatus]) 

//Lors d'appuie sur le boutton POST, lance le téléchargement sur Cloudy
  useEffect(()=>{
    if(props.onStart){
      if(selectedImages.length > 0){
        onUpload();
      } else {
        props.onHandleAddTweet();
      }
    }
  },[props.onStart]);

//Met picUpload à vide au chargement de la page si celà n'a pas été fait avant (images non postés)
  useEffect(()=> {
    if (!Array.isArray(picUpload)) {
      setPicUpload([]);
      console.log("reset picUpload");
    }
  },[])

//Quand le post est publié, tous mettre à vide
  useEffect(() => {
    if(props.resetChild) {
      // setPicToLoad([]);
      setPicUpload([]);
      // setErrorMsg(null);
      props.onChildReset();
    }
  },[props.resetChild])

//Si l'utilisateur charge des images puis change d'avis (ne publis pas): effacer les images
  useEffect(()=>{
    if(!props.onAddPic) {
      // setPicToLoad([]);
      setPicUpload([]);
      // setErrorMsg(null);
    }
  },[props.onAddPic])

//Envoie les liens des images téléchargé pour le post via PROPS  
  useEffect(() => {
  if (picUpload.length > 0 && !isLoading) {
      props.onImagesLoaded(picUpload);
    }
  }, [picUpload, isLoading]);

//Dimension écran
const getScreenWidth = () => {
  return window.innerWidth;
};

//Position du text "images télécharge" en fonction taille écran et photo téléchargé
const getDownPicStyle = () => {
  let nbrDownImg = selectedImages?.length;
  if (getScreenWidth() < 600) {
    if (nbrDownImg > 0) {
      if(isLoading){
        return { top: "15rem"}
      } else {
        return { top: "29rem"}
      }} else {
        return { top: "14rem"}
      };
    } else {
      if (nbrDownImg > 0) {
        if(isLoading){
          return { top: "16rem"}
        } else {
          return { top: "29.5rem"}
        }} else {
          return { top: "14.5rem"}
        };
    }
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
    <div className={styles.addPictureContainer} ref={ref} >
        <div className={styles.container}>
          {/* <form encType="multipart/form-data" action='/upload' method="POST"> */}
          {!isLoading && 
            <div className={styles.babyContainer}>
              <div className={styles.dropzone} {...getRootProps()}>
                <input {...getInputProps()} name="file" type='file' accept="image/*" />
                {isDragActive ? (
                  <p className={styles.dropText}>Déposez le(s) fichier(s) ici ...</p>
                ) : (
                  <p className={styles.dropText}>Faites glisser et déposez le(s) fichier(s) ici, ou cliquez pour sélectionner des fichiers</p>
                )}
              </div>
            </div>
          }
          {/* </form> */}
          <div className={styles.images}>
            {selectedImages.length > 0 &&
              selectedImages.map((image, index) => (
                  <img src={`${window.URL.createObjectURL(image)}`} key={index} alt="" />
              ))}
          </div>
          {selectedImages.length > 0 && isLoading &&  
          <div className={`${styles[theme]} ${styles.btn}`}>
              <PropagateLoader
                size="16px"
                color="#EA3680" 
                />
          </div>}

          { popUpError &&
              <section className={`${styles[theme]} ${styles.popAlert}`} >
              <aside>
                  <h4 className={styles.titleAlert}>Erreur lors du chargement, Veuillez réessayer.</h4>
                  <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    size="2x"
                    onClick={() =>setPrivat(false)}
                    style={{ color: "#EA3680" }}
                    className={styles.icon}
                  /> 
              </aside>
            </section>
            }  
        <div >
          <p className={styles.maxPicText} style={getDownPicStyle()}>Images: {selectedImages.length > 0 ? selectedImages.length: 0}/6</p> 
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
});

export default AddPicture;