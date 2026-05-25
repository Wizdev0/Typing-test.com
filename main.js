const startBtn = document.getElementById("startBtn");
const overLay = document.getElementById("overLay");
const textpasssage = document.getElementById("text");
const timer = document.getElementById("sec");
const easyBtn = document.getElementById("easy_btn");
const mediumBtn = document.getElementById("medium_btn");
const hardBtn = document.getElementById("hard_btn");
const modeBtns = document.querySelector(".mode-btns");
const secInt = document.querySelector(".sec-int");
const timedSec = document.getElementById("timed");
const restartBtn = document.getElementById("restartBtn");

/* Start Button */
startBtn.onclick = () => {
  overLay.classList.add("active");
  document.body.classList.remove("no-scroll");
  
}

let difficultyChosen = false;
let timeChosen = false;  

/* Restart Button */
restartBtn.addEventListener("click", () => {
  location.reload();
});

/* reset test with mode Btns */
function resetTest () {
   clearInterval(interval);

  started = false;

  timer.innerText = "00";

  wpmEl.innerText = "00";

  accuEl.innerText = "0";
}


/* Loading of random Passages to start the programme */
async function loadTextStart(){
  const res = await fetch("data.json");
  const data = await res.json();

  // merge all levels
  const allTexts = [
    ...data.easy,
    ...data.medium,
    ...data.hard
  ];

  const random = allTexts[Math.floor(Math.random() * allTexts.length)];

  const text = random.text;

  textpasssage.innerHTML = "";

  text.split("").forEach((letter, i) => {
    const span = document.createElement("span");
    span.textContent = letter;
    span.dataset.index = i;
    textpasssage.appendChild(span);
    
  });

  
}

loadTextStart();


/* Fixing a bug on the difficulty mode */
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


/* Selection of passages by modes */

/* EASY MODE */

async function loadTextEasy(level = "easy") {
  const res = await fetch("data.json");
  const data = await res.json();

  const list = data[level]; 
  const random = list[Math.floor(Math.random() * list.length)];

  renderText(random.text);
}

easyBtn.addEventListener("click", () =>{
  
  loadTextEasy();
  resetTest();
  difficultyChosen = true;
  if(timeChosen) {
    hiddenInput.focus();
  }


});


/* MEDIUM MODE */

async function loadTextMedium(level = "medium") {
  const res = await fetch("data.json");
  const data = await res.json();

  const list = data[level]; 
  const random = list[Math.floor(Math.random() * list.length)];

    renderText(random.text);
}

mediumBtn.addEventListener("click", () => {
    
  resetTest();
  loadTextMedium();
  difficultyChosen = true;
  if(timeChosen) {
    hiddenInput.focus();
  }
});

/* HARD MODE */

async function loadTextHard(level = "hard") {
  const res = await fetch("data.json");
  const data = await res.json();

  const list = data[level]; 
  const random = list[Math.floor(Math.random() * list.length)];

    renderText(random.text);
}

hardBtn.addEventListener("click", () => {
    
  resetTest();
  loadTextHard();
  difficultyChosen = true;
  if(timeChosen) {
    hiddenInput.focus();
  }
});


/* Timer */
/* let time = 60;


let interval = setInterval(() => {
    time--;
    timer.innerText = String(time).padStart(2, "0");    
    
    if (time === 0) {
        clearInterval(interval);
    }
}, 1000) */

/* Choosing the timer */
timedSec.addEventListener("click", () => {
  secInt.classList.toggle("active");

  if (secInt.classList.contains("active")){
    modeBtns.classList.add("active");
  } else {
    modeBtns.classList.remove("active");
  }
  
});

/* Initiation of the timer */
const firstSec = document.getElementById("oneSecMk");
const secondSec = document.getElementById("twoSecMk");
const threeSec = document.getElementById("threeSecMk");

let time = 60;
let started = false;
let interval;
let originalTime = 60;

firstSec.addEventListener("click", () => {
  setTime(60);
  secInt.classList.remove("active");
  modeBtns.classList.remove("active");
  

});


secondSec.addEventListener("click", () => {
  setTime(30);
  secInt.classList.remove("active");
  modeBtns.classList.remove("active");
  

});



threeSec.addEventListener("click", () => {
  setTime(15);
  secInt.classList.remove("active");
  modeBtns.classList.remove("active");
  

  
});

