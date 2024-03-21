import React, {useEffect, useRef, useState, useCallback} from 'react';
import { useSelector } from 'react-redux';
import styles from '../styles/AddPicture.module.css';
import { RiseLoader } from 'react-spinners';
import { useDropzone } from "react-dropzone";
import axios from "axios";

function AddPicture(props) {
    
    const user = useSelector((state)=> state.users.value);
    const theme = useSelector(state => state.theme.value.find(e => e.user === user.token)?.style || 'light'); 
    
    // const URL = "http://localhost:3000/";
  const URL = "https://hackatweet-backend-iota-three.vercel.app/";

  const [ isLoading, setIsLoading ] = useState(false);
  

  const [ picToLoad, setPicToLoad] = useState([]);
  const [ errorMsg, setErrorMsg] = useState(null);

  
  

 /* TEST2 DROPZONE 
      vvvvvvvv */
      const [ selectedImages, setSelectedImages] = useState([]);
      const [ uploadStatus, setUploadStatus] = useState("");
      const [ picUpload, setPicUpload ] = useState([]);

      


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
  } = useDropzone({ onDrop, accept: "image/*", maxFiles: 6 });

  useEffect(() => {
    if (picUpload.length > 0 && uploadStatus !== "") {
      // Appel de la fonction de rappel avec les informations nécessaires
      props.onImagesLoaded(picUpload);
      console.log(picUpload);
    }
  }, [picUpload, uploadStatus]);


  const onUpload = async () => {
    setIsLoading(true);
    setUploadStatus('Uploading...');
    const formData = new FormData();
    selectedImages.forEach((image, i)=>{
      formData.append(`file`, image);
    });
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
    const res = await axios.post(`${URL}tweets/upload2`, formData, config);
    //console.log(res.data.allCloudinaryRes);
    setPicUpload(res.data.allCloudinaryRes);
    setUploadStatus("Success");

    } catch(error) {
      console.log("imageUpload", error);
      setUploadStatus("Failed..");
    }
    setIsLoading(false);
  };
   /* ^^^^^^^^ 
  TEST2 DROPZONE */

  useEffect(()=>{
//Lors d'appuie sur le boutton POST, lance le téléchargement sur Cloudy
    if(props.onStart){
      if(selectedImages.length > 0){
        onUpload();
      } else {
        props.onHandleAddTweet();
      }
    }
  },[props.onStart]);

// useEffect(()=>{
//   if (props.onStart && uploadStatus === "Success"){
//     props.onHandleAddTweet();
//   }

// },[props.onStart, isLoading])


  // useEffect(()=>{


  // },[isLoading])

  useEffect(()=> {
//Met picUpload à vide au chargement de la page si celà n'a pas été fait avant (images non postés)
    {!Array.isArray(picUpload) && (() => {setPicUpload([]); console.log("reset picUpload");})()}
  },[])

  // useEffect(()=>{
//Passe isLoading à true lors du post d'un tweet
  //   setIsLoading(true);

  // },[props.onHandleAddTweet])

  useEffect(() => {
//Quand le post est publié, tous mettre à vide
    if(props.resetChild) {
      setPicToLoad([]);
      setPicUpload([]);
      setErrorMsg(null);
      props.onChildReset();
    }
  },[props.resetChild])

  useEffect(()=>{
//Si l'utilisateur charge des images puis change d'avis (ne publis pas): effacer les images
    if(!props.onAddPic) {
      setPicToLoad([]);
      setPicUpload([]);
      setErrorMsg(null);
    }
  },[props.onAddPic])

  
  useEffect(() => {
//Envoie les liens des images téléchargé pour le post via PROPS
    if (picUpload.length > 0 && !isLoading) {
      props.onImagesLoaded(picUpload);
    }
  }, [picUpload, isLoading]);

  
//   useEffect(() => {
// //Communication du status isLoading (image en cours de téléchargement sur cloudy) avec l ebouton post
//     props.onLoadingChange(isLoading);
//   }, [isLoading]);

 
 
  return (
    <div className={styles.addPictureContainer} >

{/* TEST2 DROPZONE */}
  {/* vvvvvvvv */}

      <form encType =" multipart/form-data " action='/upload' method="POST"/>
        <div className={styles.container}>

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

          <div className={styles.images}>
           
          {selectedImages.length > 0 &&
            selectedImages.map((image, index) => (
                <img src={`${window.URL.createObjectURL(image)}`} key={index} alt="" />
            ))}
        </div>

        {selectedImages.length > 0 && (
          <div className={styles.btn}>

           {isLoading && <RiseLoader
                            size="12px"
                            color="#EA3680" 
                            />}
            
            <p>{uploadStatus}</p>
          </div>
        )}
      <div >
        <p className={styles.maxPicText}>Images: {selectedImages.length > 0 ? selectedImages.length: 0}/6</p> 
      </div>
          

        </div>
      <form/>

  {/* ^^^^^^^^ */}
{/* TEST2 DROPZONE */}


          
    </div>



  );
}

export default AddPicture;