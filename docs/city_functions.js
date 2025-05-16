// =========================================================================
// Город - функции и механики
// =========================================================================

/**
 * Модуль для управления функциональностью города в игре TapKraken
 * 
 * В городе игрок может:
 * - Строить и улучшать здания
 * - Получать пассивный доход от построек
 * - Выполнять городские задания
 * - Участвовать в городских событиях
 */

// Типы зданий, доступные для постройки
const BUILDING_TYPES = {
  FARM: 'farm',
  MINE: 'mine',
  FACTORY: 'factory',
  RESEARCH: 'research',
  BANK: 'bank',
  POWER: 'power'
};

// Базовые параметры зданий
const BUILDINGS_CONFIG = {
  [BUILDING_TYPES.FARM]: {
    name: 'Ферма водорослей',
    icon: 'leaf',
    basePrice: 500,
    priceGrowth: 1.5,
    baseIncome: 5,
    incomeGrowth: 1.2,
    description: 'Выращивает питательные водоросли для кракена'
  },
  [BUILDING_TYPES.MINE]: {
    name: 'Подводная шахта',
    icon: 'gem',
    basePrice: 3000,
    priceGrowth: 1.6,
    baseIncome: 20,
    incomeGrowth: 1.3,
    description: 'Добывает редкие минералы со дна океана'
  },
  [BUILDING_TYPES.FACTORY]: {
    name: 'Фабрика амулетов',
    icon: 'industry',
    basePrice: 10000,
    priceGrowth: 1.7,
    baseIncome: 80,
    incomeGrowth: 1.4,
    description: 'Создает магические артефакты из морских сокровищ'
  },
  [BUILDING_TYPES.RESEARCH]: {
    name: 'Исследовательский центр',
    icon: 'microscope',
    basePrice: 50000,
    priceGrowth: 1.8,
    baseIncome: 250,
    incomeGrowth: 1.5,
    description: 'Изучает древние мистические знания'
  },
  [BUILDING_TYPES.BANK]: {
    name: 'Банк сокровищ',
    icon: 'landmark',
    basePrice: 250000,
    priceGrowth: 1.9,
    baseIncome: 1000,
    incomeGrowth: 1.6,
    description: 'Хранит и приумножает ваши богатства'
  },
  [BUILDING_TYPES.POWER]: {
    name: 'Энергетический храм',
    icon: 'bolt',
    basePrice: 1000000,
    priceGrowth: 2.0,
    baseIncome: 5000,
    incomeGrowth: 1.7,
    description: 'Черпает энергию из глубин океана, увеличивая доход'
  }
};

// Состояние города игрока
let cityState = {
  // Уровень города
  level: 1,
  
  // Опыт города
  experience: 0,
  
  // Требуемый опыт для повышения уровня
  nextLevelExp: 1000,
  
  // Множитель дохода от города
  incomeMultiplier: 1,
  
  // Здания игрока по типам (ключ - тип, значение - объект здания)
  buildings: {},
  
  // История улучшений
  upgradeHistory: [],
  
  // Текущие городские задания
  currentTasks: []
};

// Инициализация зданий при первом запуске
function initializeBuildings() {
  // Проверяем, есть ли уже здания в cityState
  if (Object.keys(cityState.buildings).length === 0) {
    // Создаем начальные здания (все типы, но уровень 0)
    for (const type in BUILDING_TYPES) {
      const buildingType = BUILDING_TYPES[type];
      cityState.buildings[buildingType] = {
        type: buildingType,
        level: 0,
        unlocked: buildingType === BUILDING_TYPES.FARM, // Изначально доступна только ферма
        income: 0,
        lastCollected: Date.now()
      };
    }
  }
}

// Расчет стоимости улучшения здания
function getBuildingUpgradePrice(buildingType, currentLevel) {
  const config = BUILDINGS_CONFIG[buildingType];
  // Для новых построек (level = 0) цена равна базовой
  if (currentLevel === 0) {
    return config.basePrice;
  }
  // Для существующих построек цена растет в геометрической прогрессии
  return Math.floor(config.basePrice * Math.pow(config.priceGrowth, currentLevel));
}

