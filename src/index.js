import App from './App.js';
import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';


var firebaseConfig = {
    apiKey: "AIzaSyDrj1cgy08BtqvXY47Vge1CIpXk0eGfCIk",
    authDomain: "reenbittesttask.firebaseapp.com",
    databaseURL: "https://reenbittesttask.firebaseio.com",
    projectId: "reenbittesttask",
    storageBucket: "reenbittesttask.appspot.com",
    messagingSenderId: "627505165671",
    appId: "1:627505165671:web:8b109cc2badddfd6bf6bc2",
    measurementId: "G-6Y60Q3LXH0"
  };
let app = firebase.initializeApp(firebaseConfig,"main");



ReactDOM.render(
    <React.StrictMode>
      <App app={app} />
    </React.StrictMode>,
    document.getElementById('root')
  );
  
  