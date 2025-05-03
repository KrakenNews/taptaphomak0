// Элементы модального окна головоломки и связанные узлы
let puzzleModal = document.getElementById("puzzle-modal");
let puzzleContainer = document.getElementById("puzzle-container");
let closePuzzleBtn = document.getElementById("close-puzzle");
let puzzleTimerEl = document.getElementById("timer");

let puzzleInterval; // Интервал для таймера головоломки

// Функция открытия модального окна головоломки
function openPuzzle() {
  if (puzzleModal) {
    puzzleModal.style.display = "flex";
    document.getElementById("main-content").style.display = "none";
    // Запускаем головоломку с уровнем "easy" по умолчанию
    startPuzzle("easy");
  }
}

// Функция закрытия головоломки
function closePuzzle() {
  if (puzzleModal) {
    puzzleModal.style.display = "none";
    document.getElementById("main-content").style.display = "block";
    clearInterval(puzzleInterval);
  }
}
closePuzzleBtn.addEventListener("click", closePuzzle);

// Функция генерации головоломки по выбранному уровню
function startPuzzle(level) {
  // Очистка предыдущих элементов
  puzzleContainer.innerHTML = "";
  // Выбор набора цветов в зависимости от сложности
  let colors = [];
  if (level === "easy") {
    colors = ["red", "blue", "green"];
  } else if (level === "medium") {
    colors = ["red", "blue", "green", "yellow"];
  } else if (level === "hard") {
    colors = ["red", "blue", "green", "yellow", "purple", "orange"];
  }
  // Генерация сетки: создаём ячейки, имитирующие "машинки"
  const totalCells = colors.length * 3;
  for (let i = 0; i < totalCells; i++) {
    let cell = document.createElement("div");
    cell.className = "puzzle-cell";
    // Циклический выбор цвета
    cell.style.backgroundColor = colors[i % colors.length];
    cell.innerText = i + 1;
    cell.style.display = "flex";
    cell.style.justifyContent = "center";
    cell.style.alignItems = "center";
    cell.style.height = "50px";
    cell.style.border = "1px solid #fff";
    puzzleContainer.appendChild(cell);
  }
  // Запуск таймера
  startPuzzleTimer();
}

// Функция таймера головоломки
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