// Расчет дохода от здания
function getBuildingIncome(buildingType, level) {
  if (level === 0) return 0;
  
  const config = BUILDINGS_CONFIG[buildingType];
  return Math.floor(config.baseIncome * Math.pow(config.incomeGrowth, level - 1));
}

// Проверка, доступно ли здание для покупки
function isBuildingAvailable(buildingType) {
  // Ферма доступна всегда
  if (buildingType === BUILDING_TYPES.FARM) {
    return true;
  }
  
  // Для других зданий проверяем требования
  const cityLevel = cityState.level;
  
  switch (buildingType) {
    case BUILDING_TYPES.MINE:
      return cityLevel >= 2;
    case BUILDING_TYPES.FACTORY:
      return cityLevel >= 4;
    case BUILDING_TYPES.RESEARCH:
      return cityLevel >= 7;
    case BUILDING_TYPES.BANK:
      return cityLevel >= 10;
    case BUILDING_TYPES.POWER:
      return cityLevel >= 15;
    default:
      return false;
  }
}

// Улучшение здания
function upgradeBuilding(buildingType) {
  const building = cityState.buildings[buildingType];
  
  // Проверяем, разблокировано ли здание
  if (!building.unlocked && !isBuildingAvailable(buildingType)) {
    console.log(`Здание ${BUILDINGS_CONFIG[buildingType].name} ещё не доступно`);
    showNotification(`Здание будет доступно на ${getBuildingRequiredLevel(buildingType)} уровне города`, "lock");
    return false;
  }
  
  // Рассчитываем стоимость улучшения
  const upgradeCost = getBuildingUpgradePrice(buildingType, building.level);
  
  // Проверяем, достаточно ли монет
  if (score < upgradeCost) {
    console.log(`Недостаточно монет для улучшения ${BUILDINGS_CONFIG[buildingType].name}`);
    showNotification("Недостаточно монет для улучшения", "coins");
    return false;
  }
  
  // Списываем стоимость улучшения
  score -= upgradeCost;
  updateScore();
  
  // Повышаем уровень здания
  building.level += 1;
  
  // Если это первый уровень, то помечаем здание как разблокированное
  if (building.level === 1) {
    building.unlocked = true;
  }
  
  // Обновляем доход от здания
  building.income = getBuildingIncome(buildingType, building.level);
  
  // Добавляем запись в историю улучшений
  cityState.upgradeHistory.push({
    date: new Date().toISOString(),
    buildingType: buildingType,
    newLevel: building.level,
    cost: upgradeCost
  });
  
  // Добавляем опыт городу
  addCityExperience(Math.floor(upgradeCost / 10));
  
  // Сохраняем состояние города
  saveCityState();
  
  // Обновляем отображение города
  renderCity();
  
  console.log(`Здание ${BUILDINGS_CONFIG[buildingType].name} улучшено до уровня ${building.level}`);
  showNotification(`${BUILDINGS_CONFIG[buildingType].name} улучшено до уровня ${building.level}`, "arrow-up");
  
  return true;
}

// Получение требуемого уровня города для разблокировки здания
function getBuildingRequiredLevel(buildingType) {
  switch (buildingType) {
    case BUILDING_TYPES.FARM:
      return 1;
    case BUILDING_TYPES.MINE:
      return 2;
    case BUILDING_TYPES.FACTORY:
      return 4;
    case BUILDING_TYPES.RESEARCH:
      return 7;
    case BUILDING_TYPES.BANK:
      return 10;
    case BUILDING_TYPES.POWER:
      return 15;
    default:
      return 999;
  }
}

