// =========================================================================
// Исправление отображения города в TapKraken с улучшенной визуализацией
// =========================================================================

// Глобальное состояние города
const fixedCityState = {
  level: 1,
  experience: 0,
  nextLevelExp: 1000,
  incomeMultiplier: 1.0,
  lastCollectTime: Date.now(),
  unclaimedIncome: 0,
  buildings: {
    house: { level: 1, unlocked: true, income: 1, visualStage: 1 },
    farm: { level: 0, unlocked: false, income: 0, visualStage: 0 },
    mine: { level: 0, unlocked: false, income: 0, visualStage: 0 },
    factory: { level: 0, unlocked: false, income: 0, visualStage: 0 },
    research: { level: 0, unlocked: false, income: 0, visualStage: 0 },
    bank: { level: 0, unlocked: false, income: 0, visualStage: 0 },
    power: { level: 0, unlocked: false, income: 0, visualStage: 0 }
  }
};

// Конфигурация зданий
const FIXED_BUILDINGS = {
  house: {
    name: 'Жилой дом',
    icon: 'home',
    basePrice: 100,
    baseIncome: 1,
    description: 'Жилище для горожан'
  },
  farm: {
    name: 'Ферма водорослей',
    icon: 'leaf',
    basePrice: 500,
    baseIncome: 5,
    description: 'Выращивает питательные водоросли'
  },
  mine: {
    name: 'Глубоководная шахта',
    icon: 'gem',
    basePrice: 2500,
    baseIncome: 25,
    description: 'Добывает ценные минералы'
  },
  factory: {
    name: 'Подводная фабрика',
    icon: 'industry',
    basePrice: 10000,
    baseIncome: 100,
    description: 'Производит товары'
  },
  research: {
    name: 'Научный центр',
    icon: 'flask',
    basePrice: 50000,
    baseIncome: 500,
    description: 'Изучает морские глубины'
  }
};

// Стадии визуального развития зданий
const BUILDING_STAGES = {
  house: [
    { level: 1, description: 'Маленькая хижина с соломенной крышей' },
    { level: 3, description: 'Деревянный домик с трубой' },
    { level: 5, description: 'Кирпичный дом с садом' },
    { level: 7, description: 'Большой особняк с балконами' },
    { level: 10, description: 'Роскошная вилла с бассейном' }
  ]
};

// Функция открытия города
function openFixedCityTab() {
  console.log('Открываем вкладку города...');
  
  // Скрываем все вкладки
  document.querySelectorAll('.content-tab').forEach(tab => {
    tab.style.display = 'none';
  });
  
  // Показываем вкладку города
  const cityTab = document.getElementById('city-tab');
  if (cityTab) {
    cityTab.style.display = 'block';
  } else {
    // Если вкладки нет, создаем её
    createFixedCityTab();
  }
  
  // Обновляем кнопки навигации
  document.querySelectorAll('.nav-button').forEach(button => {
    button.classList.remove('active');
  });
  
  const cityButton = document.querySelector('.nav-button[data-tab="city"]');
  if (cityButton) {
    cityButton.classList.add('active');
  }
  
  // Скрываем контейнер с кракеном
  const krakenContainer = document.getElementById('kraken-container');
  if (krakenContainer) {
    krakenContainer.style.display = 'none';
  }
  
  // Отрисовываем город
  renderFixedCity();
}

// Создание вкладки города
function createFixedCityTab() {
  console.log('Создаем вкладку города...');
  
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  const cityTab = document.createElement('div');
  cityTab.id = 'city-tab';
  cityTab.className = 'content-tab';
  
  // Содержимое вкладки
  cityTab.innerHTML = `
    <div class="city-header">
      <h2 class="rgb-text">Город Кракена</h2>
      <p>Стройте и улучшайте здания для получения пассивного дохода</p>
    </div>
    <div id="city-content" class="city-content">
      <!-- Содержимое будет заполнено динамически -->
    </div>
  `;
  
  mainContent.appendChild(cityTab);
}

