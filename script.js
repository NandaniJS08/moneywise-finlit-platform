// Application State
const AppState = {
    currentPage: 'home',
    currentGame: null,
    user: {
        name: 'Player',
        avatar: '👤',
        level: 1,
        netWorth: 0,
        creditHealth: 700, // Initial credit score-like value
        emergencyReadiness: 0,
        riskExposure: 0,
        badges: [],
        gamesPlayed: 0,
        accuracy: 0,
        streak: 0,
        recentMistakes: [],
        netWorthHistory: [],
        scoreHistory: []
    },
    settings: {
        sound: true,
        music: true,
        volume: 70,
        difficulty: 'medium',
        timer: true,
        hints: true,
        theme: 'auto',
        animations: true,
        language: 'en'
    },
    gameProgress: {},
    activityHistory: [],
    isOnline: navigator.onLine
};

// Language Translations
// Language Translations - Now centrally managed in i18n.js
// If I18N is not loaded yet (race condition), provide a safe fallback or wait.
// Since i18n.js is loaded in index.html, it should be available.

// Games Database - Financial Literacy Games
const gamesDatabase = [
    {
        id: 'budget-boss',
        title: () => I18N.t('gameBudgetBossTitle'),
        description: () => I18N.t('gameBudgetBossDesc'),
        icon: '💰',
        category: () => I18N.t('categoryBudgeting'),
        difficulty: 'medium',
        pointsPerGame: 15,
        type: 'drag-drop'
    },
    {
        id: 'savings-sprint',
        title: () => I18N.t('gameSavingsSprintTitle'),
        description: () => I18N.t('gameSavingsSprintDesc'),
        icon: '🌊',
        category: () => I18N.t('categoryDebt'),
        difficulty: 'hard',
        pointsPerGame: 25,
        type: 'simulation'
    },
    {
        id: 'investment-clicker',
        title: () => I18N.t('gameInvestTitle'),
        description: () => I18N.t('gameInvestDesc'),
        icon: '📈',
        category: () => I18N.t('categoryInvesting'),
        difficulty: 'medium',
        pointsPerGame: 18,
        type: 'clicker'
    },
    {
        id: 'credit-card-swipe',
        title: () => I18N.t('gameCreditMasterTitle'),
        description: () => I18N.t('gameCreditMasterDesc'),
        icon: '💳',
        category: () => I18N.t('categoryBanking'),
        difficulty: 'medium',
        pointsPerGame: 14,
        type: 'swipe'
    },
    {
        id: 'money-memory',
        title: () => I18N.t('gameMemoryTitle'),
        description: () => I18N.t('gameMemoryDesc'),
        icon: '🧠',
        category: () => I18N.t('categoryBanking'),
        difficulty: 'easy',
        pointsPerGame: 10,
        type: 'memory'
    },
    {
        id: 'stock-trader',
        title: () => I18N.t('gameStockTraderTitle'),
        description: () => I18N.t('gameStockTraderDesc'),
        icon: '📊',
        category: () => I18N.t('categoryInvesting'),
        difficulty: 'hard',
        pointsPerGame: 20,
        type: 'strategy'
    }
];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Show splash screen
    setTimeout(() => {
        document.getElementById('splashScreen').classList.remove('active');
        initializeApp();
    }, 2500);
});

let appInitialized = false;
function initializeApp() {
    if (appInitialized) return;
    appInitialized = true;
    loadFromLocalStorage();

    // Initialize I18N
    if (window.I18N) {
        // Sync I18N with AppState
        if (AppState.settings && AppState.settings.language) {
            window.I18N.lang = AppState.settings.language;
        }

        // Initial translation update
        window.I18N.updatePage();

        // Update language selector value
        const langSelect = document.getElementById('languageSelect');
        if (langSelect) {
            langSelect.value = window.I18N.lang;
        }
    }

    updateConnectionStatus();
    renderGames();
    updateUI();
    applyTheme(AppState.settings.theme);
    initSoundSystem();
    registerServiceWorker();
    if (typeof initProgressAnalytics === 'function') {
        initProgressAnalytics();
    }

    // Initialize all event listeners
    setupEventListeners();

    // Resume AudioContext on first interaction
    const resumeAudio = async () => {
        await resumeAudioContext();
        if (AppState.settings.music) startBackgroundMusic();
        document.removeEventListener('click', resumeAudio);
        document.removeEventListener('keydown', resumeAudio);
        document.removeEventListener('touchstart', resumeAudio);
    };
    document.addEventListener('click', resumeAudio);
    document.addEventListener('keydown', resumeAudio);
    document.addEventListener('touchstart', resumeAudio);

    // Check online/offline status
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
}

// Local Storage Functions
function saveToLocalStorage() {
    try {
        localStorage.setItem('learnquest_state', JSON.stringify(AppState));
    } catch (e) {
        console.warn('Failed to save to localStorage:', e.message);
    }
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('learnquest_state');
        if (saved) {
            const savedState = JSON.parse(saved);

            // Safety merge: ensure user properties aren't lost if they didn't exist in older versions
            if (savedState.user) {
                savedState.user = { ...AppState.user, ...savedState.user };
            }

            Object.assign(AppState, savedState);
        }
    } catch (e) {
        console.warn('Failed to load from localStorage:', e.message);
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Language Selector
    const langSelect = document.getElementById('languageSelect');
    if (langSelect) {
        langSelect.addEventListener('change', (e) => {
            const newLang = e.target.value;
            if (window.I18N && window.I18N.changeLanguage(newLang)) {
                // Update AppState
                AppState.settings.language = newLang;
                saveToLocalStorage();

                // Notification before reload
                showNotification(window.I18N.t('languageChanged') || `Language changed to ${newLang.toUpperCase()}`, 'success');

                // Reload after short delay to allow notification/save to finish
                setTimeout(() => location.reload(), 1000);
            } else {
                // Fallback if I18N logic fails
                AppState.settings.language = newLang;
                saveToLocalStorage();
                location.reload();
            }
        });
    }

    // Menu Toggle
    // const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuNav = document.getElementById('menuNav');

    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuNav.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }


    menuClose.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);

    // Menu Navigation
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            navigateToPage(page);
            closeMenu();
        });
    });



    // Settings
    document.getElementById('soundToggle').addEventListener('change', (e) => {
        AppState.settings.sound = e.target.checked;
        saveToLocalStorage();
        if (AppState.settings.sound) {
            resumeAudioContext();
            playSound('click');
        }
    });

    document.getElementById('musicToggle').addEventListener('change', (e) => {
        AppState.settings.music = e.target.checked;
        saveToLocalStorage();
        if (AppState.settings.music) {
            resumeAudioContext().then(() => startBackgroundMusic());
        } else {
            stopBackgroundMusic();
        }
    });

    document.getElementById('volumeControl').addEventListener('input', (e) => {
        AppState.settings.volume = e.target.value;
        document.getElementById('volumeValue').textContent = e.target.value + '%';
        saveToLocalStorage();
        updateSoundVolume();
    });

    document.getElementById('difficultySelect').addEventListener('change', (e) => {
        AppState.settings.difficulty = e.target.value;
        saveToLocalStorage();
    });

    document.getElementById('timerToggle').addEventListener('change', (e) => {
        AppState.settings.timer = e.target.checked;
        saveToLocalStorage();
    });

    document.getElementById('hintsToggle').addEventListener('change', (e) => {
        AppState.settings.hints = e.target.checked;
        saveToLocalStorage();
    });

    document.getElementById('themeSelect').addEventListener('change', (e) => {
        AppState.settings.theme = e.target.value;
        saveToLocalStorage();
        applyTheme(AppState.settings.theme);
    });

    // System theme change listener
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (AppState.settings.theme === 'auto') {
            applyTheme('auto');
        }
    });

    document.getElementById('animationsToggle').addEventListener('change', (e) => {
        AppState.settings.animations = e.target.checked;
        saveToLocalStorage();
    });

    document.getElementById('saveSettings').addEventListener('click', () => {
        saveToLocalStorage();
        showNotification('Settings saved successfully!', 'success');
    });

    document.getElementById('resetProgress').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            resetProgress();
        }
    });

    document.getElementById('clearCache').addEventListener('click', () => {
        if (confirm('Clear cache data?')) {
            localStorage.clear();
            showNotification('Cache cleared!', 'success');
            setTimeout(() => location.reload(), 1000);
        }
    });

    // Back to Home from Game
    document.getElementById('backToHome').addEventListener('click', () => {
        stopCurrentGame();
        navigateToPage('home');
    });

    // Avatar & Name Change
    document.getElementById('changeAvatar').addEventListener('click', changeAvatar);
    document.getElementById('editNameBtn').addEventListener('click', changeName);

    // Global Click Sound for interactive elements
    document.addEventListener('click', (e) => {
        const target = e.target;
        // Play click sound if the element is a button, a link, or has a specific interactive class
        if (target.tagName === 'BUTTON' ||
            target.tagName === 'A' ||
            target.closest('.menu-item') ||
            target.closest('.game-card') ||
            target.closest('.setting-item') ||
            target.onclick) {
            playSound('click');
        }
    }, true);
}

function closeMenu() {
    document.getElementById('menuNav').classList.remove('active');
    document.getElementById('menuOverlay').classList.remove('active');
    document.getElementById('menuToggle').classList.remove('active');
}

// Navigation
function navigateToPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    // Show selected page
    document.getElementById(page + 'Page').classList.add('active');

    // Update menu active state
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });

    AppState.currentPage = page;

    // Stop ongoing game if navigating away from gamePlay page
    if (page !== 'gamePlay' && AppState.currentGame) {
        stopCurrentGame();
    }

    // Update page-specific content
    if (page === 'profile') updateProfilePage();
    if (page === 'progress') {
        // Analytics dashboard auto-updates via renderProgressDashboard()
        if (typeof renderProgressDashboard === 'function') {
            renderProgressDashboard();
        }
    }
}

// Render Games
function renderGames() {
    // const gamesGrid = document.getElementById('gamesGrid');
    // gamesGrid.innerHTML = '';
    const gamesGrid = document.getElementById('gamesGrid');
    if (!gamesGrid) {
        console.error("gamesGrid element not found!");
        return;
    }
    gamesGrid.innerHTML = '';


    gamesDatabase.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        gameCard.innerHTML = `
            <div class="game-card-icon">${game.icon}</div>
            <h3 class="game-card-title">${typeof game.title === 'function' ? game.title() : game.title}</h3>
            <p class="game-card-description">${typeof game.description === 'function' ? game.description() : game.description}</p>
            <div class="game-card-stats">
                <span>📚 ${typeof game.category === 'function' ? game.category() : game.category}</span>
                <span>⭐ ${game.pointsPerGame} pts</span>
            </div>
        `;
        gameCard.addEventListener('click', () => loadGame(game));
        gamesGrid.appendChild(gameCard);
    });
}

// Load Game
function loadGame(game) {
    AppState.currentGame = game;
    navigateToPage('gamePlay');
    document.getElementById('gameTitle').textContent = typeof game.title === 'function' ? game.title() : game.title;

    // Clear container
    const container = document.getElementById('gameContainer');
    container.innerHTML = '';

    // Clean up any lingering modals from previous games
    const eduModal = document.getElementById('eduModal');
    if (eduModal) {
        eduModal.remove();
    }

    // Load specific game by ID
    switch (game.id) {
        case 'budget-boss':
            if (typeof loadBudgetBoss === 'function') loadBudgetBoss();
            else console.error('loadBudgetBoss not found');
            break;
        case 'savings-sprint':
            if (typeof loadSavingsSprint === 'function') loadSavingsSprint();
            else console.error('loadSavingsSprint not found');
            break;
        case 'investment-clicker':
            if (typeof loadInvestmentClicker === 'function') loadInvestmentClicker();
            else console.error('loadInvestmentClicker not found');
            break;
        case 'credit-card-swipe':
            if (typeof loadCreditCardSwipe === 'function') loadCreditCardSwipe();
            else console.error('loadCreditCardSwipe not found');
            break;
        case 'money-memory':
            if (typeof loadMoneyMemory === 'function') loadMoneyMemory();
            else console.error('loadMoneyMemory not found');
            break;
        case 'stock-trader':
            if (typeof loadStockTrader === 'function') loadStockTrader();
            else console.error('loadStockTrader not found');
            break;
        default:
            container.innerHTML = '<p>Game not found!</p>';
    }

    startGameTimer();
}

function finishGame(score, maxScore) {
    // Calculate points based on percentage of maxScore
    const percentage = Math.min(1, Math.max(0, score / maxScore));
    const points = Math.round(AppState.currentGame.pointsPerGame * percentage);
    endGame(score, maxScore, points);
}

// Restart Current Game
function restartCurrentGame() {
    if (AppState.currentGame) {
        loadGame(AppState.currentGame);
    } else {
        navigateToPage('home');
    }
}

