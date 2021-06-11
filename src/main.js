// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import firebase from 'firebase/app';
import store from './store';
import functions from "firebase/functions";

Vue.config.productionTip = false;

// Initialise firebase
var firebaseConfig = {
  apiKey: "AIzaSyB0Pe6xU7axubg3y0lijR1r0fBH1Kn5k5U",
  authDomain: "slack-with-vuejs.firebaseapp.com",
  projectId: "slack-with-vuejs",
  storageBucket: "slack-with-vuejs.appspot.com",
  messagingSenderId: "1062602155241",
  appId: "1:1062602155241:web:fe035db9ae9a4d3f193c78",
  databaseURL: "https://slack-with-vuejs-default-rtdb.europe-west1.firebasedatabase.app/",
};

firebase.initializeApp(firebaseConfig);

window.firebase = firebase;

console.log('%cWelcome Fellow Developer 🔥', 'color:#f2f2f2; font-size:22px; font-weight:900; background: #42474C; padding: 8px');


// Store the user data
const unsubscribe = firebase.auth().onAuthStateChanged(user => {
  store.dispatch("setUser", user);

  new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
  });

  // recursion -this function calls itsef on auth state change
  unsubscribe()
});