// Отрисовка города
function renderFixedCity() {
  console.log('Отрисовываем город...');
  
  // Получаем контейнер для контента города
  const cityContent = document.getElementById('city-content');
  if (!cityContent) return;
  
  // Очищаем контейнер
  cityContent.innerHTML = '';
  
  // Создаем фон с RGB эффектом
  const cityBackground = document.createElement('div');
  cityBackground.className = 'city-background';
  cityBackground.innerHTML = `
    <div class="city-background-grid"></div>
    <div class="city-background-overlay"></div>
  `;
  cityContent.appendChild(cityBackground);
  
  // Создаем элемент для информации о городе
  const cityInfoElement = document.createElement('div');
  cityInfoElement.className = 'city-info rgb-border';
  cityInfoElement.innerHTML = `
    <div class="city-level">
      <i class="fas fa-city rgb-glow"></i>
      <div class="level-info">
        <div class="city-level-title">Уровень города: <span class="rgb-text">${fixedCityState.level}</span></div>
        <div class="city-progress-bar">
          <div class="city-progress rgb-gradient" style="width: ${(fixedCityState.experience / fixedCityState.nextLevelExp) * 100}%"></div>
        </div>
        <div class="city-exp-text">${formatCityNumber(fixedCityState.experience)}/${formatCityNumber(fixedCityState.nextLevelExp)}</div>
      </div>
    </div>
    <div class="city-income">
      <i class="fas fa-coins rgb-pulse"></i>
      <span>Бонус к доходу: <span class="rgb-text">+${Math.floor((fixedCityState.incomeMultiplier - 1) * 100)}%</span></span>
    </div>
    <button class="collect-all-btn rgb-button" onclick="collectAllFixedIncome()">
      <i class="fas fa-hand-holding-usd"></i>
      <span>Собрать доход: <span id="unclaimed-income">${formatCityNumber(fixedCityState.unclaimedIncome)}</span></span>
    </button>
  `;
  cityContent.appendChild(cityInfoElement);
  
  // Создаем контейнер для зданий
  const buildingsContainer = document.createElement('div');
  buildingsContainer.className = 'buildings-container';
  
  // Создаем и добавляем карточки зданий
  for (const [buildingType, config] of Object.entries(FIXED_BUILDINGS)) {
    const building = fixedCityState.buildings[buildingType];
    
    // Если здание ещё не доступно, пропускаем
    if (!building) continue;
    
    // Определяем визуальную стадию
    const visualStage = getVisualStageForLevel(buildingType, building.level);
    
    // Создаем разметку для здания
    const buildingElement = document.createElement('div');
    buildingElement.className = `building-card rgb-border ${building.unlocked ? '' : 'locked'}`;
    buildingElement.dataset.type = buildingType;
    
    // Получаем описание здания для текущей визуальной стадии
    const stageInfo = BUILDING_STAGES[buildingType] ? 
      BUILDING_STAGES[buildingType].find(stage => stage.level <= building.level) || 
      { description: config.description } : 
      { description: config.description };
    
    buildingElement.innerHTML = `
      <div class="building-image stage-${visualStage}">
        <i class="fas fa-${config.icon}"></i>
      </div>
      <div class="building-info">
        <div class="building-name">${config.name} <span class="building-level">Ур. ${building.level}</span></div>
        <div class="building-description">${stageInfo.description}</div>
        <div class="building-income">
          <i class="fas fa-coins"></i> ${formatCityNumber(building.income)}/час
        </div>
      </div>
      <button class="upgrade-btn ${building.unlocked ? 'rgb-button' : 'locked'}" ${building.unlocked ? 'onclick="upgradeFixedBuilding(\'' + buildingType + '\')"' : ''}>
        <i class="fas fa-${building.unlocked ? 'arrow-up' : 'lock'}"></i>
        <span>${building.unlocked ? 'Улучшить: ' + formatCityNumber(getBuildingUpgradePrice(buildingType, building.level)) : 'Заблокировано'}</span>
      </button>
    `;
    
    buildingsContainer.appendChild(buildingElement);
  }
  
  cityContent.appendChild(buildingsContainer);
}