// Quiz Game
function loadQuizGame(game, container) {
    // Initialize Help System
    setTimeout(() => initHelpSystem('investment'), 100);

    const questions = getQuizQuestions(game.id);
    let currentQuestion = 0;
    let score = 0;
    let gamePoints = 0;

    function renderQuestion() {
        const q = questions[currentQuestion];
        container.innerHTML = `
            <div class="quiz-container">
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((currentQuestion + 1) / questions.length) * 100}%"></div>
                    </div>
                    <p>Question ${currentQuestion + 1} of ${questions.length}</p>
                </div>
                <div class="quiz-question">
                    <h2>${q.question}</h2>
                </div>
                <div class="quiz-options">
                    ${q.options.map((option, index) => `
                        <button class="quiz-option" data-index="${index}">${option}</button>
                    `).join('')}
                </div>
                <div class="quiz-score">Score: ${score}/${questions.length}</div>
            </div>
            <style>
                .quiz-container {
                    max-width: 600px;
                    margin: 0 auto;
                }
                .quiz-progress {
                    margin-bottom: 30px;
                }
                .progress-bar {
                    width: 100%;
                    height: 10px;
                    background: #e2e8f0;
                    border-radius: 5px;
                    overflow: hidden;
                    margin-bottom: 10px;
                }
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #6366f1, #ec4899);
                    transition: width 0.3s;
                }
                .quiz-question {
                    background: #f8fafc;
                    padding: 30px;
                    border-radius: 12px;
                    margin-bottom: 20px;
                }
                .quiz-question h2 {
                    font-size: 22px;
                    color: #1e293b;
                    margin: 0;
                }
                .quiz-options {
                    display: grid;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .quiz-option {
                    padding: 20px;
                    background: white;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s;
                    text-align: left;
                }
                .quiz-option:hover {
                    border-color: #6366f1;
                    transform: translateX(5px);
                }
                .quiz-option.correct {
                    background: #10b981;
                    color: white;
                    border-color: #10b981;
                }
                .quiz-option.incorrect {
                    background: #ef4444;
                    color: white;
                    border-color: #ef4444;
                }
                .quiz-score {
                    text-align: center;
                    font-size: 20px;
                    font-weight: 600;
                    color: #6366f1;
                }
            </style>
        `;

        container.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', () => checkAnswer(btn, q.correct));
        });
    }

    function checkAnswer(button, correctIndex) {
        const selectedIndex = parseInt(button.dataset.index);
        const allButtons = container.querySelectorAll('.quiz-option');

        allButtons.forEach(btn => btn.disabled = true);

        if (selectedIndex === correctIndex) {
            button.classList.add('correct');
            score++;
            gamePoints += game.pointsPerGame;
            playSound('correct');
        } else {
            button.classList.add('incorrect');
            allButtons[correctIndex].classList.add('correct');
            playSound('incorrect');
        }

        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < questions.length) {
                renderQuestion();
            } else {
                endGame(score, questions.length, gamePoints);
            }
        }, 1500);
    }

    renderQuestion();
}

function getQuizQuestions(gameId) {
    const quizData = {
        'tax-time-trivia': [
            { question: 'What is a tax deduction?', options: ['Money you owe', 'Expense that reduces taxable income', 'Type of tax form', 'Penalty fee'], correct: 1 },
            { question: 'When are federal taxes typically due in the US?', options: ['January 1', 'April 15', 'December 31', 'June 30'], correct: 1 },
            { question: 'What is a W-2 form?', options: ['Tax bill', 'Wage and tax statement', 'Loan application', 'Investment document'], correct: 1 },
            { question: 'Which of these is NOT typically tax-deductible?', options: ['Mortgage interest', 'Student loan interest', 'Groceries', 'Charitable donations'], correct: 2 },
            { question: 'What does "tax bracket" mean?', options: ['Total tax paid', 'Income range taxed at specific rate', 'Tax refund amount', 'Filing deadline'], correct: 1 }
        ],
        'crypto-basics': [
            { question: 'What is blockchain?', options: ['A bank', 'Digital ledger technology', 'A cryptocurrency', 'A trading app'], correct: 1 },
            { question: 'Who created Bitcoin?', options: ['Elon Musk', 'Satoshi Nakamoto', 'Vitalik Buterin', 'Jeff Bezos'], correct: 1 },
            { question: 'What does "HODL" mean in crypto?', options: ['Hold On for Dear Life', 'Hold Our Digital Legacy', 'Hope Of Digital Liberty', 'High Order Distribution Level'], correct: 0 },
            { question: 'What is a crypto wallet?', options: ['Bank account', 'Digital storage for cryptocurrency', 'Credit card', 'Investment fund'], correct: 1 },
            { question: 'What makes crypto transactions secure?', options: ['Banks verify them', 'Cryptographic encryption', 'Government backing', 'Physical coins'], correct: 1 }
        ],
        'insurance-wisdom': [
            { question: 'What is a deductible in insurance?', options: ['Monthly payment', 'Amount you pay before insurance covers', 'Maximum coverage', 'Policy number'], correct: 1 },
            { question: 'Which insurance is typically required by law?', options: ['Life insurance', 'Auto insurance', 'Travel insurance', 'Pet insurance'], correct: 1 },
            { question: 'What does term life insurance mean?', options: ['Covers entire life', 'Covers specific time period', 'Only for seniors', 'Investment product'], correct: 1 },
            { question: 'What is a premium?', options: ['Insurance benefit', 'Regular payment for coverage', 'Type of policy', 'Claim amount'], correct: 1 },
            { question: 'Why is health insurance important?', options: ['Free healthcare', 'Tax benefits only', 'Protects from high medical costs', 'Required for all jobs'], correct: 2 }
        ]
    };

    return quizData[gameId] || quizData['tax-time-trivia'];
}

// Finance Terms Memory Match Game
function loadMemoryGame(game, container) {
    // Initialize Help System
    setTimeout(() => initHelpSystem('memory'), 100);

    const termPairs = [
        { term: 'APR', definition: 'Annual Percentage Rate' },
        { term: '401(k)', definition: 'Retirement Savings Plan' },
        { term: 'ROI', definition: 'Return on Investment' },
        { term: 'Credit Score', definition: 'Financial Trust Rating' },
        { term: 'Budget', definition: 'Spending Plan' },
        { term: 'Asset', definition: 'Valuable Property' },
        { term: 'Liability', definition: 'Financial Obligation' },
        { term: 'Equity', definition: 'Ownership Value' }
    ];

    const cards = [];
    termPairs.forEach(pair => {
        cards.push({ content: pair.term, type: 'term', match: pair.definition });
        cards.push({ content: pair.definition, type: 'definition', match: pair.term });
    });

    cards.sort(() => Math.random() - 0.5);

    let flipped = [];
    let matched = [];
    let moves = 0;
    let gamePoints = 0;

    container.innerHTML = `
        <div class="memory-container">
            <h2>Match Financial Terms with Meanings!</h2>
            <div class="memory-stats">
                <span>Moves: <strong id="moves">0</strong></span>
                <span>Matched: <strong id="matched">0</strong>/${termPairs.length}</span>
            </div>
            <div class="memory-grid-finance" id="memoryGrid"></div>
        </div>
        <style>
            .memory-container {
                max-width: 900px;
                margin: 0 auto;
            }
            .memory-container h2 {
                text-align: center;
                color: #6366f1;
                margin-bottom: 20px;
            }
            .memory-stats {
                display: flex;
                justify-content: space-around;
                margin-bottom: 30px;
                font-size: 18px;
            }
            .memory-grid-finance {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 15px;
            }
            .memory-card {
                min-height: 120px;
                background: linear-gradient(135deg, #6366f1, #4f46e5);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
                position: relative;
                padding: 15px;
                text-align: center;
                color: white;
            }
            .memory-card:hover {
                transform: scale(1.05);
            }
            .memory-card.flipped {
                background: white;
                border: 3px solid #6366f1;
                color: #1e293b;
            }
            .memory-card.matched {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                cursor: default;
            }
            .memory-card:not(.flipped) .card-content {
                display: none;
            }
            .memory-card .card-back {
                display: block;
            }
            .memory-card.flipped .card-back {
                display: none;
            }
            @media (max-width: 768px) {
                .memory-grid-finance {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        </style>
    `;

    const grid = container.querySelector('#memoryGrid');

    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'memory-card';
        cardElement.dataset.index = index;
        cardElement.innerHTML = `
            <div class="card-back">💰</div>
            <div class="card-content">${card.content}</div>
        `;
        cardElement.addEventListener('click', () => flipCard(cardElement, card, index));
        grid.appendChild(cardElement);
    });

    function flipCard(cardElement, card, index) {
        if (flipped.length === 2 || cardElement.classList.contains('flipped') || matched.includes(index)) return;

        cardElement.classList.add('flipped');
        flipped.push({ cardElement, card, index });

        if (flipped.length === 2) {
            moves++;
            document.getElementById('moves').textContent = moves;

            const card1 = flipped[0].card;
            const card2 = flipped[1].card;

            if ((card1.content === card2.match) || (card2.content === card1.match)) {
                matched.push(flipped[0].index, flipped[1].index);
                flipped[0].cardElement.classList.add('matched');
                flipped[1].cardElement.classList.add('matched');
                document.getElementById('matched').textContent = matched.length / 2;
                playSound('correct');
                gamePoints += game.pointsPerGame;

                if (matched.length === cards.length) {
                    setTimeout(() => endGame(termPairs.length, termPairs.length, gamePoints), 500);
                }

                flipped = [];
            } else {
                playSound('incorrect');
                setTimeout(() => {
                    flipped[0].cardElement.classList.remove('flipped');
                    flipped[1].cardElement.classList.remove('flipped');
                    flipped = [];
                }, 1500);
            }
        }
    }
}

// // Memory Match Game
// function loadMemoryGame(game, container) {
//     const symbols = ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🥝', '🍒'];
//     const cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
//     let flipped = [];
//     let matched = [];
//     let moves = 0;
//     let gamePoints = 0;

//     container.innerHTML = `
//         <div class="memory-container">
//             <h2>Match the Pairs!</h2>
//             <div class="memory-stats">
//                 <span>Moves: <strong id="moves">0</strong></span>
//                 <span>Matched: <strong id="matched">0</strong>/${symbols.length}</span>
//             </div>
//             <div class="memory-grid" id="memoryGrid"></div>
//         </div>
//         <style>
//             .memory-container {
//                 max-width: 600px;
//                 margin: 0 auto;
//             }
//             .memory-container h2 {
//                 text-align: center;
//                 color: #6366f1;
//                 margin-bottom: 20px;
//             }
//             .memory-stats {
//                 display: flex;
//                 justify-content: space-around;
//                 margin-bottom: 30px;
//                 font-size: 18px;
//             }
//             .memory-grid {
//                 display: grid;
//                 grid-template-columns: repeat(4, 1fr);
//                 gap: 15px;
//             }
//             .memory-card {
//                 aspect-ratio: 1;
//                 background: #6366f1;
//                 border-radius: 12px;
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 font-size: 40px;
//                 cursor: pointer;
//                 transition: all 0.3s;
//                 position: relative;
//             }
//             .memory-card:hover {
//                 transform: scale(1.05);
//             }
//             .memory-card.flipped {
//                 background: white;
//                 border: 2px solid #6366f1;
//             }
//             .memory-card.matched {
//                 background: #10b981;
//                 cursor: default;
//             }
//             .memory-card:not(.flipped) .card-content {
//                 display: none;
//             }
//         </style>
//     `;

//     const grid = container.querySelector('#memoryGrid');

//     cards.forEach((symbol, index) => {
//         const card = document.createElement('div');
//         card.className = 'memory-card';
//         card.dataset.index = index;
//         card.innerHTML = `<div class="card-content">${symbol}</div>`;
//         card.addEventListener('click', () => flipCard(card, symbol, index));
//         grid.appendChild(card);
//     });

//     function flipCard(card, symbol, index) {
//         if (flipped.length === 2 || card.classList.contains('flipped') || matched.includes(index)) return;

//         card.classList.add('flipped');
//         flipped.push({ card, symbol, index });

//         if (flipped.length === 2) {
//             moves++;
//             document.getElementById('moves').textContent = moves;

//             if (flipped[0].symbol === flipped[1].symbol) {
//                 matched.push(flipped[0].index, flipped[1].index);
//                 flipped[0].card.classList.add('matched');
//                 flipped[1].card.classList.add('matched');
//                 document.getElementById('matched').textContent = matched.length / 2;
//                 playSound('correct');
//                 gamePoints += game.pointsPerGame;

//                 if (matched.length === cards.length) {
//                     setTimeout(() => endGame(symbols.length, symbols.length, gamePoints), 500);
//                 }

