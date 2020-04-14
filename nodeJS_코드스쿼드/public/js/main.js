import Location from './location.js';

class Main {
  constructor(){
    console.log('Main script started!');
    const signUp = document.querySelector('.signUp');
    const signIn = document.querySelector('.signIn');
    signUp.addEventListener('click', () => {
      Location.locationPathname('/signUp');
    })
    signIn.addEventListener('click', () => {
      Location.locationPathname('/signIn');
    })
  }
}

new Main();