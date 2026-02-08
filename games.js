// ============================================
// GAME 1: BUDGET BOSS (Multi-Level Survival Challenge)
// ============================================
function loadBudgetBoss() {
    // Redirect to the enhanced multi-level Budget Boss game in script.js
    const game = gamesDatabase.find(g => g.id === 'budget-boss');
    const container = document.getElementById('gameContainer');

    if (typeof loadBudgetBossGame === 'function') {
        loadBudgetBossGame(game, container);
    } else {
        console.error('loadBudgetBossGame function not found in script.js');
    }
}


// ============================================
// GAME 2: SAVE OR SINK: DEBT ESCAPE (Life Simulation)
// ============================================
function loadSavingsSprint() {
    const container = document.getElementById('gameContainer');

    // Initialize Help System
    setTimeout(() => initHelpSystem('debt'), 100);

    const levels = {
        1: {
            name: I18N.t('games.saveSink.level1.name'),
            duration: 6,
            income: 12000,
            goal: 2500,
            debtLimit: 6000,
            expenses: { "PG Rent": 4000, "Mess/Food": 3000, "Transport/Stationary": 1000 },
            intro: I18N.t('games.saveSink.level1.intro'),
            temptations: [
                { title: I18N.t('games.saveSink.temptations.canteen.title'), cost: 500, desc: I18N.t('games.saveSink.temptations.canteen.desc') },
                { title: I18N.t('games.saveSink.temptations.tshirt.title'), cost: 1200, desc: I18N.t('games.saveSink.temptations.tshirt.desc') },
                { title: I18N.t('games.saveSink.temptations.movie.title'), cost: 800, desc: I18N.t('games.saveSink.temptations.movie.desc') },
                { title: I18N.t('games.saveSink.temptations.zomato.title'), cost: 600, desc: I18N.t('games.saveSink.temptations.zomato.desc') },
                { title: I18N.t('games.saveSink.temptations.posters.title'), cost: 400, desc: I18N.t('games.saveSink.temptations.posters.desc') },
                { title: I18N.t('games.saveSink.temptations.gaming.title'), cost: 500, desc: I18N.t('games.saveSink.temptations.gaming.desc') },
                { title: I18N.t('games.saveSink.temptations.music.title'), cost: 199, desc: I18N.t('games.saveSink.temptations.music.desc') },
                { title: I18N.t('games.saveSink.temptations.latte.title'), cost: 350, desc: I18N.t('games.saveSink.temptations.latte.desc') },
                { title: I18N.t('games.saveSink.temptations.sneaker.title'), cost: 2500, desc: I18N.t('games.saveSink.temptations.sneaker.desc') },
                { title: I18N.t('games.saveSink.temptations.stationary.title'), cost: 600, desc: I18N.t('games.saveSink.temptations.stationary.desc') },
                { title: I18N.t('games.saveSink.temptations.auto.title'), cost: 200, desc: I18N.t('games.saveSink.temptations.auto.desc') },
                { title: I18N.t('games.saveSink.temptations.recharge.title'), cost: 799, desc: I18N.t('games.saveSink.temptations.recharge.desc') },
                { title: I18N.t('games.saveSink.temptations.maggi.title'), cost: 150, desc: I18N.t('games.saveSink.temptations.maggi.desc') },
                { title: I18N.t('games.saveSink.temptations.textbook.title'), cost: 400, desc: I18N.t('games.saveSink.temptations.textbook.desc') },
                { title: I18N.t('games.saveSink.temptations.party.title'), cost: 1000, desc: I18N.t('games.saveSink.temptations.party.desc') }
            ]
        },
        2: {
            name: I18N.t('games.saveSink.level2.name'),
            duration: 6,
            income: 18000,
            goal: 4000,
            debtLimit: 15000,
            initialDebt: 8000,
            interestRate: 0.04,
            expenses: { "PG Rent": 5000, "Food": 4000, "Internet": 1000, "Laundry": 500 },
            intro: I18N.t('games.saveSink.level2.intro'),
            temptations: [
                { title: I18N.t('games.saveSink.temptations.phoneCase.title'), cost: 800, desc: I18N.t('games.saveSink.temptations.phoneCase.desc') },
                { title: I18N.t('games.saveSink.temptations.appPurchase.title'), cost: 500, desc: I18N.t('games.saveSink.temptations.appPurchase.desc') },
                { title: I18N.t('games.saveSink.temptations.powerBank.title'), cost: 1500, desc: I18N.t('games.saveSink.temptations.powerBank.desc') },
                { title: I18N.t('games.saveSink.temptations.gymMembership.title'), cost: 2000, desc: I18N.t('games.saveSink.temptations.gymMembership.desc') },
                { title: I18N.t('games.saveSink.temptations.onlineCourse.title'), cost: 500, desc: I18N.t('games.saveSink.temptations.onlineCourse.desc') },
                { title: I18N.t('games.saveSink.temptations.hoodie.title'), cost: 1800, desc: I18N.t('games.saveSink.temptations.hoodie.desc') },
                { title: I18N.t('games.saveSink.temptations.keyboard.title'), cost: 3500, desc: I18N.t('games.saveSink.temptations.keyboard.desc') },
                { title: I18N.t('games.saveSink.temptations.ottBundle.title'), cost: 800, desc: I18N.t('games.saveSink.temptations.ottBundle.desc') },
                { title: I18N.t('games.saveSink.temptations.pods.title'), cost: 2500, desc: I18N.t('games.saveSink.temptations.pods.desc') },
                { title: I18N.t('games.saveSink.temptations.designerBag.title'), cost: 2200, desc: I18N.t('games.saveSink.temptations.designerBag.desc') },
                { title: I18N.t('games.saveSink.temptations.vpn.title'), cost: 400, desc: I18N.t('games.saveSink.temptations.vpn.desc') },
                { title: I18N.t('games.saveSink.temptations.fastCharger.title'), cost: 1200, desc: I18N.t('games.saveSink.temptations.fastCharger.desc') },
                { title: I18N.t('games.saveSink.temptations.mobileSkin.title'), cost: 600, desc: I18N.t('games.saveSink.temptations.mobileSkin.desc') },
                { title: I18N.t('games.saveSink.temptations.indieGame.title'), cost: 450, desc: I18N.t('games.saveSink.temptations.indieGame.desc') },
                { title: I18N.t('games.saveSink.temptations.mouse.title'), cost: 900, desc: I18N.t('games.saveSink.temptations.mouse.desc') }
            ]
        },
        3: {
            name: I18N.t('games.saveSink.level3.name'),
            duration: 6,
            income: 25000,
            goal: 6000,
            debtLimit: 30000,
            expenses: { "PG/Rent": 8000, "Food": 6000, "Notes/Books": 2000, "Coffee": 1500 },
            intro: I18N.t('games.saveSink.level3.intro'),
            events: [
                { title: I18N.t('games.saveSink.events.libraryBook.title'), cost: 2000, msg: I18N.t('games.saveSink.events.libraryBook.msg') },
                { title: I18N.t('games.saveSink.events.laptopRepair.title'), cost: 6000, msg: I18N.t('games.saveSink.events.laptopRepair.msg') },
                { title: I18N.t('games.saveSink.events.recordFine.title'), cost: 1000, msg: I18N.t('games.saveSink.events.recordFine.msg') },
                { title: I18N.t('games.saveSink.events.stolenCycle.title'), cost: 4000, msg: I18N.t('games.saveSink.events.stolenCycle.msg') },
                { title: I18N.t('games.saveSink.events.feverMeds.title'), cost: 1500, msg: I18N.t('games.saveSink.events.feverMeds.msg') }
            ],
            temptations: [
                { title: I18N.t('games.saveSink.temptations.energyDrinks.title'), cost: 500, desc: I18N.t('games.saveSink.temptations.energyDrinks.desc') },
                { title: I18N.t('games.saveSink.temptations.pizzaParty.title'), cost: 1200, desc: I18N.t('games.saveSink.temptations.pizzaParty.desc') },
                { title: I18N.t('games.saveSink.temptations.therapy.title'), cost: 1500, desc: I18N.t('games.saveSink.temptations.therapy.desc') },
                { title: I18N.t('games.saveSink.temptations.musicFest.title'), cost: 3000, desc: I18N.t('games.saveSink.temptations.musicFest.desc') },
                { title: I18N.t('games.saveSink.temptations.calculator.title'), cost: 2500, desc: I18N.t('games.saveSink.temptations.calculator.desc') },
                { title: I18N.t('games.saveSink.temptations.uber.title'), cost: 1000, desc: I18N.t('games.saveSink.temptations.uber.desc') },
                { title: I18N.t('games.saveSink.temptations.examGuide.title'), cost: 800, desc: I18N.t('games.saveSink.temptations.examGuide.desc') },
                { title: I18N.t('games.saveSink.temptations.gamingTopup.title'), cost: 1000, desc: I18N.t('games.saveSink.temptations.gamingTopup.desc') },
                { title: I18N.t('games.saveSink.temptations.deskLamp.title'), cost: 1200, desc: I18N.t('games.saveSink.temptations.deskLamp.desc') },
                { title: I18N.t('games.saveSink.temptations.softDrinks.title'), cost: 400, desc: I18N.t('games.saveSink.temptations.softDrinks.desc') },
                { title: I18N.t('games.saveSink.temptations.pillow.title'), cost: 1500, desc: I18N.t('games.saveSink.temptations.pillow.desc') },
                { title: I18N.t('games.saveSink.temptations.stressBall.title'), cost: 300, desc: I18N.t('games.saveSink.temptations.stressBall.desc') },
                { title: I18N.t('games.saveSink.temptations.noiseCancelling.title'), cost: 3500, desc: I18N.t('games.saveSink.temptations.noiseCancelling.desc') },
                { title: I18N.t('games.saveSink.temptations.vitamins.title'), cost: 800, desc: I18N.t('games.saveSink.temptations.vitamins.desc') }
            ]
        },
        4: {
            name: I18N.t('games.saveSink.level4.name'),
            duration: 8,
            income: 45000,
            goal: 15000,
            debtLimit: 60000,
            initialDebt: 37000,
            interestRate: 0.05,
            expenses: { "Rent": 15000, "EMI": 5000, "Food": 8000, "Utilities": 2000 },
            intro: I18N.t('games.saveSink.level4.intro'),
            temptations: [
                { title: I18N.t('games.saveSink.temptations.suit.title'), cost: 8000, desc: I18N.t('games.saveSink.temptations.suit.desc') },
                { title: I18N.t('games.saveSink.temptations.dinner.title'), cost: 5000, desc: I18N.t('games.saveSink.temptations.dinner.desc') },
                { title: I18N.t('games.saveSink.temptations.smartwatch.title'), cost: 4000, desc: I18N.t('games.saveSink.temptations.smartwatch.desc') },
                { title: I18N.t('games.saveSink.temptations.premiumGym.title'), cost: 6000, desc: I18N.t('games.saveSink.temptations.premiumGym.desc') },
                { title: I18N.t('games.saveSink.temptations.getaway.title'), cost: 12000, desc: I18N.t('games.saveSink.temptations.getaway.desc') },
                { title: I18N.t('games.saveSink.temptations.bike.title'), cost: 3500, desc: I18N.t('games.saveSink.temptations.bike.desc') },
                { title: I18N.t('games.saveSink.temptations.perfume.title'), cost: 4500, desc: I18N.t('games.saveSink.temptations.perfume.desc') },
                { title: I18N.t('games.saveSink.temptations.tradingBot.title'), cost: 2000, desc: I18N.t('games.saveSink.temptations.tradingBot.desc') },
                { title: I18N.t('games.saveSink.temptations.decor.title'), cost: 7000, desc: I18N.t('games.saveSink.temptations.decor.desc') },
                { title: I18N.t('games.saveSink.temptations.leatherShoes.title'), cost: 3000, desc: I18N.t('games.saveSink.temptations.leatherShoes.desc') },
                { title: I18N.t('games.saveSink.temptations.gourmetCoffee.title'), cost: 600, desc: I18N.t('games.saveSink.temptations.gourmetCoffee.desc') },
                { title: I18N.t('games.saveSink.temptations.monitor.title'), cost: 2500, desc: I18N.t('games.saveSink.temptations.monitor.desc') },
                { title: I18N.t('games.saveSink.temptations.ergoChair.title'), cost: 15000, desc: I18N.t('games.saveSink.temptations.ergoChair.desc') }
            ]
        },
        5: {
            name: I18N.t('games.saveSink.level5.name'),
            duration: 10,
            income: 50000,
            goal: 0,
            debtLimit: 60000,
            expenses: { "Travel Fund": 10000, "Food": 5000 },
            intro: I18N.t('games.saveSink.level5.intro'),
            temptations: [
                { title: I18N.t('games.saveSink.temptations.goaFlight.title'), cost: 8000, desc: I18N.t('games.saveSink.temptations.goaFlight.desc') },
                { title: I18N.t('games.saveSink.temptations.villa.title'), cost: 6000, desc: I18N.t('games.saveSink.temptations.villa.desc') },
                { title: I18N.t('games.saveSink.temptations.partyPass.title'), cost: 3000, desc: I18N.t('games.saveSink.temptations.partyPass.desc') },
                { title: I18N.t('games.saveSink.temptations.bikini.title'), cost: 4500, desc: I18N.t('games.saveSink.temptations.bikini.desc') },
                { title: I18N.t('games.saveSink.temptations.jeep.title'), cost: 2000, desc: I18N.t('games.saveSink.temptations.jeep.desc') },
                { title: I18N.t('games.saveSink.temptations.seafood.title'), cost: 2500, desc: I18N.t('games.saveSink.temptations.seafood.desc') },
                { title: I18N.t('games.saveSink.temptations.goaMerch.title'), cost: 1500, desc: I18N.t('games.saveSink.temptations.goaMerch.desc') },
                { title: I18N.t('games.saveSink.temptations.polaroids.title'), cost: 5000, desc: I18N.t('games.saveSink.temptations.polaroids.desc') },
                { title: I18N.t('games.saveSink.temptations.sunscreen.title'), cost: 1200, desc: I18N.t('games.saveSink.temptations.sunscreen.desc') },
                { title: I18N.t('games.saveSink.temptations.jetSki.title'), cost: 2000, desc: I18N.t('games.saveSink.temptations.jetSki.desc') }
            ]
        }
    };

    let state = {
        level: 1,
        month: 1,
        savings: 0,
        debt: 0,
        stress: 20,
        shownTemptations: [],
        history: [],
        active: true,
        metrics: {
            totalInterest: 0,
            luxuriesBought: 0,
            luxuriesResisted: 0,
            totalRepaid: 0,
            monthsSurvived: 0
        }
    };

    renderLevelIntro();

    function renderLevelIntro() {
        const lvl = levels[state.level];
        container.innerHTML = `
            <div class="debt-escape-intro">
                <h1 class="lvl-number">YEAR / LEVEL ${state.level}</h1>
                <h2 class="lvl-name">${lvl.name}</h2>
                <p class="lvl-desc">${lvl.intro}</p>
                <button class="start-btn" onclick="window.startDebtMonth()">Begin Month ${state.month} 📅</button>
            </div>
            <style>
                .debt-escape-intro {
                    text-align: center;
                    padding: 50px;
                    background: var(--card-bg);
                    border-radius: 24px;
                    border: 1px solid var(--border-color);
                    box-shadow: var(--shadow-xl);
                }
                .lvl-number { font-size: 24px; color: var(--primary); margin-bottom: 10px; font-weight: 800; }
                .lvl-name { font-size: 48px; margin-bottom: 20px; color: var(--text-primary); }
                .lvl-desc { font-size: 18px; color: var(--text-secondary); margin-bottom: 30px; max-width: 600px; margin-inline: auto; }
                .start-btn { 
                    padding: 18px 45px; background: linear-gradient(135deg, var(--primary), var(--primary-dark)); color: white; 
                    border: none; border-radius: 16px; font-size: 22px; font-weight: 700; cursor: pointer;
                    transition: all 0.3s; box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
                }
                .start-btn:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(99, 102, 241, 0.4); }
            </style>
        `;
    }

    function renderDebtRepay() {
        return `
            <div class="repay-card">
                <h3>📉 Loan Repayment</h3>
                <p>Have surplus cash? Pay down your debt to escape the interest trap!</p>
                <div class="repay-btns">
                    <button class="repay-btn" onclick="window.repayDebt(1000)">Pay ₹1,000</button>
                    <button class="repay-btn" onclick="window.repayDebt(5000)">Pay ₹5,000</button>
                    <button class="repay-btn" onclick="window.repayDebt(${Math.min(state.savings, state.debt)})">Clear Debt (₹${Math.min(state.savings, state.debt)})</button>
                </div>
            </div>
        `;
    }

    window.repayDebt = function (amount) {
        const actual = Math.min(amount, state.savings, state.debt);
        if (actual <= 0) return;

        state.savings -= actual;
        state.debt -= actual;
        state.metrics.totalRepaid += actual;
        showNotification(`Paid ₹${actual} towards debt!`, 'success');

        // Refresh UI
        window.startDebtMonth(true); // Special flag to just re-render
    };

    window.startDebtMonth = function (skipDeduction) {
        const lvl = levels[state.level];
        const fixedCosts = Object.values(lvl.expenses).reduce((a, b) => a + b, 0);

        if (!skipDeduction) {
            state.savings += lvl.income;
            if (state.savings < fixedCosts) {
                const deficit = fixedCosts - state.savings;
                state.debt += deficit;
                state.savings = 0;
                showNotification(`Insufficient funds for bills! ₹${deficit} added to debt.`, 'warning');
            } else {
                state.savings -= fixedCosts;
            }
        }

        renderGameUI(fixedCosts, state.savings);
    };

    function renderGameUI(fixedCosts, initialSavings) {
        const lvl = levels[state.level];

        // Random Event Level 3+
        let eventHtml = '';
        if (state.level === 3 && Math.random() < 0.3) {
            const event = lvl.events[Math.floor(Math.random() * lvl.events.length)];
            state.savings -= event.cost;
            eventHtml = `<div class="event-pop">⚠️ ${event.title}: -₹${event.cost}. ${event.msg}</div>`;
        }

        container.innerHTML = `
            <div class="debt-escape-game">
                <div class="meters">
                    <div class="meter-box level-tracker">
                        <span>${I18N.t('games.saveSink.ui.progress')}</span>
                        <div class="level-pills">
                            ${[1, 2, 3, 4, 5].map(l => `<div class="pill ${state.level >= l ? 'active' : ''} ${state.level === l ? 'current' : ''}"></div>`).join('')}
                        </div>
                        <span class="meter-val">Level ${state.level} / 5</span>
                    </div>
                    <div class="meter-box savings-meter">
                        <span>${I18N.t('games.saveSink.ui.savings')}</span>
                        <div class="meter-bar">
                            <div class="meter-fill savings-fill" style="width: ${Math.max(0, Math.min(100, (state.savings / lvl.goal) * 100))}%"></div>
                        </div>
                        <span class="meter-val">₹${state.savings.toLocaleString()} / ₹${lvl.goal.toLocaleString()}</span>
                    </div>
                    ${state.debt > 0 ? `
                        <div class="meter-box debt-meter">
                            <span>${I18N.t('games.saveSink.ui.debt')}</span>
                            <div class="meter-bar">
                                <div class="meter-fill debt-fill" style="width: ${Math.min(100, (state.debt / lvl.debtLimit) * 100)}%"></div>
                            </div>
                            <span class="meter-val">₹${state.debt.toLocaleString()} / ₹${lvl.debtLimit.toLocaleString()}</span>
                        </div>
                    ` : ''}
                    ${state.level === 3 ? `
                        <div class="meter-box stress-meter">
                            <span>${I18N.t('games.saveSink.ui.stress')}</span>
                            <div class="meter-bar">
                                <div class="meter-fill stress-fill" style="width: ${state.stress}%"></div>
                            </div>
                            <span class="meter-val">${state.stress}%</span>
                        </div>
                    ` : ''}
                    <div class="meter-box timeline-meter">
                        <span>${I18N.t('games.saveSink.ui.timeline')}</span>
                        <div class="month-pills">
                            ${Array.from({ length: lvl.duration }, (_, i) => `<div class="month-pill ${i < state.month ? 'done' : ''} ${i === state.month - 1 ? 'current' : ''}"></div>`).join('')}
                        </div>
                        <span class="meter-val">${I18N.t('games.saveSink.ui.month')} ${state.month} / ${lvl.duration}</span>
                    </div>
                </div>

                ${eventHtml}

                <div class="game-content">
                    <div class="statement-card">
                        <h3>Month ${state.month} Student Budget</h3>
                        <div class="statement-row"><span>Internship Pay/Allowance</span><span class="pos">+₹${lvl.income}</span></div>
                        <div class="statement-row"><span>Hostel/PG & Food Costs</span><span class="neg">-₹${fixedCosts}</span></div>
                        <div class="statement-divider"></div>
                        <div class="statement-row"><span>Disposable Income</span><span class="stat-highlight">₹${state.savings}</span></div>
                    </div>

                    <div id="action-area" class="action-area">
                        ${state.debt > 0 ? renderDebtRepay() : ''}
                        ${state.level === 4
                ? (state.month % 3 === 1 ? renderLevel4Choice() : renderTemptation())
                : (state.level === 5 ? renderBossFight() : renderTemptation())
            }
                    </div>
                </div>
            </div>
            <style>
                .debt-escape-game { max-width: 900px; margin: 0 auto; color: var(--text-primary); }
                .meters { display: flex; gap: 15px; margin-bottom: 30px; }
                .meter-box { flex: 1; background: var(--card-bg); padding: 15px; border-radius: 16px; text-align: center; border: 1px solid var(--border-color); box-shadow: var(--shadow-md); position: relative; }
                .level-pills { display: flex; gap: 4px; justify-content: center; margin: 10px 0; }
                .pill { height: 6px; width: 20px; background: var(--bg-tertiary); border-radius: 3px; }
                .pill.active { background: var(--primary); }
                .pill.current { background: var(--primary); box-shadow: 0 0 10px var(--primary); animation: pulse 1.5s infinite; }
                @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
                
                .meter-bg { height: 10px; background: var(--bg-tertiary); border-radius: 5px; margin: 10px 0; overflow: hidden; }
                .meter-fill { height: 100%; background: var(--success); transition: width 0.5s ease; }
                .meter-bg.debt .meter-fill { background: var(--danger); }
                .meter-bg.stress .meter-fill { background: var(--primary); }
                .meter-val { font-weight: 800; font-size: 18px; color: var(--text-primary); }
                
                .event-pop { background: rgba(239, 68, 68, 0.1); border: 1px solid var(--danger); padding: 15px; border-radius: 12px; margin-bottom: 20px; color: var(--danger); font-weight: 700; }
                
                .statement-card { background: var(--card-bg); padding: 30px; border-radius: 20px; margin-bottom: 30px; border: 1px solid var(--border-color); box-shadow: var(--shadow-lg); }
                .statement-row { display: flex; justify-content: space-between; margin: 10px 0; font-size: 18px; }
                .statement-divider { height: 1px; background: var(--border-color); margin: 20px 0; }
                .stat-highlight { font-weight: 800; color: var(--primary); font-size: 1.2em; }
                .pos { color: var(--success); font-weight: 700; }
                .neg { color: var(--danger); font-weight: 700; }
                
                .action-area { display: flex; flex-direction: column; gap: 20px; }
                .repay-card { 
                    background: var(--bg-tertiary); padding: 20px; border-radius: 16px; 
                    border: 1px dashed var(--danger); margin-bottom: 10px;
                }
                .repay-btns { display: flex; gap: 10px; justify-content: center; margin-top: 10px; }
                .repay-btn { padding: 8px 16px; border-radius: 8px; border: 1px solid var(--danger); background: transparent; color: var(--danger); cursor: pointer; font-weight: 600; }
                .repay-btn:hover { background: var(--danger); color: white; }

                .temptation-card { 
                    background: var(--card-bg); padding: 35px; border-radius: 20px; 
                    border: 3px solid var(--primary); animation: slideIn 0.5s ease;
                    box-shadow: 0 0 25px rgba(99, 102, 241, 0.2);
                    text-align: center;
                }
                @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                
                .choice-btns { display: flex; gap: 20px; justify-content: center; margin-top: 25px; }
                .choice-btn { 
                    padding: 15px 30px; border-radius: 12px; border: none; font-weight: 800; cursor: pointer; transition: all 0.3s;
                    font-size: 16px;
                }
                .choice-btn.resist { background: var(--success); color: white; box-shadow: 0 4px 0 #059669; }
                .choice-btn.buy { background: var(--danger); color: white; box-shadow: 0 4px 0 #dc2626; }
                .choice-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 0 rgba(0,0,0,0.1); }
                .choice-btn:active { transform: translateY(2px); box-shadow: 0 0 0 transparent; }
            </style>
        `;
    }

    function renderTemptation() {
        const lvl = levels[state.level];
        const available = lvl.temptations.filter(t => !state.shownTemptations.includes(t.title));

        // Reset if we ran out of new stuff
        if (available.length === 0) {
            state.shownTemptations = [];
            return renderTemptation();
        }

        const temptation = available[Math.floor(Math.random() * available.length)];
        state.shownTemptations.push(temptation.title);

        return `
            <div class="temptation-card choice-matrix">
                <div class="trap-header">⚡ SITUATION</div>
                <h3 class="trap-title">${temptation.title}</h3>
                <p class="trap-desc">${temptation.desc || 'How do you want to handle this?'}</p>
                <div class="choice-stack">
                    <button class="choice-row frugal" onclick="window.handleChoice('frugal', ${temptation.cost}, 15)">
                        <span class="choice-text">"Stay Focused. Need over want."</span>
                        <span class="choice-impact">₹0 | Stress +15</span>
                    </button>
                    <button class="choice-row balanced" onclick="window.handleChoice('balanced', ${Math.round(temptation.cost * 0.4)}, 5)">
                        <span class="choice-text">"Maybe a smaller version?"</span>
                        <span class="choice-impact">₹${Math.round(temptation.cost * 0.4)} | Stress +5</span>
                    </button>
                    <button class="choice-row impulse" onclick="window.handleChoice('impulse', ${temptation.cost}, -15)">
                        <span class="choice-text">"YOLO! Treating myself."</span>
                        <span class="choice-impact">₹${temptation.cost} | Stress -15</span>
                    </button>
                </div>
            </div>
            <style>
                .choice-matrix { text-align: left !important; }
                .trap-header { color: var(--primary); font-weight: 900; letter-spacing: 2px; font-size: 12px; margin-bottom: 5px; }
                .trap-title { font-size: 28px; margin-bottom: 10px; color: var(--text-primary); }
                .trap-desc { font-size: 16px; color: var(--text-secondary); margin-bottom: 25px; }
                
                .choice-stack { display: flex; flex-direction: column; gap: 12px; }
                .choice-row { 
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 15px 20px; border-radius: 12px; border: 1px solid var(--border-color);
                    background: var(--bg-tertiary); cursor: pointer; transition: all 0.3s;
                    text-align: left; width: 100%;
                }
                .choice-row:hover { transform: translateX(10px); background: var(--card-bg); border-color: var(--primary); }
                
                .choice-text { font-weight: 700; color: var(--text-primary); }
                .choice-impact { font-size: 12px; font-weight: 600; opacity: 0.7; color: var(--text-secondary); }
                
                .choice-row.frugal:hover { border-color: var(--success); }
                .choice-row.impulse:hover { border-color: var(--danger); }
                .choice-row.balanced:hover { border-color: var(--primary); }
            </style>
        `;
    }

    function renderLevel4Choice() {
        return `
            <div class="temptation-card">
                <h2>📊 Repayment Strategy</h2>
                <p>Choose how to tackle your education, phone, and card loans:</p>
                <div class="choice-btns">
                    <button class="choice-btn resist" onclick="window.applyRepayment('snowball')">SNOWBALL (Smallest First)</button>
                    <button class="choice-btn buy" onclick="window.applyRepayment('avalanche')">AVALANCHE (Highest Interest)</button>
                </div>
                <p style="font-size: 12px; margin-top: 15px; color: #888;">Snowball builds morale. Avalanche saves interest.</p>
            </div>
        `;
    }

    window.applyRepayment = function (strategy) {
        if (strategy === 'snowball') {
            state.stress -= 10;
            showNotification('Snowball: Morale Boost! Stress decreased.', 'success');
        } else {
            state.debt -= 500; // Efficient repayment
            showNotification('Avalanche: Saved interest! Debt reduced.', 'success');
        }
        finishMonth(false);
    };

    function renderBossFight() {
        let timeLeft = 5;
        const lvl = levels[state.level];

        const chatMessages = [
            "Friend: 'Bro, everyone's booking. Don't be a buzzkill!'",
            "Group Chat: *Sent a photo of a beautiful sunset in Goa*",
            "Friend: 'I'll lend you the money, just come!'",
            "Instagram: 'Your ex just liked a photo of the beach...'",
            "Friend: 'It's only ₹12k, you'll earn that in a week!'",
            "Group Chat: 'Only 1 spot left in the Villa!'"
        ];

        let messageIndex = 0;
        const interval = setInterval(() => {
            timeLeft--;
            const timer = document.getElementById('boss-timer');
            const messenger = document.getElementById('boss-messenger');
            if (timer) timer.innerText = `Resistance: ${timeLeft}s`;
            if (messenger && timeLeft % 2 === 0) {
                messenger.innerText = chatMessages[messageIndex % chatMessages.length];
                messenger.classList.add('shake-anim');
                setTimeout(() => messenger.classList.remove('shake-anim'), 500);
                messageIndex++;
            }
            if (timeLeft <= 0) {
                clearInterval(interval);
                window.finishMonth(true);
            }
        }, 1000);
        registerGameInterval(interval);
        state.bossTimer = interval;

        // Variety tracking for boss fight to ensure a different temptation each round
        const available = lvl.temptations.filter(t => !state.shownTemptations.includes(t.title));
        const temptation = available.length > 0 ? available[Math.floor(Math.random() * available.length)] : lvl.temptations[Math.floor(Math.random() * lvl.temptations.length)];
        state.shownTemptations.push(temptation.title);

        return `
            <div class="temptation-card boss boss-container">
                <div class="boss-aura"></div>
                <h2 class="boss-title">👹 THE FOMO DEMON</h2>
                <div id="boss-messenger" class="boss-chat-box">Waiting for messages...</div>
                <div id="boss-timer" class="boss-countdown">Resistance: 5s</div>
                
                <div class="boss-temptation">
                    <div class="trap-header">🔥 PRESSURE SPIKE</div>
                    <h3 class="trap-title">${temptation.title}</h3>
                    <p class="trap-desc">${temptation.desc}</p>
                    <button class="choice-row impulse boss-btn" onclick="window.handleChoice('impulse', ${temptation.cost}, 30)">
                        <span class="choice-text">"I CAN'T MISS OUT!" (Give in)</span>
                        <span class="choice-impact">₹${temptation.cost} | Stress +30</span>
                    </button>
                    <p class="boss-warning">Do not click. Just breathe. Survive the clock.</p>
                </div>
            </div>
            <style>
                .boss-container { position: relative; overflow: hidden; border: 4px solid #ef4444 !important; }
                .boss-aura { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%); animation: pulseAura 2s infinite; pointer-events: none; }
                @keyframes pulseAura { 0% { opacity: 0.3; } 50% { opacity: 0.7; } 100% { opacity: 0.3; } }
                
                .boss-title { color: #ef4444; font-size: 32px; font-weight: 900; letter-spacing: 4px; margin-bottom: 15px; }
                .boss-chat-box { background: #fee2e2; color: #b91c1c; padding: 15px; border-radius: 12px; font-weight: 700; font-size: 14px; margin-bottom: 20px; min-height: 50px; border-left: 5px solid #ef4444; }
                .boss-countdown { font-size: 40px; font-weight: 900; color: #b91c1c; margin: 20px 0; font-family: monospace; }
                .boss-btn { background: #b91c1c !important; color: white !important; border: none !important; padding: 20px !important; }
                .boss-warning { font-size: 12px; color: #ef4444; font-weight: 700; margin-top: 15px; text-transform: uppercase; }
                .shake-anim { animation: shake 0.5s; }
                @keyframes shake { 0%,100% {transform:translateX(0);} 25% {transform:translateX(-5px);} 75% {transform:translateX(5px);} }
            </style>
        `;
    }

    window.handleChoice = function (type, cost, stressChange) {
        if (type === 'impulse' || type === 'balanced') {
            state.metrics.luxuriesBought++;
            const finalCost = type === 'balanced' ? Math.round(cost * 0.4) : cost;
            if (state.savings >= finalCost) {
                state.savings -= finalCost;
                showNotification(`Purchased! Stress ${stressChange > 0 ? '+' : ''}${stressChange}`, 'info');
            } else {
                state.debt += finalCost;
                state.stress += 5; // Extra stress for debt
                showNotification(`Added to Debt! Stress ${stressChange + 5}`, 'warning');
            }
        } else {
            state.metrics.luxuriesResisted++;
            showNotification(`Resisted! Stress +${stressChange}`, 'success');
        }

        state.stress = Math.max(0, Math.min(100, state.stress + stressChange));
        finishMonth(false);
    };

    window.finishMonth = function (isBossWin) {
        const lvl = levels[state.level];
        state.metrics.monthsSurvived++;

        // Clear active intervals if any
        if (state.bossTimer) clearInterval(state.bossTimer);

        const isLevelComplete = state.savings >= lvl.goal && state.debt <= 0;
        const durationReached = state.month >= lvl.duration;

        if (durationReached) {
            if (isLevelComplete || (lvl.isBoss && isBossWin)) {
                if (state.level < 5) {
                    state.level++;
                    const nextLvl = levels[state.level];
                    state.month = 1;
                    // state.savings remains (carries over)
                    state.debt = nextLvl.initialDebt ? (typeof nextLvl.initialDebt === 'object' ? Object.values(nextLvl.initialDebt).reduce((a, b) => a + b, 0) : nextLvl.initialDebt) : 0;
                    state.stress = 20;
                    state.shownTemptations = [];
                    renderLevelIntro();
                } else {
                    endGame(true, "Final Freedom Achieved!");
                }
            } else {
                endGame(false, `Objective Failed! You needed ₹${lvl.goal} savings and ₹0 debt within ${lvl.duration} months.`);
            }
            return;
        }

        // Check for immediate loss
        if (state.debt > lvl.debtLimit || state.stress >= 100) {
            endGame(false, state.debt > lvl.debtLimit ? "Debt Limit Exceeded" : "Mental Burnout");
            return;
        }

        // Interest logic Level 2+
        if (lvl.interestRate && state.debt > 0) {
            const interest = Math.round(state.debt * lvl.interestRate);
            state.debt += interest;
            state.metrics.totalInterest += interest;
        }

        state.month++;
        showNotification(`Month ${state.month - 1} complete.`, 'info');
        window.startDebtMonth();
    };

    function endGame(win, reason) {
        const totalPurchases = state.metrics.luxuriesBought + state.metrics.luxuriesResisted;
        const discipline = totalPurchases > 0 ? Math.round((state.metrics.luxuriesResisted / totalPurchases) * 100) : 100;

        let financialIQ = 50;
        if (win) financialIQ += 30;
        financialIQ += Math.round(discipline / 5);
        financialIQ -= Math.round(state.metrics.totalInterest / 500);
        financialIQ = Math.max(0, Math.min(100, financialIQ));

        let grade = "F";
        if (financialIQ >= 90) grade = "A+";
        else if (financialIQ >= 80) grade = "A";
        else if (financialIQ >= 70) grade = "B";
        else if (financialIQ >= 60) grade = "C";
        else if (financialIQ >= 50) grade = "D";

        const tips = [];
        if (state.metrics.totalInterest > 2000) tips.push("🎓 **Expert Tip**: High-interest debt is a 'tax on the poor'. Always pay off your highest interest rate loan (usually Credit Cards) first—this is called the **Avalanche Method**.");
        if (state.stress > 80) tips.push("🎓 **Expert Tip**: Financial anxiety is a productivity killer. Aim for a **Starter Emergency Fund** of ₹10,000 even while paying debt to avoid 'Survival Stress'.");
        if (discipline < 50) tips.push("🎓 **Expert Tip**: Practice **Mindful Spending**. Wait 48 hours for any purchase over ₹500. If you still want it, it's likely a 'Value Buy' rather than an impulse.");
        if (state.debt > 15000) tips.push("🎓 **Expert Tip**: Never let your debt exceed 30% of your annual income. In your career, keep your **Debt-to-Income (DTI)** ratio low to stay 'Bankable'.");
        if (state.metrics.totalRepaid > 10000) tips.push("🎓 **Expert Tip**: You showed great grit! Once debt-free, redirect those same 'repayment payments' into an **Index Fund** to watch compound interest work for YOU.");
        if (tips.length < 3) tips.push("🎓 **Expert Tip**: Start building your **Credit Score** early by using a credit card ONLY for small monthly bills and paying it in full. This saves you lakhs on future home loans.");

        container.innerHTML = `
            <div class="analysis-screen">
                <div class="report-header">
                    <h1 class="grade-badge">${grade}</h1>
                    <div class="header-text">
                        <h2>${win ? 'FINANCIAL GRADUATE!' : 'ACCOUNTS CLOSED'}</h2>
                        <p>${reason}</p>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <span class="label">Financial IQ</span>
                        <span class="value">${financialIQ}</span>
                        <div class="stat-bar"><div class="stat-fill" style="width: ${financialIQ}%"></div></div>
                    </div>
                    <div class="stat-card">
                        <span class="label">Discipline</span>
                        <span class="value">${discipline}%</span>
                        <div class="stat-bar"><div class="stat-fill discipline" style="width: ${discipline}%"></div></div>
                    </div>
                    <div class="stat-card">
                        <span class="label">Net Worth</span>
                        <span class="value pos">₹${state.savings - state.debt}</span>
                    </div>
                    <div class="stat-card">
                        <span class="label">Months Active</span>
                        <span class="value">${state.metrics.monthsSurvived}</span>
                    </div>
                </div>

                <div class="leakage-box">
                    <span>💸 Financial Leakage (Interest Paid): </span>
                    <span class="neg">₹${state.metrics.totalInterest}</span>
                </div>

                <div class="tips-section">
                    <h3>Student Financial Guide:</h3>
                    <ul>
                        ${tips.map(t => `<li>${t}</li>`).join('')}
                    </ul>
                </div>

                <button class="start-btn" style="width: 100%; margin-top: 20px;" onclick="restartCurrentGame()">RE-ENROLL / PLAY AGAIN</button>
            </div>

            <style>
                .analysis-screen { 
                    background: var(--card-bg); padding: 40px; border-radius: 24px; 
                    border: 1px solid var(--border-color); box-shadow: var(--shadow-2xl);
                    max-width: 700px; margin: 0 auto; text-align: left;
                }
                .report-header { display: flex; align-items: center; gap: 30px; margin-bottom: 40px; }
                .grade-badge { 
                    font-size: 64px; background: var(--primary); color: white; 
                    width: 110px; height: 110px; display: flex; align-items: center; 
                    justify-content: center; border-radius: 20px; box-shadow: 0 10px 20px rgba(99, 102, 241, 0.4);
                }
                .header-text h2 { margin: 0; color: var(--text-primary); font-size: 32px; }
                .header-text p { margin: 5px 0 0; color: var(--text-secondary); font-size: 18px; }
                
                .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
                .stat-card { background: var(--bg-tertiary); padding: 20px; border-radius: 16px; display: flex; flex-direction: column; }
                .stat-card .label { font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; }
                .stat-card .value { font-size: 24px; font-weight: 800; color: var(--text-primary); margin: 5px 0; }
                .stat-bar { height: 6px; background: var(--border-color); border-radius: 3px; overflow: hidden; }
                .stat-fill { height: 100%; background: var(--primary); }
                .stat-fill.discipline { background: var(--success); }
                
                .leakage-box { 
                    background: rgba(239, 68, 68, 0.05); padding: 20px; border-radius: 16px; 
                    border: 1px solid rgba(239, 68, 68, 0.2); margin-bottom: 30px;
                    font-weight: 700; font-size: 18px; text-align: center;
                }
                
                .tips-section { background: var(--bg-secondary); padding: 25px; border-radius: 16px; }
                .tips-section h3 { margin: 0 0 15px; color: var(--primary); }
                .tips-section ul { padding: 0; list-style: none; margin: 0; }
                .tips-section li { margin-bottom: 12px; color: var(--text-primary); font-size: 15px; line-height: 1.5; }
            </style>
        `;

        finishGame(financialIQ, 100);
        window.dispatchEvent(new CustomEvent('moneywise:gameComplete', {
            detail: {
                gameId: AppState.currentGame.id,
                score: financialIQ,
                correct: financialIQ,
                total: 100,
                timeTaken: 0,
                mistakes: []
            }
        }));
    }
}

