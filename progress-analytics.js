/* =========================================
   ENHANCED PROGRESS ANALYTICS SYSTEM WITH CHART.JS
   ========================================= */

// Extended AppState for Progress Tracking
const ProgressAnalytics = {
    gameHistory: [],
    mistakeLog: [],
    subjectMastery: {},
    learningPaths: {},
    resilienceMetrics: {
        emergencyFundScore: 0,
        debtManagementScore: 0,
        savingsConsistency: 0,
        investmentKnowledge: 0
    },
    spendingHabits: {
        needs: 25,
        wants: 25,
        savings: 25,
        debt: 25
    },
    // Chart.js instances
    charts: {
        subject: null,
        spending: null,
        history: null
    }
};

// -----------------------------
// Realtime Event API & Utilities
// -----------------------------

// Simple debounce helper (prevents too-frequent dashboard redraws)
function debounce(fn, wait = 250) {
    let t;
    return function (...args) {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(this, args), wait);
    };
}

// Debounced render so frequent gameProgress events are smoothed
const debouncedRenderDashboard = debounce(() => {
    // If user is on progress page, do full render; otherwise update only hero score to keep UI responsive
    if (AppState && AppState.currentPage === 'progress') {
        renderProgressDashboard();
    } else {
        // update hero score quickly so header shows latest IQ
        const iq = calculateFinancialIQ();
        const rank = getIQRank(iq);
        renderHeroScore(iq, rank);
    }
}, 300);

// Handler for lightweight, in-play updates (partial progress)
function handleGameProgress(detail = {}) {
    try {
        // detail shape: { gameId, correct, total, timeTaken, mistakes }
        if (!detail || !detail.gameId) return;

        // If partial accuracy available, update subject masteries lightly (keeps charts meaningful)
        const partialScore = detail.total ? Math.round((detail.correct / detail.total) * 100) : 0;

        // Update subject mastery in a non-destructive way (does not add to full gameHistory)
        // We intentionally call updateSubjectMastery but avoid pushing to gameHistory here.
        // Provide a 'score' param as percentage so the function computes averages consistently.
        // updateSubjectMastery(detail.gameId, partialScore, detail.correct || 0, detail.total || 0);
        updateSubjectMasteryPartial(
            detail.gameId,
            partialScore,
            detail.correct || 0,
            detail.total || 0
        );

        // Update resilience and spending in a lightweight manner if needed (optional)
        if (detail.mistakes && detail.mistakes.length) {
            updateSpendingHabits(detail.gameId, detail.mistakes);
        }

        // Update UI (debounced)
        debouncedRenderDashboard();
    } catch (err) {
        console.warn('handleGameProgress error', err);
    }
}

// Handler for final game result — expects full data and reuses existing logging pipeline
function handleGameComplete(detail = {}) {
    try {
        // detail shape: { gameId, score, correct, total, timeTaken, mistakes }
        if (!detail || !detail.gameId) return;

        const lastGame =
            ProgressAnalytics.gameHistory[
            ProgressAnalytics.gameHistory.length - 1
            ];

        if (
            lastGame &&
            lastGame.gameId === detail.gameId &&
            Math.abs(new Date(lastGame.timestamp) - new Date()) < 2000
        ) {
            return; // stop duplicate logging
        }




        // If caller already used logGameCompletion directly, this still works — duplicate calls are possible,
        // so consumers should prefer one method (we will use dispatch instead of direct call where possible).
        logGameCompletion(
            detail.gameId,
            detail.score !== undefined ? detail.score : (detail.total ? Math.round((detail.correct / detail.total) * 100) : 0),
            detail.correct || 0,
            detail.total || 0,
            detail.timeTaken || 0,
            detail.mistakes || []
        );

        // Ensure immediate render
        if (AppState && AppState.currentPage === 'progress') {
            renderProgressDashboard();
        } else {
            debouncedRenderDashboard();
        }
    } catch (err) {
        console.warn('handleGameComplete error', err);
    }
}

