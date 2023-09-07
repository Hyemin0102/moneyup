<img width="40%" src="https://github.com/Hyemin0102/moneyup/assets/128768462/afe4c0c0-ba24-41ec-ac8e-93646da7c05a">
<img width="40%" src="https://github.com/Hyemin0102/moneyup/assets/128768462/1597350f-e683-42d7-8358-aa49c243a0fa">

# Money Up
챌린지 형식의 가계부 모바일 웹&앱 사이트(PWA)

<br>

## 🔎프로젝트 소개
https://hyemin0102.github.io/moneyup/

사용자의 소비 내역을 기록하며 소비 의식을 높이고,

이를 직관적으로 보여주는 UI/UX를 이용하여 웹 사용에 흥미를 느낄 수 있도록 제작하였습니다.

PWA로 만들어 모바일/PC 브라우저에서 다운로드 가능하며, 오프라인 시에도 실행됩니다.

<br>

## ⏳개발 기간
2023.05.29 ~ 2023.06.19 (약 3주)

<br>

## ⚙개발 환경
Javascript, jQuery(datepicker UI), Swiper

<br>

## 🚩주요 기능
* 사용자가 원하는 기간, 금액 설정(제이쿼리 UI이용) 챌린지 생성(챌린지 다중 생성 시 슬라이드 생성)
* 챌린지 내용 local storage 데이터 저장
* 금액 추가 시 잔여 금액 퍼센트 구하여 프로그레스바 줄어듦
* 관리 탭에서 local storage 데이터를 이용해 현재 챌린지 리스트 연동되어 생성
* 챌린지 리스트 클릭 시 local storage 저장 된 사용 데이터 불러와 사용 내역 생성
* 바닐라 자바스크립트 달력 구현

<br>

## 📌코드 리뷰
* [로컬스토리지 저장 함수](#로컬스토리지-저장-함수)
* [챌린지 생성 함수](#챌린지-생성-함수)
* [사용 금액만큼 잔여 금액 프로그레스 바 줄어드는 애니메이션 구현](#사용-금액만큼-잔여-금액-프로그레스-바-줄어드는-애니메이션-구현)
* [잔여금액 계산 함수](#잔여금액-계산-함수)

<br>
<hr>

### 로컬스토리지 저장 함수
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
<br>

### 챌린지 생성 함수
datepickter UI 달력으로 기간을 선택하고 오늘 날짜 기준으로 디데이값을 구해 챌린지를 만드는 함수. 이 때 seqNum은 swiper에서 active slide를 구분하기 위함이다. 
```javascript
const challengeWrap = document.querySelector(".challenge_wrap");

const createChallenge = () => {
  challengeWrap.innerHTML = "";
  localSave();
  let seqNum = 0;

  challengeArray.forEach((el) => {
    let today = new Date();
    let endDday = new Date(el.endDate);
    let endGap = endDday.getTime() - today.getTime();
    let result = Math.ceil(endGap / (1000 * 60 * 60 * 24));

    let challengeInner = document.createElement("div");
    challengeInner.classList.add("challenge_inner", "swiper-slide");
    challengeInner.setAttribute("data-seq", ++seqNum);

    challengeInner.innerHTML = `
    <div class="challenge_info">
      <p class="info_date">${el.startDate} ~ ${el.endDate}</p>
      <p class="info_dday">챌린지 종료까지<span class="calc_dday">${result.toString()}일</span>남았어요</p>
      <div class="progress">진행중</div>
    </div>
    <div class="pie-chart bar" id=${seqNum}>
                      <div class="center">
                        <div class="circle_number">
                          <div class="cur_amount">${el.remainingAmount.toLocaleString()}원</div>
                          <div class="pre_amount">￦${el.amount}</div>
                        </div>
                      </div>
                    </div>
                  </div>
    </div>
    `;
    challengeWrap.prepend(challengeInner); //append가 아닌 appendChild로 하나씩 새로 추가

    $("#datepicker_start").datepicker("setDate", "");
    $("#datepicker_end").datepicker("setDate", "");

    swiper.update(); // 슬라이드 요소 업데이트
    selectAmount.value = ""; //input value 초기화
  });
};
```

### 사용 금액만큼 잔여 금액 프로그레스 바 줄어드는 애니메이션 구현
나는 여러개의 소비 챌린지를 만들었을 때 슬라이드로 넘길 때마다 사용 퍼센트가 줄어드는 애니메이션을 구현하고 싶었다.

사용 금액을 입력하고 그 값을 로컬스토리지에 저장해서 남은 금액을 계산하고, 전체 금액에서 사용금액의 퍼센트를 구하여 해당 퍼센트만큼 줄어들게끔 우선 구했는데,
슬라이드를 옮길때마다 계속 실행되게 하기 위해 setInterval과 clearInterval 함수를 사용했다.

처음 챌린지를 로드했을 때 사용금액이 있는 경우(즉 프로그레스 바가 진행된 경우) clearInterval로 원래 상태로 돌아오게 하고 다시 setInterval 함수로 해당 사용 퍼센트만큼 스타일링을 적용시켜 애니메이션을 구현했고 setTime을 변수로 설정해 속도 설정을 용이하게 하였다.  
```javascript
let currentPercentage  = 0;
let interval;

const barOffset = (setTime) => {
  const activeSlideIndex = swiper.realIndex;
  const activeSlide = swiper.slides[activeSlideIndex];
  const bar = activeSlide.querySelector(".bar");

  challengeArray.forEach((el) => {
    if (el.seq == bar.id) {
      const targetPercentage = 100 - (el.remainingAmount / el.amount.replace(/,/g, "")) * 100; // 목표 퍼센트;
      //let currentPercentage = startPercentage; // 현재 퍼센트 초기값으로 넣어줌 

      if(!isNaN(targetPercentage)){ //targetPercentage 있는 경우만

        clearInterval(interval); //interval 함수 클리어

        interval = setInterval(() => {
          if (currentPercentage >= targetPercentage) {
            clearInterval(interval); // 목표 퍼센트에 도달하면 setInterval 종료
          } else {
            currentPercentage += 1;
          }
  
          bar.style.background = `conic-gradient(#fff 0% ${currentPercentage}%, var(--main-blue) ${currentPercentage}% 100%)`;
        }, setTime); // 갱신 속도 (조절 가능)
      }    
    }
  });
};
```

### 잔여금액 계산 함수
처음 예상했던 로직보다 꽤 복잡했고 코드를 짜는동안 여러번 수정하면서 어려웠던 로직이다.

특히, 로컬스토리지에 저장한 챌린지 목록과 현재 화면에 보여지고 있는 챌린지를 맞춰야했고 지출목록을 전체 더하는 과정에서 로컬스토리지에 배열을 넣었다가 다시 새 배열로 만들었다가.. 그 배열의 값들을 전부 합치는 등 로컬스토리지안의 중첩된 데이터에 이리저리 접근해야했다!!

또 잔여금액이 남아있는 경우, 전부 소진한 경우 등 조건에 맞는 화면을 구현해야 했고, 지출목록도 첫번째 지출목록은 로컬스토리지에 그냥 저장(save함수)하지만 두번째 지출목록 부터는 이 전 값을 스프레드 연사자로 전체 복사해와 거기다 추가로 저장해주는 로직도 넣어야했다.
```javascript
let totalSpendPercentage;
let spendAmountSum;

