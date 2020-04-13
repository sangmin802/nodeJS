class Form {
  constructor(){
    const ajaxBtn = document.querySelector('.ajaxSend');
    ajaxBtn.addEventListener('click', () => {
      const name = document.forms[0].elements[0].value;
      this.sendAjax('/new_info', name);
    })
  }

  sendAjax(url, _name){ // 서버(db)와 통신
    // flyers할때, DB받아오는거 이런방법이였나봄.
    // url이 getId같은 메소드이름
    // 1. fetch post로 url(메소드이름)에 필요한 값(data)를 보냄.
    // 2. server에서 해당 url(메소드이름)이 호출되고, 여러 조건을 검.
    //    ex) 필요한 값의 형식이 적절한지 등
    // 3. DB관련 작업을 함.
    // 4. 완료되면, res.json(응답값)등으로 반환해줌
    // 5. 다시 js파일로와서 fetch의 .then값으로 받아와, 필요한곳에 사용.
    // 화면리로딩없이 적용가능.
    const first = _name.charAt(0).toUpperCase();
    _name = first+_name.slice(1);
    const data = {name : _name};
    fetch(url, {
      method: 'POST',
      mode: 'cors', // cors여야만 header가 정상작동함. 기본값 cors이니 안건드려도 될듯
      headers: {
        'Content-Type': 'application/json', // 받을때, json형식으로 받는다.
      },
      body: JSON.stringify(data),
    })
    .then(res => {
      console.log(res);
      return res.json();
    })
    .then(data => {
      console.log(JSON.stringify(data)) // node server.js에서 해당 url을 통해 받아온 정보
      if(data.result === 'Ok'){
        document.querySelector('.result').innerHTML = `Hello! ${data.data.name}`;
      }else{
        document.querySelector('.result').innerHTML = `..? Who are you..?`;
      }
    });
  }
}

new Form();