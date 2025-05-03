// // Эффект всплеска при клике на осьминога
// document.getElementById("kraken").addEventListener("click", (event) => {
//     const splash = document.createElement("div");
//     splash.className = "splash-effect";
//     splash.style.left = `${event.clientX}px`;
//     splash.style.top = `${event.clientY}px`;
//     document.body.appendChild(splash);

//     setTimeout(() => splash.remove(), 1000); // Удаляем эффект через 1 секунду
// });

// // Всплывающее уведомление
// function showNotification(message) {
//     const notification = document.createElement("div");
//     notification.className = "notification";
//     notification.innerText = message;
//     document.body.appendChild(notification);

//     setTimeout(() => notification.remove(), 3000); // Удаляем уведомление через 3 секунды
// }

// // Подсветка активных машинок в головоломке
// function highlightActiveCars() {
//     const cars = document.querySelectorAll(".car");
//     cars.forEach((car) => {
//         car.addEventListener("mouseenter", () => {
//             car.style.boxShadow = "0 0 10px 2px #FFD700";
//         });
//         car.addEventListener("mouseleave", () => {
//             car.style.boxShadow = "none";
//         });
//     });
// }

// // Инициализация улучшений интерфейса
// function initUIEnhancements() {
//     highlightActiveCars();
//     console.log("UI Enhancements Initialized");
// }

// // Запускаем улучшения интерфейса после загрузки страницы
// document.addEventListener("DOMContentLoaded", initUIEnhancements);

//     carElement.style.left = newPosition;
//         carElement.style.transition = "left 0.5s ease"; // Плавный переход

//     });
//     });      
// }
//
// // Функция для добавления эффекта подсветки на машины
// function addCarGlowEffect() {
//     const cars = document.querySelectorAll(".car");
//     cars.forEach(car => {

//         car.classList.add("animate"); // Добавляем анимацию с подсветкой
//     });
// }
//
// // Функция для активации RGB подсветки для машины
// function activateRGBGlowEffect() {
//     const cars = document.querySelectorAll(".car");
//     cars.forEach(car => {
//         car.addEventListener("mouseenter", () => {
//             car.style.transition = "box-shadow 0.5s ease-in-out, transform 0.5s";
//             car.style.boxShadow = "0 0 25px rgba(255, 0, 255, 1), 0 0 35px rgba(0, 255, 255, 1)";
//             car.style.transform = "scale(1.05)";
//         });
