const SALT = "abcdefghijklmnopqrstuvwxyz";
const COMMANDS = ["Bop", "Spin", "Twist", "Pull", "Flick", "Shake"];
const ADDITIONAL = ["Buy", "Sell", "Hit", "Slap", "Bump", "Dodge", "Market", "Program", "Employ", "Pity", "Love", "Hate"];
const ADVANCED = ["Vaporize", "Obfuscate", "Discombobulate", "Jump-On", "Xerox", "Masticate", "Defenestrate", "Decapitate", "Disembowel", "Transmogrify"];

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

  const saltSpan = document.createElement("span");

  untypedAhead.setAttribute("class", "untyped");
  untypedBehind.setAttribute("class", "untyped");
  typedAhead.setAttribute("class", "typed");
  typedBehind.setAttribute("class", "typed");
  behindSpan.setAttribute("class", "behind");
  aheadSpan.setAttribute("class", "ahead");

  saltSpan.setAttribute("class", "salt");
  let ind = Math.floor(Math.random() * given.length);
  if (ind >= given.length - 1) {
    ind = given.length - 2;
  }
  if (ind === 0) {
    ind = 1;
  }

  console.log("Salted Char", given.charAt(ind));
  saltSpan.setAttribute("data-ind", ind);

  behindSpan.appendChild(typedBehind);
  behindSpan.appendChild(untypedBehind);
  aheadSpan.appendChild(typedAhead);
  aheadSpan.appendChild(untypedAhead);

  container.appendChild(behindSpan);
  container.appendChild(aheadSpan);

  for (sp of [untypedAhead, untypedBehind, typedAhead, typedBehind]) {
    const unsalted = document.createElement("span");
    const salted = document.createElement("span");

    sp.appendChild(unsalted);
    sp.appendChild(salted);
  }

  const givenString = given;
  let untypedString = given;
  let typedString = "";
  let timerString = "";

  untypedAhead.firstChild.innerText = givenString;
  saltSpan.innerText = givenString.charAt(ind);

  const word = {
    isComplete: false,
    container: container,
    behindSpan: behindSpan,
    aheadSpan: aheadSpan,
    typedAhead: {
      unsalted: typedAhead.firstChild,
      salted: typedAhead.lastChild
    },
    typedBehind: {
      unsalted: typedBehind.firstChild,
      salted: typedBehind.lastChild
    },
    untypedAhead: {
      unsalted: untypedAhead.firstChild,
      salted: untypedAhead.lastChild
    },
    untypedBehind: {
      unsalted: untypedBehind.firstChild,
      salted: untypedBehind.lastChild
    },
    untypedString: untypedString,
    typedString: typedString,
    givenString: givenString,
    salt: salt,
    saltSpan: saltSpan,
    saltedSpot: ind,
    timerString: "",
    timer: timer,
    currentTime: 0,
    timerLetter: function() {
      this.timer / this.givenString.length;
    },
    allParts: function() {
      return [this.typedBehind, this.untypedBehind, this.typedAhead, this.untypedAhead];
    },

    check: function(key) {
      if (!this.isComplete) {
        this.removeSalt();
        let idLikeSomeSaltWithThat = 0;
        if (this.typedString.length === this.saltedSpot) {
          idLikeSomeSaltWithThat++;
          if (key.toUpperCase === this.saltSpan.innerText.charAt(0).toUpperCase) {
            console.log("SALT");
            this.typedString = "";
            this.untypedString = this.givenString;
            this.typedAhead.innerText = "";
            this.typedBehind.innerText = "";
            this.untypedBehind.innerText = this.timerString;
            this.untypedAhead.innerText = this.givenString.substr(this.timerString.length);
          }
        }

        if (key.toUpperCase() === this.untypedString.charAt(idLikeSomeSaltWithThat).toUpperCase()) {
          this.typedString += this.untypedString.charAt(idLikeSomeSaltWithThat);
          this.untypedString = this.untypedString.substr(1 + idLikeSomeSaltWithThat);
          if (this.timerString.length >= this.typedString.length) {
            this.untypedBehind.unsalted.innerText = this.untypedBehind.unsalted.innerText.substr(1 + idLikeSomeSaltWithThat);
            this.typedBehind.unsalted.innerText = this.typedString;
          } else {
            this.typedAhead.unsalted.innerText += this.untypedAhead.unsalted.innerText.charAt(idLikeSomeSaltWithThat);
            this.untypedAhead.unsalted.innerText = this.untypedAhead.unsalted.innerText.substr(1 + idLikeSomeSaltWithThat);
          }
        }

        if (this.typedString === this.givenString) {
          this.complete();
        }
        this.addSalt();
      }
    },
    progress: function() {
      if (this.timerString.length === this.givenString.length && !this.isComplete) {
        //alert("Game Over");
      } else {
        this.removeSalt();
        this.timerString += this.givenString.charAt(this.timerString.length);
        if (this.timerString.length > this.typedString.length) {
          this.untypedBehind.unsalted.innerText += this.untypedAhead.unsalted.innerText.charAt(0);
          this.untypedAhead.unsalted.innerText = this.untypedAhead.unsalted.innerText.substr(1);
        } else {
          this.typedBehind.unsalted.innerText += this.typedAhead.unsalted.innerText.charAt(0);
          this.typedAhead.unsalted.innerText = this.typedAhead.unsalted.innerText.substr(1);
        }
        this.addSalt();
      }
    },
    addSalt: function() {
      if (this.salt) {
        const saltInd = this.saltedSpot;
        const getSalter = function(str, ind, typed) {
          return `<span class = "${typed}">${str.substring(0, ind)}</span><span class = "${typed}">${str.substring(ind + 1)}</span>`;
        };

        if (saltInd < this.typedString.length && saltInd < this.timerString.length) {
          let str = this.typedBehind.unsalted.innerText;
          //   console.log("salting first guy", str);
          this.typedBehind.salted.innerHTML = `<span class = "typed">${str.substring(0, saltInd)}</span><span class = "typed">${str.substring(saltInd + 1)}</span>`;
          this.typedBehind.salted.insertBefore(this.saltSpan, this.typedBehind.salted.lastChild);
          this.typedBehind.unsalted.innerText = "";
        } else if (saltInd >= this.typedString.length && saltInd < this.timerString.length) {
          let str = this.untypedBehind.unsalted.innerText;
          let workingInd = saltInd - this.typedBehind.unsalted.innerText.length;
          //   console.log("salting second guy", str);
          this.untypedBehind.salted.innerHTML = getSalter(str, workingInd, "untyped");
          this.untypedBehind.salted.insertBefore(this.saltSpan, this.untypedBehind.salted.lastChild);
          this.untypedBehind.unsalted.innerText = "";
        } else if (saltInd < this.typedString.length && saltInd >= this.timerString.length) {
          let str = this.typedAhead.unsalted.innerText;
          //   console.log("salting third guy", str);
          let workingInd = saltInd - (this.untypedBehind.unsalted.innerText.length + this.typedBehind.unsalted.innerText.length);
          this.typedAhead.salted.innerHTML = getSalter(str, workingInd, "typed");
          this.typedAhead.salted.insertBefore(this.saltSpan, this.typedAhead.salted.lastChild);
          this.typedAhead.unsalted.innerText = "";
        } else if (saltInd >= this.typedString.length && saltInd >= this.timerString.length) {
          let workingInd = saltInd - (this.typedAhead.unsalted.innerText.length + this.untypedBehind.unsalted.innerText.length + this.typedBehind.unsalted.innerText.length);
          let str = this.untypedAhead.unsalted.innerText;
          //  console.log("salting Fourth guy", str);
          this.untypedAhead.salted.innerHTML = getSalter(str, workingInd, "untyped");
          this.untypedAhead.salted.insertBefore(this.saltSpan, this.untypedAhead.salted.lastChild);
          this.untypedAhead.unsalted.innerText = "";
          //  debugger;
        } else {
          console.log("wat");
          debugger;
        }
      }
    },
    removeSalt: function() {
      if (this.salt) {
        let reconstrString = "";

        for (const child of this.allParts()) {
          // debugger;
          if (child.salted.hasChildNodes()) {
            let childArray = Array.from(child.salted.children);

            reconstrString += childArray[0].innerText;
            reconstrString += childArray[1].innerText;
            reconstrString += childArray[2].innerText;
            //     console.log(childArray, reconstrString);

            child.unsalted.innerText = reconstrString;
            while (child.salted.lastChild) {
              child.salted.removeChild(child.salted.lastChild);
            }
            //  debugger;
            reconstrString = "";
          }
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
  if (word.salt) {
    word.addSalt();
  }

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
  const word = makeWord(getCommand(), 4, true);
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