// Сбор дохода от всех зданий
function collectAllIncome() {
  let totalIncome = 0;
  const now = Date.now();
  
  // Для каждого здания рассчитываем доход
  for (const buildingType in cityState.buildings) {
    const building = cityState.buildings[buildingType];
    
    // Пропускаем неразблокированные здания или с нулевым уровнем
    if (!building.unlocked || building.level === 0) {
      continue;
    }
    
    // Рассчитываем время с последнего сбора в секундах (максимум 24 часа)
    const timePassedInSeconds = Math.min(
      (now - building.lastCollected) / 1000,
      24 * 60 * 60 // Максимум 24 часа
    );
    
    // Рассчитываем доход (в секундах)
    const incomePerSecond = building.income / 3600; // Доход в час делим на 3600 секунд
    const income = Math.floor(incomePerSecond * timePassedInSeconds * cityState.incomeMultiplier);
    
    totalIncome += income;
    
    // Обновляем время последнего сбора
    building.lastCollected = now;
  }
  
  // Добавляем доход к счету
  if (totalIncome > 0) {
    score += totalIncome;
    updateScore();
    
    // Показываем уведомление о собранном доходе
    showNotification(`Собрано ${totalIncome} монет с городских построек`, "building");
  }
  
  // Сохраняем состояние города
  saveCityState();
  
  return totalIncome;
}

// Добавление опыта городу
function addCityExperience(amount) {
  cityState.experience += amount;
  
  // Проверяем, достаточно ли опыта для повышения уровня
  while (cityState.experience >= cityState.nextLevelExp) {
    // Вычитаем требуемый опыт
    cityState.experience -= cityState.nextLevelExp;
    
    // Повышаем уровень
    cityState.level += 1;
    
    // Увеличиваем множитель дохода
    cityState.incomeMultiplier += 0.1;
    
    // Рассчитываем новое требование опыта
    cityState.nextLevelExp = Math.floor(1000 * Math.pow(1.5, cityState.level - 1));
    
    // Проверяем, нужно ли разблокировать новые здания
    checkAndUnlockBuildings();
    
    // Уведомление о повышении уровня
    showNotification(`Город достиг ${cityState.level} уровня!`, "city");
  }
  
  // Сохраняем состояние города
  saveCityState();
}

// Проверка и разблокировка зданий при повышении уровня города
function checkAndUnlockBuildings() {
  for (const type in BUILDING_TYPES) {
    const buildingType = BUILDING_TYPES[type];
    const building = cityState.buildings[buildingType];
    
    // Если здание уже разблокировано, пропускаем
    if (building.unlocked) {
      continue;
    }
    
    // Проверяем, можно ли разблокировать здание
    if (isBuildingAvailable(buildingType)) {
      // Разблокируем здание
      building.unlocked = true;
      
      // Показываем уведомление о разблокировке
      showNotification(`Разблокировано новое здание: ${BUILDINGS_CONFIG[buildingType].name}`, "unlock");
    }
  }
}

