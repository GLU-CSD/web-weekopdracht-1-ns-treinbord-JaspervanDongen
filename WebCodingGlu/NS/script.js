// script.js
function updateClock() {
  const now = new Date();

  // Get the current time in the Netherlands (CET/CEST)
  const options = { timeZone: "Europe/Amsterdam" };
  const netherlandsTime = new Date(
    now.toLocaleString("en-US", options)
  );

  const hours = netherlandsTime.getHours();
  const minutes = netherlandsTime.getMinutes();
  const seconds = netherlandsTime.getSeconds();

  // Calculate angles for the hands
  const hourDeg = (hours % 12) * 30 + (minutes / 60) * 30; // 360° / 12 = 30° per hour
  const minuteDeg = minutes * 6 + (seconds / 60) * 6;      // 360° / 60 = 6° per minute
  const secondDeg = seconds * 6;                          // 360° / 60 = 6° per second

  // Rotate the clock hands
  document.querySelector(".hour-hand").style.transform = `rotate(${hourDeg}deg)`;
  document.querySelector(".minute-hand").style.transform = `rotate(${minuteDeg}deg)`;
  document.querySelector(".second-hand").style.transform = `rotate(${secondDeg}deg)`;
}

// Update the clock every second
setInterval(updateClock, 1000);
updateClock();
