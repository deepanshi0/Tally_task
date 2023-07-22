import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import firebase from "firebase/app";
import { initializeApp } from 'firebase/app';
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDEnSoW09wtirS3lnF_2aMm1WZFDej7Uk0",
    authDomain: "nfs-word.firebaseapp.com",
    projectId: "nfs-word",
    storageBucket: "nfs-word.appspot.com",
    messagingSenderId: "642950929585",
    appId: "1:642950929585:web:89ea823d4121c3903b5690",
    measurementId: "G-P7BSNEMN4H"
  
};

initializeApp(firebaseConfig);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <App />
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