// Рендеринг интерфейса города
function renderCity() {
  const cityContainer = document.getElementById('city-content');
  if (!cityContainer) return; // Выходим, если контейнер не найден
  
  // Очищаем контейнер
  cityContainer.innerHTML = '';
  
  // Создаем фон с RGB эффектом
  const cityBackground = document.createElement('div');
  cityBackground.className = 'city-background';
  cityBackground.innerHTML = `
    <div class="city-background-grid"></div>
    <div class="city-background-overlay"></div>
  `;
  cityContainer.appendChild(cityBackground);
  
  // Создаем элемент для информации о городе
  const cityInfoElement = document.createElement('div');
  cityInfoElement.className = 'city-info rgb-border';
  cityInfoElement.innerHTML = `
    <div class="city-level">
      <i class="fas fa-city rgb-glow"></i>
      <div class="level-info">
        <div class="city-level-title">Уровень города: <span class="rgb-text">${cityState.level}</span></div>
        <div class="city-progress-bar">
          <div class="city-progress rgb-gradient" style="width: ${(cityState.experience / cityState.nextLevelExp) * 100}%"></div>
        </div>
        <div class="city-exp-text">${cityState.experience}/${cityState.nextLevelExp}</div>
      </div>
    </div>
    <div class="city-income">
      <i class="fas fa-coins rgb-pulse"></i>
      <span>Бонус к доходу: <span class="rgb-text">+${Math.floor((cityState.incomeMultiplier - 1) * 100)}%</span></span>
    </div>
    <button class="collect-all-btn rgb-button" onclick="collectAllIncome()">
      <div class="btn-content">
        <i class="fas fa-hand-holding-usd"></i>
        Собрать доход
      </div>
      <div class="btn-glow"></div>
    </button>
  `;
  
  cityContainer.appendChild(cityInfoElement);
  
  // Добавляем статистику города
  const cityStatsElement = document.createElement('div');
  cityStatsElement.className = 'city-stats rgb-border';
  
  // Рассчитываем общий доход в час
  const hourlyIncome = getTotalCityIncomePerHour();
  
  // Рассчитываем сумму затрат на все здания
  let totalInvestment = 0;
  for (const type in cityState.buildings) {
    const building = cityState.buildings[type];
    if (building.level > 0) {
      for (let i = 0; i < building.level; i++) {
        totalInvestment += getBuildingUpgradePrice(type, i);
      }
    }
  }
  
  cityStatsElement.innerHTML = `
    <div class="stats-title">Статистика города</div>
    <div class="stats-grid">
      <div class="stat-box">
        <i class="fas fa-coins rgb-glow"></i>
        <div class="stat-value">${formatNumber(hourlyIncome)}</div>
        <div class="stat-label">Доход/час</div>
      </div>
      <div class="stat-box">
        <i class="fas fa-building rgb-glow"></i>
        <div class="stat-value">${Object.values(cityState.buildings).filter(b => b.level > 0).length}</div>
        <div class="stat-label">Построек</div>
      </div>
      <div class="stat-box">
        <i class="fas fa-chart-line rgb-glow"></i>
        <div class="stat-value">${formatNumber(totalInvestment)}</div>
        <div class="stat-label">Инвестиции</div>
      </div>
      <div class="stat-box">
        <i class="fas fa-bolt rgb-glow"></i>
        <div class="stat-value">${cityState.incomeMultiplier.toFixed(2)}x</div>
        <div class="stat-label">Множитель</div>
      </div>
    </div>
  `;
  
  cityContainer.appendChild(cityStatsElement);
  
  // Создаем контейнер для зданий
  const buildingsContainer = document.createElement('div');
  buildingsContainer.className = 'buildings-container';
  
  // Добавляем заголовок секции
  const buildingsHeader = document.createElement('div');
  buildingsHeader.className = 'section-header';
  buildingsHeader.innerHTML = `
    <div class="section-title rgb-text">Постройки города</div>
    <div class="section-subtitle">Улучшайте здания для увеличения пассивного дохода</div>
  `;
  buildingsContainer.appendChild(buildingsHeader);
  
  // Добавляем каждое здание
  for (const type in BUILDING_TYPES) {
    const buildingType = BUILDING_TYPES[type];
    const building = cityState.buildings[buildingType];
    const config = BUILDINGS_CONFIG[buildingType];
    
    // Создаем элемент здания
    const buildingElement = document.createElement('div');
    buildingElement.className = `building-item rgb-border ${!building.unlocked ? 'locked' : ''}`;
    
    // Рассчитываем цену улучшения
    const upgradePrice = getBuildingUpgradePrice(buildingType, building.level);
    
    // Определяем, может ли игрок позволить себе улучшение
    const canAfford = score >= upgradePrice;
    
    // Генерируем уникальные RGB стили для каждого здания
    const hue = (parseInt(buildingType.charCodeAt(0)) * 20) % 360;
    const buildingStyle = `--building-hue: ${hue}deg;`;
    
    // Заполняем элемент здания
    buildingElement.innerHTML = `
      <div class="building-header" style="${buildingStyle}">
        <div class="building-icon rgb-glow">
          <i class="fas fa-${config.icon}"></i>
        </div>
        <div class="building-info">
          <div class="building-title">${config.name}</div>
          <div class="building-level">Уровень: <span class="rgb-text">${building.level}</span></div>
        </div>
      </div>
      <div class="building-details">
        <div class="building-income">
          ${building.level > 0 
            ? `<span class="income-value"><i class="fas fa-coins rgb-pulse"></i> ${formatNumber(building.income)}/час</span>` 
            : '<span class="not-built">Не построено</span>'}
        </div>
        <div class="building-description">${config.description}</div>
        <div class="efficiency-bar">
          <div class="efficiency-label">Эффективность:</div>
          <div class="efficiency-meter">
            ${Array(5).fill(0).map((_, i) => 
              `<div class="efficiency-dot ${i < Math.min(building.level, 5) ? 'active' : ''}" style="--dot-delay: ${i * 0.1}s"></div>`
            ).join('')}
          </div>
        </div>
      </div>
      <div class="building-upgrade">
        ${building.unlocked ? `
          <div class="upgrade-price ${canAfford ? '' : 'cannot-afford'}">
            <i class="fas fa-coins"></i>
            ${formatNumber(upgradePrice)}
          </div>
          <button class="upgrade-btn rgb-button" onclick="upgradeBuilding('${buildingType}')" ${canAfford ? '' : 'disabled'}>
            <div class="btn-content">
              ${building.level === 0 ? '<i class="fas fa-plus"></i> Построить' : '<i class="fas fa-arrow-up"></i> Улучшить'}
            </div>
            <div class="btn-glow"></div>
          </button>
        ` : `
          <div class="locked-message">
            <i class="fas fa-lock rgb-pulse"></i>
            Доступно на ${getBuildingRequiredLevel(buildingType)} уровне города
          </div>
        `}
      </div>
    `;
    
    buildingsContainer.appendChild(buildingElement);
  }
  
  cityContainer.appendChild(buildingsContainer);
  
  // Добавляем элемент для специальных улучшений города
  const cityUpgradesElement = document.createElement('div');
  cityUpgradesElement.className = 'city-upgrades';
  
  // Заголовок секции
  const upgradesHeader = document.createElement('div');
  upgradesHeader.className = 'section-header';
  upgradesHeader.innerHTML = `
    <div class="section-title rgb-text">Особые улучшения</div>
    <div class="section-subtitle">Уникальные бонусы для вашего города</div>
  `;
  cityUpgradesElement.appendChild(upgradesHeader);
  
  // Список улучшений
  const specialUpgrades = [
    {
      id: 'central_tower',
      name: 'Центральная башня',
      description: 'Увеличивает доход от всех зданий на 10%',
      icon: 'tower-observation',
      price: 5000,
      unlockLevel: 3
    },
    {
      id: 'research_center',
      name: 'Исследовательский центр',
      description: 'Повышает эффективность улучшений на 15%',
      icon: 'microscope',
      price: 15000,
      unlockLevel: 5
    },
    {
      id: 'economic_district',
      name: 'Экономический район',
      description: 'Дает дополнительные 5% от общего счета каждый час',
      icon: 'chart-pie',
      price: 50000,
      unlockLevel: 8
    }
  ];
  
  // Контейнер для специальных улучшений
  const specialUpgradesContainer = document.createElement('div');
  specialUpgradesContainer.className = 'special-upgrades-container';
  
  // Добавляем каждое специальное улучшение
  specialUpgrades.forEach(upgrade => {
    const isUnlocked = cityState.level >= upgrade.unlockLevel;
    const canAfford = score >= upgrade.price;
    
    const upgradeElement = document.createElement('div');
    upgradeElement.className = `special-upgrade rgb-border ${!isUnlocked ? 'locked' : ''}`;
    
    upgradeElement.innerHTML = `
      <div class="special-upgrade-icon rgb-glow">
        <i class="fas fa-${upgrade.icon}"></i>
      </div>
      <div class="special-upgrade-info">
        <div class="special-upgrade-name">${upgrade.name}</div>
        <div class="special-upgrade-description">${upgrade.description}</div>
      </div>
      <div class="special-upgrade-action">
        ${isUnlocked ? `
          <div class="upgrade-price ${canAfford ? '' : 'cannot-afford'}">
            <i class="fas fa-coins"></i>
            ${formatNumber(upgrade.price)}
          </div>
          <button class="upgrade-btn rgb-button" onclick="purchaseSpecialUpgrade('${upgrade.id}')" ${canAfford ? '' : 'disabled'}>
            <div class="btn-content">
              <i class="fas fa-gem"></i> Купить
            </div>
            <div class="btn-glow"></div>
          </button>
        ` : `
          <div class="locked-message">
            <i class="fas fa-lock rgb-pulse"></i>
            Доступно на ${upgrade.unlockLevel} уровне города
          </div>
        `}
      </div>
    `;
    
    specialUpgradesContainer.appendChild(upgradeElement);
  });
  
  cityUpgradesElement.appendChild(specialUpgradesContainer);
  cityContainer.appendChild(cityUpgradesElement);
}