function setTime(value) {
  clearInterval(interval);
  time = value;
  originalTime = value;
  started = false;
  timer.innerText = String(time).padStart(2, "0");
}



/* Function for calculating wpm */

const wpmEl = document.getElementById("wpmFig");

function calculateWPM() {
  const letters = document.querySelectorAll("#text span");

  let correct = 0;

  for (let i = 0; i < index; i++) {
    if (letters[i].style.color === "lightgreen") {
      correct++;
    }
  }

  const timePassed = (originalTime - time) / 60;

  if (timePassed <= 0) return 0;

  const wpm = Math.round((correct / 5) / timePassed);

  return isFinite(wpm) ? wpm : 0;
}

/* Function for calculating Accuracy */
const accuEl = document.getElementById("accuFig");

function calculateAccuracy() {
  const letters = document.querySelectorAll("#text span");

  let correct = 0;

  for (let i = 0; i < index; i++) {
    if (letters[i].style.color === "lightgreen") {
      correct++;
    }
  }

  if(index === 0 ) return 100;

  return Math.round((correct / index) * 100);

 /* return accuracy; */
}

/* Knowing the new or personal best */
const highScoreEl = document.getElementById("bestNumb");

/* Show saved high score when page loads */
highScoreEl.innerText =
  localStorage.getItem("highScore") || 0;

/* Save new personal best */
function saveHighScore() {

  const currentWPM = calculateWPM();

  const savedHighScore =
    Number(localStorage.getItem("highScore")) || 0;

  if (currentWPM > savedHighScore) {

    localStorage.setItem("highScore", currentWPM);

    highScoreEl.innerText = currentWPM;

  }

}

/* RESULT FOR THE FIRST RESULT PAGE */

/* Knowing the new or personal best */
const highScoreEl2 = document.getElementById("bestNumb2");

/* Show saved high score when page loads */
highScoreEl2.innerText =
  localStorage.getItem("highScore") || 0;

/* Save new personal best */
function saveHighScore2() {

  const currentWPM = calculateWPM();

  const savedHighScore2 =
    Number(localStorage.getItem("highScore")) || 0;

  if (currentWPM > savedHighScore2) {

  
    localStorage.setItem("highScore", currentWPM);

    highScoreEl2.innerText = currentWPM;

  }

}


/* Calculating the characters */
const countChar = document.getElementById("charCount");

function calculateCharacters() {

  const letters = document.querySelectorAll("#text span");

  let correct = 0;
  let wrong = 0;

  for(let i = 0; i < index; i++) {

    if(letters[i].style.color === "lightgreen") {

      correct++;
    } else if (letters[i].style.color === "red") {

      wrong++;

    }

  } 

  countChar.innerHTML = `
  <span class="correct-char">${correct}</span>
  <span class="slash">/</span>
  <span class="wrong-char">${wrong}</span>
  `;

  
}

/* Switch In pages */
const firstPage = document.querySelector(".typing_section");
const firstResSec = document.querySelector(".first_result_section");
const firstResBtn = document.getElementById("firstResRestartBtn");


function showFirstResultPage() {

  firstPage.classList.add("active");
  firstResSec.classList.add("active");
  normResSec.classList.remove("active");
  personalBstSec.classList.remove("active");
  document.body.classList.remove("no-scroll");
}

/* RESTART BUTTON */
firstResBtn.addEventListener("click", () => {
  localStorage.setItem("hasVisited", "true");

  firstPage.classList.remove("active");
  firstResSec.classList.remove("active");

  location.reload();

  
});


/* NORMAL RESULT PAGE */
const highScoreEl3 = document.getElementById("bestNumb3");

/* Show saved highscore when page loads */
highScoreEl3.innerText = localStorage.getItem("highScore") || 0;

function saveHighScore3() {

  const currentWPM = calculateWPM();

  const savedHighScore3 =
    Number(localStorage.getItem("highScore")) || 0;

  if (currentWPM > savedHighScore3) {

  
    localStorage.setItem("highScore", currentWPM);

    highScoreEl3.innerText = currentWPM;

  }

}

/* Counting characters */
const countChar2 = document.getElementById("charCount2");

