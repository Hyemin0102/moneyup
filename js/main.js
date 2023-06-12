let startDate;
let endDate;
let startDateString;
let endDateString;

$("#datepicker_start").datepicker({
  dateOptions: {
    debug: true,
  },
  onSelect: function () {
    //startDate = dateString;
    startDate = $.datepicker.formatDate(
      "yy-mm-dd",
      $("#datepicker_start").datepicker("getDate")
    );
    startDateString = startDate.toString(); //날짜형식 문자로 변환
  },
});

$("#datepicker_end").datepicker({
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
  challengeAmount.classList.add("amount_on");
  selectedDate.value = `${startDateString} ~ ${endDateString} `;
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

let inputAmount; //사용자가 최초 입력한 금액

//기간, 금액 입력 후 최종 확인 버튼
amountBtn.addEventListener("click", () => {
  challengeDate.classList.remove("calendar_on");
  challengeAmount.classList.remove("amount_on");
  mainChallenge.style.display = "block"; //메인 페이지 보이게
  mainBox.style.display = "none";
  createChallenge();
});

//사용 내역 입력 시 해당 금액만큼 빠지기
const preAmount = document.querySelector(".pre_amount"); //최초 예산
const curAmount = document.querySelector(".cur_amount"); //잔여 예산
const spendBtn = document.querySelector(".spend_btn"); //입력 전 사용내역 추가 버튼
const spendAmountBtn = document.querySelector(".spend_amount_btn"); //입력 후 사용내역 추가 버튼

const spendCont = document.getElementById("spendCont");

spendBtn.addEventListener("click", () => {
  document.querySelector(".challenge_spend").classList.add("spend_on");
});

let inputSpendAmount = 0; //사용내역의 금액
let inputSpendCont; //사용내역의 내용
let usedAmount = 0;

//사용내역 추가 클릭 시 원래 금액에서 입력 금액만큼 빠져야함
spendAmountBtn.addEventListener("click", () => {
  inputSpendCont = spendCont.value; //입력한 사용내역
  inputSpendAmount = spendAmount.value; //입력한 사용금액 계산 위해 숫자로 변환 but 콤마 포함되어있음
  let spendAmountValue = inputSpendAmount.replace(/,/g, ""); //숫자
  console.log("spendAmountValue", spendAmountValue);

  inputAmount = selectAmount.value; //전체 금액
  let inputAmountValue = inputAmount.replace(/,/g, ""); //숫자

  console.log("inputAmountValue", inputAmountValue);

  usedAmount = spendAmountValue; //사용자 입력 금액
  let remainingAmount = inputAmountValue - usedAmount;
  console.log("remainingAmount", remainingAmount);
  //console.log("usedAmount", typeof usedAmount);
});

//챌린지 생성 함수
const challengeWrap = document.querySelector(".challenge_wrap");
const createChallenge = () => {
  let today = new Date();
  let endDday = new Date(endDate);
  let endGap = endDday.getTime() - today.getTime();
  let result = Math.ceil(endGap / (1000 * 60 * 60 * 24));

  let challengeInner = document.createElement("div");
  challengeInner.classList.add("challenge_inner");
  challengeInner.innerHTML = `
  <div class="challenge_info">
    <p class="info_date">${startDateString} ~ ${endDateString}</p>
    <p class="info_dday">챌린지 종료까지<span class="calc_dday">${result.toString()}일</span>남았어요</p>
    <div class="progress">진행중</div>
  </div>
  <div class="challenge_detail">
    <div class="challenge_circle">
      <div class="circle_outer">
        <div class="circle_inner">
          <div class="circle_number">
            <div class="cur_amount">${selectAmount.value}원</div>
            <div class="pre_amount">${selectAmount.value}원</div>
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
        <circle cx="125" cy="125" r="113" stroke-linecap="round" />
      </svg>
    </div>
  </div>
  `;
  challengeWrap.prepend(challengeInner);
};
