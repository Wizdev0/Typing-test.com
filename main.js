// --- DOM ELEMENT SELECTIONS ---
const startBtn = document.getElementById("startBtn");
const overLay = document.getElementById("overLay");
const textpasssage = document.getElementById("text");
const timer = document.getElementById("sec");
const hiddenInput = document.getElementById("hiddenInput");
const restartBtn = document.getElementById("restartBtn");

// Difficulty & Mode Buttons
const easyBtn = document.getElementById("easy_btn");
const mediumBtn = document.getElementById("medium_btn");
const hardBtn = document.getElementById("hard_btn");
const modeBtns = document.querySelector(".mode-btns");
const secInt = document.querySelector(".sec-int");
const timedSec = document.getElementById("timed");

// Timer Trigger Targets
const firstSec = document.getElementById("oneSecMk");
const secondSec = document.getElementById("twoSecMk");
const threeSec = document.getElementById("threeSecMk");

// Mobile Dropdown Selectors
const dropdown = document.querySelector(".dropdown_diffi_menu");
const btn = document.querySelector(".dropdown_diffi_btn");
const options = document.querySelectorAll(".option input");
const dropdownMode = document.querySelector(".dropdown_mode_menu");
const btnMode = document.querySelector(".dropdown_mode_btn");
const optionsMode = document.querySelectorAll(".option_mod input");

// Screen Layout Wrapper Sections
const firstPage = document.querySelector(".typing_section");
const firstResSec = document.querySelector(".first_result_section");
const normResSec = document.querySelector(".result_section");
const personalBstSec = document.querySelector(".personal_best_section");

// Restart Triggers on Result Pages
const firstResBtn = document.getElementById("firstResRestartBtn");
const normResBtn = document.getElementById("ResRestartBtn");
const personalBstRestartBtn = document.getElementById("personalBestRestartBtn");

// Metric Displays Across All Pages
const wpmElements = [document.getElementById("wpmFig"), document.getElementById("FstResWpm"), document.getElementById("normResWpm"), document.getElementById("perBstWpm")];
const accuElements = [document.getElementById("accuFig"), document.getElementById("FirstResAccu"), document.getElementById("normResAccu"), document.getElementById("perBstAccu")];
const charContainers = [document.getElementById("charCount"), document.getElementById("charCount2"), document.getElementById("charCount3")];
const highScoreElements = [document.getElementById("bestNumb"), document.getElementById("bestNumb2"), document.getElementById("bestNumb3"), document.getElementById("bestNumb4")];

// --- APP STATE VARIABLES ---
let index = 0;
let time = 60;
let originalTime = 60;
let started = false;
let interval = null;
let difficultyChosen = false;
let timeChosen = false;  

// --- INITIALIZE HIGH SCORES ---
const cachedHighScore = localStorage.getItem("highScore") || "0";
highScoreElements.forEach(el => { if(el) el.innerText = cachedHighScore; });

// --- CONSOLIDATED TEXT RENDERING ENGINE ---
function renderText(text) {
  textpasssage.innerHTML = "";
  text.split("").forEach((letter, i) => {
    const span = document.createElement("span");
    span.textContent = letter;
    span.dataset.index = i;
    textpasssage.appendChild(span);
  });
  index = 0;
}

// Fetch Master Passage File
async function fetchPassage(level) {
  try {
    const res = await fetch("data.json");
    const data = await res.json();
    
    let list = [];
    if (level) {
      list = data[level];
    } else {
      // Fallback merge
      list = [...data.easy, ...data.medium, ...data.hard];
    }
    
    const random = list[Math.floor(Math.random() * list.length)];
    renderText(random.text);
  } catch (err) {
    console.error("Failed to load passages:", err);
  }
}

// Load default random asset array on mount
fetchPassage();

// --- STATS ENGINE (WPM, Accuracy, Metrics) ---
function calculateWPM() {
  const letters = textpasssage.querySelectorAll("span");
  let correct = 0;
  for (let i = 0; i < index; i++) {
    if (letters[i] && letters[i].style.color === "lightgreen") correct++;
  }
  const timePassed = (originalTime - time) / 60;
  if (timePassed <= 0) return 0;
  
  const wpm = Math.round((correct / 5) / timePassed);
  return isFinite(wpm) ? wpm : 0;
}

function calculateAccuracy() {
  if (index === 0) return 100;
  const letters = textpasssage.querySelectorAll("span");
  let correct = 0;
  for (let i = 0; i < index; i++) {
    if (letters[i] && letters[i].style.color === "lightgreen") correct++;
  }
  return Math.round((correct / index) * 100);
}

function updateStatsUI() {
  const wpm = calculateWPM();
  const accuracy = calculateAccuracy();

  // Update dynamic layouts
  wpmElements.forEach(el => { if(el) el.innerText = wpm; });
  accuElements.forEach(el => { if(el) el.innerText = accuracy + "%"; });

  // Compute character spread strings
  const letters = textpasssage.querySelectorAll("span");
  let correct = 0, wrong = 0;
  for (let i = 0; i < index; i++) {
    if (letters[i].style.color === "lightgreen") correct++;
    else if (letters[i].style.color === "red") wrong++;
  }

  charContainers.forEach(container => {
    if (container) {
      container.innerHTML = `
        <span class="correct-char">${correct}</span>
        <span class="slash">/</span>
        <span class="wrong-char">${wrong}</span>
      `;
    }
  });
}

// --- TIMER CONTROLS ---
function setTime(value) {
  clearInterval(interval);
  time = value;
  originalTime = value;
  started = false;
  timer.innerText = String(time).padStart(2, "0");
}