function calculateCharacters2() {

  const letters = document.querySelectorAll("#text span");

  let correct = 0;
  let wrong = 0;

  for(let i = 0; i < index; i++) {

    if(letters[i].style.color === "lightgreen") {

      correct++;
    } else if (letters[i].style.color === "red") {

      wrong++;

    }

  } 

  countChar2.innerHTML = `
  <span class="correct-char">${correct}</span>
  <span class="slash">/</span>
  <span class="wrong-char">${wrong}</span>
  `;

  
}

/* Switch in pages for normal results */
const normResSec = document.querySelector(".result_section");
const normResBtn = document.getElementById("ResRestartBtn");

function showNormalResult() {

  normResSec.classList.add("active");
  firstPage.classList.add("active");
  firstResSec.classList.remove("active");
  personalBstSec.classList.remove("active");
}

/* NORMAL RESULT BUTTON */
normResBtn.addEventListener("click", () => {
  localStorage.setItem("hasVisited", "true");

  firstPage.classList.remove("active");
  firstResSec.classList.remove("active");
  normResSec.classList.remove("active");

  location.reload();

  
});


/* PERSONAL BEST / HIGHSCORE PAGE */
const highScoreEl4 = document.getElementById("bestNumb4");

/* Show saved highscore when page loads */
highScoreEl4.innerText = localStorage.getItem("highScore") || 0;

function saveHighScore4() {

  const currentWPM = calculateWPM();

  const savedHighScore4 =
    Number(localStorage.getItem("highScore")) || 0;

  if (currentWPM > savedHighScore4) {

  
    localStorage.setItem("highScore", currentWPM);

    highScoreEl4.innerText = currentWPM;

  }

}

/* Counting characters */
const countChar3 = document.getElementById("charCount3");

function calculateCharacters3() {

  const letters = document.querySelectorAll("#text span");

  let correct = 0;
  let wrong = 0;

  for(let i = 0; i < index; i++) {

    if(letters[i].style.color === "lightgreen") {

      correct++;
    } else if (letters[i].style.color === "red") {

      wrong++;

    }

  } 

  countChar3.innerHTML = `
  <span class="correct-char">${correct}</span>
  <span class="slash">/</span>
  <span class="wrong-char">${wrong}</span>
  `;

  
}

/* Switch in pages for personal best page */
const personalBstSec = document.querySelector(".personal_best_section");
const personalBstRestartBtn = document.getElementById("personalBestRestartBtn");

function showPersonalBestPage() {

  normResSec.classList.remove("active");
  firstPage.classList.add("active");
  firstResSec.classList.remove("active");
  personalBstSec.classList.add("active");
}

/* NORMAL RESULT BUTTON */
personalBstRestartBtn.addEventListener("click", () => {
  localStorage.setItem("hasVisited", "true");

  firstPage.classList.remove("active");
  firstResSec.classList.remove("active");
  normResSec.classList.remove("active");
  personalBstSec.classList.remove("active");

  location.reload();

  
});



/* Function for finishing the test */
function finishTest() {
  clearInterval(interval);
  started = false;


  const currentWPM = calculateWPM();

  const savedHighScore = Number(localStorage.getItem("highScore")) || 0;

  const hasVisited = localStorage.getItem("hasVisited");

  /* FIRST USER */
  if(hasVisited !== "true") {
    showFirstResultPage();

    localStorage.setItem("hasVisited", "true");

  }

  /* NEW PERSONAL BEST */
  else if (currentWPM > savedHighScore) {
    localStorage.setItem("highScore", currentWPM);

    showPersonalBestPage();

  }

  /* NORMAL RESULT */
  else {
    showNormalResult();
  }

}


/* MOBILE DESIGN */

/* Dropdown for difficulty */
const dropdown = document.querySelector(".dropdown_diffi_menu");
const btn = document.querySelector(".dropdown_diffi_btn");

/* function to remove the dropdown and not toggle */
function removeDropDownDiffi() {
  dropdown.classList.remove("active");
}

btn.addEventListener("click", () => {
  dropdown.classList.toggle("active");
});

const options = document.querySelectorAll(".option input");

options.forEach(option => {
  option.addEventListener("change", () => {
    btn.firstChild.textContent = option.parentElement.textContent.trim();
    difficultyChosen = true;
    /* checkSelections(); */
  });
});

