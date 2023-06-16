let startDate;
let endDate;
let startDateString;
let endDateString;

$("#datepicker_start").datepicker({
  minDate: 0,
  onSelect: function () {
    startDate = $.datepicker.formatDate(
      "yy-mm-dd",
      $("#datepicker_start").datepicker("getDate")
    );
    startDateString = startDate.toString(); //날짜형식 문자로 변환
  },
  onClose: function (selectedDate) {
    $("#datepicker_end").datepicker("option", "minDate", selectedDate);
    $("#datepicker_start").datepicker("option", "setDate", "today");
  },
});

$("#datepicker_end").datepicker({
  minDate: $("#datepicker_start").val(),
  onSelect: function () {
    endDate = $.datepicker.formatDate(
      "yy-mm-dd",
      $("#datepicker_end").datepicker("getDate")
    );
    endDateString = endDate.toString();
  },
});

//datepicker 기본 세팅
$.datepicker.setDefaults({
  dateFormat: "yy-mm-dd",
  prevText: "이전 달",
  nextText: "다음 달",
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: ["일", "월", "화", "수", "목", "금", "토"],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
  dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
  showMonthAfterYear: true,
  yearSuffix: "년",
});

let swiper = new Swiper(".challenge_swiper", {
  pagination: {
    el: ".swiper-pagination",
    dynamicBullets: false,
  },
});

const plusBtn = document.querySelectorAll(".main_plus_btn");
const challengeDate = document.querySelector(".challenge_date");

plusBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    challengeDate.classList.add("calendar_on");
  });
});

//기간 선택 후 확인 버튼 클릭
const dateBtn = document.querySelector(".challenge_date_btn");
const challengeAmount = document.querySelector(".challenge_amount");
const selectedDate = document.getElementById("selectedDate");

dateBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!startDate || !endDate) {
    alert("챌린지 기간을 선택해주세요");
  } else {
    challengeAmount.classList.add("amount_on");
    selectedDate.value = `${startDateString} ~ ${endDateString} `;
  }
});

//금액 입력 후 확인 버튼 클릭
const amountBtn = document.querySelector(".challenge_amount_btn");

const selectAmount = document.getElementById("selectAmount");
const spendAmount = document.getElementById("spendAmount");

const mainChallenge = document.querySelector(".main_challenge");
const mainBox = document.querySelector(".main_box");

//챌린지 금액 입력, 3자리 수 콤마
const addComma = (e) => {
  let inputEl = e.target;
  let value = inputEl.value;
  value = value.replace(/[^0-9]/g, ""); //숫자만 입력 제한
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); //3자리 수 콤마
  inputEl.value = value;
};
selectAmount.addEventListener("input", addComma);
spendAmount.addEventListener("input", addComma);

let challengeArray = JSON.parse(localStorage.getItem("challengeData")) || [];

const save = () => {
  localStorage.setItem("challengeData", JSON.stringify(challengeArray));
};

//datepicker 날짜 로컬스토리지 저장
let num = 0;

