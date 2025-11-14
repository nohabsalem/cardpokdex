import React, { useState, useEffect } from 'react';

function ApiTest() {
  // 1. Déclaration de l'état pour stocker le message de Flask.
  const [flaskMessage, setFlaskMessage] = useState('Chargement du message depuis Flask...');

  useEffect(() => {
    // L'URL de votre endpoint Flask
    const flaskUrl = 'http://127.0.0.1:5000/api/message'; 

    console.log("-> Tentative d'appel à l'API Flask...");
    
    fetch(flaskUrl)
      .then(response => {
        // Le statut 200 est déjà confirmé, mais cette ligne est essentielle pour lire le corps
        return response.json(); 
      })
      .then(data => {
        // Affiche l'objet entier pour vérification
        console.log("Objet JSON reçu :", data); 
        
        // 2. Mise à jour de l'état avec la propriété 'message' de l'objet JSON.
        if (data && data.message) {
            setFlaskMessage(data.message);
        } else {
            setFlaskMessage("Réponse reçue, mais le format JSON est incorrect.");
        }
      })
      .catch(error => {
        // Cette partie capture les erreurs réseau ou les erreurs pendant le traitement du JSON
        console.error("Erreur de connexion ou de traitement:", error);
        setFlaskMessage('Échec de la connexion à Flask.');
      });
  }, []); // Le tableau vide [] assure que l'effet ne se déclenche qu'une seule fois après le premier rendu

  return (
    <div>
      <h1>Message de Flask :</h1>
      <p>{flaskMessage}</p>
    </div>
  );
}

export default ApiTest;