// Setup global listeners (call this at module init time)
function setupProgressEventListeners() {
    if (setupProgressEventListeners._done) return;
    window.addEventListener('moneywise:gameProgress', (e) => handleGameProgress(e.detail || {}));
    window.addEventListener('moneywise:gameComplete', (e) => handleGameComplete(e.detail || {}));
    setupProgressEventListeners._done = true;
}

// call listener setup now so events are caught even if initProgressAnalytics is called later
setupProgressEventListeners();


// Initialize Progress System
function initProgressAnalytics() {
    loadProgressData();
    initCharts();
    renderProgressDashboard();
}

// Initialize Chart.js charts
function initCharts() {
    // Wait for Chart.js to load
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js not loaded yet, retrying...');
        setTimeout(initCharts, 100);
        return;
    }

    // Add loading states
    const chartContainers = ['subjectChart', 'spendingChart', 'historyChart'];
    chartContainers.forEach(id => {
        const canvas = document.getElementById(id);
        if (canvas && canvas.parentElement) {
            canvas.parentElement.classList.add('chart-loading');
        }
    });

    // Subject Mastery Chart
    const subjectCanvas = document.getElementById('subjectChart');
    if (subjectCanvas) {
        const ctx = subjectCanvas.getContext('2d');
        if (ProgressAnalytics.charts.subject) {
            ProgressAnalytics.charts.subject.destroy();
        }
        ProgressAnalytics.charts.subject = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Accuracy %',
                    data: [],
                    backgroundColor: 'rgba(99, 102, 241, 0.6)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return 'Accuracy: ' + context.parsed.y + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Spending Habits Chart
    const spendingCanvas = document.getElementById('spendingChart');
    if (spendingCanvas) {
        const ctx = spendingCanvas.getContext('2d');
        if (ProgressAnalytics.charts.spending) {
            ProgressAnalytics.charts.spending.destroy();
        }
        ProgressAnalytics.charts.spending = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [I18N.t('anaNeeds'), I18N.t('anaWants'), I18N.t('anaSavings'), I18N.t('anaDebt')],
                datasets: [{
                    data: [25, 25, 25, 25],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(99, 102, 241, 0.8)',
                        'rgba(245, 158, 11, 0.8)'
                    ],
                    borderColor: [
                        'rgba(16, 185, 129, 1)',
                        'rgba(59, 130, 246, 1)',
                        'rgba(99, 102, 241, 1)',
                        'rgba(245, 158, 11, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Financial IQ History Chart
    const historyCanvas = document.getElementById('historyChart');
    if (historyCanvas) {
        const ctx = historyCanvas.getContext('2d');
        if (ProgressAnalytics.charts.history) {
            ProgressAnalytics.charts.history.destroy();
        }
        ProgressAnalytics.charts.history = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: I18N.t('anaFinIQ'),
                    data: [],
                    fill: true,
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 3,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function (value) {
                                return value;
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return 'IQ Score: ' + context.parsed.y;
                            }
                        }
                    }
                }
            }
        });
    }

    // Re-render dashboard now that charts are initialized
    renderProgressDashboard();
}

// Load saved progress data from localStorage
function loadProgressData() {
    const saved = localStorage.getItem('moneywise_progress');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            Object.assign(ProgressAnalytics, {
                ...ProgressAnalytics,
                ...data,
                resilienceMetrics: {
                    ...ProgressAnalytics.resilienceMetrics,
                    ...data.resilienceMetrics
                },
                spendingHabits: {
                    ...ProgressAnalytics.spendingHabits,
                    ...data.spendingHabits
                }
            });
        } catch (e) {
            console.error('Error loading progress data:', e);
        }
    }
}

// Save progress data
function saveProgressData() {
    // Don't save chart instances
    const dataToSave = {
        gameHistory: ProgressAnalytics.gameHistory,
        mistakeLog: ProgressAnalytics.mistakeLog,
        subjectMastery: ProgressAnalytics.subjectMastery,
        learningPaths: ProgressAnalytics.learningPaths,
        resilienceMetrics: ProgressAnalytics.resilienceMetrics,
        spendingHabits: ProgressAnalytics.spendingHabits
    };
    localStorage.setItem('moneywise_progress', JSON.stringify(dataToSave));
}