//                 flipped = [];
//             } else {
//                 playSound('incorrect');
//                 setTimeout(() => {
//                     flipped[0].card.classList.remove('flipped');
//                     flipped[1].card.classList.remove('flipped');
//                     flipped = [];
//                 }, 1000);
//             }
//         }
//     }
// }

// Budget Boss - Monthly Budgeting Simulation
function loadSimulationGame(game, container) {
    if (game.id === 'budget-boss') {
        loadBudgetBossGame(game, container);
    } else if (game.id === 'emergency-fund-builder') {
        loadEmergencyFundGame(game, container);
    } else if (game.id === 'stock-market-simulator') {
        loadStockMarketGame(game, container);
    }
}

// Budget Boss Game - Multi-Level Survival Challenge
function loadBudgetBossGame(game, container) {
    // Initialize Help System
    setTimeout(() => initHelpSystem('budget'), 100);

    // Game Configuration
    const LEVELS = {
        beginner: { days: 10, budget: 1500, scenarios: 1, label: "10 Days", desc: "Beginner - Manage $1,500 for 10 days", color: "#10b981" },
        intermediate: { days: 15, budget: 2100, scenarios: 2, label: "15 Days", desc: "Intermediate - Stretch $2,100 for 15 days", color: "#f59e0b" },
        advanced: { days: 30, budget: 3600, scenarios: 2, label: "30 Days", desc: "Advanced - Survive 30 days on $3,600", color: "#ef4444" }
    };

    // Comprehensive Scenario Pool
    const SCENARIOS = [
        // Essential Expenses (20 scenarios)
        {
            cat: 'essential', title: '🏠 Rent Payment Due', desc: 'Your monthly rent is due today.', choices: [
                { text: 'Pay full rent ($400)', cost: 400, feedback: 'Rent paid on time! 🏠' },
                { text: 'Ask landlord for extension', cost: 0, feedback: 'Risky move, may affect relationship ⚠️' }
            ]
        },
        {
            cat: 'essential', title: '🛒 Grocery Shopping', desc: 'You need food for the week.', choices: [
                { text: 'Full grocery trip ($80)', cost: 80, feedback: 'Well stocked for the week! 🛒' },
                { text: 'Budget shopping ($50)', cost: 50, feedback: 'Smart budgeting! 💰' },
                { text: 'Skip this week', cost: 0, feedback: 'Not sustainable long-term ⚠️' }
            ]
        },
        {
            cat: 'essential', title: '💡 Electricity Bill', desc: 'Monthly electricity bill arrived.', choices: [
                { text: 'Pay bill ($60)', cost: 60, feedback: 'Lights stay on! 💡' },
                { text: 'Delay payment', cost: 0, feedback: 'Late fees may apply ⚠️' }
            ]
        },
        {
            cat: 'essential', title: '🚗 Gas for Car', desc: 'Car fuel tank is almost empty.', choices: [
                { text: 'Fill tank ($50)', cost: 50, feedback: 'Car ready to go! 🚗' },
                { text: 'Half tank ($25)', cost: 25, feedback: 'Enough for now 👍' }
            ]
        },
        {
            cat: 'essential', title: '📱 Phone Bill', desc: 'Monthly phone bill is due.', choices: [
                { text: 'Pay bill ($45)', cost: 45, feedback: 'Connected! 📱' },
                { text: 'Skip this month', cost: 0, feedback: 'Service may be disconnected ⚠️' }
            ]
        },
        {
            cat: 'essential', title: '🍞 Basic Groceries', desc: 'Need bread, milk, basics.', choices: [
                { text: 'Buy essentials ($30)', cost: 30, feedback: 'Basics covered! 🍞' },
                { text: 'Make do with what you have', cost: 0, feedback: 'Creative cooking! 👨‍🍳' }
            ]
        },
        {
            cat: 'essential', title: '🧼 Household Supplies', desc: 'Running low on cleaning supplies.', choices: [
                { text: 'Restock ($25)', cost: 25, feedback: 'Clean home! 🧼' },
                { text: 'Wait until next week', cost: 0, feedback: 'Can manage for now 👍' }
            ]
        },
        {
            cat: 'essential', title: '💊 Prescription Refill', desc: 'Monthly prescription needs refilling.', choices: [
                { text: 'Fill prescription ($35)', cost: 35, feedback: 'Health first! 💊' },
                { text: 'Stretch current supply', cost: 0, feedback: 'Not recommended ⚠️' }
            ]
        },
        {
            cat: 'essential', title: '🚌 Transport Pass', desc: 'Weekly bus pass expired.', choices: [
                { text: 'Buy weekly pass ($20)', cost: 20, feedback: 'Convenient travel! 🚌' },
                { text: 'Pay per ride', cost: 25, feedback: 'Costs more overall 💸' }
            ]
        },
        {
            cat: 'essential', title: '🧺 Laundry Day', desc: 'Clothes need washing.', choices: [
                { text: 'Laundromat ($12)', cost: 12, feedback: 'Fresh clothes! 👕' },
                { text: 'Hand wash at home ($2)', cost: 2, feedback: 'Budget-friendly choice! 💰' }
            ]
        },

        // Emergencies (15 scenarios)
        {
            cat: 'emergency', title: '🏥 Sudden Illness', desc: 'Persistent headache and fever.', choices: [
                { text: 'Visit doctor ($80)', cost: 80, feedback: 'Getting proper care! 🏥' },
                { text: 'Buy OTC medicine ($15)', cost: 15, feedback: 'Hope it helps! 💊' },
                { text: 'Rest and wait', cost: 0, feedback: 'Risky for health ⚠️' }
            ]
        },
        {
            cat: 'emergency', title: '🔧 Car Breakdown', desc: 'Car won\'t start!', choices: [
                { text: 'Call mechanic ($120)', cost: 120, feedback: 'Back on the road! 🚗' },
                { text: 'Public transport ($40)', cost: 40, feedback: 'Temporary solution 🚌' },
                { text: 'Ask friend for rides', cost: 0, feedback: 'Can\'t rely on this forever ⚠️' }
            ]
        },
        {
            cat: 'emergency', title: '🦷 Dental Pain', desc: 'Sudden toothache!', choices: [
                { text: 'Emergency dentist ($150)', cost: 150, feedback: 'Expensive but necessary! 🦷' },
                { text: 'Pain medication ($12)', cost: 12, feedback: 'Temporary relief only ⚠️' }
            ]
        },
        {
            cat: 'emergency', title: '💻 Laptop Crash', desc: 'Laptop won\'t turn on (needed for school/work).', choices: [
                { text: 'Repair shop ($100)', cost: 100, feedback: 'Working again! 💻' },
                { text: 'Use library computers', cost: 0, feedback: 'Inconvenient but free 📚' }
            ]
        },
        {
            cat: 'emergency', title: '🚨 Lost Wallet', desc: 'Need to replace ID and cards.', choices: [
                { text: 'Replace everything ($50)', cost: 50, feedback: 'All sorted! 🆔' },
                { text: 'Just essentials ($25)', cost: 25, feedback: 'Minimum covered 👍' }
            ]
        },
        {
            cat: 'emergency', title: '💧 Plumbing Emergency', desc: 'Pipe leak in apartment!', choices: [
                { text: 'Emergency plumber ($90)', cost: 90, feedback: 'Fixed! 💧' },
                { text: 'DIY temporary fix ($15)', cost: 15, feedback: 'Holding for now 🔧' }
            ]
        },
        {
            cat: 'emergency', title: '📱 Phone Screen Cracked', desc: 'Dropped phone, screen shattered.', choices: [
                { text: 'Repair screen ($85)', cost: 85, feedback: 'Good as new! 📱' },
                { text: 'Use as-is with protector ($10)', cost: 10, feedback: 'Functional at least 👍' }
            ]
        },
        {
            cat: 'emergency', title: '🐱 Pet Emergency', desc: 'Pet seems unwell.', choices: [
                { text: 'Emergency vet ($200)', cost: 200, feedback: 'Pet health matters! 🐱' },
                { text: 'Wait and monitor', cost: 0, feedback: 'Concerning ⚠️' }
            ]
        },
        {
            cat: 'emergency', title: '🔑 Locked Out', desc: 'Lost apartment keys!', choices: [
                { text: 'Locksmith ($75)', cost: 75, feedback: 'Back home! 🔑' },
                { text: 'Wait for roommate', cost: 0, feedback: 'Hours wasted ⏰' }
            ]
        },
        {
            cat: 'emergency', title: '👓 Broke Glasses', desc: 'Glasses prescription needed for daily life.', choices: [
                { text: 'Replace glasses ($120)', cost: 120, feedback: 'Can see clearly! 👓' },
                { text: 'Repair with tape ($0)', cost: 0, feedback: 'Temporary fix ⚠️' }
            ]
        },

        // Opportunities (12 scenarios)
        {
            cat: 'opportunity', title: '💼 Freelance Gig', desc: 'Friend offers one-day freelance work.', choices: [
                { text: 'Take the job (+$100)', cost: -100, feedback: 'Extra income earned! 💰' },
                { text: 'Decline', cost: 0, feedback: 'Maybe next time 👍' }
            ]
        },
        {
            cat: 'opportunity', title: '⏰ Overtime Work', desc: 'Boss offers overtime hours.', choices: [
                { text: 'Work overtime (+$80)', cost: -80, feedback: 'Extra money! 💵' },
                { text: 'Decline, need rest', cost: 0, feedback: 'Self-care is important 💆' }
            ]
        },
        {
            cat: 'opportunity', title: '📚 Tutoring Offer', desc: 'Student needs help with subject you excel in.', choices: [
                { text: 'Tutor for payment (+$60)', cost: -60, feedback: 'Helping and earning! 📚' },
                { text: 'Too busy', cost: 0, feedback: 'Time is valuable too ⏰' }
            ]
        },
        {
            cat: 'opportunity', title: '🎨 Sell Unused Items', desc: 'Could sell old electronics online.', choices: [
                { text: 'List and sell (+$90)', cost: -90, feedback: 'Declutter and profit! 💰' },
                { text: 'Keep items', cost: 0, feedback: 'Might need later 🤔' }
            ]
        },
        {
            cat: 'opportunity', title: '🐕 Dog Walking Job', desc: 'Neighbor needs regular dog walker.', choices: [
                { text: 'Accept job (+$50/week)', cost: -50, feedback: 'Fun and profitable! 🐕' },
                { text: 'No time', cost: 0, feedback: 'Fair enough ⏰' }
            ]
        },
        {
            cat: 'opportunity', title: '💳 Cashback Redemption', desc: 'Have accumulated rewards points.', choices: [
                { text: 'Redeem for cash (+$40)', cost: -40, feedback: 'Free money! 💰' },
                { text: 'Save for later', cost: 0, feedback: 'Building rewards 📈' }
            ]
        },
        {
            cat: 'opportunity', title: '🌱 Sell Homemade Crafts', desc: 'Friend suggests selling your crafts.', choices: [
                { text: 'Set up online shop (+$70)', cost: -70, feedback: 'Creative income! 🎨' },
                { text: 'Just a hobby', cost: 0, feedback: 'Keep it fun 😊' }
            ]
        },
        {
            cat: 'opportunity', title: '🚗 Rideshare Driver', desc: 'Could drive for rideshare on weekends.', choices: [
                { text: 'Sign up and drive (+$120)', cost: -120, feedback: 'Good side hustle! 🚗' },
                { text: 'Not interested', cost: 0, feedback: 'Understandable 👍' }
            ]
        },
        {
            cat: 'opportunity', title: '📦 Return Unused Purchase', desc: 'Remembered unused item with receipt.', choices: [
                { text: 'Return for refund (+$55)', cost: -55, feedback: 'Money back! 💵' },
                { text: 'Keep it', cost: 0, feedback: 'Might use someday 🤷' }
            ]
        },
        {
            cat: 'opportunity', title: '🎯 Participate in Study', desc: 'University study pays participants.', choices: [
                { text: 'Join study (+$75)', cost: -75, feedback: 'Easy money! 🧪' },
                { text: 'Pass', cost: 0, feedback: 'Privacy matters 🔒' }
            ]
        },

        // Social (10 scenarios)
        {
            cat: 'social', title: '🎂 Friend\'s Birthday', desc: 'Best friend\'s birthday party.', choices: [
                { text: 'Gift + attend ($50)', cost: 50, feedback: 'Good friend! 🎁' },
                { text: 'Attend, homemade gift ($10)', cost: 10, feedback: 'Thoughtful! 💝' },
                { text: 'Decline', cost: 0, feedback: 'They\'ll understand... 😔' }
            ]
        },
        {
            cat: 'social', title: '☕ Coffee with Friends', desc: 'Friends want to meet at café.', choices: [
                { text: 'Join them ($15)', cost: 15, feedback: 'Social time! ☕' },
                { text: 'Suggest park instead', cost: 0, feedback: 'Budget-friendly hangout! 🌳' }
            ]
        },
        {
            cat: 'social', title: '🍕 Pizza Night', desc: 'Roommates ordering pizza.', choices: [
                { text: 'Split cost ($12)', cost: 12, feedback: 'Fun night! 🍕' },
                { text: 'Cook own meal', cost: 0, feedback: 'Healthy choice! 🥗' }
            ]
        },
        {
            cat: 'social', title: '🎬 Movie Night Out', desc: 'Friends going to new movie.', choices: [
                { text: 'Join ($18)', cost: 18, feedback: 'Great movie! 🎬' },
                { text: 'Stream at home', cost: 0, feedback: 'Cheaper option! 📺' }
            ]
        },
        {
            cat: 'social', title: '💝 Date Invitation', desc: 'Someone asked you out.', choices: [
                { text: 'Nice restaurant ($40)', cost: 40, feedback: 'Romantic! 💕' },
                { text: 'Coffee date ($12)', cost: 12, feedback: 'Budget-friendly! ☕' },
                { text: 'Decline politely', cost: 0, feedback: 'Maybe next time 🙂' }
            ]
        },
        {
            cat: 'social', title: '🎮 Gaming Night', desc: 'Friends buying new multiplayer game.', choices: [
                { text: 'Buy game ($30)', cost: 30, feedback: 'Join the fun! 🎮' },
                { text: 'Play free games', cost: 0, feedback: 'F2P for the win! 🕹️' }
            ]
        },
        {
            cat: 'social', title: '🎵 Concert Tickets', desc: 'Favorite band coming to town.', choices: [
                { text: 'Buy ticket ($60)', cost: 60, feedback: 'Amazing concert! 🎵' },
                { text: 'Skip it', cost: 0, feedback: 'FOMO but budget-wise 💸' }
            ]
        },
        {
            cat: 'social', title: '🎳 Bowling with Coworkers', desc: 'Team building night.', choices: [
                { text: 'Participate ($25)', cost: 25, feedback: 'Work relationships! 🎳' },
                { text: 'Excuse yourself', cost: 0, feedback: 'Need personal time 🏠' }
            ]
        },
        {
            cat: 'social', title: '🍽️ Potluck Invitation', desc: 'Invited to potluck dinner.', choices: [
                { text: 'Bring nice dish ($20)', cost: 20, feedback: 'Everyone loved it! 👨‍🍳' },
                { text: 'Simple contribution ($8)', cost: 8, feedback: 'It\'s the thought! 💭' }
            ]
        },
        {
            cat: 'social', title: '🏃 Charity Run', desc: 'Friends doing charity 5K run.', choices: [
                { text: 'Register ($30)', cost: 30, feedback: 'Good cause! 🏃' },
                { text: 'Donate smaller amount ($10)', cost: 10, feedback: 'Still helping! 💝' },
                { text: 'Skip', cost: 0, feedback: 'Next time maybe 🤷' }
            ]
        },

        // Temptations (10 scenarios)
        {
            cat: 'temptation', title: '🛍️ Flash Sale', desc: 'Favorite store: 50% off everything!', choices: [
                { text: 'Shop ($70)', cost: 70, feedback: 'Impulse buy! 💸' },
                { text: 'Window shop only', cost: 0, feedback: 'Strong willpower! 💪' }
            ]
        },
        {
            cat: 'temptation', title: '📱 New Phone Release', desc: 'Latest smartphone just launched.', choices: [
                { text: 'Pre-order ($500)', cost: 500, feedback: 'Budget killer! ⚠️' },
                { text: 'Current phone works fine', cost: 0, feedback: 'Smart decision! 🧠' }
            ]
        },
        {
            cat: 'temptation', title: '🍔 Food Delivery', desc: 'Too tired to cook, craving takeout.', choices: [
                { text: 'Order delivery ($25)', cost: 25, feedback: 'Convenient but pricey 🍔' },
                { text: 'Make simple meal', cost: 0, feedback: 'Healthy and cheap! 🥗' }
            ]
        },
        {
            cat: 'temptation', title: '👟 Sneaker Drop', desc: 'Limited edition sneakers released.', choices: [
                { text: 'Buy ($150)', cost: 150, feedback: 'Cool shoes, hurt wallet! 👟' },
                { text: 'Resist', cost: 0, feedback: 'Financial discipline! 💪' }
            ]
        },
        {
            cat: 'temptation', title: '🎯 Online Shopping', desc: 'Browsing and cart is full.', choices: [
                { text: 'Complete purchase ($85)', cost: 85, feedback: 'Retail therapy 💳' },
                { text: 'Clear cart', cost: 0, feedback: 'Dodged that bullet! 🎯' }
            ]
        },
        {
            cat: 'temptation', title: '☕ Daily Coffee Habit', desc: 'Fancy coffee shop temptation.', choices: [
                { text: 'Specialty coffee ($6/day)', cost: 30, feedback: 'Adds up fast! ☕' },
                { text: 'Home brew', cost: 0, feedback: 'Huge savings! 💰' }
            ]
        },
        {
            cat: 'temptation', title: '🎮 Gaming Console', desc: 'Console on sale.', choices: [
                { text: 'Buy console ($400)', cost: 400, feedback: 'Impulse purchase! 🎮' },
                { text: 'Save your money', cost: 0, feedback: 'Wise restraint! 🧠' }
            ]
        },
        {
            cat: 'temptation', title: '🍰 Dessert Delivery', desc: 'Sweet cravings hit hard.', choices: [
                { text: 'Order treats ($20)', cost: 20, feedback: 'Sweet but expensive! 🍰' },
                { text: 'Snack at home', cost: 0, feedback: 'Healthier choice! 🍎' }
            ]
        },
        {
            cat: 'temptation', title: '📚 Book Sale', desc: 'Bookstore having massive sale.', choices: [
                { text: 'Buy 5 books ($45)', cost: 45, feedback: 'Reading list grows! 📚' },
                { text: 'Use library', cost: 0, feedback: 'Free reading! 📖' }
            ]
        },
        {
            cat: 'temptation', title: '💄 Beauty Products', desc: 'New skincare line launch.', choices: [
                { text: 'Full set ($95)', cost: 95, feedback: 'Self-care or splurge? 💄' },
                { text: 'Stick with current routine', cost: 0, feedback: 'Smart budgeting! 💰' }
            ]
        }
    ];

    // Game State
    let gameState = {
        level: null,
        currentDay: 1,
        budget: 0,
        totalDays: 0,
        decisionsLog: [],
        usedScenarios: []
    };

    // Show Level Selection
    showLevelSelection();

    function showLevelSelection() {
        container.innerHTML = `
            <div class="bb-level-selection">
                <h2>💰 Budget Boss Challenge</h2>
                <p class="bb-intro">Can you survive and become a Budget Boss? Choose your difficulty:</p>
                <div class="bb-level-cards">
                    ${Object.entries(LEVELS).map(([key, level]) => `
                        <div class="bb-level-card" data-level="${key}" style="border-color: ${level.color}">
                            <div class="bb-level-badge" style="background: ${level.color}">${level.label}</div>
                            <h3>${level.desc.split(' - ')[0]}</h3>
                            <div class="bb-level-details">
                                <div class="bb-detail">
                                    <span class="bb-icon">💵</span>
                                    <span>$${level.budget.toLocaleString()}</span>
                                </div>
                                <div class="bb-detail">
                                    <span class="bb-icon">📅</span>
                                    <span>${level.days} days</span>
                                </div>
                                <div class="bb-detail">
                                    <span class="bb-icon">⚡</span>
                                    <span>~$${Math.round(level.budget / level.days)}/day</span>
                                </div>
                            </div>
                            <button class="bb-select-btn" style="background: ${level.color}">Start Challenge</button>
                        </div>
                    `).join('')}
                </div>
            </div>
            <style>
                .bb-level-selection { max-width: 900px; margin: 0 auto; text-align: center; }
                .bb-level-selection h2 { font-size: 36px; color: var(--primary-color); margin-bottom: 10px; text-shadow: 0 0 10px rgba(99, 102, 241, 0.3); }
                .bb-intro { color: var(--text-secondary); font-size: 18px; margin-bottom: 40px; }
                .bb-level-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 25px; }
                .bb-level-card { 
                    background: var(--card-bg); 
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 2px solid var(--border-color); 
                    border-radius: 16px; 
                    padding: 25px; 
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
                    cursor: pointer; 
                }
                .bb-level-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-xl); border-color: var(--primary-color); }
                .bb-level-badge { display: inline-block; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 700; margin-bottom: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
                .bb-level-card h3 { color: var(--text-primary); font-size: 20px; margin-bottom: 20px; }
                .bb-level-details { margin-bottom: 25px; }
                .bb-detail { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 12px 0; font-size: 16px; color: var(--text-secondary); }
                .bb-icon { font-size: 20px; }
                .bb-select-btn { width: 100%; padding: 14px; color: white; border: none; border-radius: 12px; font-size: 16px; font-weight: 600; cursor: pointer; transition: 0.3s; box-shadow: var(--shadow-sm); }
                .bb-select-btn:hover { opacity: 0.95; transform: scale(1.02); box-shadow: var(--shadow-md); }
            </style>
        `;

        container.querySelectorAll('.bb-level-card').forEach(card => {
            card.addEventListener('click', () => {
                const levelKey = card.dataset.level;
                startGame(levelKey);
            });
        });
    }

    function startGame(levelKey) {
        const level = LEVELS[levelKey];
        gameState = {
            level: levelKey,
            currentDay: 1,
            budget: level.budget,
            totalDays: level.days,
            decisionsLog: [],
            usedScenarios: []
        };
        showGameplay();
    }

    function showGameplay() {
        const level = LEVELS[gameState.level];
        const budgetPercent = Math.min(100, (gameState.budget / level.budget) * 100);
        const budgetColor = budgetPercent > 60 ? 'var(--success-color)' : budgetPercent > 30 ? 'var(--warning-color)' : 'var(--danger-color)';

        // Select random scenario
        const availableScenarios = SCENARIOS.filter(s => !gameState.usedScenarios.includes(s));
        if (availableScenarios.length === 0) gameState.usedScenarios = []; // Reset if all used
        const scenario = availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
        gameState.usedScenarios.push(scenario);

        container.innerHTML = `
            <div class="bb-gameplay">
                <div class="bb-game-header">
                    <div class="bb-day-counter">
                        <span class="bb-day-label">Day</span>
                        <span class="bb-day-number">${gameState.currentDay}/${gameState.totalDays}</span>
                    </div>
                    <div class="bb-budget-display">
                        <div class="bb-budget-label">Remaining Budget</div>
                        <div class="bb-budget-amount">$${gameState.budget.toLocaleString()}</div>
                        <div class="bb-budget-bar">
                            <div class="bb-budget-fill" style="width: ${budgetPercent}%; background: ${budgetColor}"></div>
                        </div>
                    </div>
                </div>

                <div class="bb-scenario-card">
                    <div class="bb-scenario-icon">${scenario.title.split(' ')[0]}</div>
                    <h3 class="bb-scenario-title">${scenario.title.substring(scenario.title.indexOf(' ') + 1)}</h3>
                    <p class="bb-scenario-desc">${scenario.desc}</p>
                    <div class="bb-choices">
                        ${scenario.choices.map((choice, idx) => `
                            <button class="bb-choice-btn" data-index="${idx}">
                                <span class="bb-choice-text">${choice.text}</span>
                                <span class="bb-choice-cost ${choice.cost <= 0 ? 'positive' : 'negative'}">
                                    ${choice.cost > 0 ? '-' : '+'}$${Math.abs(choice.cost)}
                                </span>
                            </button>
                        `).join('')}
                    </div>
                </div>

                ${gameState.decisionsLog.length > 0 ? `
                    <div class="bb-history">
                        <h4>Recent Decisions</h4>
                        <div class="bb-history-list">
                            ${gameState.decisionsLog.slice(-3).reverse().map(d => `
                                <div class="bb-history-item">
                                    <span>Day ${d.day}: ${d.title}</span>
                                    <span class="${d.cost <= 0 ? 'positive' : 'negative'}">${d.cost > 0 ? '-' : '+'}$${Math.abs(d.cost)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
            <style>
                .bb-gameplay { max-width: 700px; margin: 0 auto; }
                .bb-game-header { background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); color: white; padding: 30px; border-radius: 20px; margin-bottom: 30px; box-shadow: var(--shadow-lg); }
                .bb-day-counter { text-align: center; margin-bottom: 25px; }
                .bb-day-label { font-size: 14px; opacity: 0.9; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 5px; }
                .bb-day-number { font-size: 36px; font-weight: 800; }
                .bb-budget-label { font-size: 14px; opacity: 0.9; margin-bottom: 8px; text-align: center; }
                .bb-budget-amount { font-size: 40px; font-weight: 800; text-align: center; margin-bottom: 15px; }
                .bb-budget-bar { background: rgba(255,255,255,0.2); height: 14px; border-radius: 10px; overflow: hidden; backdrop-filter: blur(4px); }
                .bb-budget-fill { height: 100%; transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); border-radius: 10px; box-shadow: 0 0 10px rgba(255,255,255,0.2); }
                .bb-scenario-card { 
                    background: var(--card-bg); 
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid var(--border-color);
                    border-radius: 20px; 
                    padding: 35px; 
                    box-shadow: var(--shadow-lg); 
                    margin-bottom: 25px; 
                    animation: bbSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1); 
                }
                @keyframes bbSlideIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                .bb-scenario-icon { font-size: 64px; text-align: center; margin-bottom: 20px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1)); }
                .bb-scenario-title { font-size: 26px; color: var(--text-primary); text-align: center; margin-bottom: 12px; font-weight: 700; }
                .bb-scenario-desc { font-size: 17px; color: var(--text-secondary); text-align: center; margin-bottom: 30px; line-height: 1.6; }
                .bb-choices { display: flex; flex-direction: column; gap: 14px; }
                .bb-choice-btn { 
                    background: var(--bg-tertiary); 
                    border: 2px solid var(--border-color); 
                    border-radius: 14px; 
                    padding: 20px; 
                    cursor: pointer; 
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                }
                .bb-choice-btn:hover { background: var(--card-bg); border-color: var(--primary-color); transform: translateX(8px); box-shadow: var(--shadow-md); }
                .bb-choice-text { font-size: 16px; color: var(--text-primary); font-weight: 600; }
                .bb-choice-cost { font-size: 18px; font-weight: 800; }
                .bb-choice-cost.positive { color: var(--success-color); }
                .bb-choice-cost.negative { color: var(--danger-color); }
                .bb-history { background: var(--bg-tertiary); border-radius: 16px; padding: 25px; border: 1px solid var(--border-color); }
                .bb-history h4 { color: var(--text-secondary); margin-bottom: 15px; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 700; }
                .bb-history-list { display: flex; flex-direction: column; gap: 10px; }
                .bb-history-item { display: flex; justify-content: space-between; font-size: 14px; color: var(--text-primary); padding: 8px 0; border-bottom: 1px solid var(--border-color); }
                .bb-history-item:last-child { border-bottom: none; }
                .bb-history-item .positive { color: var(--success-color); font-weight: 700; }
                .bb-history-item .negative { color: var(--danger-color); font-weight: 700; }
                @media (max-width: 768px) {
                    .bb-choice-btn { flex-direction: column; gap: 8px; text-align: center; padding: 15px; }
                }
            </style>
        `;

        container.querySelectorAll('.bb-choice-btn').forEach((btn, idx) => {
            btn.addEventListener('click', () => makeDecision(scenario, scenario.choices[idx]));
        });
    }

    function makeDecision(scenario, choice) {
        // Find the optimal choice based on category
        let optimalChoice = scenario.choices[0];

        if (scenario.cat === 'opportunity') {
            // For opportunities, the lowest cost (most negative) is best
            scenario.choices.forEach(c => {
                if (c.cost < optimalChoice.cost) optimalChoice = c;
            });
        } else if (scenario.cat === 'social' || scenario.cat === 'temptation') {
            // For discretionary spending, lowest cost is usually best
            scenario.choices.forEach(c => {
                if (c.cost < optimalChoice.cost) optimalChoice = c;
            });
        } else {
            // For essentials/emergencies, skipping ($0) is often bait/risky.
            // We only count it as a mistake if there's a strictly cheaper way to accomplish the SAME goal.
            // For now, let's treat essentials as "Always OK" to spend on.
            optimalChoice = choice;
        }

        // Log if it's a mistake (only for discretionary or missed income)
        if (choice.cost > optimalChoice.cost) {
            const loss = (choice.cost - optimalChoice.cost);
            AppState.user.recentMistakes.unshift({
                game: 'Budget Boss',
                category: scenario.cat,
                title: scenario.title,
                choice: choice.text,
                smarterChoice: optimalChoice.text,
                pointsLoss: loss,
                moneyLoss: loss * 500,
                date: new Date().toISOString()
            });
            if (AppState.user.recentMistakes.length > 10) AppState.user.recentMistakes.pop();
        }

        // Update budget
        gameState.budget -= choice.cost;

        // Log decision
        gameState.decisionsLog.push({
            day: gameState.currentDay,
            title: scenario.title,
            choice: choice.text,
            cost: choice.cost
        });

        // Show feedback
        showDecisionFeedback(choice, () => {
            // Check lose condition
            if (gameState.budget <= 0) {
                showGameOver();
                return;
            }

            // Check win condition
            if (gameState.currentDay >= gameState.totalDays) {
                showVictory();
                return;
            }

            // Next day
            gameState.currentDay++;
            showGameplay();
        });
    }

    function showDecisionFeedback(choice, callback) {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'bb-feedback-overlay';
        feedbackDiv.innerHTML = `
            <div class="bb-feedback-card">
                <div class="bb-feedback-icon">${choice.cost > 0 ? '💸' : '💰'}</div>
                <p class="bb-feedback-text">${choice.feedback}</p>
                <div class="bb-feedback-amount ${choice.cost <= 0 ? 'positive' : 'negative'}">
                    ${choice.cost > 0 ? '-' : '+'}$${Math.abs(choice.cost)}
                </div>
            </div>
            <style>
                .bb-feedback-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000; animation: bbFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                @keyframes bbFadeIn { from { opacity: 0; } to { opacity: 1; } }
                .bb-feedback-card { background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: 24px; padding: 50px; text-align: center; max-width: 450px; box-shadow: var(--shadow-xl); animation: bbPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
                @keyframes bbPopIn { from { transform: scale(0.7) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
                .bb-feedback-icon { font-size: 80px; margin-bottom: 25px; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.2)); }
                .bb-feedback-text { font-size: 22px; color: var(--text-primary); margin-bottom: 20px; font-weight: 600; line-height: 1.4; }
                .bb-feedback-amount { font-size: 36px; font-weight: 800; }
                .bb-feedback-amount.positive { color: var(--success-color); border-bottom: 4px solid var(--success-color); display: inline-block; }
                .bb-feedback-amount.negative { color: var(--danger-color); border-bottom: 4px solid var(--danger-color); display: inline-block; }
            </style>
        `;
        container.appendChild(feedbackDiv);

        setTimeout(() => {
            feedbackDiv.remove();
            callback();
        }, 1500);
    }

    function showVictory() {
        const level = LEVELS[gameState.level];
        const finalPoints = Math.round((gameState.budget / level.budget) * 100) + 50;

        container.innerHTML = `
            <div class="bb-victory">
                <div class="bb-trophy">🏆</div>
                <h2 class="bb-victory-title">BUDGET BOSS WINNER!</h2>
                <p class="bb-victory-subtitle">You survived ${gameState.totalDays} days!</p>
                <div class="bb-victory-stats">
                    <div class="bb-victory-stat">
                        <div class="bb-stat-value">$${gameState.budget.toLocaleString()}</div>
                        <div class="bb-stat-label">Money Remaining</div>
                    </div>
                    <div class="bb-victory-stat">
                        <div class="bb-stat-value">${gameState.decisionsLog.length}</div>
                        <div class="bb-stat-label">Decisions Made</div>
                    </div>
                    <div class="bb-victory-stat">
                        <div class="bb-stat-value">${Math.round((gameState.budget / level.budget) * 100)}%</div>
                        <div class="bb-stat-label">Budget Saved</div>
                    </div>
                </div>
                <div class="bb-victory-message">
                    ${gameState.budget > level.budget * 0.5 ? '🌟 Outstanding! You\'re a financial wizard!' :
                gameState.budget > level.budget * 0.2 ? '👏 Well done! Solid financial skills!' :
                    '💪 You made it! Keep practicing those money skills!'}
                </div>
                <div class="bb-victory-actions">
                    <button class="bb-action-btn primary" onclick="restartCurrentGame()">Play Again</button>
                    <button class="bb-action-btn" onclick="navigateToPage('home')">Home</button>
                </div>
            </div>
            <style>
                .bb-victory { max-width: 700px; margin: 0 auto; text-align: center; padding: 50px 20px; }
                .bb-trophy { font-size: 130px; animation: bbVictoryBounce 1.2s infinite ease-in-out; filter: drop-shadow(0 0 20px rgba(245, 158, 11, 0.4)); }
                @keyframes bbVictoryBounce { 0%, 100% { transform: translateY(0) scale(1.05); } 50% { transform: translateY(-30px) scale(0.95); } }
                .bb-victory-title { font-size: 48px; color: var(--primary-color); margin: 25px 0; font-weight: 900; text-shadow: 0 0 15px rgba(99, 102, 241, 0.3); letter-spacing: -1px; }
                .bb-victory-subtitle { font-size: 22px; color: var(--text-secondary); margin-bottom: 40px; font-weight: 500; }
                .bb-victory-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; margin-bottom: 40px; }
                .bb-victory-stat { 
                    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); 
                    color: white; 
                    padding: 30px 20px; 
                    border-radius: 20px; 
                    box-shadow: var(--shadow-lg);
                    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .bb-victory-stat:hover { transform: scale(1.05); }
                .bb-stat-value { font-size: 32px; font-weight: 800; margin-bottom: 5px; }
                .bb-stat-label { font-size: 13px; opacity: 0.85; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
                .bb-victory-message { 
                    background: rgba(16, 185, 129, 0.1); 
                    color: var(--success-color); 
                    padding: 25px; 
                    border-radius: 20px; 
                    font-size: 20px; 
                    margin-bottom: 40px; 
                    border: 2px solid var(--success-color); 
                    font-weight: 600;
                    backdrop-filter: blur(8px);
                }
                .bb-victory-actions { display: flex; gap: 20px; justify-content: center; }
                .bb-action-btn { 
                    padding: 18px 45px; 
                    border: none; 
                    border-radius: 15px; 
                    font-size: 17px; 
                    font-weight: 700; 
                    cursor: pointer; 
                    transition: all 0.3s; 
                    box-shadow: var(--shadow-md);
                }
                .bb-action-btn.primary { background: var(--primary-color); color: white; }
                .bb-action-btn.primary:hover { background: var(--primary-dark); transform: translateY(-3px); box-shadow: var(--shadow-lg); }
                .bb-action-btn:not(.primary) { background: var(--bg-tertiary); color: var(--text-primary); border: 1px solid var(--border-color); }
                .bb-action-btn:not(.primary):hover { background: var(--card-bg); transform: translateY(-3px); border-color: var(--primary-color); }
                @media (max-width: 768px) {
                    .bb-victory-stats { grid-template-columns: 1fr; }
                }
            </style>
        `;

        playSound('win');
        setTimeout(() => endGame(finalPoints, 100, finalPoints), 2000);
    }

    function showGameOver() {
        const level = LEVELS[gameState.level];
        const survived = gameState.currentDay;

        container.innerHTML = `
            <div class="bb-gameover">
                <div class="bb-gameover-icon">💸</div>
                <h2 class="bb-gameover-title">Budget Depleted!</h2>
                <p class="bb-gameover-subtitle">You ran out of money on Day ${survived}</p>
                <div class="bb-gameover-stats">
                    <div class="bb-gameover-stat">
                        <div class="bb-stat-value">${survived}/${gameState.totalDays}</div>
                        <div class="bb-stat-label">Days Survived</div>
                    </div>
                    <div class="bb-gameover-stat">
                        <div class="bb-stat-value">${gameState.decisionsLog.length}</div>
                        <div class="bb-stat-label">Decisions Made</div>
                    </div>
                </div>
                <div class="bb-gameover-tips">
                    <h4>💡 Tips for Next Time:</h4>
                    <ul>
                        <li>Prioritize essential expenses over wants</li>
                        <li>Take income opportunities when available</li>
                        <li>Avoid impulse purchases and temptations</li>
                        <li>Balance social life with budget constraints</li>
                    </ul>
                </div>
                <div class="bb-gameover-actions">
                    <button class="bb-action-btn primary" onclick="restartCurrentGame()">Try Again</button>
                    <button class="bb-action-btn" onclick="navigateToPage('home')">Home</button>
                </div>
            </div>
            <style>
                .bb-gameover { max-width: 650px; margin: 0 auto; text-align: center; padding: 40px 20px; }
                .bb-gameover-icon { font-size: 110px; animation: bbShake 0.5s infinite alternate; filter: drop-shadow(0 0 15px var(--danger-color)); }
                @keyframes bbShake { from { transform: rotate(-5deg); } to { transform: rotate(5deg); } }
                .bb-gameover-title { font-size: 44px; color: var(--danger-color); margin: 20px 0; font-weight: 900; }
                .bb-gameover-subtitle { font-size: 22px; color: var(--text-secondary); margin-bottom: 40px; font-weight: 500; }
                .bb-gameover-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
                .bb-gameover-stat { 
                    background: var(--card-bg); 
                    border: 2px solid var(--danger-color);
                    color: var(--danger-color); 
                    padding: 25px; 
                    border-radius: 20px; 
                    box-shadow: var(--shadow-lg);
                    backdrop-filter: blur(10px);
                }
                .bb-gameover-tips { 
                    background: var(--bg-tertiary); 
                    border: 1px solid var(--border-color);
                    border-radius: 20px; 
                    padding: 30px; 
                    margin-bottom: 40px; 
                    text-align: left; 
                }
                .bb-gameover-tips h4 { color: var(--text-primary); margin-bottom: 15px; font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
                .bb-gameover-tips ul { list-style: none; padding: 0; }
                .bb-gameover-tips li { color: var(--text-secondary); margin-bottom: 12px; font-size: 16px; padding-left: 25px; position: relative; line-height: 1.5; }
                .bb-gameover-tips li::before { content: '🎯'; position: absolute; left: 0; }
                .bb-gameover-actions { display: flex; gap: 20px; justify-content: center; }
            </style>
        `;

        playSound('incorrect');
        const points = Math.round((survived / gameState.totalDays) * game.pointsPerGame);
        setTimeout(() => endGame(survived, gameState.totalDays, points), 2000);
    }
}

// Scenario Game - Credit Card Challenge
function loadScenarioGame(game, container) {
    // Initialize Help System
    setTimeout(() => initHelpSystem('credit'), 100);

    const scenarios = [
        { situation: "Laptop for $800, you have $500. Credit card APR: 20%", question: "Best decision?", options: ["Use credit, minimum payments", "Save up $800", "Use credit, pay off monthly", "Get a loan"], correct: 1, explanation: "Saving prevents 20% interest charges!" },
        { situation: "Credit card offers 2% cashback on all purchases", question: "Smart approach?", options: ["Always use credit", "Never use credit", "Use it and pay full balance monthly", "Only for emergencies"], correct: 2, explanation: "Cashback is smart IF you pay full balance monthly!" },
        { situation: "$3K credit debt at 18% APR, $2K savings at 1% interest", question: "Best move?", options: ["Keep saving", "Use savings to pay debt", "Invest savings", "Get new card"], correct: 1, explanation: "Paying 18% debt saves more than 1% interest!" }
    ];

    let currentScenario = 0, score = 0, gamePoints = 0;

    function renderScenario() {
        const s = scenarios[currentScenario];
        container.innerHTML = `<div class="scenario-container"><h2>Credit Card Challenge</h2><div class="scenario-progress">Scenario ${currentScenario + 1}/${scenarios.length}</div><div class="scenario-situation"><h3>💳 Situation:</h3><p>${s.situation}</p></div><div class="scenario-question"><h3>${s.question}</h3></div><div class="scenario-options">${s.options.map((opt, i) => `<button class="scenario-option" data-index="${i}">${opt}</button>`).join('')}</div><div class="scenario-score">Score: ${score}/${scenarios.length}</div></div><style>.scenario-container { max-width: 700px; margin: 0 auto; } .scenario-container h2 { text-align: center; color: #6366f1; margin-bottom: 10px; } .scenario-progress { text-align: center; color: #64748b; margin-bottom: 30px; } .scenario-situation { background: #fef3c7; padding: 25px; border-radius: 12px; margin-bottom: 20px; border-left: 4px solid #f59e0b; } .scenario-situation h3 { margin-bottom: 15px; color: #92400e; } .scenario-question { background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 20px; } .scenario-options { display: grid; gap: 15px; margin-bottom: 20px; } .scenario-option { padding: 20px; background: white; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 16px; cursor: pointer; text-align: left; } .scenario-option:hover { border-color: #6366f1; transform: translateX(5px); } .scenario-option.correct { background: #d1fae5; border-color: #10b981; color: #065f46; } .scenario-option.incorrect { background: #fee2e2; border-color: #ef4444; color: #991b1b; } .scenario-explanation { background: #dbeafe; padding: 20px; border-radius: 12px; margin-top: 20px; border-left: 4px solid #3b82f6; } .scenario-score { text-align: center; font-size: 20px; font-weight: 600; color: #6366f1; }</style>`;

        container.querySelectorAll('.scenario-option').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                const allBtns = container.querySelectorAll('.scenario-option');
                allBtns.forEach(b => b.disabled = true);

                if (idx === s.correct) {
                    btn.classList.add('correct');
                    score++;
                    gamePoints += game.pointsPerGame;
                    playSound('correct');
                }
                else {
                    btn.classList.add('incorrect');
                    allBtns[s.correct].classList.add('correct');
                    playSound('incorrect');

                    // Log as mistake
                    AppState.user.recentMistakes.unshift({
                        game: 'Credit Card Master',
                        title: s.situation,
                        choice: s.options[idx],
                        smarterChoice: s.options[s.correct],
                        pointsLoss: 50, // Standard penalty for scenario games
                        moneyLoss: 50 * 500, // ₹25,000 yearly impact estimate
                        date: new Date().toISOString()
                    });
                    if (AppState.user.recentMistakes.length > 10) AppState.user.recentMistakes.pop();
                }

                const exp = document.createElement('div');
                exp.className = 'scenario-explanation';
                exp.innerHTML = `<strong>💡 Explanation:</strong><br>${s.explanation}`;
                container.querySelector('.scenario-container').appendChild(exp);

                setTimeout(() => { currentScenario++; currentScenario < scenarios.length ? renderScenario() : endGame(score, scenarios.length, gamePoints); }, 4000);
            });
        });
    }
    renderScenario();
}

