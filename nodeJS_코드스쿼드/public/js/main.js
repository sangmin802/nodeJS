import Location from './location.js';

class Main {
  constructor(){
    console.log('Main script started!');
    // const token = localStorage.getItem('token');
    // if(token){
    //   fetch('/', {
    //     method : 'GET',
    //     mode : 'cors',
    //     headers : {
    //       'Content-Type' : 'application/json',
    //       'Authorization' : token
    //     },
    //   })
    //   .then(res => {
    //     const logOut = document.querySelector('.logOut');
    //     logOut.addEventListener('click', () => {
    //       Location.locationPathname('/logOut')
    //     })
    //   })
    // }else{
    //   const signUp = document.querySelector('.signUp');
    //   const signIn = document.querySelector('.signIn');
    //   signUp.addEventListener('click', () => {
    //     Location.locationPathname('/signUp');
    //   })
    //   signIn.addEventListener('click', () => {
    //     Location.locationPathname('/signIn');
    //   })
    // }
    const signUp = document.querySelector('.signUp');
    const signIn = document.querySelector('.signIn');
    const logOut = document.querySelector('.logOut');
    if(signUp && signIn){
      signUp.addEventListener('click', () => {
        Location.locationPathname('/signUp');
      })
      signIn.addEventListener('click', () => {
        Location.locationPathname('/signIn');
      })
    }else{
      logOut.addEventListener('click', () => {
        Location.locationPathname('/logOut')
      })
    }
  }
}

new Main();