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