// End Game
function endGame(score, total, points) {
    // Input validation
    if (typeof score !== 'number' || typeof total !== 'number' || typeof points !== 'number') {
        console.error('endGame: Invalid parameters', { score, total, points });
        return;
    }

    if (isNaN(score) || isNaN(total) || isNaN(points)) {
        console.error('endGame: NaN detected', { score, total, points });
        return;
    }

    if (total === 0) {
        console.error('endGame: total cannot be zero');
        return;
    }

    // Ensure values are within valid ranges
    score = Math.max(0, Math.min(score, total));
    points = Math.max(0, points);

    const gameContainer = document.getElementById('gameContainer');
    const percentage = Math.round((score / total) * 100);

    // Play game end sound
    playSound('gameEnd');

    // Play coin sound for points
    if (points > 0) {
        setTimeout(() => playSound('coin'), 300);
    }

    // Map original points to real-world metrics based on game type
    const multiplier = 500; // 1 point = ₹500 for Net Worth
    const gain = points * multiplier;

    // Distribute gains
    AppState.user.netWorth += gain;

    // Track History for Charting
    AppState.user.netWorthHistory.push({
        date: new Date().toISOString(),
        value: AppState.user.netWorth
    });
    AppState.user.scoreHistory.push({
        date: new Date().toISOString(),
        score: percentage
    });

    // Update Overall Stats
    AppState.user.gamesPlayed++;
    const prevAccuracy = AppState.user.accuracy || 0;
    const totalAccuracy = prevAccuracy * (AppState.user.gamesPlayed - 1);
    AppState.user.accuracy = Math.round((totalAccuracy + percentage) / AppState.user.gamesPlayed);

    // Update Subject Performance
    if (!AppState.user.subjectPerformance) AppState.user.subjectPerformance = {};
    if (!AppState.user.subjectPerformance[AppState.currentGame.category]) {
        AppState.user.subjectPerformance[AppState.currentGame.category] = { total: 0, correct: 0 };
    }
    AppState.user.subjectPerformance[AppState.currentGame.category].total += total;
    AppState.user.subjectPerformance[AppState.currentGame.category].correct += score;

    // Update global user stats
    if (AppState.currentGame.id === 'budget-boss') {
        AppState.user.emergencyReadiness = Math.min(100, (AppState.user.emergencyReadiness || 0) + points);
    } else if (AppState.currentGame.id === 'savings-sprint') {
        AppState.user.creditHealth = Math.min(900, (AppState.user.creditHealth || 700) + Math.round(points / 2));
        AppState.user.emergencyReadiness = Math.min(100, (AppState.user.emergencyReadiness || 0) + 5);
    } else if (AppState.currentGame.id === 'credit-card-swipe') {
        AppState.user.creditHealth = Math.min(900, (AppState.user.creditHealth || 700) + points);
    } else if (AppState.currentGame.id === 'stock-trader' || AppState.currentGame.id === 'investment-clicker') {
        AppState.user.riskExposure = Math.min(100, (AppState.user.riskExposure || 0) + 10);
    }

    // Level and Badge Checks
    updateLevel();
    checkNewBadges();

    // Add to activity history for Profile summary
    if (!AppState.activityHistory) AppState.activityHistory = [];
    AppState.activityHistory.unshift({
        game: typeof AppState.currentGame.title === 'function'
            ? AppState.currentGame.title()
            : AppState.currentGame.title,

        points: points,
        score: score,
        total: total,
        date: new Date().toISOString()
    });

    // Sync with Analytics system
    if (typeof logGameCompletion === 'function') {
        logGameCompletion(AppState.currentGame.id, score, score, total, AppState.timerValue || 60);
    }

    saveToLocalStorage();

    if (AppState.activityHistory.length > 20) {
        AppState.activityHistory = AppState.activityHistory.slice(0, 20);
    }

    saveToLocalStorage();
    stopGameTimer();

    // ⭐ CALCULATE TIME ELAPSED ⭐
    const timeElapsed = AppState.gameStartTime
        ? Math.floor((Date.now() - AppState.gameStartTime) / 1000)
        : 0;

    // ⭐ LOG TO ANALYTICS SYSTEM ⭐
    if (typeof logGameCompletion === 'function') {
        logGameCompletion(
            AppState.currentGame.id,
            points, // Use earned points (currency)
            score,  // Use raw score (correct answers)
            total,  // Use total possible
            timeElapsed,
            AppState.user.recentMistakes || []
        );
    }
    let leveledUp = false;
    gameContainer.innerHTML = `
        <div class="game-result">
            <div class="result-icon">${percentage >= 70 ? '🎉' : percentage >= 50 ? '👍' : '💪'}</div>
            <h2>${percentage >= 70 ? 'Excellent!' : percentage >= 50 ? 'Good Job!' : 'Keep Practicing!'}</h2>
            <div class="result-score">
                <div class="score-circle">
                    <div class="score-value">${percentage}%</div>
                    <div class="score-label">Financial Health</div>
                </div>
            </div>
            <div class="result-stats">
                <div class="result-stat">
                    <div class="stat-value">+₹${gain.toLocaleString()}</div>
                    <div class="stat-label">Net Worth Gained</div>
                </div>
                <div class="result-stat">
                    <div class="stat-value">${score}/${total}</div>
                    <div class="stat-label">Concept Mastery</div>
                </div>
            </div>
            ${leveledUp ? `
                <div class="level-up-banner">
                    <span class="level-up-icon">🏆</span>
                    <span>Level Up! You're now Level ${AppState.user.level}!</span>
                </div>
            ` : ''}
            <div class="result-actions">
                <button class="result-btn primary" onclick="restartCurrentGame()">Play Again</button>
                <button class="result-btn" onclick="navigateToPage('home')">Back to Home</button>
            </div>
        </div>
        <style>
            .game-result {
                text-align: center;
                max-width: 500px;
                margin: 0 auto;
                padding: 40px 20px;
            }
            .result-icon {
                font-size: 80px;
                margin-bottom: 20px;
                animation: bounce 1s;
            }
            .game-result h2 {
                font-size: 32px;
                color: #6366f1;
                margin-bottom: 30px;
            }
            .result-score {
                margin: 30px 0;
            }
            .score-circle {
                width: 150px;
                height: 150px;
                margin: 0 auto;
                border-radius: 50%;
                background: linear-gradient(135deg, #6366f1, #ec4899);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
            }
            .score-value {
                font-size: 40px;
                font-weight: 700;
            }
            .score-label {
                font-size: 14px;
                opacity: 0.9;
            }
            .result-stats {
                display: flex;
                justify-content: center;
                gap: 40px;
                margin: 30px 0;
            }
            .result-stat {
                text-align: center;
            }
            .result-stat .stat-value {
                font-size: 28px;
                font-weight: 700;
                color: #10b981;
                margin-bottom: 5px;
            }
            .result-stat .stat-label {
                font-size: 14px;
                color: #64748b;
            }
            .level-up-banner {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 15px 25px;
                border-radius: 12px;
                margin: 20px 0;
                font-size: 18px;
                font-weight: 600;
                animation: slideIn 0.5s;
            }
            .level-up-icon {
                font-size: 24px;
                margin-right: 10px;
            }
            .result-actions {
                display: flex;
                gap: 15px;
                justify-content: center;
                margin-top: 30px;
            }
            .result-btn {
                padding: 15px 30px;
                border: 2px solid #6366f1;
                border-radius: 12px;
                background: white;
                color: #6366f1;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            }
            .result-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(99, 102, 241, 0.3);
            }
            .result-btn.primary {
                background: #6366f1;
                color: white;
            }
            .result-btn.primary:hover {
                background: #4f46e5;
            }
            @keyframes slideIn {
                from {
                    transform: translateY(-20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        </style>
    `;


    // ⭐ CORRECTED - Log to analytics system ⭐
    logGameCompletion(
        AppState.currentGame.id,   // ✅ Game ID from AppState
        points,                     // ✅ Points earned (can be used as score)
        score,                      // ✅ Correct answers
        total,                      // ✅ Total questions
        timeElapsed,               // ✅ Time calculated above
        []                         // ✅ Empty array for now (add mistakes later)
    );
    // NEW: notify progress system via an event (allows real-time updates)
    window.dispatchEvent(new CustomEvent('moneywise:gameComplete', {
        detail: {
            gameId: AppState.currentGame.id,
            score: points,
            correct: score,
            total: total,
            timeTaken: timeElapsed,
            mistakes: []
        }
    }));

    // Update the dashboard
    renderProgressDashboard();

    playSound('gameEnd');
    updateUI();
}