// Log game completion
function logGameCompletion(gameId, score, correct, total, timeTaken, mistakes = []) {
    const gameData = {
        gameId,
        score,
        correct,
        total,
        accuracy: ((correct / total) * 100).toFixed(1),
        timeTaken,
        timestamp: new Date().toISOString(),
        mistakes
    };

    ProgressAnalytics.gameHistory.push(gameData);

    // Log mistakes for review
    mistakes.forEach(mistake => {
        ProgressAnalytics.mistakeLog.push({
            ...mistake,
            gameId,
            timestamp: new Date().toISOString()
        });
    });

    // Update subject mastery
    updateSubjectMastery(gameId, score, correct, total);

    // Update resilience metrics based on game
    updateResilienceMetrics(gameId, score);

    // Update spending habits if applicable
    updateSpendingHabits(gameId, mistakes);

    // Keep only last 100 games
    if (ProgressAnalytics.gameHistory.length > 100) {
        ProgressAnalytics.gameHistory = ProgressAnalytics.gameHistory.slice(-100);
    }

    // Keep only last 50 mistakes
    if (ProgressAnalytics.mistakeLog.length > 50) {
        ProgressAnalytics.mistakeLog = ProgressAnalytics.mistakeLog.slice(-50);
    }

    saveProgressData();

    // Refresh dashboard if on progress page
    if (AppState && AppState.currentPage === 'progress') {
        renderProgressDashboard();
    }
}

function updateSubjectMasteryPartial(gameId, score, correct, total) {
    const game = gamesDatabase.find(g => g.id === gameId);
    if (!game) return;

    const category =
        typeof game.category === 'function'
            ? game.category()
            : game.category;

    if (!ProgressAnalytics.subjectMastery[category]) {
        ProgressAnalytics.subjectMastery[category] = {
            gamesPlayed: 0,
            totalScore: 0,
            totalCorrect: 0,
            totalQuestions: 0,
            lastPlayed: null
        };
    }

    const mastery = ProgressAnalytics.subjectMastery[category];

    // 🚨 DO NOT increment gamesPlayed here
    mastery.totalCorrect += correct;
    mastery.totalQuestions += total;

    mastery.accuracy =
        ((mastery.totalCorrect / mastery.totalQuestions) * 100).toFixed(1);
}


// Update subject mastery scores
function updateSubjectMastery(gameId, score, correct, total) {
    const game = gamesDatabase.find(g => g.id === gameId);
    if (!game) return;

    const category = typeof game.category === 'function' ? game.category() : game.category;
    if (!ProgressAnalytics.subjectMastery[category]) {
        ProgressAnalytics.subjectMastery[category] = {
            gamesPlayed: 0,
            totalScore: 0,
            totalCorrect: 0,
            totalQuestions: 0,
            lastPlayed: null
        };
    }

    const mastery = ProgressAnalytics.subjectMastery[category];
    mastery.gamesPlayed++;
    mastery.totalScore += score;
    mastery.totalCorrect += correct;
    mastery.totalQuestions += total;
    mastery.lastPlayed = new Date().toISOString();
    mastery.averageScore = (mastery.totalScore / mastery.gamesPlayed).toFixed(1);
    mastery.accuracy = ((mastery.totalCorrect / mastery.totalQuestions) * 100).toFixed(1);
}

// Update resilience metrics
function updateResilienceMetrics(gameId, score) {
    const scorePercent = Math.min(100, score);

    if (gameId.includes('emergency') || gameId.includes('savings')) {
        ProgressAnalytics.resilienceMetrics.emergencyFundScore =
            Math.round((ProgressAnalytics.resilienceMetrics.emergencyFundScore + scorePercent) / 2);
        ProgressAnalytics.resilienceMetrics.savingsConsistency =
            Math.round((ProgressAnalytics.resilienceMetrics.savingsConsistency + scorePercent) / 2);
    }

    if (gameId.includes('debt') || gameId.includes('loan') || gameId.includes('credit')) {
        ProgressAnalytics.resilienceMetrics.debtManagementScore =
            Math.round((ProgressAnalytics.resilienceMetrics.debtManagementScore + scorePercent) / 2);
    }

    if (gameId.includes('investment') || gameId.includes('stock')) {
        ProgressAnalytics.resilienceMetrics.investmentKnowledge =
            Math.round((ProgressAnalytics.resilienceMetrics.investmentKnowledge + scorePercent) / 2);
    }
}