// Получение визуальной стадии для уровня здания
function getVisualStageForLevel(buildingType, level) {
  if (level === 0) return 0;
  
  const stages = BUILDING_STAGES[buildingType];
  if (!stages) return 1;
  
  // Находим самую высокую стадию, подходящую для текущего уровня
  for (let i = stages.length - 1; i >= 0; i--) {
    if (level >= stages[i].level) {
      return i + 1;
    }
  }
  
  return 1;
}

// Получение цены улучшения здания
function getBuildingUpgradePrice(buildingType, level) {
  const config = FIXED_BUILDINGS[buildingType];
  if (!config) return 0;
  
  // Базовая формула для расчета стоимости улучшения
  return Math.floor(config.basePrice * Math.pow(1.5, level));
}

// Улучшение здания
function upgradeFixedBuilding(buildingType) {
  console.log(`Улучшаем здание ${buildingType}...`);
  
  const building = fixedCityState.buildings[buildingType];
  if (!building || !building.unlocked) return;
  
  // Получаем стоимость улучшения
  const upgradeCost = getBuildingUpgradePrice(buildingType, building.level);
  
  // Проверяем, достаточно ли монет (используем глобальную переменную score)
  if (window.score < upgradeCost) {
    showCityNotification("Недостаточно монет для улучшения!", "error");
    return;
  }
  
  // Запоминаем текущую визуальную стадию
  const oldVisualStage = getVisualStageForLevel(buildingType, building.level);
  
  // Списываем монеты
  window.score -= upgradeCost;
  if (typeof window.updateScore === 'function') {
    window.updateScore();
  }
  
  // Увеличиваем уровень здания
  building.level += 1;
  
  // Увеличиваем доход
  building.income = calculateBuildingIncome(buildingType, building.level);
  
  // Получаем новую визуальную стадию
  const newVisualStage = getVisualStageForLevel(buildingType, building.level);
  
  // Показываем уведомление
  showCityNotification(`${FIXED_BUILDINGS[buildingType].name} улучшен до уровня ${building.level}!`, "success");
  
  // Добавляем опыт городу
  addCityExperience(upgradeCost * 0.1);
  
  // Перерисовываем город
  renderFixedCity();
  
  // Если визуальная стадия изменилась, показываем анимацию
  if (oldVisualStage !== newVisualStage) {
    playBuildingUpgradeAnimation(buildingType, oldVisualStage, newVisualStage);
  }
}

// Расчет дохода здания
function calculateBuildingIncome(buildingType, level) {
  const config = FIXED_BUILDINGS[buildingType];
  if (!config) return 0;
  
  // Базовая формула для расчета дохода
  return Math.floor(config.baseIncome * Math.pow(1.2, level - 1));
}

// Анимация улучшения здания
function playBuildingUpgradeAnimation(buildingType, oldStage, newStage) {
  console.log(`Анимация улучшения ${buildingType} со стадии ${oldStage} до ${newStage}`);
  
  // Находим элемент здания
  const buildingElement = document.querySelector(`.building-card[data-type="${buildingType}"]`);
  if (!buildingElement) return;
  
  // Находим изображение здания
  const buildingImage = buildingElement.querySelector('.building-image');
  if (!buildingImage) return;
  
  // Добавляем класс для анимации
  buildingImage.classList.add('upgrading');
  
  // Через небольшую задержку меняем стадию и убираем анимацию
  setTimeout(() => {
    buildingImage.classList.remove(`stage-${oldStage}`);
    buildingImage.classList.add(`stage-${newStage}`);
    
    setTimeout(() => {
      buildingImage.classList.remove('upgrading');
      
      // Создаем эффект частиц
      createUpgradeParticles(buildingElement);
    }, 500);
  }, 500);
}

