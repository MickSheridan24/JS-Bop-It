let GameId = 0;
let activeGame = null;
class Game {
  constructor() {
    this.vocabulary = ["Bop", "Spin", "Twist", "Pull", "Flick", "Shake"];
    this.additional = ["Buy", "Sell", "Hit", "Slap", "Bump", "Dodge", "Market", "Program", "Employ", "Pity", "Love", "Hate"];
    this.advanced = ["Vaporize", "Obfuscate", "Discombobulate", "Jump-On", "Xerox", "Masticate", "Defenestrate", "Decapitate", "Disembowel", "Transmogrify"];
    this.id = ++GameId;
    this.score = 0;
    this.active = true;
    this.intervals = [];
    this.words = [];

    activeGame = this;
    this.run();
  }

  static getActiveGame() {
    return activeGame;
  }

  run() {
    this.setDictionary();
    this.setTimer();
    this.runGame(this.words);
  }
  getCommand = () => {
    let unlocked = getScore() >= 10;
    if (Math.floor(Math.random() * 100) > 90 && this.advanced.length > 0 && unlocked) {
      return this.advanced[Math.floor(Math.random() * this.advanced.length)];
    } else {
      return this.vocabulary[Math.floor(Math.random() * this.vocabulary.length)];
    }
  };

  setTimer() {
    const gameTimer = setInterval(() => {
      if (this.active) {
        for (const word of this.words) {
          if (!word.isComplete) {
            word.currentTime++;
            if (word.currentTime === word.timer) {
              word.currentTime = 0;
              word.progress();
            }
          } else {
            console.log("removed", word);
            console.log([...this.words]);
            this.words.splice(this.words.indexOf(word), 1);
            console.log([...this.words]);
          }
        }
      } else {
        clearInterval(gameTimer);
      }
    }, 250);

    document.addEventListener("keydown", e => {
      if (e.key === "?") {
        debugger;
      }
      for (const word of this.words) {
        word.check(e.key);
      }
    });
  }

  setDictionary() {
    const add = setInterval(() => {
      if (this.additional.length > 0) {
        const num = Math.floor(Math.random() * this.additional.length);
        this.vocabulary.push(this.additional[num]);
        this.additional.splice(num, 1);
      } else if (this.advanced.length > 0) {
        const num = Math.floor(Math.random() * this.advanced.length);
        this.vocabulary.push(this.advanced[num]);
        this.advanced.splice(num, 1);
      } else {
        clearInterval(add);
      }
    }, 4000);
  }

  runGame(words) {
    words.push(this.fixWord());
    this.intervals.push(this.buttonThread(10000));
    this.intervals.push(this.wordThread(3000, words));
    this.intervals.push(this.wordThread(7000, words));
    this.intervals.push(this.wordThread(10000, words));
  }

  fixWord() {
    let salted = Math.random() > 0.8;
    const word = new Word(this, this.getCommand(), 6, salted);
    const board = getBoard();
    board.appendChild(word.container);
    return word;
  }

  wordThread(num, words) {
    return setInterval(() => {
      words.push(this.fixWord());
      if (num >= 3000) {
        num -= 100;
      }
    }, num);
  }

  buttonThread(num) {
    return setInterval(() => {
      let b = new GameButton(this, 10);
      board.appendChild(b.button);
      if (num >= 5000) {
        num -= 100;
      }
    }, num);
  }

  addPoints() {
    this.score++;
    setScore(this.score);
  }

  over() {
    this.active = false;
    this.intervals.forEach(clearInterval);
    this.intervals = [];
    gameOver();
  }
}