// Update spending habits based on game choices
function updateSpendingHabits(gameId, mistakes) {
    // This would be customized based on specific game mechanics
    // For now, we'll use a simplified approach
    if (gameId.includes('budget')) {
        mistakes.forEach(mistake => {
            if (mistake.type === 'overspending') {
                ProgressAnalytics.spendingHabits.wants += 5;
            } else if (mistake.type === 'undersaving') {
                ProgressAnalytics.spendingHabits.savings -= 3;
            }
        });
    }

    // Normalize values to percentages
    const total = Object.values(ProgressAnalytics.spendingHabits).reduce((a, b) => a + b, 0);
    if (total > 0) {
        Object.keys(ProgressAnalytics.spendingHabits).forEach(key => {
            ProgressAnalytics.spendingHabits[key] =
                Math.round((ProgressAnalytics.spendingHabits[key] / total) * 100);
        });
    }
}

// Calculate overall financial IQ score
function calculateFinancialIQ() {
    if (ProgressAnalytics.gameHistory.length === 0) {
        return 0;
    }

    // Weighted calculation
    const recentGames = ProgressAnalytics.gameHistory.slice(-20);
    const avgScore = recentGames.reduce((sum, game) => sum + parseFloat(game.accuracy), 0) / recentGames.length;

    const resilienceAvg = Object.values(ProgressAnalytics.resilienceMetrics)
        .reduce((a, b) => a + b, 0) / 4;

    const financialIQ = Math.round((avgScore * 0.6 + resilienceAvg * 0.4));

    return Math.min(100, financialIQ);
}

// Get IQ rank label
function getIQRank(score) {
    if (score >= 90) return { label: I18N.t('anaIQRankMaster'), color: '#10b981', emoji: '🏆' };
    if (score >= 80) return { label: I18N.t('anaIQRankExpert'), color: '#3b82f6', emoji: '⭐' };
    if (score >= 70) return { label: I18N.t('anaIQRankAdvanced'), color: '#6366f1', emoji: '🎯' };
    if (score >= 60) return { label: I18N.t('anaIQRankInter'), color: '#f59e0b', emoji: '📈' };
    if (score >= 50) return { label: I18N.t('anaIQRankDev'), color: '#f97316', emoji: '🌱' };
    return { label: I18N.t('anaIQRankBeg'), color: '#64748b', emoji: '🎓' };
}

