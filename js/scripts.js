function isMobile() {
  return window.matchMedia("(max-width: 767px)").matches;
}

// Function to set a cookie
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

// Function to get a cookie value by name
function getCookie(name) {
  var nameEQ = name + "=";
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    while (cookie.charAt(0) == " ") cookie = cookie.substring(1, cookie.length);
    if (cookie.indexOf(nameEQ) == 0)
      return cookie.substring(nameEQ.length, cookie.length);
  }
  return null;
}

// Function to delete a cookie by name
function deleteCookie(name) {
  setCookie(name, "", -1);
}

function switchTab(tabId, tabs, tabContents) {
  // Remove "active" class from all tabs
  tabs.forEach((tab) => {
    tab.classList.remove("active");
  });

  // Remove "active" class from all tab contents
  tabContents.forEach((content) => {
    content.classList.remove("active");
  });

  // Add "active" class to the selected tab
  const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
  selectedTab.classList.add("active");

  // Show the corresponding tab content
  const selectedContent = document.getElementById(tabId);
  selectedContent.classList.add("active");
}

function burgerNavInit() {
  const burger = document.querySelector(".header__burger");
  burger.addEventListener("click", function () {
    this.classList.toggle("active");
    const menu = document.querySelector(".header .container > div");
    menu.classList.toggle("mob-open");
    document.querySelector("body").classList.toggle("body-fixed");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const forms = document.querySelectorAll("form");
  if (forms) {
    forms.forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const form = this;

        fetch("mail.php", {
          method: "post",
          body: new FormData(form),
        })
          .then((res) => res.json())
          .then(function (data) {
            if (data?.code != 200) return;
            let title, container;
            if (form.getAttribute("name") == "inner") {
              container = form.closest(".form-wrapper");
              title = container.querySelector("h3");
            } else {
              container = form.closest(".modal__container");
              title = container.querySelector("h4").innerHTML = "СПАСИБО!";
            }
            title.innerHTML = "СПАСИБО!";
            container.classList.add("success");
            container.querySelector(".disclaimer").remove();
            form.innerHTML = "<p>Ваша заявка успешно отправлена</p>";
            form.style.marginTop = "14px";
          });
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  burgerNavInit();

  const anchorLinks = document.querySelectorAll(".anchor-link");
  if (anchorLinks) {
    anchorLinks.forEach((item) => {
      item.addEventListener("click", function (event) {
        event.preventDefault();
        const targetSection = document.querySelector(item.getAttribute("href"));
        targetSection.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  MicroModal.init();

  if (!isMobile()) {
    const permit = getCookie("permit");
    // deleteCookie("permit");

    if (!permit || permit === "no") {
      MicroModal.show("permit"); // [1]
    }
  }

  document.querySelectorAll(".btn-permit").forEach((item) => {
    item.addEventListener("click", function () {
      const val = this.dataset.value;
      console.log(val);
      setCookie("permit", val, 14);

      if (val === "yes") {
        MicroModal.close("permit");
        return;
      }

      const modal = document.querySelector(".permit");
      modal.querySelector(".permit-content").innerHTML =
        "<h4>Доступ закрыт</h4>";
      document.querySelector("body").classList.toggle("body-fixed");
    });
  });

  const tabs = Array.from(document.getElementsByClassName("tab"));
  const tabContents = Array.from(document.getElementsByClassName("catalog"));

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab");
      switchTab(tabId, tabs, tabContents);
    });
  });
  if (tabs.length !== 0) switchTab("tab0", tabs, tabContents);

  const selectTabs = document.querySelector('select[name="select-tabs"]');
  if (selectTabs) {
    selectTabs.addEventListener("change", () => {
      const tabId = selectTabs.value;
      switchTab(tabId, tabs, tabContents);
    });
  }

  const marquee = document.querySelector(".marquee");
  if (marquee) {
    const rows = document.querySelectorAll(".marquee > div > div");
    const firstEls = rows[0].querySelectorAll("span");
    const secondEls = rows[1].querySelectorAll("span");

    const totalSpans = firstEls.length;
    const spanWidth = firstEls[0].offsetWidth;
    const spansTotalWidth = totalSpans * spanWidth;

    for (let i = 0; i < totalSpans; i++) {
      rows[0].appendChild(firstEls[i].cloneNode(true));
      rows[1].appendChild(secondEls[i].cloneNode(true));
    }

    const scrollMultiplier = isMobile() ? 0.5 : 1; // Adjust the multipliers as needed

    rows[0].style.transform = `translateX(-${spansTotalWidth}px)`;

    window.addEventListener("scroll", function () {
      const scrollPosition = window.scrollY * scrollMultiplier;

      rows[0].style.transform = `translateX(calc(-${spansTotalWidth}px + ${scrollPosition}px))`;
      rows[1].style.transform = `translateX(-${scrollPosition}px)`;

      if (scrollPosition >= spansTotalWidth) {
        rows[0].style.transform = "translateX(0)";
        rows[1].style.transform = "translateX(0)";
      }
    });
  }

  const maskOptions = {
    mask: "+{7}(000)000-00-00",
  };
  const phoneInputs = document.querySelectorAll("#phone");
  if (phoneInputs) {
    phoneInputs.forEach((item) => {
      const mask = IMask(item, maskOptions);
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  let center = [55.780805, 37.667301];
  function init() {
    let map = new ymaps.Map("map", {
      center: center,
      zoom: 17,
    });
    let placemark = new ymaps.Placemark(
      center,
      {},
      {
        iconLayout: "default#image",
        iconImageHref: "/img/placemark-map.png",
        iconImageSize: [140, 140],
        iconImageOffset: [-70, -72],
      }
    );
    map.controls.remove("geolocationControl"); // удаляем геолокацию
    map.controls.remove("searchControl"); // удаляем поиск
    map.controls.remove("trafficControl"); // удаляем контроль трафика
    map.controls.remove("typeSelector"); // удаляем тип
    map.controls.remove("fullscreenControl"); // удаляем кнопку перехода в полноэкранный режим
    map.controls.remove("zoomControl"); // удаляем контрол зуммирования
    map.controls.remove("rulerControl"); // удаляем контрол правил
    map.geoObjects.add(placemark);
  }
  ymaps.ready(init);
});

$(document).ready(function () {
  if ($(".slider")) {
    $(".slider").slick({
      dots: false,
      arrows: false,
      slidesToShow: 4,
      variableWidth: true,
      autoplay: true,
      cssEase: "ease",
      autoplay: true,
      autoplaySpeed: 700,
      speed: 700,
    });
  }
});
