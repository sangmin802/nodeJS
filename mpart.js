// 정리정돈을 위해 함수, 배열, 객체가 있지만, 그러한 객체도 많아지면 관리하기가 힘들어진다.
// 그러한 객체들을 따로 관리하는 최종은 모듈이다.
var L = {
    name : '레고시',
    kind : '회색늑대',
    f : function(){
        console.log(`${this.name}는 ${this.kind} 입니다.`);
    }
}
var H = {
    name : '하루',
    kind : '토끼',
    f : function(){
        console.log(`${this.name}는 ${this.kind} 입니다.`);
    }  
}
module.exports = {L, H}; // 현재 이 js파일에서 M이라는 객체를 이 파일 밖에서 사용할 수 있도록 내보내겠다.