// Generate personalized improvement instructions
function generateImprovementInstructions() {
    const instructions = [];
    const iq = calculateFinancialIQ();

    // Analyze weak areas
    const subjectScores = Object.entries(ProgressAnalytics.subjectMastery)
        .map(([subject, data]) => ({
            subject,
            accuracy: parseFloat(data.accuracy) || 0,
            gamesPlayed: data.gamesPlayed
        }))
        .sort((a, b) => a.accuracy - b.accuracy);

    // Top weak subject
    if (subjectScores.length > 0 && subjectScores[0].accuracy < 70) {
        instructions.push({
            icon: '🎯',
            title: I18N.t('anaFocusOn').replace('{subject}', subjectScores[0].subject),
            description: I18N.t('anaFocusDesc').replace('{subject}', subjectScores[0].subject).replace('{accuracy}', subjectScores[0].accuracy),
            priority: 'high'
        });
    }

    // Recent mistakes pattern
    const recentMistakes = ProgressAnalytics.mistakeLog.slice(-10);
    const mistakeTypes = {};
    recentMistakes.forEach(m => {
        mistakeTypes[m.type] = (mistakeTypes[m.type] || 0) + 1;
    });

    const commonMistake = Object.entries(mistakeTypes).sort((a, b) => b[1] - a[1])[0];
    if (commonMistake) {
        instructions.push({
            icon: '⚠️',
            title: I18N.t('anaWatchOut').replace('{mistake}', commonMistake[0]),
            description: I18N.t('anaWatchOutDesc').replace('{mistake}', commonMistake[0]).replace('{count}', commonMistake[1]),
            priority: 'medium'
        });
    }

    // Resilience improvement
    const weakResilience = Object.entries(ProgressAnalytics.resilienceMetrics)
        .sort((a, b) => a[1] - b[1])[0];

    if (weakResilience && weakResilience[1] < 50) {
        const resilienceNames = {
            emergencyFundScore: I18N.t('factorEmergency'),
            debtManagementScore: I18N.t('factorDebt'),
            savingsConsistency: I18N.t('factorSavings'),
            investmentKnowledge: I18N.t('factorInvestment')
        };

        instructions.push({
            icon: '🛡️',
            title: I18N.t('anaStrengthen').replace('{metric}', resilienceNames[weakResilience[0]]),
            description: I18N.t('anaStrengthenDesc'),
            priority: 'high'
        });
    }

    // General advice based on IQ
    if (iq < 60) {
        instructions.push({
            icon: '📚',
            title: I18N.t('anaStartBasics'),
            description: I18N.t('anaStartBasicsDesc'),
            priority: 'high'
        });
    } else if (iq >= 80) {
        instructions.push({
            icon: '🚀',
            title: I18N.t('anaChallengeYourself'),
            description: I18N.t('anaChallengeYourselfDesc'),
            priority: 'low'
        });
    }

    // Time management
    const avgTime = ProgressAnalytics.gameHistory.slice(-10)
        .reduce((sum, g) => sum + (g.timeTaken || 0), 0) / 10;

    if (avgTime > 300) { // More than 5 minutes
        instructions.push({
            icon: '⏱️',
            title: I18N.t('anaImproveSpeed'),
            description: I18N.t('anaImproveSpeedDesc'),
            priority: 'low'
        });
    }

    return instructions;
}

// Generate personalized learning tips
function generateLearningTips() {
    const tips = [];
    const iq = calculateFinancialIQ();

    // Budget management tip
    tips.push({
        icon: '💰',
        title: I18N.t('anaTip503020'),
        description: I18N.t('anaTip503020Des'),
        action: I18N.t('anaActionBudget'),
        gameId: 'budget-boss'
    });

    // Emergency fund tip
    if (ProgressAnalytics.resilienceMetrics.emergencyFundScore < 70) {
        tips.push({
            icon: '🚨',
            title: I18N.t('anaTipEmerFund'),
            description: I18N.t('anaTipEmerFundDes'),
            action: I18N.t('anaActionEmerFund'),
            gameId: 'emergency-fund'
        });
    }

    // Debt management tip
    if (ProgressAnalytics.resilienceMetrics.debtManagementScore < 70) {
        tips.push({
            icon: '📉',
            title: I18N.t('anaTipDebt'),
            description: I18N.t('anaTipDebtDes'),
            action: I18N.t('anaActionDebt'),
            gameId: 'savings-sprint'
        });
    }

    // Credit score tip
    const creditGames = ProgressAnalytics.gameHistory.filter(g => g.gameId.includes('credit'));
    if (creditGames.length < 3) {
        tips.push({
            icon: '💳',
            title: I18N.t('anaTipCredit'),
            description: I18N.t('anaTipCreditDes'),
            action: I18N.t('anaActionCredit'),
            gameId: 'credit-card'
        });
    }

    // Investment tip
    if (ProgressAnalytics.resilienceMetrics.investmentKnowledge < 60) {
        tips.push({
            icon: '📈',
            title: I18N.t('anaTipInvest'),
            description: I18N.t('anaTipInvestDes'),
            action: I18N.t('anaActionInvest'),
            gameId: 'investment-game'
        });
    }

    // Tax tip
    tips.push({
        icon: '🧾',
        title: I18N.t('anaTipTax'),
        description: I18N.t('anaTipTaxDes'),
        action: I18N.t('anaActionTax'),
        gameId: 'tax-trivia'
    });

    return tips.slice(0, 4); // Return top 4 most relevant
}

