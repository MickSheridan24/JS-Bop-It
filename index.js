console.log("I'm going mad");
const COMMANDS = ["Bop", "Spin", "Twist", "Pull", "Flick", "Shake"];
const ADDITIONAL = [
  "Buy",
  "Sell",
  "Hit",
  "Slap",
  "Bump",
  "Dodge",
  "Market",
  "Program",
  "Employ",
  "Pity",
  "Love",
  "Hate"
];
const ADVANCED = [
  "Vaporize",
  "Obfuscate",
  "Discombobulate",
  "Jump-On",
  "Xerox",
  "Masticate",
  "Defenestrate",
  "Decapitate",
  "Disembowel",
  "Transmogrify"
];

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
      word.currentTime++;
      if (word.currentTime === word.timer) {
        word.currentTime = 0;
        word.progress();
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

function makeWord(given, timer, salt = false) {
  //Produce the Divs and spans
  const board = getBoard();
  const xPoint = Math.floor(Math.random() * board.clientWidth);
  const yPoint = Math.floor(Math.random() * board.clientHeight);

  const container = document.createElement("div");
  container.setAttribute("class", "word-card");
  container.style = `left: ${xPoint}px; top: ${yPoint}px`;

  const aheadSpan = document.createElement("span");
  const behindSpan = document.createElement("span");
  const untypedAhead = document.createElement("span");
  const typedAhead = document.createElement("span");
  const untypedBehind = document.createElement("span");
  const typedBehind = document.createElement("span");

  untypedAhead.setAttribute("class", "untyped");
  untypedBehind.setAttribute("class", "untyped");
  typedAhead.setAttribute("class", "typed");
  typedBehind.setAttribute("class", "typed");
  behindSpan.setAttribute("class", "behind");
  aheadSpan.setAttribute("class", "ahead");

  behindSpan.appendChild(typedBehind);
  behindSpan.appendChild(untypedBehind);
  aheadSpan.appendChild(typedAhead);
  aheadSpan.appendChild(untypedAhead);

  container.appendChild(behindSpan);
  container.appendChild(aheadSpan);

  const givenString = given;
  let untypedString = given;
  let typedString = "";
  let timerString = "";

  untypedAhead.innerText = givenString;
  typedAhead.innerText = "";
  typedBehind.innerText = "";
  untypedBehind.innerText = "";

  const word = {
    isComplete: false,
    container: container,
    behindSpan: behindSpan,
    aheadSpan: aheadSpan,
    typedAhead: typedAhead,
    typedBehind: typedBehind,
    untypedAhead: untypedAhead,
    untypedBehind: untypedBehind,
    untypedString: untypedString,
    typedString: typedString,
    givenString: givenString,
    timerString: "",
    timer: timer,
    currentTime: 0,
    timerLetter: function() {
      this.timer / this.givenString.length;
    },

    check: function(key) {
      if (!this.isComplete) {
        if (key.toUpperCase() === this.untypedString.charAt(0).toUpperCase()) {
          this.typedString += this.untypedString.charAt(0);
          this.untypedString = this.untypedString.substr(1);
          if (this.timerString.length >= this.typedString.length) {
            this.untypedBehind.innerText = this.untypedBehind.innerText.substr(
              1
            );
            this.typedBehind.innerText = this.typedString;
          } else {
            this.typedAhead.innerText += this.untypedAhead.innerText.charAt(0);
            this.untypedAhead.innerText = this.untypedAhead.innerText.substr(1);
          }
        }
        if (this.typedString === this.givenString) {
          this.complete();
        }
      }
    },
    progress: function() {
      console.log(
        "progressing",
        "Timer",
        this.timerString,
        "Given",
        this.givenString
      );
      if (
        this.timerString.length === this.givenString.length &&
        !this.isComplete
      ) {
        alert("Game Over");
      } else {
        this.timerString += this.givenString.charAt(this.timerString.length);
        if (this.timerString.length > this.typedString.length) {
          this.untypedBehind.innerText += this.untypedAhead.innerText.charAt(0);
          this.untypedAhead.innerText = this.untypedAhead.innerText.substr(1);
        } else {
          this.typedBehind.innerText += this.typedAhead.innerText.charAt(0);
          this.typedAhead.innerText = this.typedAhead.innerText.substr(1);
        }
      }
    },
    complete: function() {
      this.container.remove();
      const score = getScore();
      score.textContent = parseInt(score.textContent) + 1;
      this.isComplete = true;
    }
  };

  return word;
}

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
  const word = makeWord(getCommand(), 4);
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
