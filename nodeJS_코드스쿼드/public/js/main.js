import Location from './location.js';

class Main {
  constructor(){
    console.log('Main script started!');
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