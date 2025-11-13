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

  // 3. Rendu du composant
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>🚀 Statut de la connexion React ↔ Flask</h3>
      <p>
        Message actuel dans l'état React : 
        <strong style={{ color: 'blue' }}>{flaskMessage}</strong>
      </p>
      {/* Affichage d'un indicateur si le message par défaut est toujours là */}
      {flaskMessage === 'Chargement du message depuis Flask...' && <p>En attente de la réponse...</p>}
    </div>
  );
}

export default ApiTest;