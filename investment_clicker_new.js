// ============================================
// GAME 3: INVESTMENT GROWTH (Interactive Redesign)
// ============================================
function loadInvestmentClicker() {
    const container = document.getElementById('gameContainer');

    let gameState = {
        balance: 1000,
        portfolio: {
            savings: 0,
            bonds: 0,
            stocks: 0
        },
        years: 0,
        targetYears: 10,
        history: [{ year: 0, total: 1000, savings: 0, bonds: 0, stocks: 0 }],
        events: [],
        marketCondition: 'normal',
        firstInvestments: { savings: false, bonds: false, stocks: false },
        diversified: false
    };

    const investmentTypes = {
        savings: {
            name: I18N.t('games.investment.types.savings.name'),
            icon: '💰',
            risk: I18N.t('games.investment.low'),
            riskClass: 'low',
            baseReturn: 0.03,
            volatility: 0
        },
        bonds: {
            name: I18N.t('games.investment.types.bonds.name'),
            icon: '📊',
            risk: I18N.t('games.investment.med'),
            riskClass: 'medium',
            baseReturn: 0.06,
            volatility: 0.02
        },
        stocks: {
            name: I18N.t('games.investment.types.stocks.name'),
            icon: '📈',
            risk: I18N.t('games.investment.high'),
            riskClass: 'high',
            baseReturn: 0.12,
            volatility: 0.08
        }
    };

    const marketEvents = [
        { year: 3, type: 'bull', message: I18N.t('games.investment.events.bull'), effect: { stocks: 1.25 } },
        { year: 5, type: 'crash', message: I18N.t('games.investment.events.crash'), effect: { stocks: 0.85 } },
        { year: 7, type: 'rates', message: I18N.t('games.investment.events.rates'), effect: { bondsRate: 0.08 } },
        { year: 4, type: 'emergency', message: I18N.t('games.investment.events.emergency') + ': -$150', effect: { balance: -150 } }
    ];

    container.innerHTML = `
        <div class="investment-game-v2">
            <!-- Header Stats -->
            <div class="inv-header">
                <div class="inv-stat-card balance">
                    <div class="stat-icon">💵</div>
                    <div class="stat-info">
                        <div class="stat-label">${I18N.t('games.investment.cash')}</div>
                        <div class="stat-value" id="balanceValue">$1,000</div>
                    </div>
                </div>
                <div class="inv-stat-card portfolio">
                    <div class="stat-icon">💼</div>
                    <div class="stat-info">
                        <div class="stat-label">${I18N.t('games.investment.portfolio')}</div>
                        <div class="stat-value" id="portfolioValue">$0</div>
                    </div>
                </div>
                <div class="inv-stat-card years">
                    <div class="stat-icon">📅</div>
                    <div class="stat-info">
                        <div class="stat-label">${I18N.t('games.investment.year')}</div>
                        <div class="stat-value" id="yearValue">0 / 10</div>
                    </div>
                </div>
            </div>

            <!-- Investment Options -->
            <div class="investment-options">
                <h3>${I18N.t('games.investment.choose')}</h3>
                <div class="investment-cards">
                    ${Object.entries(investmentTypes).map(([key, type]) => `
                        <div class="inv-card" data-type="${key}">
                            <div class="inv-card-header">
                                <span class="inv-icon">${type.icon}</span>
                                <span class="inv-name">${type.name}</span>
                            </div>
                            <div class="inv-card-body">
                                <div class="inv-risk ${type.riskClass}">${I18N.t('games.investment.risk')}: ${type.risk}</div>
                                <div class="inv-return">${(type.baseReturn * 100).toFixed(0)}% ${I18N.t('games.investment.return')}</div>
                                <div class="inv-amount" id="${key}Amount">$0</div>
                            </div>
                            <div class="inv-card-footer">
                                <input type="range" min="0" max="500" step="50" value="0" 
                                       class="inv-slider" id="${key}Slider">
                                <div class="slider-value" id="${key}SliderValue">$0</div>
                                <button class="inv-invest-btn" data-type="${key}">${I18N.t('games.investment.invest')}</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Growth Visualization -->
            <div class="growth-section">
                <h3>${I18N.t('games.investment.growth')}</h3>
                <div class="growth-chart" id="growthChart">
                    <div class="chart-bars" id="chartBars"></div>
                    <div class="chart-labels">
                        <span>Year 0</span>
                        <span>Year 5</span>
                        <span>Year 10</span>
                    </div>
                </div>
            </div>

            <!-- Event Feed -->
            <div class="event-feed" id="eventFeed">
                <div class="event-item info">
                    <span class="event-icon">💡</span>
                    <span>Start investing to grow your wealth!</span>
                </div>
            </div>

            <!-- Action Button -->
            <button class="year-advance-btn" id="advanceYear">
                <span class="btn-icon">⏭️</span>
                <span class="btn-text">${I18N.t('games.investment.advance')}</span>
            </button>
        </div>

        <style>
            .investment-game-v2 {
                max-width: 1000px;
                margin: 0 auto;
                padding: 30px;
            }
            
            .inv-header {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .inv-stat-card {
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: 16px;
                padding: 20px;
                display: flex;
                align-items: center;
                gap: 15px;
                transition: all 0.3s ease;
            }
            
            .inv-stat-card:hover {
                transform: translateY(-4px);
                box-shadow: var(--shadow-lg);
                border-color: var(--primary);
            }
            
            .stat-icon {
                font-size: 36px;
            }
            
            .stat-label {
                font-size: 12px;
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
            }
            
            .stat-value {
                font-size: 24px;
                font-weight: 800;
                color: var(--primary);
            }
            
            .investment-options h3 {
                color: var(--text-primary);
                margin-bottom: 20px;
                font-size: 20px;
            }
            
            .investment-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .inv-card {
                background: var(--card-bg);
                border: 2px solid var(--border-color);
                border-radius: 16px;
                padding: 20px;
                transition: all 0.3s ease;
            }
            
            .inv-card:hover {
                transform: translateY(-4px);
                box-shadow: var(--shadow-xl);
            }
            
            .inv-card-header {
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 15px;
            }
            
            .inv-icon {
                font-size: 32px;
            }
            
            .inv-name {
                font-size: 18px;
                font-weight: 700;
                color: var(--text-primary);
            }
            
            .inv-card-body {
                margin-bottom: 15px;
            }
            
            .inv-risk {
                display: inline-block;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
                margin-bottom: 8px;
            }
            
            .inv-risk.low {
                background: rgba(16, 185, 129, 0.2);
                color: var(--success);
            }
            
            .inv-risk.medium {
                background: rgba(245, 158, 11, 0.2);
                color: var(--warning);
            }
            
            .inv-risk.high {
                background: rgba(239, 68, 68, 0.2);
                color: var(--error);
            }
            
            .inv-return {
                font-size: 14px;
                color: var(--text-secondary);
                margin-bottom: 8px;
            }
            
            .inv-amount {
                font-size: 20px;
                font-weight: 700;
                color: var(--success);
            }
            
            .inv-card-footer {
                border-top: 1px solid var(--border-color);
                padding-top: 15px;
            }
            
            .inv-slider {
                width: 100%;
                margin-bottom: 10px;
            }
            
            .slider-value {
                text-align: center;
                font-size: 16px;
                font-weight: 600;
                color: var(--primary);
                margin-bottom: 10px;
            }
            
            .inv-invest-btn {
                width: 100%;
                padding: 12px;
                background: var(--primary);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 14px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .inv-invest-btn:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
            }
            
            .inv-invest-btn:disabled {
                background: var(--bg-tertiary);
                color: var(--text-secondary);
                cursor: not-allowed;
                transform: none;
            }
            
            .growth-section {
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: 16px;
                padding: 25px;
                margin-bottom: 25px;
            }
            
            .growth-section h3 {
                color: var(--text-primary);
                margin-bottom: 20px;
                font-size: 18px;
            }
            
            .growth-chart {
                position: relative;
                height: 200px;
                background: var(--bg-color);
                border-radius: 12px;
                padding: 20px;
            }
            
            .chart-bars {
                display: flex;
                align-items: flex-end;
                justify-content: space-around;
                height: 140px;
                gap: 5px;
            }
            
            .chart-bar {
                flex: 1;
                background: linear-gradient(to top, var(--primary), var(--success));
                border-radius: 4px 4px 0 0;
                min-height: 5px;
                transition: all 0.5s ease;
                position: relative;
            }
            
            .chart-bar:hover::after {
                content: attr(data-value);
                position: absolute;
                top: -30px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--bg-tertiary);
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
            }
            
            .chart-labels {
                display: flex;
                justify-content: space-between;
                margin-top: 10px;
                font-size: 12px;
                color: var(--text-secondary);
            }
            
            .event-feed {
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: 16px;
                padding: 20px;
                margin-bottom: 25px;
                max-height: 150px;
                overflow-y: auto;
            }
            
            .event-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                margin-bottom: 8px;
                border-radius: 8px;
                font-size: 14px;
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            .event-item.info {
                background: rgba(99, 102, 241, 0.1);
                color: var(--primary);
            }
            
            .event-item.success {
                background: rgba(16, 185, 129, 0.1);
                color: var(--success);
            }
            
            .event-item.warning {
                background: rgba(245, 158, 11, 0.1);
                color: var(--warning);
            }
            
            .event-item.error {
                background: rgba(239, 68, 68, 0.1);
                color: var(--error);
            }
            
            .event-icon {
                font-size: 18px;
            }
            
            .year-advance-btn {
                width: 100%;
                padding: 20px;
                background: linear-gradient(135deg, var(--success), #059669);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 18px;
                font-weight: 700;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                transition: all 0.3s ease;
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
            }
            
            .year-advance-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
            }
            
            .year-advance-btn:active {
                transform: translateY(0);
            }
            
            .btn-icon {
                font-size: 24px;
            }
            
            /* Educational Modal */
            .edu-modal-investment {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .edu-modal-investment.active {
                opacity: 1;
                visibility: visible;
            }
            
            .edu-modal-content-inv {
                background: var(--card-bg);
                border-radius: 20px;
                padding: 35px;
                max-width: 500px;
                width: 90%;
                box-shadow: var(--shadow-xl);
                border: 2px solid var(--primary);
                animation: modalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            @keyframes modalPop {
                from {
                    transform: scale(0.8);
                    opacity: 0;
                }
                to {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            
            .edu-modal-header-inv {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .edu-modal-icon-inv {
                font-size: 42px;
            }
            
            .edu-modal-title-inv {
                font-size: 24px;
                font-weight: 800;
                color: var(--primary);
                margin: 0;
            }
            
            .edu-modal-body-inv {
                color: var(--text-primary);
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 25px;
            }
            
            .edu-modal-close-inv {
                width: 100%;
                padding: 12px;
                background: var(--primary);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .edu-modal-close-inv:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
            }
            
            @media (max-width: 768px) {
                .investment-cards {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    `;

    // Initialize sliders
    Object.keys(investmentTypes).forEach(type => {
        const slider = document.getElementById(`${type}Slider`);
        const valueDisplay = document.getElementById(`${type}SliderValue`);

        slider.addEventListener('input', (e) => {
            valueDisplay.textContent = `$${e.target.value}`;
        });
    });

    // Investment button handlers
    document.querySelectorAll('.inv-invest-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            const slider = document.getElementById(`${type}Slider`);
            const amount = parseInt(slider.value);

            if (amount > 0 && gameState.balance >= amount) {
                gameState.balance -= amount;
                gameState.portfolio[type] += amount;

                // Show educational popup on first investment
                if (!gameState.firstInvestments[type]) {
                    gameState.firstInvestments[type] = true;
                    showEducationalModal(type);
                }

                // Check for diversification
                checkDiversification();

                addEvent(`Invested $${amount} in ${investmentTypes[type].name}`, 'success');
                updateUI();
                playSound('click');

                // Reset slider
                slider.value = 0;
                document.getElementById(`${type}SliderValue`).textContent = '$0';
            } else if (amount > gameState.balance) {
                addEvent('Not enough cash available!', 'error');
                playSound('error');
            }
        });
    });

    // Advance year button
    document.getElementById('advanceYear').addEventListener('click', () => {
        advanceYear();
    });

    function advanceYear() {
        gameState.years++;

        // Apply returns
        let totalGrowth = 0;
        Object.keys(gameState.portfolio).forEach(type => {
            if (gameState.portfolio[type] > 0) {
                const typeData = investmentTypes[type];
                let returnRate = typeData.baseReturn;

                // Add volatility for stocks and bonds
                if (type === 'stocks') {
                    returnRate += (Math.random() - 0.5) * typeData.volatility * 2;
                } else if (type === 'bonds') {
                    returnRate += (Math.random() - 0.5) * typeData.volatility;
                }

                const growth = gameState.portfolio[type] * returnRate;
                gameState.portfolio[type] += growth;
                totalGrowth += growth;
            }
        });

        gameState.balance += totalGrowth;

        // Check for market events
        const event = marketEvents.find(e => e.year === gameState.years);
        if (event) {
            applyMarketEvent(event);
        }

        // Record history
        const totalPortfolio = Object.values(gameState.portfolio).reduce((a, b) => a + b, 0);
        gameState.history.push({
            year: gameState.years,
            total: gameState.balance,
            ...gameState.portfolio
        });

        if (totalGrowth > 0) {
            addEvent(`Year ${gameState.years}: Portfolio grew by $${totalGrowth.toFixed(2)}!`, 'success');
        }

        updateUI();
        updateChart();
        playSound('success');

        // Check if game is complete
        if (gameState.years >= gameState.targetYears) {
            endGame();
        }
    }

    function applyMarketEvent(event) {
        addEvent(event.message, event.type === 'crash' || event.type === 'emergency' ? 'warning' : 'info');

        if (event.effect.stocks) {
            gameState.portfolio.stocks *= event.effect.stocks;
        }
        if (event.effect.bondsRate) {
            investmentTypes.bonds.baseReturn = event.effect.bondsRate;
        }
        if (event.effect.balance) {
            gameState.balance += event.effect.balance;
        }
    }

    function checkDiversification() {
        const invested = Object.values(gameState.portfolio).filter(v => v > 0).length;
        if (invested >= 3 && !gameState.diversified) {
            gameState.diversified = true;
            showDiversificationModal();
        }
    }

    function showEducationalModal(type) {
        // Use I18N for titles and content
        // Helper to get nested keys safely
        const titleKey = `games.investment.lessons.${type}.title`;
        const contentKey = `games.investment.lessons.${type}.content`;

        const lessons = {
            savings: { icon: '💰' },
            bonds: { icon: '📊' },
            stocks: { icon: '📈' }
        };

        const lesson = lessons[type];
        createModal(lesson.icon, I18N.t(titleKey), I18N.t(contentKey));
    }

    function showDiversificationModal() {
        createModal('🎯', I18N.t('games.investment.diversification.title'),
            I18N.t('games.investment.diversification.content'));
    }

    function createModal(icon, title, content) {
        let modal = document.getElementById('eduModalInvestment');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'eduModalInvestment';
            modal.className = 'edu-modal-investment';
            modal.innerHTML = `
                <div class="edu-modal-content-inv">
                    <div class="edu-modal-header-inv">
                        <div class="edu-modal-icon-inv" id="modalIconInv"></div>
                        <h2 class="edu-modal-title-inv" id="modalTitleInv"></h2>
                    </div>
                    <div class="edu-modal-body-inv" id="modalBodyInv"></div>
                    <button class="edu-modal-close-inv" onclick="document.getElementById('eduModalInvestment').classList.remove('active')">Got it! 👍</button>
                </div>
            `;
            document.body.appendChild(modal);

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }

        document.getElementById('modalIconInv').textContent = icon;
        document.getElementById('modalTitleInv').textContent = title;
        document.getElementById('modalBodyInv').textContent = content;

        setTimeout(() => {
            modal.classList.add('active');
        }, 300);
    }

    function addEvent(message, type = 'info') {
        const feed = document.getElementById('eventFeed');
        const event = document.createElement('div');
        event.className = `event-item ${type}`;

        const icons = { info: '💡', success: '✅', warning: '⚠️', error: '❌' };
        event.innerHTML = `
            <span class="event-icon">${icons[type]}</span>
            <span>${message}</span>
        `;

        feed.insertBefore(event, feed.firstChild);

        // Keep only last 5 events
        while (feed.children.length > 5) {
            feed.removeChild(feed.lastChild);
        }
    }

    function updateUI() {
        document.getElementById('balanceValue').textContent = `$${gameState.balance.toFixed(0)}`;

        const totalPortfolio = Object.values(gameState.portfolio).reduce((a, b) => a + b, 0);
        document.getElementById('portfolioValue').textContent = `$${totalPortfolio.toFixed(0)}`;
        document.getElementById('yearValue').textContent = `${gameState.years} / ${gameState.targetYears}`;

        // Update investment amounts
        Object.keys(investmentTypes).forEach(type => {
            document.getElementById(`${type}Amount`).textContent = `$${gameState.portfolio[type].toFixed(0)}`;
        });
    }

    function updateChart() {
        const chartBars = document.getElementById('chartBars');
        chartBars.innerHTML = '';

        const maxValue = Math.max(...gameState.history.map(h => h.total), 1000);

        gameState.history.forEach(record => {
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            const height = (record.total / maxValue) * 100;
            bar.style.height = `${height}%`;
            bar.setAttribute('data-value', `$${record.total.toFixed(0)}`);
            chartBars.appendChild(bar);
        });
    }

    function endGame() {
        const totalValue = gameState.balance;
        const profit = totalValue - 1000;
        const roi = ((profit / 1000) * 100).toFixed(1);

        // Calculate strategy score
        let score = Math.min(100, Math.round((totalValue / 2500) * 100));
        if (gameState.diversified) score = Math.min(100, score + 20);

        // Clean up modal
        const modal = document.getElementById('eduModalInvestment');
        if (modal) modal.remove();

        container.innerHTML = `
            <div style="text-align: center; padding: 40px; max-width: 600px; margin: 0 auto;">
                <div style="font-size: 80px; margin-bottom: 20px;">🎉</div>
                <h2 style="font-size: 32px; margin-bottom: 15px; color: var(--text-primary);">${I18N.t('games.investment.endGame.title')}</h2>
                <div style="background: var(--card-bg); padding: 30px; border-radius: 15px; margin: 20px 0; border: 1px solid var(--border-color);">
                    <div style="margin-bottom: 20px;">
                        <div style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase;">${I18N.t('games.investment.endGame.finalValue')}</div>
                        <div style="font-size: 42px; font-weight: 800; color: var(--success);">$${totalValue.toFixed(2)}</div>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <div style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase;">${I18N.t('games.investment.endGame.totalProfit')}</div>
                        <div style="font-size: 32px; font-weight: 700; color: var(--primary);">$${profit.toFixed(2)}</div>
                    </div>
                    <div>
                        <div style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase;">${I18N.t('games.investment.endGame.roi')}</div>
                        <div style="font-size: 28px; font-weight: 700; color: var(--warning);">${roi}%</div>
                    </div>
                </div>
                ${gameState.diversified ? `<p style="font-size: 16px; color: var(--success); margin: 15px 0;">${I18N.t('games.investment.endGame.bonus')}</p>` : ''}
                <p style="font-size: 16px; color: var(--text-secondary); margin: 20px 0;">
                    ${score >= 80 ? "Wall Street Wolf! 🐺" : score >= 50 ? "Smart Investor! 🧠" : "Rookie Number? Try Again! 📉"}
                </p>
                <button onclick="loadInvestmentClicker()" style="padding: 15px 30px; background: var(--primary); color: white; border: none; border-radius: 10px; font-size: 18px; font-weight: 700; cursor: pointer; margin-top: 10px;">${I18N.t('games.investment.endGame.playAgain')}</button>
            </div>
        `;

        finishGame(score, 100);
    }

    updateUI();
    updateChart();
}
