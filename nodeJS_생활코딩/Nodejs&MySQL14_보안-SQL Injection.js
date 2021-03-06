// 문제) update나 delete 등등 외부로부터 정보가 들어와서, 명령문이 실행된는 경우, 보안상 문제를 일으킬 수 있다.
// 해결)
// 1. 우리가 지금까지 해온것처럼, query문에 입력값이 있을 때, ?로하고, 두번째 인자로 값을 직접입력해주게 되면, 사용자들이 직접 입력한 query문들을 막고, 오류를 띄운다.
// 실제로, 해당 query문을 변수로 만들고, console.log(변수.sql)했을 때, 주소창에 추가적으로 입력한 query문은 문자열로 인식됨.

// 2. 근데 기본적으로 query method는 한번에 여러개의 query문이 실행되는것을 막는다.
// 근데 이것도 db연동 설정할 때, 가능하게 할 수 있긴함. 근데 하지말자.

// 3. ?쓰기 싫다면, 입력되는 값에 db연동모듈.escape(입력값)처리를 해주자.
// 근데 그냥 ? 쓰자.. 이게 편한듯