// Создание частиц для анимации улучшения
function createUpgradeParticles(buildingElement) {
  const rect = buildingElement.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  // Создаем контейнер для частиц, если его нет
  let particlesContainer = document.getElementById('particles-container');
  if (!particlesContainer) {
    particlesContainer = document.createElement('div');
    particlesContainer.id = 'particles-container';
    particlesContainer.style.position = 'fixed';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.pointerEvents = 'none';
    particlesContainer.style.zIndex = '1000';
    document.body.appendChild(particlesContainer);
  }
  
  // Создаем частицы
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'upgrade-particle';
    
    // Случайный цвет
    const colors = ['#ff3b30', '#5ac8fa', '#ffcc00', '#34c759', '#007aff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Случайный размер
    const size = Math.random() * 10 + 5;
    
    // Стили частицы
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.boxShadow = `0 0 ${size/2}px ${color}`;
    particle.style.left = `${centerX}px`;
    particle.style.top = `${centerY}px`;
    
    // Добавляем частицу
    particlesContainer.appendChild(particle);
    
    // Анимируем частицу
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 150 + 50;
    const duration = Math.random() * 1 + 0.5;
    
    setTimeout(() => {
      particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
      particle.style.opacity = '0';
      particle.style.transition = `all ${duration}s ease-out`;
      
      // Удаляем частицу после анимации
      setTimeout(() => {
        particle.remove();
      }, duration * 1000);
    }, 10);
  }
}

// Добавление опыта городу
function addCityExperience(amount) {
  fixedCityState.experience += Math.floor(amount);
  
  // Проверяем, достигнут ли следующий уровень
  if (fixedCityState.experience >= fixedCityState.nextLevelExp) {
    fixedCityState.level += 1;
    fixedCityState.experience -= fixedCityState.nextLevelExp;
    fixedCityState.nextLevelExp = Math.floor(fixedCityState.nextLevelExp * 1.5);
    
    // Увеличиваем множитель дохода
    fixedCityState.incomeMultiplier += 0.05;
    
    // Показываем уведомление
    showCityNotification(`Уровень города повышен до ${fixedCityState.level}!`, "levelup");
    
    // Играем эффект
    playCityLevelUpEffect();
  }
}

// Эффект повышения уровня города
function playCityLevelUpEffect() {
  const cityContent = document.getElementById('city-content');
  if (!cityContent) return;
  
  // Создаем элемент для анимации
  const levelUpText = document.createElement('div');
  levelUpText.className = 'level-up-text';
  levelUpText.textContent = `УРОВЕНЬ ${fixedCityState.level}!`;
  
  levelUpText.style.position = 'absolute';
  levelUpText.style.top = '50%';
  levelUpText.style.left = '50%';
  levelUpText.style.transform = 'translate(-50%, -50%) scale(0.5)';
  levelUpText.style.fontSize = '48px';
  levelUpText.style.fontWeight = 'bold';
  levelUpText.style.color = '#ffcc00';
  levelUpText.style.textShadow = '0 0 10px rgba(255, 204, 0, 0.8)';
  levelUpText.style.zIndex = '101';
  levelUpText.style.opacity = '0';
  levelUpText.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  
  cityContent.appendChild(levelUpText);
  
  // Анимация
  setTimeout(() => {
    levelUpText.style.opacity = '1';
    levelUpText.style.transform = 'translate(-50%, -50%) scale(1.2)';
    
    setTimeout(() => {
      levelUpText.style.opacity = '0';
      levelUpText.style.transform = 'translate(-50%, -50%) scale(2)';
      
      setTimeout(() => {
        levelUpText.remove();
      }, 500);
    }, 1500);
  }, 300);
  
  // Создаем частицы для украшения
  for (let i = 0; i < 50; i++) {
    createLevelUpParticle();
  }
}

