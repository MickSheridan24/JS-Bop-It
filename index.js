document.addEventListener("DOMContentLoaded", () => {
  new Game();
  const active = document.getElementById("active");
  active.innerHTML = Game.getActiveGame().id;
  console.log(Game.getActiveGame());
});

const getCommand = () => {
  let unlocked = getScore() >= 10;
  if (Math.floor(Math.random() * 100) > 90 && ADVANCED.length > 0 && unlocked) {
    return ADVANCED[Math.floor(Math.random() * ADVANCED.length)];
  } else {
    return COMMANDS[Math.floor(Math.random() * COMMANDS.length)];
  }
};
function getMain() {
  return document.getElementById("main");
}
function getScore() {
  return document.getElementById("score");
}
function setScore(num) {
  getScore().innerHTML = num;
}
function getBoard() {
  return document.getElementById("board");
}

function gameOver(game) {
  while (getBoard().firstChild) {
    getBoard().firstChild.remove();
  }
  setScore(0);
  const overScreen = document.createElement("div");
  overScreen.innerHTML = `<h3>Game Over!</h3><p>Score: ${Game.getActiveGame().score}</p>`;
  overScreen.className = "game-over";
  getBoard().appendChild(overScreen);
  const restart = document.createElement("button");
  restart.innerHTML = "Retry It?";
  restart.addEventListener("click", () => {
    new Game();
    console.log(Game.getActiveGame());
    const active = document.getElementById("active");
    active.innerHTML = Game.getActiveGame().id;
    overScreen.remove();
  });
  overScreen.appendChild(restart);
}
