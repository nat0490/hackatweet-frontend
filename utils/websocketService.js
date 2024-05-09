const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:8080');

const websocketService = {
  connect: () => {
    socket.addEventListener('open', () => {
      console.log('Connexion WebSocket établie');
    });

    socket.addEventListener('message', (event) => {
      console.log('Message reçu du serveur WebSocket :', event.data);
      // Traiter les messages reçus du serveur WebSocket
    });

    socket.addEventListener('close', () => {
      console.log('Connexion WebSocket fermée');
      // Gérer les actions à effectuer lorsque la connexion WebSocket est fermée
    });

    socket.addEventListener('error', (error) => {
      console.error('Erreur WebSocket :', error);
      // Gérer les erreurs de connexion WebSocket
    });
  },

  sendMessage: (message) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(message);
      console.log('Message envoyé au serveur WebSocket :', message);
    } else {
      console.error('Impossible d\'envoyer le message : la connexion WebSocket est fermée');
    }
  },

  closeConnection: () => {
    socket.close();
  }
};

export default websocketService;