// ============================================
// GAME 3: INVESTMENT CLICKER
// ============================================
// ============================================
// GAME 3: INVESTMENT GROWTH (Interactive Redesign)
// ============================================
function loadInvestmentClicker() {
    const container = document.getElementById('gameContainer');

    // Initialize Help System
    setTimeout(() => initHelpSystem('investment'), 100);

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
        savings: { name: 'Savings Account', icon: '💰', risk: 'Low', baseReturn: 0.03, volatility: 0 },
        bonds: { name: 'Bonds', icon: '📊', risk: 'Medium', baseReturn: 0.06, volatility: 0.02 },
        stocks: { name: 'Stocks', icon: '📈', risk: 'High', baseReturn: 0.12, volatility: 0.08 }
    };

    const marketEvents = [
        { year: 3, type: 'bull', message: '📈 Bull Market! Stocks surge +25%!', effect: { stocks: 1.25 } },
        { year: 5, type: 'crash', message: '📉 Market Correction! Stocks drop -15%', effect: { stocks: 0.85 } },
        { year: 7, type: 'rates', message: '🏦 Interest Rate Hike! Bonds now 8%', effect: { bondsRate: 0.08 } },
        { year: 4, type: 'emergency', message: '💸 Emergency Expense: -$150', effect: { balance: -150 } }
    ];

    container.innerHTML = `
        <div class="investment-game-v2">
            <!-- Header Stats -->
            <div class="inv-header">
                <div class="inv-stat-card balance">
                    <div class="stat-icon">💵</div>
                    <div class="stat-info">
                        <div class="stat-label">Available Cash</div>
                        <div class="stat-value" id="balanceValue">$1,000</div>
                    </div>
                </div>
                <div class="inv-stat-card portfolio">
                    <div class="stat-icon">💼</div>
                    <div class="stat-info">
                        <div class="stat-label">Portfolio Value</div>
                        <div class="stat-value" id="portfolioValue">$0</div>
                    </div>
                </div>
                <div class="inv-stat-card years">
                    <div class="stat-icon">📅</div>
                    <div class="stat-info">
                        <div class="stat-label">Year</div>
                        <div class="stat-value" id="yearValue">0 / 10</div>
                    </div>
                </div>
            </div>

            <!-- Investment Options -->
            <div class="investment-options">
                <h3>Choose Your Investments</h3>
                <div class="investment-cards">
                    ${Object.entries(investmentTypes).map(([key, type]) => `
                        <div class="inv-card" data-type="${key}">
                            <div class="inv-card-header">
                                <span class="inv-icon">${type.icon}</span>
                                <span class="inv-name">${type.name}</span>
                            </div>
                            <div class="inv-card-body">
                                <div class="inv-risk ${type.risk.toLowerCase()}">${type.risk} Risk</div>
                                <div class="inv-return">${(type.baseReturn * 100).toFixed(0)}% avg return</div>
                                <div class="inv-amount" id="${key}Amount">$0</div>
                            </div>
                            <div class="inv-card-footer">
                                <input type="range" min="0" max="500" step="50" value="0" 
                                       class="inv-slider" id="${key}Slider">
                                <div class="slider-value" id="${key}SliderValue">$0</div>
                                <button class="inv-invest-btn" data-type="${key}">Invest</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Growth Visualization -->
            <div class="growth-section">
                <h3>Portfolio Growth Over Time</h3>
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
                <span class="btn-text">Advance to Next Year</span>
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
        window.dispatchEvent(new CustomEvent('moneywise:gameProgress', {
            detail: {
                gameId: AppState.currentGame.id,
                correct: gameState.years,
                total: gameState.targetYears,
                mistakes: []
            }
        }));

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
        const lessons = {
            savings: {
                icon: '💰',
                title: 'Savings Account',
                content: 'Great start! Savings accounts are the safest option with guaranteed returns. They\'re perfect for emergency funds and short-term goals. Low risk means low returns, but your money is always safe!'
            },
            bonds: {
                icon: '📊',
                title: 'Bonds Investment',
                content: 'Smart choice! Bonds offer moderate returns with less volatility than stocks. They\'re loans to companies or governments that pay you interest. Perfect for balanced portfolios!'
            },
            stocks: {
                icon: '📈',
                title: 'Stock Market',
                content: 'Bold move! Stocks have the highest potential returns but also the most risk. Prices fluctuate daily, but historically, stocks outperform other investments over the long term. Remember: don\'t panic sell during downturns!'
            }
        };

        const lesson = lessons[type];
        createModal(lesson.icon, lesson.title, lesson.content);
    }

    function showDiversificationModal() {
        createModal('🎯', 'Diversification Achieved!',
            'Excellent strategy! You\'ve diversified across all three investment types. This reduces risk because when one investment type goes down, others might go up. "Don\'t put all your eggs in one basket!" +20 bonus points!');
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
                <h2 style="font-size: 32px; margin-bottom: 15px; color: var(--text-primary);">Investment Journey Complete!</h2>
                <div style="background: var(--card-bg); padding: 30px; border-radius: 15px; margin: 20px 0; border: 1px solid var(--border-color);">
                    <div style="margin-bottom: 20px;">
                        <div style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase;">Final Portfolio Value</div>
                        <div style="font-size: 42px; font-weight: 800; color: var(--success);">$${totalValue.toFixed(2)}</div>
                    </div>
                    <div style="margin-bottom: 20px;">
                        <div style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase;">Total Profit</div>
                        <div style="font-size: 32px; font-weight: 700; color: var(--primary);">$${profit.toFixed(2)}</div>
                    </div>
                    <div>
                        <div style="font-size: 14px; color: var(--text-secondary); text-transform: uppercase;">Return on Investment</div>
                        <div style="font-size: 28px; font-weight: 700; color: var(--warning);">${roi}%</div>
                    </div>
                </div>
                ${gameState.diversified ? '<p style="font-size: 16px; color: var(--success); margin: 15px 0;">🎯 Diversification Bonus: +20 points!</p>' : ''}
                <p style="font-size: 16px; color: var(--text-secondary); margin: 20px 0;">
                    You invested over ${gameState.targetYears} years and learned about compound interest, risk management, and diversification!
                </p>
            </div>
        `;

        finishGame(score, 100);
        window.dispatchEvent(new CustomEvent('moneywise:gameComplete', {
            detail: {
                gameId: AppState.currentGame.id,
                score: score,
                correct: score,
                total: 100,
                timeTaken: gameState.years,
                mistakes: []
            }
        }));

    }

    updateUI();
    updateChart();
}
