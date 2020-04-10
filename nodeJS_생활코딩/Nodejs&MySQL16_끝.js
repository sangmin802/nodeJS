// 1. SELECT * FROM ??? LIMIT 0 OFFSET 20 -> 0~20까지만 보여줘
// 이걸 통해 pagnation 가능할듯.
// 2. SELECT * FROM ??? WHERE ??? LIKE "%??%" -> 앞 뒤, 상관없이 ??가 들어가있는 값들을 불러와.
// 이걸 통해 검색기능 가능할듯. 혹은, keyup 이벤트로 자동완성기능