// Создать частицу для анимации повышения уровня города
function createLevelUpParticle() {
  const cityContent = document.getElementById('city-content');
  if (!cityContent) return;
  
  const particle = document.createElement('div');
  particle.className = 'level-up-particle';
  
  // Случайный размер и цвет
  const size = Math.random() * 15 + 5;
  const colors = ['#ffcc00', '#ff3b30', '#0a84ff', '#34c759', '#ff9500', '#af52de'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  // Стилизуем частицу
  particle.style.position = 'absolute';
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.backgroundColor = color;
  particle.style.borderRadius = '50%';
  particle.style.boxShadow = `0 0 ${size/2}px ${color}`;
  particle.style.opacity = '0.8';
  particle.style.zIndex = '102';
  particle.style.pointerEvents = 'none';
  
  // Начальная позиция (в центре экрана)
  const rect = cityContent.getBoundingClientRect();
  const startX = rect.width / 2;
  const startY = rect.height / 2;
  
  particle.style.left = `${startX}px`;
  particle.style.top = `${startY}px`;
  
  // Добавляем в DOM
  cityContent.appendChild(particle);
  
  // Случайное направление и скорость
  const angle = Math.random() * Math.PI * 2;
  const distance = Math.random() * 300 + 100;
  const duration = Math.random() * 1.5 + 0.5;
  
  // Анимация разлета
  setTimeout(() => {
    particle.style.transition = `all ${duration}s cubic-bezier(0.165, 0.84, 0.44, 1)`;
    particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
    particle.style.opacity = '0';
    
    // Удаляем частицу после анимации
    setTimeout(() => {
      particle.remove();
    }, duration * 1000);
  }, 10);
}

// Показ уведомления
function showCityNotification(message, type = 'info') {
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, type);
    return;
  }
  
  console.log(`[Город] ${message}`);
  
  // Создаем своё уведомление, если нет глобальной функции
  const notification = document.createElement('div');
  notification.className = `city-notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : type === 'levelup' ? 'star' : 'info-circle'}"></i>
    <span>${message}</span>
  `;
  
  // Стили уведомления
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.left = '50%';
  notification.style.transform = 'translateX(-50%)';
  notification.style.backgroundColor = type === 'error' ? '#ff3b30' : type === 'success' ? '#34c759' : type === 'levelup' ? '#ffcc00' : '#007aff';
  notification.style.color = '#fff';
  notification.style.padding = '10px 20px';
  notification.style.borderRadius = '5px';
  notification.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
  notification.style.zIndex = '10000';
  notification.style.opacity = '0';
  notification.style.transition = 'all 0.3s ease';
  
  document.body.appendChild(notification);
  
  // Анимация появления и исчезновения
  setTimeout(() => {
    notification.style.opacity = '1';
    
    setTimeout(() => {
      notification.style.opacity = '0';
      
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }, 10);
}

// Форматирование числа для отображения
function formatCityNumber(num) {
  if (typeof window.formatNumber === 'function') {
    return window.formatNumber(num);
  }
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
}

// Собрать весь накопленный доход
function collectAllFixedIncome() {
  if (fixedCityState.unclaimedIncome <= 0) {
    showCityNotification("Пока нечего собирать!", "info");
    return;
  }
  
  const amount = fixedCityState.unclaimedIncome;
  
  // Добавляем монеты к общему счету
  if (typeof window.score !== 'undefined') {
    window.score += amount;
    if (typeof window.updateScore === 'function') {
      window.updateScore();
    }
  }
  
  // Сбрасываем несобранный доход
  fixedCityState.unclaimedIncome = 0;
  fixedCityState.lastCollectTime = Date.now();
  
  // Показываем уведомление
  showCityNotification(`Собрано ${formatCityNumber(amount)} монет!`, "success");
  
  // Анимация сбора монет
  animateCoinCollection(amount);
  
  // Обновляем город
  renderFixedCity();
}

// Анимация сбора монет
function animateCoinCollection(amount) {
  const scoreElement = document.getElementById('score');
  if (!scoreElement) return;
  
  // Создаем контейнер для анимации монет, если его нет
  let coinContainer = document.getElementById('coin-animation-container');
  if (!coinContainer) {
    coinContainer = document.createElement('div');
    coinContainer.id = 'coin-animation-container';
    coinContainer.style.position = 'fixed';
    coinContainer.style.top = '0';
    coinContainer.style.left = '0';
    coinContainer.style.width = '100%';
    coinContainer.style.height = '100%';
    coinContainer.style.pointerEvents = 'none';
    coinContainer.style.zIndex = '9999';
    document.body.appendChild(coinContainer);
  }
  
  // Получаем координаты кнопки сбора и счетчика монет
  const collectButton = document.querySelector('.collect-all-btn');
  if (!collectButton) return;
  
  const collectRect = collectButton.getBoundingClientRect();
  const scoreRect = scoreElement.getBoundingClientRect();
  
  // Создаем несколько летящих монет
  const coinCount = Math.min(20, Math.max(5, Math.floor(amount / 100)));
  
  for (let i = 0; i < coinCount; i++) {
    // Создаем элемент монеты
    const coin = document.createElement('div');
    coin.className = 'flying-coin';
    
    // Стилизуем монету
    coin.style.position = 'absolute';
    coin.style.width = '20px';
    coin.style.height = '20px';
    coin.style.borderRadius = '50%';
    coin.style.background = 'radial-gradient(circle at 30% 30%, #ffec8b, #ffd700 30%, #b8860b)';
    coin.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.8)';
    coin.style.display = 'flex';
    coin.style.alignItems = 'center';
    coin.style.justifyContent = 'center';
    coin.style.fontSize = '12px';
    coin.style.fontWeight = 'bold';
    coin.style.color = '#734f19';
    coin.style.zIndex = '10000';
    coin.innerHTML = '$';
    
    // Случайная начальная позиция вокруг кнопки сбора
    const startX = collectRect.left + collectRect.width / 2 + (Math.random() - 0.5) * 40;
    const startY = collectRect.top + collectRect.height / 2 + (Math.random() - 0.5) * 40;
    
    coin.style.left = `${startX}px`;
    coin.style.top = `${startY}px`;
    
    // Добавляем монету в контейнер
    coinContainer.appendChild(coin);
    
    // Задержка перед началом анимации
    const delay = Math.random() * 200;
    
    // Запускаем анимацию монеты
    setTimeout(() => {
      // Вычисляем кривую Безье для более естественного движения
      const controlX = startX + (scoreRect.left + scoreRect.width / 2 - startX) * 0.3 + (Math.random() - 0.5) * 100;
      const controlY = startY - 100 - Math.random() * 100;
      
      const duration = 0.5 + Math.random() * 0.5;
      
      coin.style.transition = `all ${duration}s cubic-bezier(.17,.67,.83,.67)`;
      
      // Анимируем перемещение монеты к счетчику
      setTimeout(() => {
        coin.style.left = `${scoreRect.left + scoreRect.width / 2}px`;
        coin.style.top = `${scoreRect.top + scoreRect.height / 2}px`;
        coin.style.opacity = '0';
        coin.style.transform = 'scale(0.5)';
        
        // Удаляем монету после завершения анимации
        setTimeout(() => {
          coin.remove();
        }, duration * 1000);
      }, 10);
    }, delay);
  }
}

