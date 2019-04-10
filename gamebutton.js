const YESBUTTON = ["Press It!", "Click It!", "Confirm It!", "Accept It!", "Activate It!", "Submit It!", "Touch It!"];
const NOBUTTON = ["Ignore It!", "Forget It!", "Neglect It!", "Avoid It!", "Forget It!", "Overlook It!", "Reject It!"];
class GameButton {
  constructor(game, timer) {
    this.game = game;
    this.armed = true;
    this.timer = timer;
    this.init();
    this.setTimer();
  }
  init() {
    this.red = Math.random() <= 0.5;
    this.yes = Math.random() <= 0.5;
    this.dont = Math.random() <= 0.5;
    const xPoint = Math.floor(Math.random() * getBoard().clientWidth);
    const yPoint = Math.floor(Math.random() * getBoard().clientHeight);

    this.button = document.createElement("button");
    this.button.style = `position: fixed; left: ${xPoint}px; top: ${yPoint}px`;
    this.button.innerText = "";
    if (this.red) {
      this.button.classList.add("salt");
    }
    if (this.dont) {
      this.button.innerText += "Don't ";
    }
    if (this.yes) {
      this.button.innerText += YESBUTTON[Math.floor(Math.random() * YESBUTTON.length)];
    } else {
      this.button.innerText += NOBUTTON[Math.floor(Math.random() * NOBUTTON.length)];
    }

    this.button.addEventListener("click", () => {
      this.check(true);
    });
  }
  setTimer() {
    const sp = document.createElement("span");
    this.button.appendChild(sp);
    sp.innerHTML = ` (${this.timer})`;
    setInterval(() => {
      this.timer--;
      sp.innerHTML = ` (${this.timer})`;
      if (this.timer < 0) {
        this.check(false);
      }
    }, 1000);
  }
  check(clicked) {
    if (this.armed) {
      this.armed = false;
      console.log(this.yes, this.red, this.dont);
      let shouldI = clicked;
      if (!this.yes) {
        shouldI = !shouldI;
      }
      if (this.red) {
        shouldI = !shouldI;
      }
      if (this.dont) {
        shouldI = !shouldI;
      }

      if (shouldI) {
        this.game.addPoints(1);
        this.button.remove();
      } else {
        this.game.over();
      }
    }
  }
}
