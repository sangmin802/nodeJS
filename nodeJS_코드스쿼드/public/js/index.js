class Index {
  constructor(){
    console.log('Index script started!');
    const signUp = document.querySelector('.signUp');
    signUp.addEventListener('click', () => {
      location.pathname = '/new'
    })
  }
}

new Index();