// Render the complete progress dashboard
function renderProgressDashboard() {
    const iq = calculateFinancialIQ();
    const rank = getIQRank(iq);

    // 1. Hero Score Card
    renderHeroScore(iq, rank);

    // 2. Subject Mastery (Chart)
    renderSubjectChart();

    // 3. Improvement Instructions
    renderImprovementInstructions();

    // 4. Mistake Review
    renderMistakeGallery();

    // 5. Spending Habits (Chart)
    renderSpendingChart();

    // 6. Resilience Score
    renderResilienceScore();

    // 7. Learning Path
    renderLearningPath();

    // 8. Recent Activity
    renderRecentActivity();

    // 9. History Chart
    renderHistoryChart();
}

// 1. Render Hero Score
function renderHeroScore(iq, rank) {
    const container = document.getElementById('studentScoreContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="score-display" style="color: ${rank.color};">
            ${iq}<span style="font-size: 0.5em; opacity: 0.7;">/100</span>
        </div>
        <div class="score-rank-badge">
            <span>${rank.emoji}</span>
            <span>${rank.label}</span>
        </div>
    `;
}

// 2. Render Subject Mastery Chart
function renderSubjectChart() {
    // Remove loading state
    const canvas = document.getElementById('subjectChart');
    if (canvas && canvas.parentElement) {
        canvas.parentElement.classList.remove('chart-loading');
    }

    if (!ProgressAnalytics.charts.subject) return;

    const subjects = Object.entries(ProgressAnalytics.subjectMastery)
        .sort((a, b) => b[1].gamesPlayed - a[1].gamesPlayed);

    if (subjects.length === 0) {
        // Show empty state with sample data
        ProgressAnalytics.charts.subject.data.labels = ['Play games to see your progress!'];
        ProgressAnalytics.charts.subject.data.datasets[0].data = [0];
        ProgressAnalytics.charts.subject.data.datasets[0].backgroundColor = 'rgba(156, 163, 175, 0.3)';
        ProgressAnalytics.charts.subject.update();
        return;
    }

    const labels = subjects.map(([name]) => name);
    const data = subjects.map(([, stats]) => {
        return ((stats.correct / stats.total) * 100).toFixed(1);
    });

    ProgressAnalytics.charts.subject.data.labels = labels;
    ProgressAnalytics.charts.subject.data.datasets[0].data = data;
    ProgressAnalytics.charts.subject.data.datasets[0].backgroundColor = 'rgba(99, 102, 241, 0.6)';
    ProgressAnalytics.charts.subject.update();
}

// 3. Render Improvement Instructions
function renderImprovementInstructions() {
    const container = document.getElementById('improvementInstructions');
    if (!container) return;

    const instructions = generateImprovementInstructions();

    if (instructions.length === 0) {
        container.innerHTML = `
            <div class="instruction-item">
                <div class="instruction-icon">✨</div>
                <div class="instruction-text">
                    <div class="instruction-title">${I18N.t('anaChallengeYourself')}</div>
                    <div class="instruction-desc">${I18N.t('anaChallengeYourselfDesc')}</div>
                </div>
            </div>
        `;
        return;
    }

    const html = instructions.map(inst => `
        <div class="instruction-item">
            <div class="instruction-icon">${inst.icon}</div>
            <div class="instruction-text">
                <div class="instruction-title">${inst.title}</div>
                <div class="instruction-desc">${inst.description}</div>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

// 4. Render Mistake Gallery
function renderMistakeGallery() {
    const container = document.getElementById('mistakeGallery');
    if (!container) return;

    const recentMistakes = ProgressAnalytics.mistakeLog.slice(-6).reverse();

    if (recentMistakes.length === 0) {
        container.innerHTML = `
            <div class="mistake-empty">
                <div class="mistake-empty-icon">🎉</div>
                <p>${I18N.t('anaNoMistakes')}</p>
            </div>
        `;
        return;
    }

    const html = recentMistakes.map(mistake => {
        const game = gamesDatabase.find(g => g.id === mistake.gameId);
        const gameIcon = game ? game.icon : '🎮';
        const gameName = game ? (typeof game.title === 'function' ? game.title() : game.title) : 'Unknown Game';
        const date = new Date(mistake.timestamp).toLocaleDateString();

        return `
            <div class="mistake-item">
                <div class="mistake-header">
                    <div class="mistake-icon">${gameIcon}</div>
                    <div class="mistake-meta">
                        <div class="mistake-game">${gameName}</div>
                        <div class="mistake-date">${date}</div>
                    </div>
                </div>
                <div class="mistake-description">
                    ${mistake.description || I18N.t('anaMistakeDefaultDesc')}
                </div>
                <div class="mistake-impact">
                    ${mistake.impact ? `<span class="impact-tag negative">💸 ${mistake.impact}</span>` : ''}
                    ${mistake.type ? `<span class="impact-tag">${mistake.type}</span>` : ''}
                </div>
                <div class="mistake-lesson">
                    <strong>${I18N.t('anaMistakeLesson')}</strong>
                    ${mistake.lesson || I18N.t('anaMistakeDefaultLesson')}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

// 5. Render Spending Habits Chart
function renderSpendingChart() {
    // Remove loading state
    const canvas = document.getElementById('spendingChart');
    if (canvas && canvas.parentElement) {
        canvas.parentElement.classList.remove('chart-loading');
    }

    if (!ProgressAnalytics.charts.spending) return;

    const habits = ProgressAnalytics.spendingHabits;
    const total = Object.values(habits).reduce((a, b) => a + b, 0);

    if (total === 0) {
        // Show empty state with sample data
        ProgressAnalytics.charts.spending.data.datasets[0].data = [25, 25, 25, 25];
        ProgressAnalytics.charts.spending.data.datasets[0].backgroundColor = [
            'rgba(156, 163, 175, 0.3)',
            'rgba(156, 163, 175, 0.3)',
            'rgba(156, 163, 175, 0.3)',
            'rgba(156, 163, 175, 0.3)'
        ];
        ProgressAnalytics.charts.spending.update();
        return;
    }

    const data = [habits.needs, habits.wants, habits.savings, habits.debt];
    ProgressAnalytics.charts.spending.data.datasets[0].backgroundColor = [
        'rgba(16, 185, 129, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(99, 102, 241, 0.8)',
        'rgba(245, 158, 11, 0.8)'
    ];

    ProgressAnalytics.charts.spending.data.datasets[0].data = data;
    ProgressAnalytics.charts.spending.update();
}

// 6. Render Resilience Score
function renderResilienceScore() {
    const container = document.getElementById('resilienceScore');
    if (!container) return;

    const metrics = ProgressAnalytics.resilienceMetrics;
    const overallResilience = Math.round(
        Object.values(metrics).reduce((a, b) => a + b, 0) / 4
    );

    const html = `
        <div class="resilience-gauge" style="--resilience-score: ${overallResilience};">
            <div class="resilience-circle">
                <div class="resilience-value">${overallResilience}</div>
            </div>
        </div>
        <div class="resilience-factors">
            <div class="resilience-factor">
                <div class="factor-value">${metrics.emergencyFundScore}</div>
                <div class="factor-label">Emergency Fund</div>
            </div>
            <div class="resilience-factor">
                <div class="factor-value">${metrics.debtManagementScore}</div>
                <div class="factor-label">Debt Control</div>
            </div>
            <div class="resilience-factor">
                <div class="factor-value">${metrics.savingsConsistency}</div>
                <div class="factor-label">Savings Habit</div>
            </div>
            <div class="resilience-factor">
                <div class="factor-value">${metrics.investmentKnowledge}</div>
                <div class="factor-label">Investment IQ</div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// 7. Render Learning Path
function renderLearningPath() {
    const container = document.getElementById('personalizedTips');
    if (!container) return;

    const tips = generateLearningTips();

    const html = tips.map(tip => `
        <div class="tip-item">
            <div class="tip-icon">${tip.icon}</div>
            <div class="tip-content">
                <div class="tip-title">${tip.title}</div>
                <div class="tip-description">${tip.description}</div>
                <a href="#" class="tip-action" onclick="navigateToPage('home'); return false;">
                    ${tip.action} →
                </a>
            </div>
        </div>
    `).join('');

    container.innerHTML = html;
}

// 8. Render Recent Activity
function renderRecentActivity() {
    const container = document.getElementById('recentActivity');
    if (!container) return;

    const recentGames = ProgressAnalytics.gameHistory.slice(-8).reverse();

    if (recentGames.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 30px 20px; color: var(--progress-text-muted);">
                <div style="font-size: 40px; margin-bottom: 8px;">🎮</div>
                <p>${I18N.t('anaNoActivity')}</p>
            </div>
        `;
        return;
    }

    const html = `
        <div class="activity-timeline">
            ${recentGames.map(game => {
        const gameData = gamesDatabase.find(g => g.id === game.gameId);
        const gameName = gameData ? (typeof gameData.title === 'function' ? gameData.title() : gameData.title) : 'Unknown';
        const timeAgo = getTimeAgo(game.timestamp);

        return `
                    <div class="activity-item">
                        <div class="activity-content">
                            <div class="activity-game">${gameName}</div>
                            <div class="activity-action">
                                ${I18N.t('anaScored').replace('{points}', game.score).replace('{accuracy}', game.accuracy)}
                            </div>
                            <div class="activity-time">${timeAgo}</div>
                        </div>
                    </div>
                `;
    }).join('')}
        </div>
    `;

    container.innerHTML = html;
}

// 9. Render History Chart
function renderHistoryChart() {
    // Remove loading state
    const canvas = document.getElementById('historyChart');
    if (canvas && canvas.parentElement) {
        canvas.parentElement.classList.remove('chart-loading');
    }

    if (!ProgressAnalytics.charts.history) return;

    const history = ProgressAnalytics.gameHistory.slice(-10);

    if (history.length === 0) {
        // Show empty state
        ProgressAnalytics.charts.history.data.labels = ['No data yet'];
        ProgressAnalytics.charts.history.data.datasets[0].data = [0];
        ProgressAnalytics.charts.history.update();
        return;
    }

    const labels = history.map((_, index) => I18N.t('anaHistoryLabel').replace('{n}', index + 1));
    const data = history.map(game => parseFloat(game.accuracy));

    ProgressAnalytics.charts.history.data.labels = labels;
    ProgressAnalytics.charts.history.data.datasets[0].data = data;
    ProgressAnalytics.charts.history.update();
}

// Helper Functions
function getSubjectIcon(subject) {
    const icons = {
        'Budgeting': '💰',
        'Credit Management': '💳',
        'Investing': '📈',
        'Debt Management': '📉',
        'Savings': '🐖',
        'Emergency Fund': '🚨',
        'Taxes': '🧾',
        'Insurance': '🛡️',
        'Real Estate': '🏠',
        'Stock Market': '📊'
    };
    return icons[subject] || '🎓';
}

function getAccuracyColor(accuracy) {
    if (accuracy >= 90) return 'var(--progress-accent-success)';
    if (accuracy >= 75) return 'var(--progress-accent-info)';
    if (accuracy >= 60) return 'var(--progress-accent-warning)';
    return 'var(--progress-accent-danger)';
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return I18N.t('anaJustNow');
    if (diffMins < 60) return I18N.t('anaMAgo').replace('{m}', diffMins);
    if (diffHours < 24) return I18N.t('anaHAgo').replace('{h}', diffHours);
    if (diffDays < 7) return I18N.t('anaDAgo').replace('{d}', diffDays);
    return past.toLocaleDateString();
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProgressAnalytics);
} else {
    initProgressAnalytics();
}

// Export for use in other modules
window.ProgressAnalytics = ProgressAnalytics;
window.logGameCompletion = logGameCompletion;
window.renderProgressDashboard = renderProgressDashboard;
