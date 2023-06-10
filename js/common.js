//메뉴 클릭
const menuBtn = document.querySelectorAll(".header_inner > ul > li");
console.log('menuBtn',menuBtn);

menuBtn.forEach((el) => {
  el.addEventListener("click", function (e) {
    
    console.log("클릭");
    menuBtn.forEach((item) => {
      item.classList.remove("active");
    });
    el.classList.add("active");
    
  });
});