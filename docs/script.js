// Объявление глобальных переменных
let score = 0;
let energy = 500;
let tapPower = 1;
let energyRegen = 1;
let autoClicker = 0;

const scoreEl = document.getElementById("score");
const energyEl = document.getElementById("energy");

document.body.style.overflow = 'hidden';

// Засекаем время начала загрузки для фиксации минимальной длительности экрана загрузки
const startTime = Date.now();
document.body.classList.add('loading');

// Обработка загрузки окна
window.addEventListener('load', () => {
    loadGameData();

    const loadingScreen = document.getElementById('loading-screen');
    const minDuration = 4000; // минимум 4 секунды
    const timePassed = Date.now() - startTime;
    const delay = Math.max(0, minDuration - timePassed);

    setTimeout(() => {
        loadingScreen.style.opacity = "0";
        setTimeout(() => {
            loadingScreen.style.display = "none";
            document.body.classList.remove('loading');
            document.getElementById("main-content").style.display = "block";
        }, 500);
    }, delay);
});

// Функция для создания эффекта всплеска (splash) при клике
function createSplash(event) {
    // Берём контейнер Кракена, который имеет относительное позиционирование
    const container = document.getElementById("kraken-container");
    const containerRect = container.getBoundingClientRect();
    // Вычисляем координаты клика относительно контейнера, центрируя всплеск (учитывая размер 50px)
    const x = event.clientX - containerRect.left - 25;
    const y = event.clientY - containerRect.top - 25;
    // Создаём элемент всплеска
    const splash = document.createElement("div");
    splash.className = "splash-effect";
    splash.style.left = `${x}px`;
    splash.style.top = `${y}px`;
    // Добавляем всплеск в контейнер
    container.appendChild(splash);
    // Удаляем его после завершения анимации (1 секунда)
    setTimeout(() => splash.remove(), 1000);
}

// Функция обработки клика по Кракену
function tap(event) {
    if (energy > 0) {
        score += tapPower;
        energy -= 1;
        scoreEl.innerText = score;
        energyEl.innerText = energy;
        saveGameData();
        createSplash(event); // Запускаем визуальный эффект всплеска
        // Если понадобится звуковой эффект, можно раскомментировать следующую строку:
        // playTapSound();
    } else {
        alert("Энергия закончилась! Подождите восстановления.");
    }
}

// Интервал для восстановления энергии и начисления автокликов
setInterval(() => {
    if (energy < 500) {
        energy += energyRegen;
        if (energy > 500) energy = 500;
        energyEl.innerText = energy;
    }
    if (autoClicker > 0) {
        score += autoClicker;
        scoreEl.innerText = score;
    }
    saveGameData();
}, 1000);

// Функции для работы с Магазином
function openShop() {
    document.getElementById("shop-modal").style.display = "flex";
}

function closeShop() {
    document.getElementById("shop-modal").style.display = "none";
}

function buyUpgrade(power, cost, energyCost) {
    if (score >= cost && energy >= energyCost) {
        score -= cost;
        energy -= energyCost;
        tapPower += power;
        scoreEl.innerText = score;
        energyEl.innerText = energy;
        saveGameData();
        alert("Улучшение куплено!");
    } else {
        alert("Недостаточно очков или энергии!");
    }
}

function buyEnergyRegen(amount, cost) {
    if (score >= cost) {
        score -= cost;
        energyRegen += amount;
        scoreEl.innerText = score;
        saveGameData();
        alert("Скорость восстановления энергии увеличена!");
    } else {
        alert("Недостаточно очков!");
    }
}

function buyAutoClicker(amount, cost) {
    if (score >= cost) {
        score -= cost;
        autoClicker += amount;
        scoreEl.innerText = score;
        saveGameData();
        alert("Автокликер куплен!");
    } else {
        alert("Недостаточно очков!");
    }
}

// Функция сохранения данных игры в localStorage
function saveGameData() {
    localStorage.setItem("score", score);
    localStorage.setItem("energy", energy);
    localStorage.setItem("tapPower", tapPower);
    localStorage.setItem("energyRegen", energyRegen);
    localStorage.setItem("autoClicker", autoClicker);
}

// Функция загрузки данных игры из localStorage
function loadGameData() {
    const savedScore = localStorage.getItem("score");
    const savedEnergy = localStorage.getItem("energy");
    const savedTapPower = localStorage.getItem("tapPower");
    const savedEnergyRegen = localStorage.getItem("energyRegen");
    const savedAutoClicker = localStorage.getItem("autoClicker");

    if (savedScore !== null) score = parseInt(savedScore, 10);
    if (savedEnergy !== null) energy = parseInt(savedEnergy, 10);
    if (savedTapPower !== null) tapPower = parseInt(savedTapPower, 10);
    if (savedEnergyRegen !== null) energyRegen = parseInt(savedEnergyRegen, 10);
    if (savedAutoClicker !== null) autoClicker = parseInt(savedAutoClicker, 10);

    scoreEl.innerText = score;
    energyEl.innerText = energy;
}

// Обработчик ошибок загрузки изображения Кракена
document.getElementById("kraken").addEventListener("error", () => {
    alert("❌ Ошибка: Картинка кракена не загрузилась!");
});

// Привязываем событие открытия головоломки к кнопке с id "start-puzzle-btn"
// Функция openPuzzle() реализована в puzzle.js
document.getElementById("start-puzzle-btn").addEventListener("click", () => {
    openPuzzle();
});

// Дополнительная функция – воспроизведение звукового эффекта при клике (если понадобится)
// Для работы необходимо разместить файл tap-sound.mp3 в корневой директории проекта
function playTapSound() {
    const tapSound = new Audio("tap-sound.mp3");
    tapSound.play();
}
