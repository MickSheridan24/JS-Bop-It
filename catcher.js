class Catcher {
  constructor(game) {
    this.game = game;
    this.container = document.createElement("div");
    this.x = 600;
    this.container.style = `left: ${this.x}px;`;
    this.buildGuy();
    new Flyer(this);
  }
  buildGuy() {
    this.container.innerHTML = `IT!`;
    this.container.className = "catcher";
    getBoard().appendChild(this.container);
  }
  move(e) {
    //debugger;
    console.log(e.key);
    if (e.key === "ArrowLeft") {
      this.x -= 30;
      this.container.style = `left: ${this.x}px;`;
    } else if (e.key === "ArrowRight") {
      this.x += 30;
      this.container.style = `left: ${this.x}px;`;
    }
  }
}
