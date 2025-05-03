// Элементы модального окна головоломки
let puzzleModal = document.getElementById("puzzle-modal");
let puzzleContainer = document.getElementById("puzzle-container");
let closePuzzleBtn = document.getElementById("close-puzzle");
let puzzleTimerEl = document.getElementById("timer");

let puzzleInterval; // Интервал для таймера головоломки

// Открытие модального окна головоломки
function openPuzzle() {
  if (puzzleModal) {
    puzzleModal.style.display = "flex";
    document.getElementById("main-content").style.display = "none";
    startPuzzle("easy"); // По умолчанию уровень easy
  }
}

// Закрытие головоломки
function closePuzzle() {
  if (puzzleModal) {
    puzzleModal.style.display = "none";
    document.getElementById("main-content").style.display = "block";
    clearInterval(puzzleInterval);
  }
}
closePuzzleBtn.addEventListener("click", closePuzzle);

// Запуск головоломки по выбранному уровню сложности
function startPuzzle(level) {
  // Очистка предыдущего содержимого
  puzzleContainer.innerHTML = "";
  let colors = [];
  if (level === "easy") {
    colors = ["red", "blue", "green"];
  } else if (level === "medium") {
    colors = ["red", "blue", "green", "yellow"];
  } else if (level === "hard") {
    colors = ["red", "blue", "green", "yellow", "purple", "orange"];
  }
  const totalCells = colors.length * 3;
  for (let i = 0; i < totalCells; i++) {
    let cell = document.createElement("div");
    cell.className = "puzzle-cell";
    cell.style.backgroundColor = colors[i % colors.length];
    cell.innerText = i + 1;
    cell.style.display = "flex";
    cell.style.justifyContent = "center";
    cell.style.alignItems = "center";
    cell.style.height = "50px";
    cell.style.border = "1px solid #fff";
    // Добавляем эффект увеличения при наведении
    cell.addEventListener("mouseover", () => {
      cell.style.transform = "scale(1.1)";
    });
    cell.addEventListener("mouseout", () => {
      cell.style.transform = "scale(1)";
    });
    puzzleContainer.appendChild(cell);
  }
  startPuzzleTimer();
}

// Таймер головоломки
function startPuzzleTimer() {
  let timeLeft = 60;
  puzzleTimerEl.innerText = timeLeft;
  clearInterval(puzzleInterval);
  puzzleInterval = setInterval(() => {
    timeLeft--;
    puzzleTimerEl.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(puzzleInterval);
      alert("Время вышло!");
      closePuzzle();
    }
  }, 1000);
}
