let dTime;

const trainTypes = {
  SPR: 'Sprinter',
  IC: 'Intercity',
  ST: 'Stoptrein',
  ICE: 'InterCity Express',
  EST: 'Eurostar',
  ICD:'InterCityDirect'
};

const API_KEY = ""; // Replace with your NS API key

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
console.log('yay');
  if (departures.length > 0) {
    // Update the board with the first departure
    const currentDeparture = departures[0];
    dTime = `${currentDeparture.plannedDateTime.substring(11, 16)}`;
    destinationElement.textContent = currentDeparture.direction;
    Ttype = currentDeparture.trainCategory;
    viaInfoElement.textContent = currentDeparture.routeStations.map(station => station.mediumName).join(", ");
    platformNumberElement.textContent = currentDeparture.plannedTrack || "-";
    platformTextElement.textContent = ""; // Update with additional info if needed

   
  
  // Use the mapping object to set the text content
  trainTypeElement.textContent = trainTypes[Ttype] || 'Unknown';

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

let counter = 0;
let showDepartureTime = true; // True means show the departure time, false means hide it

// Function to toggle the clock and departure time visibility
function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  // Calculate angles for clock hands
  const hourDeg = (hours % 12) * 30 + (minutes / 60) * 30; // 360° / 12 hours
  const minuteDeg = (minutes / 60) * 360;                  // 360° / 60 minutes
  const secondDeg = (seconds / 60) * 360;                  // 360° / 60 seconds

  // Rotate clock hands
  document.querySelector(".hour-hand").style.transform = `rotate(${hourDeg}deg)`;
  document.querySelector(".minute-hand").style.transform = `rotate(${minuteDeg}deg)`;
  document.querySelector(".second-hand").style.transform = `rotate(${secondDeg}deg)`;

  // Update departure time visibility every 5 seconds
  counter++;
  if (counter === 5) {
    counter = 0;
    showDepartureTime = !showDepartureTime; // Toggle the visibility of departure time
  }

  // Calculate time difference between now and dTime
  const [dHours, dMinutes] = dTime.split(":").map(Number); // Extract hours and minutes from dTime
  const departureTime = new Date(now);
  departureTime.setHours(dHours, dMinutes, 0, 0); // Set departure time

  let diff = departureTime - now; // Calculate difference in milliseconds

  

  // Convert difference into hours, minutes, and seconds
  const diffHours = Math.floor(diff / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diff % (1000 * 60)) / 1000);


  // Show or hide the departure time based on the toggle state
  if (showDepartureTime) {
    departureTimeElement.textContent = dTime
    departureTimeElement.style.display = 'block'; // Make visible
  } else {
    const timeUntilDeparture = `${diffHours}h ${diffMinutes}m ${diffSeconds}s`;
    console.log(timeUntilDeparture);
    console.log(diffMinutes)
    
    if (diffMinutes > 1) {
      departureTimeElement.textContent = `${diffMinutes} minut${diffMinutes > 1 ? 'en' : ''}`;
    } else if (diffMinutes === 1) {
      departureTimeElement.textContent = `${diffMinutes} minuut`;
    } else {
      departureTimeElement.textContent = `<1 minuut`;

    departureTimeElement.style.display = 'block'; // Hide
  }
}
}


// Update the clock every second
setInterval(updateClock, 1000);
fetchTrainInfo(station);
updateClock();
