// Individual Project 1 JavaScript
// Uses jQuery and Day.js.

// ---------- Theme toggle: extra functionality ----------
function applySavedTheme() {
  const savedTheme = localStorage.getItem("siteTheme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const theme = document.body.classList.contains("dark-mode") ? "dark" : "light";
  localStorage.setItem("siteTheme", theme);
}

// ---------- JavaScript cookies ----------
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return "";
}

function updateVisitMessage() {
  const lastVisit = getCookie("lastVisit");
  const now = dayjs().format("MMMM D, YYYY h:mm:ss A");

  if (!lastVisit) {
    $("#visitMessage").text("Welcome to my homepage for the first time!");
  } else {
    $("#visitMessage").text(`Welcome back! Your last visit was ${lastVisit}`);
  }

  setCookie("lastVisit", now, 365);
}

// ---------- Digital clock ----------
function updateDigitalClock() {
  const currentTime = dayjs().format("dddd, MMMM D, YYYY h:mm:ss A");
  $("#digitalClock").text(currentTime);
}

// ---------- Analog clock ----------
function drawAnalogClock() {
  const canvas = document.getElementById("analogClock");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const radius = canvas.height / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(radius, radius);

  drawFace(ctx, radius * 0.9);
  drawNumbers(ctx, radius * 0.9);
  drawTime(ctx, radius * 0.9);

  ctx.restore();
}

function drawFace(ctx, radius) {
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  const gradient = ctx.createRadialGradient(0, 0, radius * 0.85, 0, 0, radius * 1.05);
  gradient.addColorStop(0, "#dbeafe");
  gradient.addColorStop(0.5, "#2563eb");
  gradient.addColorStop(1, "#0f172a");
  ctx.strokeStyle = gradient;
  ctx.lineWidth = radius * 0.08;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
  ctx.fillStyle = "#0f172a";
  ctx.fill();
}

function drawNumbers(ctx, radius) {
  ctx.font = `${radius * 0.16}px Arial`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = "#0f172a";

  for (let num = 1; num <= 12; num++) {
    const angle = num * Math.PI / 6;
    ctx.rotate(angle);
    ctx.translate(0, -radius * 0.78);
    ctx.rotate(-angle);
    ctx.fillText(num.toString(), 0, 0);
    ctx.rotate(angle);
    ctx.translate(0, radius * 0.78);
    ctx.rotate(-angle);
  }
}

function drawHand(ctx, position, length, width) {
  ctx.beginPath();
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.moveTo(0, 0);
  ctx.rotate(position);
  ctx.lineTo(0, -length);
  ctx.strokeStyle = "#0f172a";
  ctx.stroke();
  ctx.rotate(-position);
}

function drawTime(ctx, radius) {
  const now = new Date();

  let hour = now.getHours();
  let minute = now.getMinutes();
  let second = now.getSeconds();

  hour = hour % 12;
  hour = (hour * Math.PI / 6) +
         (minute * Math.PI / (6 * 60)) +
         (second * Math.PI / (360 * 60));
  drawHand(ctx, hour, radius * 0.5, radius * 0.07);

  minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
  drawHand(ctx, minute, radius * 0.72, radius * 0.05);

  second = second * Math.PI / 30;
  drawHand(ctx, second, radius * 0.78, radius * 0.02);
}

// ---------- Show / hide email ----------
function setupEmailToggle() {
  let emailVisible = false;

  $("#emailToggle").on("click", function () {
    if (emailVisible) {
      $("#emailArea").empty();
      $("#emailToggle").text("Show my email");
      emailVisible = false;
    } else {
      const emailLink = $("<a>")
        .attr("href", "mailto:tikhonam@mail.uc.edu")
        .text("tikhonam@mail.uc.edu");
      $("#emailArea").empty().append(emailLink);
      $("#emailToggle").text("Hide my email");
      emailVisible = true;
    }
  });
}

// ---------- JokeAPI ----------
function loadJoke() {
  const jokeUrl = "https://v2.jokeapi.dev/joke/Any?safe-mode&type=single";

  $.getJSON(jokeUrl)
    .done(function (data) {
      if (data && data.joke) {
        $("#jokeText").text(data.joke);
      } else {
        $("#jokeText").text("No joke was returned by the API.");
      }
    })
    .fail(function () {
      $("#jokeText").text("The JokeAPI request failed. Please try again later.");
    });
}

// ---------- Dog CEO API ----------
function loadDogImage() {
  const dogUrl = "https://dog.ceo/api/breeds/image/random";

  $.getJSON(dogUrl)
    .done(function (data) {
      if (data && data.message) {
        $("#dogImage")
          .attr("src", data.message)
          .attr("alt", "Random dog from Dog CEO API");
      }
    })
    .fail(function () {
      $("#dogImage")
        .attr("alt", "The Dog CEO API request failed. Please try again later.");
    });
}

// ---------- Initialize page ----------
$(document).ready(function () {
  applySavedTheme();

  $("#themeToggle").on("click", toggleTheme);

  $("#footerYear").text(dayjs().format("YYYY"));

  updateVisitMessage();

  updateDigitalClock();
  setInterval(updateDigitalClock, 1000);

  drawAnalogClock();
  setInterval(drawAnalogClock, 1000);

  setupEmailToggle();

  if ($("#jokeText").length) {
    loadJoke();
    setInterval(loadJoke, 60000);
    $("#newJokeButton").on("click", loadJoke);
  }

  if ($("#dogImage").length) {
    loadDogImage();
    $("#newDogButton").on("click", loadDogImage);
  }
});
