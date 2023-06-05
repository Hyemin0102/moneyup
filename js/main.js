//메뉴 클릭
const menuBtn = document.querySelectorAll(".header_inner > ul > li");
menuBtn.forEach((el) => {
  el.addEventListener("click", function () {
    menuBtn.forEach((item) => {
      item.classList.remove("active");
    });
    this.classList.add("active");
  });
});

//달력 생성
let date = new Date();
//console.log(date) Sun Jun 04 2023 22:48:20 GMT+0900 (한국 표준시)

const createCalender = () => {
  const year = date.getFullYear();
  const month = date.getMonth();

  document.querySelector(".year_month").textContent = `${year}년 ${
    month + 1
  }월`;

  const prevLast = new Date(year, month, 0);
  //지난달 마지막일(날짜에 0을 전달하면 마지막일이 나옴. month에는 현재 월 -1이기 때문에 이 전 달 마지막날 출력)
  const thisLast = new Date(year, month + 1, 0); //이번달 마지막일

  const prevLastDate = prevLast.getDate(); //지난달 마지막날 날짜 반환
  const thisLastDate = thisLast.getDate(); //이번달 마지막날 날짜 반환

  const prevLastDay = prevLast.getDay(); //지난달 마지막날 요일 인덱스 반환(일~토, 0~6나옴)
  const thisLastDay = thisLast.getDay(); //이번달 마지막날 요일 인덱스 반환

  const prevDates = []; //배열 생성
  //const thisDates = [...Array(thisLastDate + 1).keys()].slice(1);
  const thisDates = [...Array(thisLastDate + 1).keys()].slice(1);
  //thisLastDate + 1가 현재 기준 31이고 ...Array로 0부터 30까지, 즉 31개의 정수 인덱스를 생성함.
  //keys()는 배열매서드로 각 요소에 대한 인덱스를 새로운 배열로 생성함. Array Iterator 객체를 반환.윗줄에서 0~30까지 정수 인덱스가 나왔고 key()를 붙히면서 각 인덱스의 값이 동일하게 0~30 생김
  //위에 값이 0부터 나오기때문에 첫번째 요소 제거 하고 새 배열로 만듦
  //console.log(thisDates)

  const nextDates = [];

  if (prevLastDay !== 6) {
    //6인 경우(토요일) 달력에 안나오면 되니까
    for (let i = 0; i <= prevLastDay; i++) {
      //지난달마지막날의 인덱스만큼 i가 같거나 작은 경우
      prevDates.unshift(prevLastDate - i);
      //지난달 마지막 날짜에서 i 만큼씩 빼서 그 숫자를 배열 앞쪽에 할당
    }
  }
  for (let i = 1; i < 7 - thisLastDay; i++) {
    //이번달 마지막날의 인덱스
    nextDates.push(i);
  }
  const dates = prevDates.concat(thisDates, nextDates); //prevDates배열에 thisDates,nextDates 추가
  //console.log(dates) //지난날짜+현재달+다음날짜 순서로 합쳐짐

  const firstDateIndex = dates.indexOf(1); //1일이 몇번째 index에 있는지
  const lastDateIndex = dates.lastIndexOf(thisLastDate); //thisLastDate가 몇번째 index에 있는지

  const calDates = document.querySelector(".cal_dates");
  calDates.innerHTML = "";

  dates.forEach((el, index) => {
    let dateClass;
    if (index >= firstDateIndex && index <= lastDateIndex) {
      //i가 첫째날 인덱스보다 크고, 마지막날 인덱스보다 작으면 이번 달
      dateClass = "";
    } else {
      dateClass = "othermonth";
    }

    const dateElement = document.createElement("div"); //class이름 date인 div 생성
    dateElement.className = "cal_date";
    const spanElement = document.createElement("span"); //span생성
    spanElement.className = dateClass;
    spanElement.textContent = el; //각 dates 아이템 할당

    dateElement.appendChild(spanElement);
    calDates.appendChild(dateElement);
  });
};

//이전달 달력 생성
const prevMonth = () => {
  date.setMonth(date.getMonth() - 1);
  createCalender();
};

//다음달 달력 생성
const nextMonth = () => {
  date.setMonth(date.getMonth() + 1);
  createCalender();
};

const mainPlusBtn = document.querySelector(".main_plus_btn");
const calendar = document.querySelector(".calendar_wrap");
const prevBtn = document.querySelector(".cal_nav_btn.prev");
const nextBtn = document.querySelector(".cal_nav_btn.next");

mainPlusBtn.addEventListener("click", () => {
  createCalender();
  calendar.classList.add("on");
});
prevBtn.addEventListener("click", () => prevMonth());
nextBtn.addEventListener("click", () => nextMonth());
