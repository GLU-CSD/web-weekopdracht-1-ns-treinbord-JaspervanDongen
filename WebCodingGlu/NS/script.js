function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Calculate angles for the hands
  const hourDeg = (hours % 12) * 30 + (minutes / 60) * 30; // 360° / 12 hours
  const minuteDeg = (minutes / 60) * 360;                    // 360° / 60 minutes
  const secondDeg = (seconds / 60) * 360;                    // 360° / 60 seconds

  // Rotate the clock hands
  document.querySelector(".hour-hand").style.transform = `rotate(${hourDeg}deg)`;
  document.querySelector(".minute-hand").style.transform = `rotate(${minuteDeg}deg)`;
  document.querySelector(".second-hand").style.transform = `rotate(${secondDeg}deg)`;
}

// Update the clock every second
setInterval(updateClock, 1000);
updateClock();


// Your API key here
const API_KEY = "ffddedb47f8640c5a374ebf9228eab5d"; // Replace with your NS API key
const API_URL = "https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=UT";

// DOM Elements
const departureTimeElement = document.querySelector(".departure-time");
const destinationElement = document.querySelector(".destination");
const trainTypeElement = document.querySelector(".train-type");
const viaInfoElement = document.querySelector(".via-info");
const nextInfoElement = document.querySelector(".next-info");
const platformNumberElement = document.querySelector(".platform-number");
const platformTextElement = document.querySelector(".platform-text");

// Function to fetch train information
async function fetchTrainInfo() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        "Ocp-Apim-Subscription-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    updateInfoBoard(data.payload.departures);
  } catch (error) {
    console.error("Error fetching train info:", error);
  }
}

// Function to update the information board
function updateInfoBoard(departures) {
  if (departures.length > 0) {
    // Update the board with the first departure
    const currentDeparture = departures[0];
    departureTimeElement.textContent = `${currentDeparture.plannedDateTime.substring(11, 16)}`;
    destinationElement.textContent = currentDeparture.direction;
    trainTypeElement.textContent = currentDeparture.trainCategory;
    viaInfoElement.textContent = currentDeparture.routeStations.map(station => station.mediumName).join(", ");
    platformNumberElement.textContent = currentDeparture.plannedTrack || "-";
    platformTextElement.textContent = ""; // Update with additional info if needed

    // Update the next info line
    if (departures.length > 1) {
      const nextDeparture = departures[1];
      nextInfoElement.textContent = `Hierna/next: ${nextDeparture.plannedDateTime.substring(11, 16)} ${nextDeparture.trainCategory} ${nextDeparture.direction}`;
    } else {
      nextInfoElement.textContent = "Geen volgende trein"; // No next train
    }
  } else {
    console.warn("No departures found");
    departureTimeElement.textContent = "Geen informatie";
    destinationElement.textContent = "N/A";
    trainTypeElement.textContent = "";
    viaInfoElement.textContent = "";
    platformNumberElement.textContent = "-";
    nextInfoElement.textContent = "Geen volgende trein";
  }
}

setInterval(fetchTrainInfo,3000)
fetchTrainInfo();