/**
 * Stops the currently running game and cleans up resources.
 */
function stopCurrentGame() {
    console.log('Stopping current game:', AppState.currentGame?.id);

    // 1. Stop all registered intervals (including main timer)
    clearAllGameIntervals();

    // 2. Clear any active timeouts
    if (window.eduPopupTimeout) {
        clearTimeout(window.eduPopupTimeout);
        window.eduPopupTimeout = null;
    }

    // 3. Clear game container
    const container = document.getElementById('gameContainer');
    if (container) {
        // Specific cleanup for boss fight if it wasn't registered
        if (window.bossTimer) {
            clearInterval(window.bossTimer);
            window.bossTimer = null;
        }
        container.innerHTML = '';
    }

    // 4. Reset game state
    AppState.currentGame = null;
}

// Game Timer
let gameTimerInterval;
let gameStartTime;

// Global tracker for all game-related intervals to ensure cleanup
window.activeIntervals = window.activeIntervals || [];

/**
 * Registers an interval for cleanup when the game stops.
 * @param {number} id - The interval ID returned by setInterval.
 */
function registerGameInterval(id) {
    window.activeIntervals.push(id);
}

/**
 * Clears all registered intervals.
 */
function clearAllGameIntervals() {
    window.activeIntervals.forEach(id => clearInterval(id));
    window.activeIntervals = [];
}

