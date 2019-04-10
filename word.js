const COMMANDS = ["Bop", "Spin", "Twist", "Pull", "Flick", "Shake"];
const ADDITIONAL = ["Buy", "Sell", "Hit", "Slap", "Bump", "Dodge", "Market", "Program", "Employ", "Pity", "Love", "Hate"];
const ADVANCED = ["Vaporize", "Obfuscate", "Discombobulate", "Jump-On", "Xerox", "Masticate", "Defenestrate", "Decapitate", "Disembowel", "Transmogrify"];

class Word {
  constructor(game, given, timer, salt = true) {
    this.game = game;
    this.given = given;
    this.currentTime = 0;
    this.timer = timer;
    this.untyped = given;
    this.typed = "";
    this.timerTyped = "";
    this.complete = false;
    this.salt = salt;
    this.initCard();
  }
  initCard() {
    this.container = document.createElement("div");
    this.letters = [];
    const xPoint = Math.floor(Math.random() * getBoard().clientWidth);
    const yPoint = Math.floor(Math.random() * getBoard().clientHeight);
    this.container.setAttribute("class", "word-card");
    this.container.style = `left: ${xPoint}px; top: ${yPoint}px`;
    for (let ch = 0; ch < this.given.length; ch++) {
      const sp = document.createElement("span");
      sp.classList.add("untyped");
      sp.innerHTML = this.given.charAt(ch);
      this.letters.push(sp);
      this.container.appendChild(sp);
    }
    const itSpan = document.createElement("span");
    itSpan.innerHTML = " It!";
    itSpan.className = "untyped";
    this.container.appendChild(itSpan);
    if (this.salt) {
      this.saltSpan = document.createElement("span");
      this.saltSpan.classList.add("salt");
      this.saltIndex = Math.floor(Math.random() * this.given.length);
      this.saltChar = this.getSaltyLetter();
      this.saltSpan.innerHTML = this.saltChar;
      this.container.insertBefore(this.saltSpan, this.getSpan(this.saltIndex));
    }
  }
  getSaltyLetter() {
    const vowels = ["a", "e", "i", "o", "u"];
    const all = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    let ret = "";
    const char = this.given.charAt(this.saltIndex);
    let fAll = all.filter(e => e !== char);
    let filt = vowels.filter(e => e !== char);
    if (vowels.find(ch => ch === char)) {
      ret = filt[Math.floor(Math.random() * filt.length)];
    } else {
      ret = fAll[Math.floor(Math.random() * fAll.length)];
    }

    if (this.saltIndex === 0) {
      ret = ret.toUpperCase();
      let origFirst = this.getSpan(0).innerHTML;
      this.getSpan(0).innerHTML = origFirst.toLowerCase();
    }
    return ret;
  }
  getSaltSpan() {
    return this.saltSpan;
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
      } else if (this.salt && (key.toUpperCase() === this.saltChar.toUpperCase() && this.typed.length === this.saltIndex)) {
        console.log("conditional worked");
        this.typed = "";
        this.untyped = this.given;
        this.container.querySelectorAll(".typed").forEach(e => {
          e.classList.remove("typed");
          e.classList.add("untyped");
        });
      }
      if (this.typed === this.given) {
        this.container.remove();
        this.game.addPoints(1);
        this.isComplete = true;
      }
    }
  }

  progress() {
    if (this.timerTyped.length === this.given.length && !this.isComplete) {
      this.game.over();
    } else {
      const index = this.timerTyped.length;
      const span = this.getSpan(index);
      if (index === 0) {
        if (this.saltIndex === 0) {
          this.saltSpan.classList.add("first-rounded");
        } else {
          span.classList.add("first-rounded");
        }
      } else {
        this.getSpan(index - 1).classList.remove("last-rounded");
      }
      this.timerTyped += this.given.charAt(index);
      span.classList.add("behind");
      if (index === this.saltIndex) {
        this.saltSpan.classList.add("behind");
      }
      span.classList.add("last-rounded");
    }
  }
}
