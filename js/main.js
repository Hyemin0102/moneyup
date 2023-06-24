//메뉴 클릭
const menuBtn = document.querySelectorAll(".header_inner > ul > li");
//console.log("menuBtn", menuBtn);

menuBtn.forEach((el) => {
  el.addEventListener("click", function (e) {
    menuBtn.forEach((item) => {
      item.classList.remove("active");
    });
    el.classList.add("active");
  });
});

let startDate;
let endDate;
let startDateString;
let endDateString;

$("#datepicker_start").datepicker({
  minDate: null,
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
const dateCloseBtn = document.querySelector(".date_close");

plusBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    challengeDate.classList.add("calendar_on");
  });
});
dateCloseBtn.addEventListener("click", () => {
  challengeDate.classList.remove("calendar_on");
  document.querySelector("#datepicker_start").value = "";
  document.querySelector("#datepicker_end").value = "";
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
const amountCloseBtn = document.querySelector(".amount_close");

const selectAmount = document.getElementById("selectAmount");
const spendAmount = document.getElementById("spendAmount");

const mainChallenge = document.querySelector(".main_challenge");
const mainBox = document.querySelector(".main_box");

amountCloseBtn.addEventListener("click", () => {
  challengeAmount.classList.remove("amount_on");
  selectAmount.value = ""; //input value 초기화
});

//챌린지 금액 입력, 3자리 수 콤마
const addComma = (e) => {
  let inputEl = e.target;
  let value = inputEl.value;
  value = value.replace(/[^0-9]/g, ""); //숫자만 입력 제한
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ","); //3자리 수 콤마

  const maxLength = 11; //억자리까지 입력
  if (value.length > maxLength) {
    alert("10자리 미만으로만 입력 가능합니다.");
    inputEl.value = inputEl.value.slice(0, maxLength);
  } else {
    inputEl.value = value;
  }
};
selectAmount.addEventListener("input", addComma);
spendAmount.addEventListener("input", addComma);

let challengeArray = JSON.parse(localStorage.getItem("challengeData")) || [];

const save = () => {
  localStorage.setItem("challengeData", JSON.stringify(challengeArray));
};

//datepicker 날짜 로컬스토리지 저장
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
//console.log("spendBtn", spendBtn);

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


//페이지 새로 고침 시
window.addEventListener("load", () => {
  if (challengeArray.length > 0) {
    mainChallenge.style.display = "block";
    mainBox.style.display = "none";
    createChallenge(); //함수생성
    localSave(); //seq 숫자 연결되어 1씩 증가하도록
    barOffset(10); //bar style 유지
  } else {
    mainChallenge.style.display = "none";
    mainBox.style.display = "flex";
  }
});

swiper.on("slideChange", function () {
  currentPercentage  = 0;
  barOffset(10);
});

//헤더 li 탭 클릭 시 화면
const challengeDetailBox = document.querySelector(".main_challenge_detail"); //챌린지 상세 내역

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
  challengeDetailBox.style.left = "100%";
});

/* 챌린지 관리 탭 클릭 시 */
headerList.addEventListener("click", function () {
  challengeMain.style.display = "none";
  challengeList.style.display = "block";
  challengeCal.style.display = "none";
  challengeSet.style.display = "none";
  if (localStorage.getItem("challengeData")) {
    createChllengeList(); //관리 - 목록 생성
    challengeListLi.forEach((list) => {
      //생성된 li들 반복문 돌려야함
      list.addEventListener("click", () => {
        //해당 li 클릭하면 로컬배열 중에서 seq같은거 찾아냄
        const detailInner = document.querySelector(".detail_inner");
        detailInner.innerHTML = "";

        challengeArray.forEach((el) => {
          if (el.seq == list.dataset.seq) {
            if (!el.userSpendList || el.userSpendList.length === 0) {
              alert("사용내역이 없습니다.");
            } else {
              console.log('el.remainingAmount',el.remainingAmount)
              let spendAmountList = []; //사용한 금액 목록
              let spendDateList = []; //사용한 날짜 목록
              let spendItemList = []; //사용한 내역 목록

              el.userSpendList.forEach((item) => {
                //클릭한 li의 사용금액, 날짜, 내역 따로 배열에 추가
                spendAmountList.push(item.spendAmount);
                spendDateList.push(item.spendDate);
                spendItemList.push(item.spendItem);
              });
              let formatSpendAmountList = spendAmountList.map((item) =>
                Number(item).toLocaleString()
              );
              let formatspendDateList = spendDateList.map(
                (item) => new Date(item).toISOString().split("T")[0]
              );

              for (let i = 0; i < spendAmountList.length; i++) {
                let createDiv = document.createElement("div");
                createDiv.classList.add("detail_box");
                createDiv.innerHTML = `
                  <p>${formatspendDateList[i]}</p>
                  <div class="detail_cont">
                    <p>${spendItemList[i]}</p>
                    <p>${formatSpendAmountList[i]}원</p>
                  </div>
                `;
                detailInner.append(createDiv);
              }

              challengeDetailBox.style.left = "0%";
              const DetailBoxClose =
                document.querySelector(".detail_close_btn");
              DetailBoxClose.addEventListener("click", () => {
                challengeDetailBox.style.left = "100%";
              });
            }
          }
        });
      });
    });
    document.querySelector(".main_challenge_empty").style.display = "none";
  }
});

let challengeListLi;

headerCal.addEventListener("click", function () {
  challengeMain.style.display = "none";
  challengeList.style.display = "none";
  challengeCal.style.display = "block";
  challengeSet.style.display = "none";
  challengeDetailBox.style.left = "100%";
});

headerSet.addEventListener("click", function () {
  challengeMain.style.display = "none";
  challengeList.style.display = "none";
  challengeCal.style.display = "none";
  challengeSet.style.display = "block";
  challengeDetailBox.style.left = "100%";
});

//챌린지 관리 탭 - 로컬값으로 생성
const challengeListUl = document.querySelector(
  ".main_challenge_list .challenge_inner"
);

let listNum = 0;
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
    createLi.setAttribute("data-seq", ++listNum);
    createLi.innerHTML = `
                    <p class="info_date">${el.startDate}~${el.endDate}</p>
                    <p class="info_dday">
                    챌린지 종료까지<span class="calc_dday">${
                      ddayArrayItem[index]
                    }</span>남았어요
                    </p>
                    <div class="list_amout">
                      <span class="list_amount_text">잔여 금액</span>
                      <span class="list_amount_Num">${el.remainingAmount.toLocaleString()}원</span>
                    </div>
                    <div class="list_prev_amount">${el.amount}원</div>
      `;
    challengeListUl.prepend(createLi);
    challengeListLi = document.querySelectorAll(
      ".challenge_list .challenge_info"
    );
  });
  listNum = 0;
};