const localSave = () => {
  const challengeObj = {
    seq: ++num,
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

//기간, 금액 입력 후 최종 확인 버튼
amountBtn.addEventListener("click", () => {
  if (selectAmount.value) {
    challengeDate.classList.remove("calendar_on");
    challengeAmount.classList.remove("amount_on");
    mainChallenge.style.display = "block"; //메인 페이지 보이게
    mainBox.style.display = "none";
    createChallenge(); //챌린지 생성
  } else {
    alert("챌린지 금액을 입력해주세요");
  }
});

//사용 내역 입력 시 해당 금액만큼 빠지기
const preAmount = document.querySelector(".pre_amount"); //최초 예산
const spendBtn = document.querySelector(".spend_btn"); //입력 전 사용내역 추가 버튼
const spendAmountBtn = document.querySelector(".spend_amount_btn"); //입력 후 사용내역 추가 버튼
const challengeSpend = document.querySelector(".challenge_spend");

const spendCont = document.getElementById("spendCont");
console.log("spendBtn", spendBtn);

spendBtn.addEventListener("click", () => {
  challengeSpend.classList.add("spend_on");
  document
    .querySelector(".spend_amount_close")
    .addEventListener("click", () => {
      challengeSpend.classList.remove("spend_on");
    });
});

let inputAmount; //최초 금액
let usedAmount = 0; //총 사용 금액
let curAmount;
let slideActive;

//전체 금액에서 잔여 금액 계산 함수
const remainingAmountCalc = () => {
  slideActive = document.querySelector(".swiper-slide-active");
  let seqActive = slideActive.dataset.seq; //현재 active slide의 seq 번호

  let spendDate = new Date();

  challengeArray.forEach((el) => {
    if (seqActive == el.seq) {
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
      let spendAmountSum = spendAmountArrNum.reduce((a, b) => a + b); //사용 금액 합계

      el.remainingAmount = amountValue - spendAmountSum; //잔여 금액
      save();

      if (el.remainingAmount > 0) {
        //잔액이 0보다 작으면 save안되게(remaingAmout 줄어들게 됨)
        save();
      }

      if (el.remainingAmount < 0) {
        //잔액 없는 경우 함수종료
        alert("잔여 금액이 부족합니다.");
        curAmount.innerHTML = "0원";
        return;
      }

      let remainingPercentage = (el.remainingAmount / amountValue) * 100; //잔여금액 퍼센트
      let totalSpendPercentage = 100 - remainingPercentage; //총 사용금액 퍼센트
      let strokeDashOffsetPercentage = (totalSpendPercentage / 100) * 0.9 + 0.1; //사용퍼센트를 0.1~1까지 변경
      let strokeDashOffsetCalc = `calc(720 - (720 * ${
        1 - strokeDashOffsetPercentage
      }))`;
      //calc 값 구함
      el.offset = strokeDashOffsetCalc;
      save(); //로컬스토리지 업데이트
      console.log("el.remainingAmount///", el.remainingAmount);
      barOffset();
      curAmount = document.querySelector(".swiper-slide-active .cur_amount");
      curAmount.innerHTML = `${el.remainingAmount.toLocaleString()}원`;

      if (el.remainingAmount == 0) {
        alert(
          "챌린지 금액을 모두 사용하셨습니다. 새로운 챌린지를 추가해주세요."
        );
      }
    }
  });
};

//offset 만큼 bar스타일 적용
const barOffset = () => {
  const activeSlideIndex = swiper.realIndex; //현재 슬라이드 인덱스 구함
  const activeSlide = swiper.slides[activeSlideIndex]; //모든 슬라이드에서 현재 인덱스 찾음
  const bar = activeSlide.querySelector(".bar"); //현재 슬라이드에서 bar요소 찾음
  challengeArray.forEach((el) => {
    //전체 배열 반복문으로 bar의 id값과 배열 seq값 동일한 것만 스타일 적용
    if (el.seq == bar.id) {
      bar.style.strokeDashoffset = el.offset;
    }
  });
};

//사용내역 추가 클릭 시 원래 금액에서 입력 금액만큼 빠져야함
spendAmountBtn.addEventListener("click", () => {
  if (spendCont.value.trim() === "" || spendAmount.value.trim() === "") {
    alert("사용내역과 금액 모두 입력해주세요");
  } else {
    challengeSpend.classList.remove("spend_on");
    remainingAmountCalc(); //잔여 금액 계산
  }

  spendCont.value = ""; //사용내역 초기화
  spendAmount.value = ""; //사용금액 초기화
});

//챌린지 생성 함수
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
    <div class="challenge_detail">
      <div class="challenge_circle">
        <div class="circle_outer">
          <div class="circle_inner">
            <div class="circle_number">
              <div class="cur_amount">${el.remainingAmount.toLocaleString()}원</div>
              <div class="pre_amount">￦${el.amount}</div>
            </div>
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="250px" height="250px">
          <defs>
            <linearGradient id="GradientColor" gradientUnits="objectBoundingBox" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stop-color="rgb(255, 216, 204)" />
                <stop offset="100%" stop-color="rgb(211, 225, 252)" />
            </linearGradient>
          </defs>
          <circle  id=${seqNum} class="bar" cx="125" cy="125" r="113" stroke-linecap="round" />
        </svg>
      </div>
    </div>
    `;
    challengeWrap.append(challengeInner); //append가 아닌 appendChild로 하나씩 새로 추가

    $("#datepicker_start").datepicker("setDate", "");
    $("#datepicker_end").datepicker("setDate", "");

    swiper.update(); // 슬라이드 요소 업데이트
    selectAmount.value = ""; //input value 초기화
  });
};

//페이지 새로 고침 시
window.addEventListener("load", () => {
  if (challengeArray.length > 0) {
    mainChallenge.style.display = "block";
    mainBox.style.display = "none";
    createChallenge(); //함수생성
    localSave(); //seq 숫자 연결되어 1씩 증가하도록
    barOffset(); //bar style 유지
  } else {
    mainChallenge.style.display = "none";
    mainBox.style.display = "flex";
  }
});

swiper.on("slideChange", function () {
  barOffset();
});

//헤더 li 탭 클릭 시 화면
const headerMain = document.querySelector(".header_main");
const headerList = document.querySelector(".header_list");
const headerCal = document.querySelector(".header_cal");
const headerSet = document.querySelector(".header_set");

const challengeMain = document.querySelector(".challenge_main");
const challengeList = document.querySelector(".challenge_list");
const challengeCal = document.querySelector(".challenge_cal");
const challengeSet = document.querySelector(".challenge_set");

headerMain.addEventListener("click", function () {
  challengeMain.style.display = "block";
  challengeList.style.display = "none";
  challengeCal.style.display = "none";
  challengeSet.style.display = "none";
});

/* 챌린지 관리 탭 클릭 시 */
headerList.addEventListener("click", function () {
  challengeMain.style.display = "none";
  challengeList.style.display = "block";
  challengeCal.style.display = "none";
  challengeSet.style.display = "none";
  createChllengeList();
  console.log("클릭!!!", challengeListLi);
  createSpendList();

  challengeListLi.forEach((list, index) => {
    list.addEventListener("click", () => {
      console.log("ddddd", challengeArray);

      //사용 내역 보이는 함수
    });
  });
});
const detailInner = document.querySelector(".detail_inner");
const createSpendList = () => {
  console.log(challengeArray[0].userSpendList);
  detailInner.innerHTML = "";
  challengeArray.forEach((el, index) => {
    let createDiv = document.createElement("div");
    createDiv.classList.add("detail_box");
    createDiv.innerHTML = `
    <div class="detail_box">
      <p></p>
      <div class="detail_cont">
        <p>사용 내용</p>
        <p>사용 금액</p>
      </div>
    </div>
    `;
    detailInner.append(createDiv);
  });
};

headerCal.addEventListener("click", function () {
  challengeMain.style.display = "none";
  challengeList.style.display = "none";
  challengeCal.style.display = "block";
  challengeSet.style.display = "none";
});

headerSet.addEventListener("click", function () {
  challengeMain.style.display = "none";
  challengeList.style.display = "none";
  challengeCal.style.display = "none";
  challengeSet.style.display = "block";
});

//챌린지 관리 탭 - 로컬값으로 생성
const challengeListUl = document.querySelector(
  ".main_challenge_list .challenge_inner"
);
let challengeListLi;
const createChllengeList = () => {
  challengeListUl.innerHTML = "";

  let calcDdays = document.querySelectorAll(".calc_dday"); //span태그 세개
  const ddayArray = Array.from(calcDdays); //노드리스트 새로 배열로 만들어줌

  let ddayArrayItem = [];
  ddayArray.forEach((item) => {
    ddayArrayItem.push(item.innerHTML);
  });

  challengeArray.forEach((el, index) => {
    let createLi = document.createElement("li");
    createLi.classList.add("challenge_info");
    createLi.innerHTML = `
                    <p class="info_date">${el.startDate}~${el.endDate}</p>
                    <div class="list_amout">
                    <p class="list_cur_amount">${el.remainingAmount.toLocaleString()}원</p>
                    <p class="list_prev_amount">/ ${el.amount}</p>
                    </div>
                    <p class="info_dday">
                      챌린지 종료까지<span class="calc_dday">${
                        ddayArrayItem[index]
                      }</span>남았어요
                    </p>
                    <div class="progress">진행중</div>
      `;
    challengeListUl.append(createLi);
    challengeListLi = document.querySelectorAll(
      ".challenge_list .challenge_info"
    );
    console.log("ssssss", challengeListLi);
  });
};
