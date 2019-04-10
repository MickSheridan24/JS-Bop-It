const CATCH = ["Catch", "Intercept", "Get", "Accept", "Collide With", "Stop", "Block"];
const AVOID = ["Avoid", "Dodge", "Bypass", "Evade", "Elude", "Escape", "Shun"];

class Flyer {
  constructor(catcher) {
    this.catcher = catcher;
    this.container = document.createElement("div");
    this.x = Math.random() * getBoard().clientWidth;
    this.y = -50;
    this.container.style = `left: ${this.x}px; top: ${this.y}px;`;
    this.container.className = "flyer";
    this.container.innerHTML = "";
    this.setValues();
    this.buildFlyer();
    this.fly();
  }
  setValues() {
    this.catch = Math.random() <= 0.5;
    this.dont = Math.random() <= 0.5;
    this.red = Math.random() <= 0.5;
  }
  buildFlyer() {
    if (this.dont) {
      this.container.innerHTML += "Don't ";
    }
    if (this.catch) {
      this.container.innerHTML += CATCH[Math.floor(Math.random() * CATCH.length)];
    } else {
      this.container.innerHTML += AVOID[Math.floor(Math.random() * AVOID.length)];
    }
    if (this.red) {
      this.container.style = "color: red; border-color: red";
    }
    getBoard().appendChild(this.container);
  }
  move() {
    this.y += 30;
    this.container.style = `left: ${this.x}px; top: ${this.y}px;`;
  }
  fly() {
    setInterval(() => {
      this.move();
    }, 200);
  }
}