function startGameTimer() {
    gameStartTime = Date.now();
    gameTimerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('gameTimer').textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
    registerGameInterval(gameTimerInterval);
}

function stopGameTimer() {
    if (gameTimerInterval) {
        clearInterval(gameTimerInterval);
        gameTimerInterval = null;
    }
}

// Update Level
// Calculate Financial Health Score (0-100)
function calculateFinancialHealth() {
    const netWorthScore = Math.min(100, (AppState.user.netWorth / 50000) * 100);
    const creditScore = (AppState.user.creditHealth / 900) * 100;
    const emergencyScore = AppState.user.emergencyReadiness;
    const riskScore = AppState.user.riskExposure;

    return Math.round((netWorthScore + creditScore + emergencyScore + riskScore) / 4);
}

// // Update Level
// function updateLevel() {
//     const healthScore = calculateFinancialHealth();
//     const oldLevel = AppState.user.level;

//     // Force Level to be math-based: Score of 0-9 = L1, 10-19 = L2, etc.
//     // Level = Math.floor(Score / 10) + 1
//     let correctLevel = Math.floor(healthScore / 10) + 1;
//     correctLevel = Math.min(10, Math.max(1, correctLevel));

//     if (correctLevel !== oldLevel) {
//         AppState.user.level = correctLevel;
//         if (correctLevel > oldLevel) {
//             showNotification(`Financial Level Up! You're now Level ${AppState.user.level}! 🏆`, 'success');
//         }
//         updateUI(); // Ensure header updates immediately
//         if (AppState.currentPage === 'profile') updateProfilePage();
//     }
// }
function updateLevel() {
    const healthScore = calculateFinancialHealth();
    const oldLevel = AppState.user.level;

    let correctLevel = Math.floor(healthScore / 10) + 1;
    correctLevel = Math.min(10, Math.max(1, correctLevel));

    let leveledUp = false;

    if (correctLevel !== oldLevel) {
        AppState.user.level = correctLevel;

        if (correctLevel > oldLevel) {
            leveledUp = true;
            showNotification(`Financial Level Up! You're now Level ${AppState.user.level}! 🏆`, 'success');
        }

        updateUI();
        if (AppState.currentPage === 'profile') updateProfilePage();
    }

    return leveledUp;
}


