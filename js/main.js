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

//달력생성
let date = new Date();
let selectedDates = []; //클릭한 날짜 저장할 배열
let selectedDateAll = []; //클릭한 날짜 전체 기간 담을 배열 생성

const inputDate = document.querySelector("#challengeDate");

//달력 구하는 함수
const createCalender = () => {
  const year = date.getFullYear();
  const month = date.getMonth();

  document.querySelector(".year_month").textContent = `${year}년 ${
    month + 1
  }월`;

  const prevLast = new Date(year, month, 0);
  const thisLast = new Date(year, month + 1, 0);

  const prevLastDate = prevLast.getDate();
  const thisLastDate = thisLast.getDate();

  const prevLastDay = prevLast.getDay();
  const thisLastDay = thisLast.getDay();

  const prevDates = [];
  const thisDates = [...Array(thisLastDate + 1).keys()].slice(1);
  const nextDates = [];

  if (prevLastDay !== 6) {
    for (let i = 0; i <= prevLastDay; i++) {
      prevDates.unshift("");
    }
  }
  for (let i = 1; i < 7 - thisLastDay; i++) {
    nextDates.push("");
  }

  const dates = prevDates.concat(thisDates, nextDates);

  const firstDateIndex = dates.indexOf(1); //1일이 몇번째 index에 있는지
  const lastDateIndex = dates.lastIndexOf(thisLastDate); //thisLastDate가 몇번째 index에 있는지

  const calDates = document.querySelector(".cal_dates");
  calDates.innerHTML = "";

  dates.forEach((el, index) => {
    let dateClass;
    if (index >= firstDateIndex && index <= lastDateIndex) {
      dateClass = "thismonth";
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
  //오늘 날짜 구하기
  let today = new Date();
  if (month === today.getMonth() && year === today.getFullYear()) {
    for (let date of document.querySelectorAll(".thismonth")) {
      //console.log(typeof date.innerHTML); - string이라 숫자로 변경
      if (Number(date.innerHTML) === today.getDate()) {
        date.classList.add("today");
      }
    }
  }
  //클릭 이벤트
  let calDateElement = document.querySelectorAll(".cal_date");
  //console.log("11", calDateElement);
  calDateElement.forEach((date) => {
    date.addEventListener("click", (e) => {
      let clickDate = e.target.textContent;
      let clickMonth = month + 1; //해당 date의 month
      let clickYear = year; //해당 date의 year
      const clickedDates = new Date(`${clickYear},${clickMonth},${clickDate}`);
      //console.log(clickedDates);

      if (selectedDates.length < 2) {
        selectedDates.push(clickedDates); //클릭한 날짜 selectedDates 배열에 담기
        e.target.classList.add("selected");
        localSetItem(selectedDates);//로컬스토리지 저장

        const startDate = new Date(selectedDates[0]);
        const endDate = new Date(selectedDates[1]);
        //const currentDate = new Date(startDate);

        if(startDate<endDate){ //시작일이 더 이른 경우
          console.log('savedSelectedDates',savedSelectedDates)
        } else if(endDate<startDate) { //시작일이 더 느린 경우
          calDateElement.forEach((date) => {
            date.classList.remove("selected");
          });
          alert('시작일을 더 빠르게 다시 선택해주세요!');
          selectedDates = [];
          console.log('selectedDates',selectedDates)
        }
      }
    });
  });
};

//로컬스토리지 저장
const localSetItem = (dates) =>{
  localStorage.setItem(
    "selectedDates",
    JSON.stringify(dates.map((date) => date.toDateString())) //toDateString으로 날짜만 저장
  );
}

//로컬스토리지 불러옴
const localGetItem = () => {
  const savedSelectedDates = localStorage.getItem("selectedDates");
  return savedSelectedDates ? JSON.parse(savedSelectedDates).map((date) => date) : [];
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
const mainBox = document.querySelector(".main_box");

mainPlusBtn.addEventListener("click", (e) => {
  e.stopPropagation(); //없으면 상위요소(mainBox)까지 이벤트 전달되어 클릭 안되므로 추가
  createCalender();
  calendar.classList.add("on");
});

mainBox.addEventListener("click", () => {
  if (calendar.classList.contains("on")) {
    calendar.classList.remove("on");
  }
});

prevBtn.addEventListener("click", () => prevMonth());
nextBtn.addEventListener("click", () => nextMonth());

//챌린지 금액 입력, 3자리 수 콤마
const addComma = () => {
  const input = document.getElementById("number");
  let value = input.value;
  value = value.replace(/,/g, "");
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  input.value = value;
};

const savedSelectedDates = localGetItem();
const formattedDate = savedSelectedDates.map((dateString)=>{
  let formatDate = new Date(dateString);
  let formatYear = formatDate.getFullYear();
  let formatMonth = formatDate.getMonth() +1;
  let formatDay = formatDate.getDate();
  return `${formatYear}.${formatMonth < 10 ? '0' + formatMonth : formatMonth}.${formatDay <10 ? '0'+ formatDay : formatDay}`;
})
console.log('formattedDate',formattedDate);
let challengeStart = formattedDate[0];
let challengeEnd = formattedDate[1];
const challengeDate = document.getElementById("challengeDate");
challengeDate.value = `${challengeStart} ~ ${challengeEnd}`;



document.getElementById("number").addEventListener("input", addComma);





/* calDateElement.addEventListener("click", (e) => {
  let clickDate = e.target.textContent;
  let clickMonth = month + 1; //해당 date의 month
  let clickYear = year; //해당 date의 year
  const clickedDates = new Date(`${clickYear},${clickMonth},${clickDate}`);
}); */
//console.log(clickedDates);

/* //달력 생성
let date = new Date();
let selectedDates = []; //클릭한 날짜 저장할 배열
let selectedDateAll = []; //클릭한 날짜 전체 기간 담을 배열 생성

const inputDate = document.querySelector("#challengeDate");

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
      prevDates.unshift("");
      //지난달 마지막 날짜에서 i 만큼씩 빼서 그 숫자를 배열 앞쪽에 할당
    }
  }
  for (let i = 1; i < 7 - thisLastDay; i++) {
    //이번달 마지막날의 인덱스
    nextDates.push("");
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
      dateClass = "thismonth";
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

    //클릭 이벤트
    let calDateElement = document.querySelectorAll(".cal_date");
    dateElement.addEventListener("click", (e) => {
      let clickDate = e.target.textContent;
      let clickMonth = month + 1; //해당 date의 month
      let clickYear = year; //해당 date의 year
      const clickedDates = new Date(`${clickYear},${clickMonth},${clickDate}`);
      //console.log(clickedDates);

      if (selectedDates.length < 2) {
        selectedDates.push(clickedDates); //클릭한 날짜 selectedDates 배열에 담기
        e.target.classList.add("selected");

        let startDate = selectedDates[0];
        let endDate = selectedDates[1];

        //*****local storage에 배열값 넣고 그걸 꺼내서 class 추가
        localStorage.setItem(
          "selectedDates",
          JSON.stringify(selectedDates.map((date) => date.toDateString())) //toDateString으로 날짜만 저장
        );

        calDateElement.forEach((dateEl) => {
          let dateNumber = parseInt(dateEl.querySelector("span").textContent);
          let currentDate = new Date(clickYear, clickMonth - 1, dateNumber); //현재 클릭한 날짜 세팅

          let startDateTime = startDate.getTime();
          let endDateTime = endDate.getTime();
          let currentDateTime = currentDate.getTime();

          if (
            currentDateTime >= startDateTime &&
            currentDateTime <= endDateTime
          ) {
          /*  let getDatesLocal =
              JSON.parse(localStorage.getItem("selectedDates")) || [];
            //console.log("getDatesLocal", getDatesLocal);

            //**** getIte으로 가져온 값 input value로 넣기

            let dateClassSelect = getDatesLocal.map((date) => {
              //로컬에서 가져온 날짜를 배열로 저장
              let getDate = new Date(date); //로컬에서 가져온 문자형식을 날짜형태로 변환
              return getDate;
            });

            let start = dateClassSelect[0]; //날짜 형식의 0번째 인덱스 일자
            let end = dateClassSelect[1]; //날짜 형식의 1번째 인덱스 일자 -> 두 인덱스 사이의 날짜 전체 출력
            let currentDate = new Date(start);

            while (currentDate <= end) {
              let currnetDateNumber = currentDate.getDate(); //시작일의 날짜만 추출
              if (parseInt(dateEl.textContent) === currnetDateNumber) {
                //로컬에 저장된 날짜에 class 추가
                dateEl.classList.add("selected");
              }
              currentDate.setDate(currentDate.getDate() + 1);
            } 
          }
        });
      } else if (selectedDates.length === 2) {
        selectedDates = [];
        calDateElement.forEach((dateEl) => {
          dateEl.classList.remove("selected");
        });
      }
    });

    //오늘 날짜 구하기
    let today = new Date();
    if (month === today.getMonth() && year === today.getFullYear()) {
      for (let date of document.querySelectorAll(".thismonth")) {
        //console.log(typeof date.innerHTML); - string이라 숫자로 변경
        if (Number(date.innerHTML) === today.getDate()) {
          date.classList.add("today");
        }
      }
    }
  });
}; */