// Создадим глобальный объект для доступа к функциям города
window.fixedCity = {
  openCityTab: openFixedCityTab,
  renderCity: renderFixedCity,
  upgradeBuilding: upgradeFixedBuilding,
  collectAllIncome: collectAllFixedIncome
};

// Добавление обработчиков при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  console.log('Настраиваем обработчики для города...');
  
  // Добавляем обработчик для кнопки города
  const cityButton = document.querySelector('.nav-button[data-tab="city"]');
  if (cityButton) {
    cityButton.onclick = function() {
      openFixedCityTab();
    };
  }
  
  // Каждые 10 секунд обновляем несобранный доход
  setInterval(() => {
    // Рассчитываем накопившийся доход
    const totalIncomePerHour = getTotalFixedCityIncome();
    const now = Date.now();
    const elapsed = (now - fixedCityState.lastCollectTime) / 3600000; // Часы
    
    fixedCityState.unclaimedIncome += Math.floor(totalIncomePerHour * elapsed);
    fixedCityState.lastCollectTime = now;
    
    // Обновляем отображение, если открыта вкладка города
    const cityTab = document.getElementById('city-tab');
    if (cityTab && cityTab.style.display !== 'none') {
      const unclaimedElement = document.getElementById('unclaimed-income');
      if (unclaimedElement) {
        unclaimedElement.textContent = formatCityNumber(fixedCityState.unclaimedIncome);
      }
    }
  }, 10000);
});

// Получение общего дохода города в час
function getTotalFixedCityIncome() {
  let totalIncome = 0;
  
  for (const buildingType in fixedCityState.buildings) {
    const building = fixedCityState.buildings[buildingType];
    if (building.level > 0) {
      totalIncome += building.income;
    }
  }
  
  // Применяем бонусный множитель города
  return Math.floor(totalIncome * fixedCityState.incomeMultiplier);
}