// Update UI
function updateUI() {
    // Update header stats
    document.getElementById('headerNetWorth').textContent = '₹' + AppState.user.netWorth.toLocaleString();
    document.getElementById('headerLevel').textContent = AppState.user.level;

    // Update settings values
    document.getElementById('soundToggle').checked = AppState.settings.sound;
    document.getElementById('musicToggle').checked = AppState.settings.music;
    document.getElementById('volumeControl').value = AppState.settings.volume;
    document.getElementById('volumeValue').textContent = AppState.settings.volume + '%';
    document.getElementById('difficultySelect').value = AppState.settings.difficulty;
    document.getElementById('timerToggle').checked = AppState.settings.timer;
    document.getElementById('hintsToggle').checked = AppState.settings.hints;
    document.getElementById('themeSelect').value = AppState.settings.theme;
    document.getElementById('animationsToggle').checked = AppState.settings.animations;
    document.getElementById('languageSelect').value = AppState.settings.language;
}

// Apply Theme
function applyTheme(theme) {
    let themeToApply = theme;

    if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        themeToApply = prefersDark ? 'dark' : 'light';
    }

    document.documentElement.setAttribute('data-theme', themeToApply);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.setAttribute('content', themeToApply === 'dark' ? '#0f172a' : '#6366f1');
    }
}