options.forEach(option => {

  option.addEventListener("click", () => {

    const mode = option.dataset.mode;

    if(mode === "easyMob") {
      loadTextEasy();
      removeDropDownDiffi();
      difficultyChosen = true;
      checkSelections();
    }

    else if(mode === "mediumMob"){
      loadTextMedium();
      removeDropDownDiffi();
      difficultyChosen = true;
      checkSelections();
    }

    else if(mode === "hardMob") {
      loadTextHard();
      removeDropDownDiffi();
      difficultyChosen = true;
      checkSelections();
    }

  })

})



/* Dropdown for time */
const dropdownMode = document.querySelector(".dropdown_mode_menu");
const btnMode = document.querySelector(".dropdown_mode_btn");

/* function to remove the dropdown and not toggle */
function removeDropDownMode() {
  dropdownMode.classList.remove("active");
}

btnMode.addEventListener("click", () => {
  dropdownMode.classList.toggle("active");
  
});

const optionsMode = document.querySelectorAll(".option_mod input");


optionsMode.forEach(option => {

  option.addEventListener("click", () => {

    const mode = option.dataset.mode;

    if(mode === "sixtySec") {
      setTime(60);
      removeDropDownMode();
      timeChosen = true;

      checkSelections();
    }

    else if(mode === "thirtySec"){
      setTime(30);
      removeDropDownMode();
      timeChosen = true;

      checkSelections();

    }

    else if(mode === "fifteenSec") {
      setTime(15);
      removeDropDownMode();
      timeChosen = true;

      checkSelections();

    }

  })

})

function checkSelections() {

  if (difficultyChosen && timeChosen) {

    hiddenInput.focus();

    /* hiddenInput.click(); */

  }

}

const hiddenInput = document.getElementById("hiddenInput");
hiddenInput.addEventListener("focus", () => {
  console.log("Input focused");
});

/* Handling typing function */
function handleTyping(key) {
   if(time === 0 && started) return;


  

  const letters = document.querySelectorAll("#text span");

  // 🔙 handle backspace
  if (key === "Backspace") {
    if (index > 0) {
      index--;
      letters[index].style.color = "";
      letters[index].style.textDecoration = "none";
    }
    return;
  }

  /* Start timer when a User types the first key */
  if (!started) {
    started = true;

    time = originalTime;

    timer.innerText = String(time).padStart(2, "0");

    interval = setInterval(() => {
      time--;
        
      timer.innerText = String(time).padStart(2, "0");

      if (time === 0) {
        clearInterval(interval);

        finishTest();
      } 

    }, 1000);
  }

  

  // stop if finished
  

  // ✅ compare typed key with current letter
  if (key === letters[index].innerText) {
    letters[index].style.color = "lightgreen";
  } else {
    letters[index].style.color = "red";
    letters[index].style.textDecoration = "underline";
  }

  // move forward
  index++;


  letters[index]?.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "nearest"
  });

  if(index === letters.length) {
    
    finishTest();
  }

  /* Calculating Wpm */
  const wpm = calculateWPM();
  wpmEl.innerText = wpm;
  

  /* Calculating Accuracy */
  const accuracy = calculateAccuracy();
  accuEl.innerText = accuracy + "%";

  /* FIRST RESULT PAGE */
  const firstResWpm = document.getElementById("FstResWpm");
  firstResWpm.innerText = wpm;

  const firstResAccu = document.getElementById("FirstResAccu");
  firstResAccu.innerText = accuracy + "%";

  /* NORMAL RESULT PAGE */
  const normalResWpm = document.getElementById("normResWpm");
  normalResWpm.innerText = wpm;

  const normalResAccu = document.getElementById("normResAccu");
  normalResAccu.innerText = accuracy + "%";

  /* PERSONAL BEST PAGE */
  const personalBstWpm = document.getElementById("perBstWpm");
  personalBstWpm.innerText = wpm;

  const personalBstAccu = document.getElementById("perBstAccu");
  personalBstAccu.innerText = accuracy + "%";

  calculateCharacters();
  calculateCharacters2();
  calculateCharacters3();

}

/* Typing Area for desktop */

let index = 0;

document.addEventListener("keydown", (e) => {
  // ignore keys like Shift, Ctrl, etc
  const key = e.key;
  if (key.length > 1 && key !== "Backspace") return;
  e.preventDefault();
  
  handleTyping(e.key);
 
});

/* Typing Area for mobile */
hiddenInput.addEventListener("input", (e) => {

  const key = e.target.value.slice(-1);
  handleTyping(key);
  e.target.value = "";
  

});













