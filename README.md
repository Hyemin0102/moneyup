<img width="40%" src="https://github.com/Hyemin0102/moneyup/assets/128768462/afe4c0c0-ba24-41ec-ac8e-93646da7c05a">
<img width="40%" src="https://github.com/Hyemin0102/moneyup/assets/128768462/1597350f-e683-42d7-8358-aa49c243a0fa">

# Money Up
챌린지 형식의 가계부 모바일 웹&앱 사이트(PWA)

## 🔎프로젝트 소개
https://hyemin0102.github.io/moneyup/

사용자의 소비 내역을 기록하며 소비 의식을 높이고,

이를 직관적으로 보여주는 UI/UX를 이용하여 웹 사용에 흥미를 느낄 수 있도록 제작하였습니다.

PWA로 만들어 모바일/PC 브라우저에서 다운로드 가능하며, 오프라인 시에도 실행됩니다.


## ⏳개발 기간
2023.05.29 ~ 2023.06.19 (약 3주)

## ⚙개발 환경
Javascript, jQuery(datepicker UI), Swiper

## 🚩주요 기능
* PWA 만들어 다운로드 시 오프라인에서도 실행 가능
* 사용자가 원하는 기간, 금액 설정(제이쿼리 UI이용) 챌린지 생성(챌린지 다중 생성 시 슬라이드 생성)
* 챌린지 내용 local storage 데이터 저장
* 금액 추가 시 잔여 금액 퍼센트 구하여 프로그레스바 줄어듦
* 관리 탭에서 local storage 데이터를 이용해 현재 챌린지 리스트 연동되어 생성
* 챌린지 리스트 클릭 시 local storage 저장 된 사용 데이터 불러와 사용 내역 생성
* 바닐라 자바스크립트 달력 구현

## 📌코드 리뷰
로컬스토리지 저장 함수를 이용하여 data 활용
```javascript
let challengeArray = JSON.parse(localStorage.getItem("challengeData")) || [];

const save = () => {
  localStorage.setItem("challengeData", JSON.stringify(challengeArray));
};
let num = 1;

const localSave = () => {
  const challengeObj = {
    seq: num++,
    startDate: startDate,
    endDate: endDate,
    amount: selectAmount.value,
    remainingAmount: selectAmount.value,
    userSpendList: "",
  };
  if (startDate != null) {
    //입력한 값이 있는 경우만 local 저장
    challengeArray.push(challengeObj);
    save(); //로컬스토리지에 challengeArray배열 저장
  }
};
```
## 😊프로젝트를 마치며
* 로컬스토리지에 데이터 저장 시 단순 값 뿐만 아니라 배열형태를 저장하여, 로컬 스토리지 > value > 배열 > key, value 값까지 접근하는 방법에 대해 공부하였습니다.
* 경우에 따라 데이터를 저장하고 필요한 값만 데이터 추출해오는 방법에 대해 배웠으며, 실제 사용자가 사용하는 경우를 고려하여 사용 편리성을 높이기 위해
UI/UX를 고려하였습니다.
* 제이쿼리 UI와 바닐라 자바스크립트 두가지의 방법으로 달력 기능을 구현하면서, 날짜 함수의 기능에 대해 많이 배웠습니다.
* 프로젝트를 진행하며 ios/safari의 크로스 브라우징에 대해서 고민을 많이 하였는데 이 부분은 앞으로 더욱 공부하여 개선해 나가야겠습니다.
* PWA로 만들어 브라우저와 모바일에서 다운로드가 가능하고 인터넷 연결이 안되더라도 실행이 되니 진짜 어플리케이션을 만든 것 같아 재밌었습니다.



