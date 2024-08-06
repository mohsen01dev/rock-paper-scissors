// ----- Define necessary DOM elements -----
// Using const variables for DOM elements
const playerChoiceImage = document.querySelector(".player-choice img");
const cpuChoiceImage = document.querySelector(".cpu-choice img");
const result = document.querySelector(".result h2");
const options = document.querySelectorAll(".option");
const resetButton = document.querySelector(".reset-btn");
const historyText = document.getElementById("history-text");
const container1 = document.querySelector(".container-1");
const infoAlert = document.querySelector(".info-alert");
const lightIcon = document.getElementById("light-icon");
const darkIcon = document.getElementById("dark-icon");

// Variable for binding keyboards for playing the game
const keyMapping = {
  r: "rock",
  R: "rock",
  p: "paper",
  P: "paper",
  s: "scissors",
  S: "scissors",
};

// Variables to get and store data from local storage
const savedTheme = localStorage.getItem("theme");
const storedHistory = localStorage.getItem("history-en");

// Using let variables for DOM elements
let waitingMessage;
let playerChoice;
let cpuChoice;
let timer;
let playerScore = 0;
let cpuScore = 0;
let gameIsRunning = false;
let blinking;
let blinkingIsRunning = false;

// ----- Define necessary functions -----
// Apply dark mode styles
function applyDarkTheme() {
  // Hide light mode icon and display dark mode icon
  darkIcon.className = "fa fa-moon-o fa-2x deactive";
  lightIcon.className = "fa fa-sun-o fa-2x";

  // Assign dark mode colors to variables
  document.documentElement.style.setProperty("--body-bg", "#222");
  document.documentElement.style.setProperty("--container-bg", "#151515");
  document.documentElement.style.setProperty("--element-bg", "#333");
  document.documentElement.style.setProperty("--active-bg", "#444");
  document.documentElement.style.setProperty("--text-border-color", "#eee");
  document.documentElement.style.setProperty("--alert-text", "#ffff00");
}

// Apply light mode styles
function applyLightTheme() {
  // Hide dark mode icon and display light mode icon
  lightIcon.className = "fa fa-sun-o fa-2x deactive";
  darkIcon.className = "fa fa-moon-o fa-2x";

  /// Assign light mode colors to variables
  document.documentElement.style.setProperty("--body-bg", "#f5f5f5");
  document.documentElement.style.setProperty("--container-bg", "#fff");
  document.documentElement.style.setProperty("--element-bg", "#eee");
  document.documentElement.style.setProperty("--active-bg", "#ddd");
  document.documentElement.style.setProperty("--text-border-color", "#151515");
  document.documentElement.style.setProperty("--alert-text", "#df0000");
}

// Check and apply the saved theme
function applyStoredTheme() {
  if (savedTheme === "dark") {
    applyDarkTheme();
  } else {
    applyLightTheme();
  }
}

// Switch between light and dark themes
function themeSwitcher() {
  // Switch to dark mode and save preference in local storage
  lightIcon.addEventListener("click", () => {
    applyLightTheme();
    localStorage.setItem("theme", "light");
  });

  // Switch to light mode and save preference in local storage
  darkIcon.addEventListener("click", () => {
    applyDarkTheme();
    localStorage.setItem("theme", "dark");
  });
}

// Get and display history from local storage
function historyUpdate() {
  if (storedHistory) {
    historyText.textContent = storedHistory;
    const previousScores = storedHistory.match(/\d+/g);

    // Update both player and CPU scores if history exists in local storage
    if (previousScores) {
      playerScore = parseInt(previousScores[0]);
      cpuScore = parseInt(previousScores[1]);
    }
  }
}

// Get CPU choice
function getCpuChoice() {
  const choices = ["rock", "paper", "scissors"];
  const randomIndex = Math.floor(Math.random() * 3);
  return choices[randomIndex];
}

// Update CPU choice image based on CPU choice
function cpuChoiceImageUpdate(cpuChoice) {
  if (cpuChoice === "rock") cpuChoiceImage.src = "./images/rock.svg";
  else if (cpuChoice === "paper") cpuChoiceImage.src = "./images/paper.svg";
  else cpuChoiceImage.src = "./images/scissors.svg";
}

// Check the winner and update the result text
function checkWinner(playerChoice, cpuChoice) {
  switch (playerChoice) {
    case "rock":
      switch (cpuChoice) {
        case "rock":
          return "It's a tie 🧐";
        case "paper":
          return "You lost, aww 😞";
        case "scissors":
          return "You won, hooray! 🎉";
      }
      break;

    case "paper":
      switch (cpuChoice) {
        case "rock":
          return "You won, hooray! 🎉";
        case "paper":
          return "It's a tie 🧐";
        case "scissors":
          return "You lost, aww 😞";
      }
      break;

    case "scissors":
      switch (cpuChoice) {
        case "rock":
          return "You lost, aww 😞";
        case "paper":
          return "You won, hooray! 🎉";
        case "scissors":
          return "It's a tie 🧐";
      }
      break;
  }
}