// Вспомогательная функция форматирования чисел
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Получение общего дохода от города в час
function getTotalCityIncomePerHour() {
  let totalIncome = 0;
  
  for (const buildingType in cityState.buildings) {
    const building = cityState.buildings[buildingType];
    if (building.unlocked && building.level > 0) {
      totalIncome += building.income;
    }
  }
  
  return Math.floor(totalIncome * cityState.incomeMultiplier);
}

// Сохранение состояния города
function saveCityState() {
  try {
    localStorage.setItem('tapkraken_city', JSON.stringify(cityState));
  } catch (e) {
    console.error('Ошибка при сохранении состояния города:', e);
  }
}

// Загрузка состояния города
function loadCityState() {
  try {
    const savedState = localStorage.getItem('tapkraken_city');
    if (savedState) {
      cityState = JSON.parse(savedState);
    }
  } catch (e) {
    console.error('Ошибка при загрузке состояния города:', e);
  }
  
  // Инициализируем здания, если их нет
  initializeBuildings();
}

// Инициализация города при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  // Загружаем состояние города
  loadCityState();
  
  // Регистрируем обработчик событий для кнопки города
  const cityButton = document.querySelector('.nav-button[data-tab="city"]');
  if (cityButton) {
    cityButton.addEventListener('click', function() {
      // Открываем вкладку города
      openCityTab();
    });
  }
});

