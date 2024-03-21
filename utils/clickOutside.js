

export const detectClickOutside = (condition, setCondition, status, containerRef) => {
    const handleClickOutside = (event) => {
        //Si il y a selectedPic && onClick en dehors de la zone
              if (condition && containerRef.current && !containerRef.current.contains(event.target)) {
                setCondition(status);
              }
          };
         
          let timeoutId;
      //Ajout de timeout afin de laisser la "fenêtre" s'ouvrir pour afficher l'image avant de d'éclancher l'evènement d'écoute du click
          if (condition) {
              timeoutId = setTimeout(() => {
                //console.log("add event");
                  document.addEventListener('click', handleClickOutside);
              }, 100); // Ajoutez un délai de 100 millisecondes (ou ajustez selon vos besoins)
          } else {
            //console.log("remove event");
              document.removeEventListener('click', handleClickOutside);
          }
      
          return () => {
              clearTimeout(timeoutId); // Nettoyez le timeOut avant de retirer l'écouteur
              document.removeEventListener('click', handleClickOutside);
          };
          
};