// Start the game
function startTheGame(e) {
  gameIsRunning = true;

  // Remove "active" class from all options and add it to the chosen option
  options.forEach((opt) => opt.classList.remove("active"));
  e.currentTarget.classList.add("active");

  // Update player choice image to the selected option
  playerChoice = e.currentTarget.querySelector("img").alt;
  const playerChoiceImageUpdate = e.currentTarget.querySelector("img").src;

  // Call the function to determine CPU choice
  cpuChoice = getCpuChoice();

  // Set selected options as default and start the animation
  playerChoiceImage.src = cpuChoiceImage.src = "./images/rock.svg";
  result.textContent = "Who’s winning? 🤔";
  container1.classList.add("animation");

  // Set a timeout to delay calculating the result
  timer = setTimeout(() => {
    // Stop the animation and update both player and CPU choices
    container1.classList.remove("animation");
    playerChoiceImage.src = playerChoiceImageUpdate;
    cpuChoiceImageUpdate(cpuChoice);

    // Check the winner and update the result text
    checkWinner(playerChoice, cpuChoice);
    result.textContent = checkWinner(playerChoice, cpuChoice);
    if (result.textContent === "You won, hooray! 🎉") playerScore++;
    else if (result.textContent === "You lost, aww 😞") cpuScore++;

    // Update the history and save it in local storage
    historyText.textContent = `You: ${playerScore} - ${cpuScore} :CPU`;
    localStorage.setItem("history-en", historyText.textContent);

    // Stop the game and remove any waiting message
    gameIsRunning = false;
    if (waitingMessage) waitingMessage.remove();
  }, 3000);
}

// Run the startGame function when the player clicks their mouse, if it meets the criteria
function mouseClickStart() {
  options.forEach((option) => {
    option.addEventListener("click", (e) => {
      // Start the game if it's not running
      if (!gameIsRunning) startTheGame(e);
      else {
        // If the game is not running, check if the waiting message exists; if not, add it
        if (!document.getElementById("waiting-message")) {
          waitingMessage = document.createElement("p");
          waitingMessage.id = "waiting-message";
          container1.insertBefore(waitingMessage, container1.firstChild);
          waitingMessage.textContent =
            "The game is in progress, please wait ...";
        }
      }
    });
  });
}

// Run the startGame function when the player press a valid key on their keyboard, if it meets the criteria
function keyPress(e) {
  // Check if the pressed key is valid and the game is not running
  if (e.key.toLowerCase() in keyMapping && !gameIsRunning) {
    const choice = keyMapping[e.key.toLowerCase()];
    const option = Array.from(options).find(
      (opt) => opt.querySelector("img").alt === choice
    );
    if (option) startTheGame({ currentTarget: option });

    // If the pressed key is valid and the game is running, show the waiting message if it doesn't already exist
  } else if (e.key.toLowerCase() in keyMapping && gameIsRunning) {
    if (!document.getElementById("waiting-message")) {
      waitingMessage = document.createElement("p");
      waitingMessage.id = "waiting-message";
      container1.insertBefore(waitingMessage, container1.firstChild);

      waitingMessage.textContent = "The game is in progress, please wait ...";
    }

    // Blink the alarm 3 times if the pressed key is not valid
  } else if (!(e.key.toLowerCase() in keyMapping)) {
    if (!blinkingIsRunning) {
      blinkingIsRunning = true;
      let blinkCount = 0;

      blinking = setInterval(() => {
        infoAlert.classList.toggle("blink");
        blinkCount++;

        if (blinkCount >= 6) {
          clearInterval(blinking);
          blinkingIsRunning = false;
        }
      }, 500);
    }
  }
}

// Run the keyDownStart function when a key is pressed
function keyDownStart() {
  document.addEventListener("keydown", keyPress);
}

// Reset everything when the player clicks the reset button
function reset() {
  resetButton.addEventListener("click", () => {
    container1.classList.remove("animation");

    clearTimeout(timer);

    playerChoiceImage.src = cpuChoiceImage.src = "./images/rock.svg";
    playerChoice = "";
    cpuChoice = "";

    result.textContent = "Ready? 😎";

    options.forEach((option) => {
      option.classList.remove("active");
    });

    localStorage.removeItem("history-en");
    historyText.textContent = "You: 0 - 0 :CPU";
    playerScore = 0;
    cpuScore = 0;

    gameIsRunning = false;

    clearInterval(blinking);
    infoAlert.classList.remove("blink");
    blinkingIsRunning = false;

    if (waitingMessage) waitingMessage.remove();
  });
}

// Run essential functions
applyStoredTheme();
historyUpdate();
mouseClickStart();
keyDownStart();
themeSwitcher();
reset();