// Update Profile Page
function updateProfilePage() {
    document.getElementById('userName').textContent = AppState.user.name;
    document.getElementById('userAvatar').textContent = AppState.user.avatar;
    document.getElementById('userLevel').textContent = AppState.user.level;
    document.getElementById('totalNetWorth').textContent = '₹' + AppState.user.netWorth.toLocaleString();
    document.getElementById('creditHealth').textContent = AppState.user.creditHealth;
    document.getElementById('emergencyReadiness').textContent = AppState.user.emergencyReadiness + '%';
    document.getElementById('riskExposure').textContent = AppState.user.riskExposure + '%';

    // Calculate level progress based on Financial Health
    const healthScore = calculateFinancialHealth();
    const level = AppState.user.level;
    const isMaxLevel = level >= 10;

    // Progress calculation: Score within the [ (level-1)*10, level*10 ] bracket
    const lowerBound = (level - 1) * 10;
    const upperBound = level * 10;

    let progressPercentage = 0;
    if (isMaxLevel) {
        progressPercentage = Math.min(100, (healthScore / 100) * 100);
        document.getElementById('nextLevel').textContent = 'MAX';
        document.getElementById('nextLevelPoints').textContent = '100';
    } else {
        progressPercentage = Math.min(100, Math.max(0, ((healthScore - lowerBound) / 10) * 100));
        document.getElementById('nextLevel').textContent = level + 1;
        document.getElementById('nextLevelPoints').textContent = upperBound;
    }

    document.getElementById('levelProgressFill').style.width = progressPercentage + '%';
    document.getElementById('currentLevelPoints').textContent = healthScore;

    // Achievements (Recent Badges)
    const achievementsList = document.getElementById('achievementsList');
    if (AppState.user.badges && AppState.user.badges.length > 0) {
        achievementsList.innerHTML = AppState.user.badges.map(badgeId => {
            const badge = getBadgeDetails(badgeId);
            return `
                <div class="achievement-item">
                    <div class="achievement-icon">${badge.icon}</div>
                    <div class="achievement-info">
                        <h4>${badge.name}</h4>
                        <p>${badge.desc}</p>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        achievementsList.innerHTML = '<p class="no-achievements">Start playing to unlock achievements!</p>';
    }

    // Leaderboard
    renderLeaderboard();
}

// Helper to get badge details
function getBadgeDetails(id) {
    const badges = {
        'wealth-builder': { name: 'Wealth Builder 💰', desc: 'Reach ₹50,000 Net Worth', icon: '💰' },
        'shield-bearer': { name: 'Shield Bearer 🛡️', desc: 'Reach 100% Emergency Readiness', icon: '🛡️' },
        'gold-score': { name: 'Gold Score 💳', desc: 'Reach 850 Credit Health', icon: '💳' },
        'risk-master': { name: 'Risk Master 🦖', desc: 'Reach 50% Risk Exposure', icon: '🦖' },
        'streak-master': { name: 'Streak Master 🔥', desc: 'Maintain a 5-day streak', icon: '🔥' }
    };
    return badges[id] || { name: 'Expert Learner', desc: 'Gained financial knowledge', icon: '🎓' };
}

// Global Leaderboard Mock Data (Fun Names)
const mockLeaderboard = [
    { name: 'Financial Wiz 🧙', netWorth: 185000, avatar: '🧙', rankTitle: 'Elite Investor' },
    { name: 'Penny Pincher 🪙', netWorth: 142000, avatar: '🧑‍💻', rankTitle: 'Master Saver' },
    { name: 'Stock Guru 📊', netWorth: 98500, avatar: '😎', rankTitle: 'Market Expert' },
    { name: 'Budget Queen 👑', netWorth: 64000, avatar: '👩‍💻', rankTitle: 'Budgeting Pro' },
    { name: 'Savvy Student 🎓', netWorth: 32000, avatar: '🧑‍🎓', rankTitle: 'Junior Trader' }
];

function renderLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    if (!leaderboardList) return;

    // Create current data array with user
    let data = [...mockLeaderboard];
    data.push({
        name: AppState.user.name + ' (You)',
        netWorth: AppState.user.netWorth,
        avatar: AppState.user.avatar,
        rankTitle: getRankTitle(AppState.user.level),
        isUser: true
    });

    // Sort by Net Worth
    data.sort((a, b) => b.netWorth - a.netWorth);

    leaderboardList.innerHTML = data.map((player, index) => {
        const rank = index + 1;
        let rankClass = `rank-${rank}`;
        if (rank > 3) rankClass = 'rank-low';

        return `
            <div class="leaderboard-item ${player.isUser ? 'is-user' : ''} ${rankClass}">
                <div class="rank-number">${rank}</div>
                <div class="player-avatar">${player.avatar}</div>
                <div class="player-info">
                    <span class="player-name">${player.name}</span>
                    <span class="player-rank-title">${player.rankTitle}</span>
                </div>
                <div class="player-score">₹${player.netWorth.toLocaleString()}</div>
            </div>
        `;
    }).join('');
}

function getRankTitle(level) {
    const titles = ['Rookie', 'Novice', 'Apprentice', 'Practitioner', 'Pro', 'Expert', 'Master', 'Grandmaster', 'Legend', 'Financial Deity'];
    return titles[Math.min(level - 1, titles.length - 1)];
}

// Change Name Functionality
function changeName() {
    const newName = prompt("Enter your new player name:", AppState.user.name);
    if (newName && newName.trim() !== "" && newName.length <= 20) {
        AppState.user.name = newName.trim();
        document.getElementById('userName').textContent = AppState.user.name;
        saveToLocalStorage();
        renderLeaderboard();
        showNotification('Profile name updated!', 'success');
    } else if (newName) {
        showNotification('Invalid name. Maximum 20 characters.', 'error');
    }
}

// Check and Unlock New Badges
function checkNewBadges() {
    const badges = [
        { id: 'wealth-builder', name: 'Wealth Builder 💰', desc: 'Reach ₹50,000 Net Worth', target: () => AppState.user.netWorth >= 50000 },
        { id: 'shield-bearer', name: 'Shield Bearer 🛡️', desc: 'Reach 100% Emergency Readiness', target: () => AppState.user.emergencyReadiness >= 100 },
        { id: 'gold-score', name: 'Gold Score 💳', desc: 'Reach 850 Credit Health', target: () => AppState.user.creditHealth >= 850 },
        { id: 'risk-master', name: 'Risk Master 🦖', desc: 'Reach 50% Risk Exposure', target: () => AppState.user.riskExposure >= 50 },
        { id: 'streak-master', name: 'Streak Master 🔥', desc: 'Maintain a 5-day streak', target: () => AppState.user.streak >= 5 }
    ];

    badges.forEach(badge => {
        if (badge.target() && !AppState.user.badges.includes(badge.id)) {
            AppState.user.badges.push(badge.id);
            showNotification(`New Badge Unlocked: ${badge.name}! 🎊`, 'success');
        }
    });
}

function calculateAchievements() {
    const badges = [
        { id: 'wealth-builder', title: 'Wealth Builder', icon: '💰', description: 'Reached ₹50k Net Worth' },
        { id: 'shield-bearer', title: 'Shield Bearer', icon: '🛡️', description: 'Reached 100% Emergency Fund' },
        { id: 'gold-score', title: 'Gold Score', icon: '💳', description: 'Reached 850 Credit Score' },
        { id: 'risk-master', title: 'Risk Master', icon: '🦖', description: 'Reached 50% Risk Exposure' }
    ];

    return badges.filter(b => AppState.user.badges.includes(b.id));
}

// Update Progress Page with Advanced Analytics
function updateProgressPage() {
    // 1. Subject Progress (Existing)
    const subjectProgress = document.getElementById('subjectProgress');
    const subjects = calculateSubjectProgress();
    subjectProgress.innerHTML = subjects.map(subject => `
        <div class="subject-item">
            <div class="subject-header">
                <span class="subject-name">${subject.name}</span>
                <span class="subject-percentage">${subject.percentage}%</span>
            </div>
            <div class="subject-bar">
                <div class="subject-fill" style="width: ${subject.percentage}%"></div>
            </div>
        </div>
    `).join('');

    // 2. Student Financial IQ Score
    updateStudentScore();

    // 3. Improvement Instructions
    updateImprovementInstructions();

    // 4. Mistake Review Gallery
    const mistakeGallery = document.getElementById('mistakeGallery');
    if (AppState.user.recentMistakes.length > 0) {
        mistakeGallery.innerHTML = AppState.user.recentMistakes.map(m => `
            <div class="mistake-card">
                <div class="mistake-header">
                    <span class="mistake-title">${m.title}</span>
                    <span class="mistake-loss">-₹${m.moneyLoss.toLocaleString()}</span>
                </div>
                <div class="mistake-details">
                    You chose: "<b>${m.choice}</b>"<br>
                    Real Money Impact: This decision would have cost you ₹${m.moneyLoss.toLocaleString()} over a year compared to the optimal path.
                </div>
                <div class="mistake-footer">
                    💡 Smarter Choice: "${m.smarterChoice}"
                </div>
            </div>
        `).join('');
    } else {
        mistakeGallery.innerHTML = '<p class="section-desc" style="text-align: center; margin-top:10px;">No mistakes yet! Your financial judgment is impeccable. 🌟</p>';
    }

    // 3. Spending Ratio & Resilience
    updateAdvancedMetrics();

    // 6. Personalized Tips
    generatePersonalizedTips();

    // 7. Recent Activity
    const recentActivity = document.getElementById('recentActivity');


    if (AppState.activityHistory.length > 0) {
        recentActivity.innerHTML = AppState.activityHistory.slice(0, 5).map(activity => `
            <div class="activity-item">
                <div class="activity-info">
                    <div class="activity-title">${activity.game}</div>
                    <div class="activity-date">${new Date(activity.date).toLocaleDateString()}</div>
                </div>
                <div class="activity-points">+₹${(activity.points * 500).toLocaleString()}</div>
            </div>
        `).join('');
    } else {
        recentActivity.innerHTML = '<p style="text-align: center; color: #64748b;">No activity yet. Start playing to track your progress!</p>';
    }
}

function updateAdvancedMetrics() {
    // Spending Ratio Calculation based on mistake categories
    const spendingRatio = document.getElementById('spendingRatio');
    if (!spendingRatio) return;

    const mistakes = AppState.user.recentMistakes || [];

    // Count discretionary mistakes (Social, Opportunity, etc.)
    const discretionaryCount = mistakes.filter(m => m.category === 'social' || m.category === 'opportunity').length;

    // Simulate a base ratio if no mistakes yet
    const lifestylePercent = discretionaryCount > 0 ? Math.min(60, (discretionaryCount * 15) + 20) : 20;
    const essentialsPercent = 100 - lifestylePercent;

    spendingRatio.innerHTML = `
        <div class="ratio-labels">
            <span>Essential Needs: ${essentialsPercent}%</span>
            <span>Lifestyle/Wants: ${lifestylePercent}%</span>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar-fill" style="width: ${essentialsPercent}%; background: var(--success-color);"></div>
            <div class="progress-bar-fill" style="width: ${lifestylePercent}%; background: var(--warning-color); float: left;"></div>
        </div>
        <p class="section-desc" style="margin-top: 10px;">${lifestylePercent > 35 ? '⚠️ Your lifestyle spending is impacting your savings potential.' : '✅ Your spending is well-optimized for a student budget.'}</p>
    `;

    // Resilience Score
    const resilience = document.getElementById('resilienceScore');
    const baseResilience = AppState.user.emergencyReadiness;
    const penalty = AppState.user.recentMistakes.length * 5;
    const finalResilience = Math.max(0, baseResilience - penalty);

    resilience.innerHTML = `
        <div class="resilience-flex" style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size: 32px; font-weight: 800; color: var(--primary-color);">${finalResilience}%</span>
            <span style="font-size: 14px; color: var(--text-secondary); text-align:right;">
                ${finalResilience > 70 ? 'Excellent Shield! 🛡️' : finalResilience > 40 ? 'Fair Protection 👍' : 'High Risk! ⚠️'}
            </span>
        </div>
        <div class="progress-bar-container" style="background: var(--bg-tertiary); height: 12px; border-radius: 6px; overflow: hidden; margin-top: 10px;">
            <div class="progress-bar-fill" style="width: ${finalResilience}%; background: var(--primary-color); height: 100%;"></div>
        </div>
    `;
}

function generatePersonalizedTips() {
    const tipsContainer = document.getElementById('personalizedTips');
    const totalMistakes = AppState.user.recentMistakes.length;
    const temptationMistakes = AppState.user.recentMistakes.filter(m => m.game === 'Budget Boss' && m.title.match(/Sale|Temptation|Coffee|Phone/i)).length;

    const tips = [];
    if (totalMistakes === 0) {
        tips.push("You're doing great! Try the 'Advanced' difficulty in Budget Boss to test your limits.");
        tips.push("Start looking into the 'Investment Clicker' to grow your ₹50k Net Worth even faster.");
    } else {
        if (temptationMistakes > 0) {
            tips.push("Impulse Control: Before buying, wait 24 hours. Most 'Flash Sales' are designed to trigger FOMO.");
            tips.push("The ₹500 Multiplier: Small luxury costs (like coffee) add up to ₹1,50,000 yearly in real terms!");
        }
        if (AppState.user.creditHealth < 750) {
            tips.push("Credit Boost: Avoid carrying balances. Use the 'Credit Card Master' game to practice debt-free spending.");
        }
        if (AppState.user.emergencyReadiness < 50) {
            tips.push("Safety First: Prioritize building 3 months of expenses. It's your ultimate defense against debt.");
        }
    }

    // Default tips if pool is small
    if (tips.length < 2) tips.push("Consistency is key. Play at least one game daily to keep your financial mindset sharp.");

    tipsContainer.innerHTML = tips.map(tip => `
        <div class="tip-item">${tip}</div>
    `).join('');
}

function calculateSubjectProgress() {
    const subjects = {};

    AppState.activityHistory.forEach(activity => {
        const game = gamesDatabase.find(g => g.title === activity.game);
        if (game) {
            if (!subjects[game.category]) {
                subjects[game.category] = { total: 0, correct: 0 };
            }
            subjects[game.category].total += activity.total;
            subjects[game.category].correct += activity.score;
        }
    });

    return Object.keys(subjects).map(name => ({
        name: name,
        percentage: subjects[name].total > 0
            ? Math.round((subjects[name].correct / subjects[name].total) * 100)
            : 0
    }));
}

// Change Avatar
function changeAvatar() {
    const avatars = ['👤', '😀', '😎', '🤓', '🧑‍🎓', '👨‍💻', '👩‍💻', '🦸', '🧙', '🐱', '🐶', '🦊', '🐼'];
    const currentIndex = avatars.indexOf(AppState.user.avatar);
    const nextIndex = (currentIndex + 1) % avatars.length;
    AppState.user.avatar = avatars[nextIndex];
    document.getElementById('userAvatar').textContent = AppState.user.avatar;
    saveToLocalStorage();
}

// Reset Progress
function resetProgress() {
    AppState.user = {
        name: 'Player',
        avatar: '👤',
        level: 1,
        netWorth: 0,
        creditHealth: 700,
        emergencyReadiness: 0,
        riskExposure: 0,
        badges: [],
        gamesPlayed: 0,
        accuracy: 0,
        streak: 0,
        recentMistakes: []
    };
    AppState.gameProgress = {};
    AppState.activityHistory = [];
    saveToLocalStorage();
    updateUI();
    updateProfilePage();
    showNotification('Progress reset successfully!', 'success');
    navigateToPage('home');
}

// Connection Status
function updateConnectionStatus() {
    AppState.isOnline = navigator.onLine;
    const statusIndicator = document.getElementById('connectionStatus');
    const statusText = document.getElementById('statusText');

    if (AppState.isOnline) {
        statusIndicator.classList.add('online');
        statusText.textContent = 'Online Mode';
        showNotification('You are now online!', 'success');
    } else {
        statusIndicator.classList.remove('online');
        statusText.textContent = 'Offline Mode';
        showNotification('You are offline. Limited features available.', 'error');
    }
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');

    notification.className = 'notification show ' + type;
    notificationText.textContent = message;

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function updateStudentScore() {
    const scoreVal = document.getElementById('studentScoreValue');
    if (!scoreVal) return;

    // Calculate composite score (weighted average) with safe defaults
    const netWorth = AppState.user.netWorth || 0;
    const creditHealth = AppState.user.creditHealth || 700;
    const resilience = AppState.user.emergencyReadiness || 0;

    const netWorthScore = Math.min(100, (netWorth / 50000) * 100);
    const creditScore = Math.max(0, ((creditHealth - 600) / 250) * 100);
    const resilienceScore = resilience;

    const finalIQ = Math.round((netWorthScore * 0.3) + (creditScore * 0.4) + (resilienceScore * 0.3)) || 0;

    scoreVal.textContent = finalIQ;

    // Dynamic coloring based on score
    if (finalIQ > 80) scoreVal.style.color = 'var(--success-color)';
    else if (finalIQ > 50) scoreVal.style.color = 'var(--primary-color)';
    else scoreVal.style.color = 'var(--warning-color)';
}

function updateImprovementInstructions() {
    const instructionContainer = document.getElementById('improvementInstructions');
    if (!instructionContainer) return;

    const mistakes = AppState.user.recentMistakes || [];

    if (mistakes.length === 0) {
        instructionContainer.innerHTML = `
            <div class="instruction-item">Play the "Budget Boss" game to start your financial analysis.</div>
            <div class="instruction-item">Target a credit score of 720+ by avoiding debt scenarios.</div>
        `;
        return;
    }

    const instructions = [];

    // Analyze patterns
    const highLifestyle = mistakes.filter(m => m.category === 'social').length >= 2;
    const missedIncome = mistakes.filter(m => m.category === 'opportunity').length > 0;
    const lowCredit = AppState.user.creditHealth < 720;

    if (highLifestyle) {
        instructions.push("<strong>Cut Lifestyle Leakage</strong>: You've made several expensive social choices. Try choosing 'Free' alternatives 2 out of 3 times.");
    }
    if (missedIncome) {
        instructions.push("<strong>Seize Opportunities</strong>: You missed chances to earn extra ₹. In the next game, prioritize 'Side Hustles'.");
    }
    if (lowCredit) {
        instructions.push("<strong>Credit Repair</strong>: Your credit is under 720. Focus on the 'Credit Card Master' game and pay full balances.");
    }

    if (AppState.user.emergencyReadiness < 30) {
        instructions.push("<strong>Build the Buffer</strong>: Your resilience is low. In Budget Boss, prioritize saving ₹5,000 for emergencies.");
    }

    if (instructions.length === 0) {
        instructions.push("<strong>Next Level</strong>: Your basics are solid! Try 'Advanced' difficulty to test your luxury management.");
    }

    instructionContainer.innerHTML = instructions.map(ins => `
        <div class="instruction-item">${ins}</div>
    `).join('');
}

// Reload current game when language changes
window.addEventListener('languageChanged', (e) => {
    // Only reload if a game is currently active and valid
    if (AppState.currentGame) {
        console.log("Reloading game for language change:", AppState.currentGame.title);
        loadGame(AppState.currentGame);
    }
});
