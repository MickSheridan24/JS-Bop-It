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
  console.log("Hello World");

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
  setInterval(() => {
    words.push(runGame(words));
  }, 2000);
  document.addEventListener("keydown", e => {
    for (word of words) {
      word.check(e.key);
    }
  });
});

function makeWord(given) {
  const gridIndex = Math.floor(Math.random() * 12);
  const section = getGrid(Math.floor(Math.random() * 4));
  const container = section.children[gridIndex];
  const untyped = document.createElement("span");
  const it = document.createElement("span");
  it.textContent = " It!";
  untyped.setAttribute("class", "untyped");
  it.setAttribute("class", "untyped");
  const typed = document.createElement("span");
  typed.setAttribute("class", "typed");
  container.setAttribute("class", "grid-item");
  container.style = `grid-area: ${Math.floor(Math.random() * 12)}`;
  container.appendChild(typed);
  container.appendChild(untyped);
  container.appendChild(it);
  const str = given;
  untyped.innerText = str;
  typed.innerText = "";
  container.addEventListener("keydown", e => {});

  const word = {
    isComplete: false,
    container: container,
    untyped: untyped,
    typed: typed,
    str: str,
    check: function(key) {
      console.log(key);
      if (!this.isComplete) {
        if (
          key.toUpperCase() === this.untyped.innerText.charAt(0).toUpperCase()
        ) {
          this.typed.innerText += this.untyped.innerText.charAt(0);
          this.untyped.innerText = this.untyped.innerText.substr(1);
          if (this.untyped.innerText.length <= 0) {
            this.complete();
          }
        } else {
          this.untyped.innerText = this.str;
          this.typed.innerText = "";
        }
      }
    },
    complete: function() {
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }
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

function getGrid(num) {
  return document.getElementById(`grid${num}`);
}

(function buildGrid() {
  const grid1 = getGrid(1);
  const grid2 = getGrid(2);
  const grid3 = getGrid(3);
  const grid0 = getGrid(0);

  for (let i = 0; i < 12; i++) {
    const item1 = document.createElement("div");
    item1.setAttribute("class", "grid-item");
    grid1.appendChild(item1);

    const item2 = document.createElement("div");
    item2.setAttribute("class", "grid-item");
    // item2.style = `grid-area: ${i}`;
    grid2.appendChild(item2);

    const item3 = document.createElement("div");
    item3.setAttribute("class", "grid-item");
    //   item3.style = `grid-area: ${i}`;
    grid3.appendChild(item3);

    const item0 = document.createElement("div");
    item0.setAttribute("class", "grid-item");
    //  item0.style = `grid-area: ${i}`;
    grid0.appendChild(item0);
  }
})();

function runGame() {
  const word = makeWord(getCommand());
  return word;
}