// Открытие вкладки города
function openCityTab() {
  // Скрываем все вкладки контента
  const contentTabs = document.querySelectorAll('.content-tab');
  contentTabs.forEach(tab => {
    tab.style.display = 'none';
  });
  
  // Показываем вкладку города
  const cityTab = document.getElementById('city-tab');
  if (cityTab) {
    cityTab.style.display = 'block';
  } else {
    // Если вкладки нет, создаем её
    createCityTab();
  }
  
  // Активируем кнопку города в навигации
  const navButtons = document.querySelectorAll('.nav-button');
  navButtons.forEach(btn => {
    btn.classList.remove('active');
  });
  
  const cityButton = document.querySelector('.nav-button[data-tab="city"]');
  if (cityButton) {
    cityButton.classList.add('active');
  }
  
  // Рендерим интерфейс города
  renderCity();
}

// Создание вкладки города, если её нет в DOM
function createCityTab() {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  const cityTab = document.createElement('div');
  cityTab.id = 'city-tab';
  cityTab.className = 'content-tab';
  cityTab.style.display = 'none';
  
  // Добавляем заголовок
  const cityHeader = document.createElement('div');
  cityHeader.className = 'city-header';
  cityHeader.innerHTML = `
    <h2>Город Кракена</h2>
    <p>Стройте и улучшайте здания для получения пассивного дохода</p>
  `;
  
  cityTab.appendChild(cityHeader);
  
  // Добавляем контейнер для контента города
  const cityContent = document.createElement('div');
  cityContent.id = 'city-content';
  cityContent.className = 'city-content';
  
  cityTab.appendChild(cityContent);
  
  // Добавляем вкладку к основному контенту
  mainContent.appendChild(cityTab);
}

// Экспортируем функции и константы для использования в основном скрипте
window.city = {
  BUILDING_TYPES,
  BUILDINGS_CONFIG,
  cityState,
  upgradeBuilding,
  collectAllIncome,
  getTotalCityIncomePerHour,
  renderCity,
  openCityTab
};