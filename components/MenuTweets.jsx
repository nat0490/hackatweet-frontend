import React, { forwardRef } from "react";

const MenuTweets = forwardRef((props,ref) => {


    return (
        <section ref={ref}>
            MenuTweet
            <p>Rendre privé</p>
            <p>Modifier</p>
            <p>Supprimer</p>
        </section>
    );
});

export default MenuTweets;