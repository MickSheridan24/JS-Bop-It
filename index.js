const COMMANDS = ["Bop", "Spin", "Twist", "Pull", "Flick", "Shake"];
const ADDITIONAL = ["Buy", "Sell", "Hit", "Slap", "Bump", "Dodge", "Market", "Program", "Employ", "Pity", "Love", "Hate"];
const ADVANCED = ["Vaporize", "Obfuscate", "Discombobulate", "Jump-On", "Xerox", "Masticate", "Defenestrate", "Decapitate", "Disembowel", "Transmogrify"];

class Word {
  constructor(given, timer) {
    this.given = given;
    this.currentTime = 0;
    this.timer = timer;
    this.untyped = given;
    this.typed = "";
    this.timerTyped = "";
    this.complete = false;
    this.initCard();
  }
  initCard() {
    this.container = document.createElement("div");
    this.letters = [];
    const xPoint = Math.floor(Math.random() * board.clientWidth);
    const yPoint = Math.floor(Math.random() * board.clientHeight);
    this.container.setAttribute("class", "word-card");
    this.container.style = `left: ${xPoint}px; top: ${yPoint}px`;
    for (let ch = 0; ch < this.given.length; ch++) {
      const sp = document.createElement("span");
      sp.classList.add("untyped");
      sp.innerHTML = this.given.charAt(ch);
      this.letters.push(sp);
      this.container.appendChild(sp);
    }
  }
  getSpan(index) {
    return this.letters[index];
  }
  check(key) {
    if (!this.isComplete) {
      if (key.toUpperCase() === this.untyped.charAt(0).toUpperCase()) {
        const span = this.getSpan(this.typed.length);
        this.typed += this.untyped.charAt(0);
        this.untyped = this.untyped.substr(1);
        span.classList.remove("untyped");
        span.classList.add("typed");
      }
      if (this.typed === this.given) {
        this.container.remove();
        const score = getScore();
        score.textContent = parseInt(score.textContent) + 1;
        this.isComplete = true;
      }
    }
  }

  progress() {
    if (this.timerTyped.length === this.given.length && !this.isComplete) {
      //alert("Game Over");
    } else {
      const span = this.getSpan(this.timerTyped.length);
      if (this.timerTyped.length === 0) {
        span.classList.add("first-rounded");
      } else {
        this.getSpan(this.timerTyped.length - 1).classList.remove("last-rounded");
      }
      this.timerTyped += this.given.charAt(this.timerTyped.length);
      span.classList.add("behind");
      span.classList.add("last-rounded");
    }
  }
}

const getCommand = () => {
  let unlocked = getScore() >= 10;
  if (Math.floor(Math.random() * 100) > 90 && ADVANCED.length > 0 && unlocked) {
    return ADVANCED[Math.floor(Math.random() * ADVANCED.length)];
  } else {
    return COMMANDS[Math.floor(Math.random() * COMMANDS.length)];
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const words = [];
  const add = setInterval(() => {
    if (ADDITIONAL.length > 0) {
      const num = Math.floor(Math.random() * ADDITIONAL.length);
      COMMANDS.push(ADDITIONAL[num]);
      ADDITIONAL.splice(num, 1);
    } else {
      if (ADVANCED.length > 0) {
        const num = Math.floor(Math.random() * ADVANCED.length);
        COMMANDS.push(ADVANCED[num]);
        ADVANCED.splice(num, 1);
      } else {
        clearInterval(add);
      }
    }
  }, 4000);

  const gameTimer = setInterval(() => {
    for (word of words) {
      if (!word.isComplete) {
        word.currentTime++;
        if (word.currentTime === word.timer) {
          word.currentTime = 0;
          word.progress();
        }
      } else {
        console.log("removed", word);
        console.log([...words]);
        words.splice(words.indexOf(word), 1);
        console.log([...words]);
      }
    }
  }, 250);

  runGame(words);

  document.addEventListener("keydown", e => {
    for (word of words) {
      word.check(e.key);
    }
  });
});

function getMain() {
  return document.getElementById("main");
}

function getScore() {
  return document.getElementById("score");
}

function getBoard() {
  return document.getElementById("board");
}
function fixWord() {
  const word = new Word(getCommand(), 4);
  const board = getBoard();
  board.appendChild(word.container);
  return word;
}

function wordThread(num, words) {
  words.push(fixWord());
  setInterval(() => {
    words.push(fixWord());
    if (num >= 2000) {
      num -= 100;
    }
  }, num);
}
function runGame(words) {
  wordThread(2000, words);
  setTimeout(() => {
    wordThread(10000, words);
    setTimeout(() => {
      wordThread(5000, words);
    }, 25000);
  }, 50000);
}