const remainingAmountCalc = () => {
  slideActive = document.querySelector(".swiper-slide-active");
  let seqActive = slideActive.dataset.seq; //현재 active slide의 seq 번호

  let spendDate = new Date();

  challengeArray.forEach((el) => {
    if (seqActive == el.seq) {
      //console.log("작동해", el.seq);
      let amountValue = el.amount.replace(/,/g, ""); //콤마 제거
      let inputSpendAmount = spendAmount.value;
      let spendAmountValue = inputSpendAmount.replace(/,/g, ""); //숫자

      const spendItem = {
        spendItem: spendCont.value,
        spendAmount: spendAmountValue,
        spendDate: spendDate,
      };

      if (el.userSpendList == "") {
        //사용금액이 비어있는 경우 로컬에 배열 저장
        el.userSpendList = [spendItem];
      } else {
        //사용 금액있는 경우 기존 배열 전체 가져와서 현재 사용 금액 추가 저장
          el.userSpendList = [...el.userSpendList, spendItem];
      }
    
      let spendAmountArr = el.userSpendList.map((item) => item.spendAmount);
      //spendAmount 값만 출력해서 새로운 배열 생성

      let spendAmountArrNum = spendAmountArr.map(Number);
      spendAmountSum = spendAmountArrNum.reduce((a, b) => a + b); //사용 금액 합계

      el.remainingAmount = amountValue - spendAmountSum; //잔여 금액

      let remainingPercentage = (el.remainingAmount / amountValue) * 100; //잔여금액 퍼센트
      totalSpendPercentage = 100 - remainingPercentage; //총 사용금액 퍼센트
      let backgroundGradient = `conic-gradient(#fff 0% ${totalSpendPercentage}%, var(--main-blue) ${totalSpendPercentage}% 100%)`

      el.offset = backgroundGradient
      curAmount = document.querySelector(".swiper-slide-active .cur_amount");

      if (el.remainingAmount >= 0) {
        //잔액이 0보다 크거나 같으면
        save();
        curAmount.innerHTML = `${el.remainingAmount.toLocaleString()}원`;
        barOffset(20);
        if(el.remainingAmount == 0){
          alert("챌린지 금액을 모두 사용하셨습니다. 새로운 챌린지를 등록해주세요.");
        }
      } else { //잔액이 0보다 작으면
        alert("잔여 금액이 부족합니다.");
        el.remainingAmount = 0;
        el.offset =  `conic-gradient(#fff 0% 100%)`;
        save();
        curAmount.innerHTML = "0원";
        barOffset(20);
      }
    }
  });
};
```

<br>

## 😊프로젝트를 마치며
* 로컬스토리지에 데이터 저장 시 단순 값 뿐만 아니라 배열형태를 저장하여, 로컬 스토리지 > value > 배열 > key, value 값까지 접근하는 방법에 대해 공부하였습니다.
* 경우에 따라 데이터를 저장하고 필요한 값만 데이터 추출해오는 방법에 대해 배웠으며, 실제 사용자가 사용하는 경우를 고려하여 사용 편리성을 높이기 위해
UI/UX를 고려하였습니다.
* datepicker UI와 바닐라 자바스크립트 두가지의 방법으로 달력 기능을 구현하면서, 날짜 함수의 기능에 대해 많이 배웠습니다.
* 프로젝트를 진행하며 ios/safari의 크로스 브라우징에 대해서 고민을 많이 하였는데 이 부분은 앞으로 더욱 공부하여 개선해 나가야겠습니다.
* PWA로 만들어 브라우저와 모바일에서 다운로드가 가능하고 인터넷 연결이 안되더라도 실행이 되니 진짜 어플리케이션을 만든 것 같아 재밌었습니다.