function startTimer() {
  started = true;
  time = originalTime;
  timer.innerText = String(time).padStart(2, "0");

  interval = setInterval(() => {
    time--;
    timer.innerText = String(time).padStart(2, "0");

    if (time <= 0) {
      clearInterval(interval);
      finishTest();
    }
  }, 1000);
}

function resetTest() {
  clearInterval(interval);
  started = false;
  index = 0;
  timer.innerText = String(originalTime).padStart(2, "0");
  updateStatsUI();
}

function checkSelections() {
  if (difficultyChosen && timeChosen) {
    hiddenInput.focus();
  }
}

// --- ROUTING / END STATE MANAGEMENT ---
function finishTest() {
  clearInterval(interval);
  started = false;

  const currentWPM = calculateWPM();
  const savedHighScore = Number(localStorage.getItem("highScore")) || 0;
  const hasVisited = localStorage.getItem("hasVisited");

  // Save new records if achieved
  if (currentWPM > savedHighScore) {
    localStorage.setItem("highScore", currentWPM);
    highScoreElements.forEach(el => { if(el) el.innerText = currentWPM; });
  }

  // Display handling wrapper routes
  firstPage.classList.add("active");
  document.body.classList.remove("no-scroll");

  if (hasVisited !== "true") {
    firstResSec.classList.add("active");
    normResSec.classList.remove("active");
    personalBstSec.classList.remove("active");
    localStorage.setItem("hasVisited", "true");
  } else if (currentWPM > savedHighScore) {
    personalBstSec.classList.add("active");
    firstResSec.classList.remove("active");
    normResSec.classList.remove("active");
  } else {
    normResSec.classList.add("active");
    firstResSec.classList.remove("active");
    personalBstSec.classList.remove("active");
  }
}

// --- CORE INTERACTION HANDLERS ---

// Global keyboard input intercept logic
document.addEventListener("keydown", (e) => {
  const key = e.key;

  // Structural escapes
  if (time === 0 && started) return;
  if (key.length > 1 && key !== "Backspace") return;
  
  // Intercept standard input typing actions if testing area active
  if (overLay.classList.contains("active") && !firstPage.classList.contains("active")) {
    e.preventDefault();
    handleTyping(key);
  }
});

// Mobile Input Field Mirror Logic
hiddenInput.addEventListener("input", (e) => {
  const value = e.target.value;
  if (!value) return;
  
  const key = value.slice(-1);
  handleTyping(key);
  // Keep field clean to continuously catch character inputs
  e.target.value = " "; 
});

function handleTyping(key) {
  const letters = textpasssage.querySelectorAll("span");
  if (!letters.length || index >= letters.length) return;

  if (!started) {
    startTimer();
  }

  if (key === "Backspace") {
    if (index > 0) {
      index--;
      letters[index].style.color = "";
      letters[index].style.textDecoration = "none";
    }
    updateStatsUI();
    return;
  }

  // Set correctness markup highlights
  if (key === letters[index].innerText) {
    letters[index].style.color = "lightgreen";
  } else {
    letters[index].style.color = "red";
    letters[index].style.textDecoration = "underline";
  }

  index++;
  updateStatsUI();

  if (index === letters.length) {
    finishTest();
  }
}

// --- DESKTOP INTERFACES CONTROL ---
startBtn.onclick = () => {
  overLay.classList.add("active");
  document.body.classList.remove("no-scroll");
  hiddenInput.focus();
};

easyBtn.addEventListener("click", () => { fetchPassage("easy"); resetTest(); difficultyChosen = true; checkSelections(); });
mediumBtn.addEventListener("click", () => { fetchPassage("medium"); resetTest(); difficultyChosen = true; checkSelections(); });
hardBtn.addEventListener("click", () => { fetchPassage("hard"); resetTest(); difficultyChosen = true; checkSelections(); });

timedSec.addEventListener("click", () => {
  secInt.classList.toggle("active");
  modeBtns.classList.toggle("active", secInt.classList.contains("active"));
});

firstSec.addEventListener("click", () => { setTime(60); timeChosen = true; closeTimeMenu(); checkSelections(); });
secondSec.addEventListener("click", () => { setTime(30); timeChosen = true; closeTimeMenu(); checkSelections(); });
threeSec.addEventListener("click", () => { setTime(15); timeChosen = true; closeTimeMenu(); checkSelections(); });

function closeTimeMenu() {
  secInt.classList.remove("active");
  modeBtns.classList.remove("active");
}

// --- MOBILE INTERFACES CONTROL ---
btn.addEventListener("click", () => dropdown.classList.toggle("active"));
btnMode.addEventListener("click", () => dropdownMode.classList.toggle("active"));

options.forEach(option => {
  option.addEventListener("change", () => {
    btn.firstChild.textContent = option.parentElement.textContent.trim();
    dropdown.classList.remove("active");
  });

  option.addEventListener("click", () => {
    const mode = option.dataset.mode;
    if (mode === "easyMob") fetchPassage("easy");
    else if (mode === "mediumMob") fetchPassage("medium");
    else if (mode === "hardMob") fetchPassage("hard");
    resetTest();
    difficultyChosen = true;
    checkSelections();
  });
});

optionsMode.forEach(option => {
  option.addEventListener("click", () => {
    const mode = option.dataset.mode;
    if (mode === "sixtySec") setTime(60);
    else if (mode === "thirtySec") setTime(30);
    else if (mode === "fifteenSec") setTime(15);
    timeChosen = true;
    dropdownMode.classList.remove("active");
    checkSelections();
  });
});

// --- GLOBAL RESTART TRIGGERS ---
const globalRestarts = [restartBtn, firstResBtn, normResBtn, personalBstRestartBtn];
globalRestarts.forEach(btn => {
  if (btn) {
    btn.addEventListener("click", () => {
      localStorage.setItem("hasVisited", "true");
      location.reload();
    });
  }
});