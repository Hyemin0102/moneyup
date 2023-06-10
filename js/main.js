let startDate;
let endDate;

$("#datepicker_start").datepicker({
  dateOptions:{
    debug:true,
  },
  
  onSelect: function (dateString) {
    console.log(dateString);
    startDate = dateString;
  },
});

$("#datepicker_end").datepicker({
  onSelect: function (dateString) {
    console.log(dateString);
    endDate = dateString;
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

const plusBtn = document.querySelector('.main_plus_btn');
const challengeBtn = document.querySelector('.challenge_plus_btn');

const dateBtn = document.querySelector('.challenge_date_btn');
const challengeDate = document.querySelector('.challenge_date');
const callengePrice = document.querySelector('.challenge_price');

plusBtn,challengeBtn.addEventListener('click',()=>{
  challengeDate.classList.add('calendar_on');
})


dateBtn.addEventListener('click',(e) => {
  e.preventDefault();
  callengePrice.classList.add('price_on');
  document.getElementById('challengeDate').value = `${startDate} ~ ${endDate} `
});

//챌린지 금액 입력, 3자리 수 콤마
const addComma = () => {
  const input = document.getElementById("number");
  let value = input.value;
  value = value.replace(/,/g, "");
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  input.value = value;
};
document.getElementById("number").addEventListener("input", addComma);


