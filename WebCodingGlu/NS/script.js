let counter = 0;
let showCountdown = true; // True toont aftelling, False toont digitale klok

function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Bereken hoeken voor de klokwijzers
  const hourDeg = (hours % 12) * 30 + (minutes / 60) * 30; // 360° / 12 uur
  const minuteDeg = (minutes / 60) * 360;                  // 360° / 60 minuten
  const secondDeg = (seconds / 60) * 360;                  // 360° / 60 seconden

  // Draai de klokwijzers
  document.querySelector(".hour-hand").style.transform = `rotate(${hourDeg}deg)`;
  document.querySelector(".minute-hand").style.transform = `rotate(${minuteDeg}deg)`;
  document.querySelector(".second-hand").style.transform = `rotate(${secondDeg}deg)`;

  // Digitale klok of aftelling weergeven
  const departureTimeElement = document.querySelector(".departure-time");

counter++;
if (counter === 5) {
  counter = 0;
  showCountdown = !showCountdown; // Toggle between digital clock and countdown
}

if (showCountdown) {
  // Show countdown
  const now = new Date();
  const departureTime = departureTimeElement; // Replace with the actual departure time

  const timeRemaining = Math.max(0, Math.floor((departureTime - now) / 1000));
  const minutesRemaining = Math.floor(timeRemaining / 60);

  if (minutesRemaining > 1) {
    departureTimeElement.textContent = `${minutesRemaining} minut${minutesRemaining > 1 ? 'en' : ''}`;
  } else if (minutesRemaining === 1) {
    departureTimeElement.textContent = `${minutesRemaining} minuut`;
  } else {
    departureTimeElement.textContent = `<1 minuut`;
  }
} else {
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  departureTimeElement.textContent = formattedTime;
}
}

// Update de klok elke seconde
setInterval(updateClock, 1000);
updateClock();


const API_KEY = "ffddedb47f8640c5a374ebf9228eab5d"; // Replace with your NS API key
// DOM Elements
const departureTimeElement = document.querySelector(".departure-time");
const destinationElement = document.querySelector(".destination");
const trainTypeElement = document.querySelector(".train-type");
const viaInfoElement = document.querySelector(".via-info");
const nextInfoElement = document.querySelector(".next-info");
const platformNumberElement = document.querySelector(".platform-number");
const platformTextElement = document.querySelector(".platform-text");
const stationInputElement = document.querySelector("#stationName");
const fetchButton = document.querySelector("#fetchButton");

// Function to fetch train information based on station name
async function fetchTrainInfo(station) {
  const API_URL = `https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures?station=${station}`;

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
    alert("Could not fetch train information. Please try again.");
  }
}

// Function to update the information board
function updateInfoBoard(departures) {
  if (departures.length > 0) {
    // Update the board with the first departure
    const currentDeparture = departures[0];
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
    destinationElement.textContent = "N/A";
    trainTypeElement.textContent = "";
    viaInfoElement.textContent = "Geen tussenstops";
    platformNumberElement.textContent = "-";
    nextInfoElement.textContent = "Geen volgende trein";
  }
}

// Event listener for the Search button
fetchButton.addEventListener("click", () => {
  const station = stationInputElement.value.trim().toUpperCase(); // Get and normalize the station input
  if (station) {
    fetchTrainInfo(station);
  } else {
    alert("Please enter a station name.");
  }
});

// Optionally, you can add a listener to the input field to trigger fetching when pressing Enter
stationInputElement.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const station = stationInputElement.value.trim().toUpperCase();
    if (station) {
      fetchTrainInfo(station);
    } else {
      alert("Please enter a station name.");
    }
  }
});

