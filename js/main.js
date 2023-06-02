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

const createCalender = () => {
  const year = date.getFullYear();
  const month = date.getMonth();

  document.querySelector(".year_month").textContent = `${year}년 ${
    month + 1
  }월`;

  const prevLast = new Date(year, month, 0); //지난달 마지막일
  const thisLast = new Date(year, month + 1, 0); //이번달 마지막일

  const prevLastDate = prevLast.getDate(); //지난달 마지막날 날짜 반환
  const thisLastDate = thisLast.getDate(); //이번달 마지막날 날짜 반환

  const prevLastDay = prevLast.getDay(); //지난달 마지막날 요일 인덱스 반환
  const thisLastDay = thisLast.getDay(); //이번달 마지막날 요일 인덱스 반환

  const prevDates = []; //배열 생성
  const thisDates = [...Array(thisLastDate + 1).keys()].slice(1);
  //thisLastDate + 1 인 배열을 생성하고 keys()로 배열 요소에 순차접근 가능하게 함.
  //...으로 배열의 모든 값을 가져오고 첫번째 요소인 0을 제외함.(thisLastDate는 값이 0부터 나오기때문에 )
  const nextDates = [];

  if (prevLastDay !== 6) {
    //인덱스 6은 일요일, 일요일 제외 모든 요일
    for (let i = 0; i < prevLastDay + 1; i++) {
      prevDates.unshift(prevLastDate - i);
      //지난달 마지막 날짜에서 i 만큼씩 빼서 그 숫자를 배열에 할당
    }
    //console.log(prevDates);
  }
  for (let i = 1; i < 7 - thisLastDay; i++) {
    //이번달 마지막날의 인덱스
    nextDates.push(i);
  }
  const dates = prevDates.concat(thisDates, nextDates); //prevDates배열에 thisDates,nextDates 추가
  //

  const firstDateIndex = dates.indexOf(1); //1일이 몇번째 index에 있는지
  const lastDateIndex = dates.lastIndexOf(thisLastDate); //이번달 마지막날이 몇번째 index에 있는지

  const calDates = document.querySelector(".cal_dates");
  calDates.innerHTML = "";

  dates.forEach((el, i) => {
    let dateClass;
    if (i >= firstDateIndex && i <= lastDateIndex) {
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

createCalender();

const mainPlusBtn = document.querySelector(".main_plus_btn");
console.log(mainPlusBtn);
const calendar = document.querySelector(".calendar_wrap");

mainPlusBtn.addEventListener("click", () => {
  calendar.classList.add("on");
});
