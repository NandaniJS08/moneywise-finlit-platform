// ============================================
// GAME 4: CREDIT CARD SWIPE (Tinder Style)
// ============================================
function loadCreditCardSwipe_Legacy() {
    const container = document.getElementById('gameContainer');

    // Initialize Help System
    setTimeout(() => initHelpSystem('credit'), 100);

    let gameState = {
        score: 0,
        cardsProcessed: 0,
        totalCards: 10,
        currentCard: 0
    };

    const scenarios = [
        { text: "Pay only the minimum balance", isGood: false, feedback: "Paying minimums leads to huge interest!" },
        { text: "Pay full balance every month", isGood: true, feedback: "Excellent! No interest charged." },
        { text: "Max out credit limit", isGood: false, feedback: "High utilization hurts your credit score!" },
        { text: "Check statement for errors", isGood: true, feedback: "Smart move to catch fraud early." },
        { text: "Use credit for emergency only", isGood: true, feedback: "Good discipline!" },
        { text: "Miss a payment deadline", isGood: false, feedback: "Late fees and credit score damage!" },
        { text: "Keep credit utilization under 30%", isGood: true, feedback: "Best for your credit score." },
        { text: "Apply for 5 cards at once", isGood: false, feedback: "Too many inquiries hurt your score." },
        { text: "Ignore credit score updates", isGood: false, feedback: "Always monitor your financial health." },
        { text: "Set up autopay", isGood: true, feedback: "Never miss a payment again!" }
    ];

    container.innerHTML = `
        <div class="swipe-game">
            <div class="swipe-header">
                <div class="swipe-stat">Score: <span id="swipeScore">0</span></div>
                <div class="swipe-progress">Card: <span id="cardCount">1</span>/10</div>
            </div>
            
            <div class="card-stack">
                <div class="swipe-card" id="currentCard">
                    <div class="card-content">
                        <div class="card-icon">💳</div>
                        <p class="card-text">${scenarios[0].text}</p>
                    </div>
                    <div class="swipe-feedback valid">Good ✅</div>
                    <div class="swipe-feedback invalid">Bad ❌</div>
                </div>
            </div>

            <div class="swipe-controls">
                <button class="swipe-btn bad" id="btnBad">❌ Bad Habit</button>
                <button class="swipe-btn good" id="btnGood">✅ Good Habit</button>
            </div>

            <div class="swipe-instructions">
                Swipe Right (or click Good) for smart moves.<br>
                Swipe Left (or click Bad) for risky moves.
            </div>
        </div>

        <style>
            .swipe-game {
                max-width: 450px;
                margin: 0 auto;
                text-align: center;
                overflow: hidden;
                position: relative;
                padding: 30px;
                background: var(--bg-tertiary);
                border-radius: 24px;
                border: 1px solid var(--border-color);
                box-shadow: var(--shadow-xl);
            }
            .swipe-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
                font-weight: 700;
                font-size: 18px;
                background: var(--card-bg);
                padding: 15px 25px;
                border-radius: 50px;
                border: 1px solid var(--border-color);
                box-shadow: var(--shadow-sm);
                color: var(--text-primary);
            }
            .swipe-stat { 
                color: var(--primary); 
            }
            .swipe-progress { color: var(--text-secondary); }
            
            .card-stack {
                position: relative;
                height: 380px;
                margin-bottom: 40px;
                perspective: 1000px;
            }
            .swipe-card {
                position: absolute;
                width: 100%;
                height: 100%;
                background: var(--card-bg);
                border-radius: 24px;
                box-shadow: var(--shadow-lg);
                border: 1px solid var(--border-color);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 30px;
                cursor: grab;
                transition: transform 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease;
                user-select: none;
                transform-style: preserve-3d;
            }
            .swipe-card:hover {
                box-shadow: var(--shadow-xl);
                transform: translateY(-5px) scale(1.02);
                border-color: var(--primary);
            }
            .card-content {
                pointer-events: none;
                z-index: 2;
                transform: translateZ(20px);
            }
            .card-icon {
                font-size: 80px;
                margin-bottom: 30px;
                filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
            }
            .card-text {
                font-size: 24px;
                font-weight: 700;
                line-height: 1.5;
                color: var(--text-primary);
            }
            .swipe-feedback {
                position: absolute;
                top: 40px;
                font-size: 36px;
                font-weight: 800;
                opacity: 0;
                border: 4px solid;
                padding: 10px 20px;
                border-radius: 16px;
                transform: rotate(-15deg) translateZ(50px);
                z-index: 10;
                text-transform: uppercase;
                letter-spacing: 2px;
                background: rgba(255,255,255,0.9);
                backdrop-filter: blur(5px);
            }
            [data-theme="dark"] .swipe-feedback {
                background: rgba(0,0,0,0.4);
            }
            .swipe-feedback.valid {
                right: 30px;
                color: var(--success);
                border-color: var(--success);
                transform: rotate(15deg) translateZ(50px);
                box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
            }
            .swipe-feedback.invalid {
                left: 30px;
                color: var(--danger);
                border-color: var(--danger);
                box-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
            }
            .swipe-controls {
                display: flex;
                gap: 30px;
                justify-content: center;
                margin-bottom: 30px;
            }
            .swipe-btn {
                width: 80px;
                height: 80px;
                border: none;
                border-radius: 50%;
                font-weight: 700;
                font-size: 28px;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                font-family: inherit;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: var(--shadow-md);
                position: relative;
                background: var(--card-bg);
            }
            .swipe-btn.bad { 
                color: var(--danger);
                border: 2px solid var(--danger);
            }
            .swipe-btn.good { 
                color: var(--success);
                border: 2px solid var(--success);
            }
            
            .swipe-btn:hover { 
                transform: scale(1.15) translateY(-5px); 
            }
            .swipe-btn.bad:hover {
                background: var(--danger);
                color: white;
                box-shadow: 0 10px 30px rgba(239, 68, 68, 0.4);
            }
            .swipe-btn.good:hover {
                background: var(--success);
                color: white;
                box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
            }
            .swipe-btn:active { transform: scale(0.9); }
            
            .swipe-instructions {
                font-size: 14px;
                color: var(--text-secondary);
                line-height: 1.6;
                background: var(--card-bg);
                padding: 20px;
                border-radius: 16px;
                border: 1px dashed var(--border-color);
            }
            
            /* Dark Mode Enhancements */
            [data-theme="dark"] .swipe-game {
                background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%);
                backdrop-filter: blur(20px);
                border-color: var(--glass-border);
            }
            [data-theme="dark"] .swipe-card {
                background: linear-gradient(145deg, var(--card-bg) 0%, rgba(30, 41, 59, 0.95) 100%);
                border: 1px solid var(--glass-border);
            }
            [data-theme="dark"] .swipe-stat {
                text-shadow: 0 0 10px rgba(99, 102, 241, 0.4);
            }
        </style>
    `;

    const card = document.getElementById('currentCard');

    // Touch/Drag Logic
    let startX = 0;
    let isDragging = false;

    card.addEventListener('mousedown', startDrag);
    card.addEventListener('touchstart', startDrag);

    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);

    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    function startDrag(e) {
        isDragging = true;
        startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        card.style.cursor = 'grabbing';
    }

    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();

        const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const diffX = currentX - startX;
        const rotation = diffX / 10;

        card.style.transform = `translateX(${diffX}px) rotate(${rotation}deg)`;

        // Visual feedback
        if (diffX > 50) {
            document.querySelector('.swipe-feedback.valid').style.opacity = Math.min(1, (diffX - 50) / 100);
        } else if (diffX < -50) {
            document.querySelector('.swipe-feedback.invalid').style.opacity = Math.min(1, (-diffX - 50) / 100);
        } else {
            document.querySelector('.swipe-feedback.valid').style.opacity = 0;
            document.querySelector('.swipe-feedback.invalid').style.opacity = 0;
        }
    }

    function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        card.style.cursor = 'grab';

        const currentX = e.type === 'mouseup' ? e.clientX : (e.changedTouches ? e.changedTouches[0].clientX : startX);
        const diffX = currentX - startX;

        if (diffX > 100) {
            handleSwipe(true); // Swipe Right (Good)
        } else if (diffX < -100) {
            handleSwipe(false); // Swipe Left (Bad)
        } else {
            // Reset
            card.style.transform = 'translate(0) rotate(0)';
            document.querySelector('.swipe-feedback.valid').style.opacity = 0;
            document.querySelector('.swipe-feedback.invalid').style.opacity = 0;
        }
    }

    function handleSwipe(isRight) {
        const scenario = scenarios[gameState.currentCard];
        // Right mean "Good Habit", Left means "Bad Habit"
        // User thinks: "Is this a good habit?" -> Swipe Right. "Is this bad?" -> Swipe Left.
        // Wait, logic check:
        // Scenario: "Pay only minimum". This is BAD. User should classify as BAD (Left?).
        // If user swipes Right (Good), they are saying it's Good.
        // So correct answer for "Pay only minimum" is Left (Bad).

        // Let's assume Button/Swipe mapping:
        // Green/Right = "This is Good"
        // Red/Left = "This is Bad"

        const userChoiceIsGood = isRight; // User says it's good

        const isCorrect = userChoiceIsGood === scenario.isGood;

        if (isCorrect) {
            gameState.score += 10;
            playSound('success');
            showNotification(scenario.feedback, 'success');
        } else {
            playSound('error');
            showNotification(scenario.feedback, 'error');
        }

        document.getElementById('swipeScore').textContent = gameState.score;

        // Animate out
        const endX = isRight ? 1000 : -1000;
        card.style.transition = 'transform 0.5s ease';
        card.style.transform = `translateX(${endX}px) rotate(${isRight ? 45 : -45}deg)`;

        setTimeout(nextCard, 500);
    }

    document.getElementById('btnGood').addEventListener('click', () => {
        card.style.transition = 'transform 0.5s ease';
        card.style.transform = `translateX(200px) rotate(20deg)`;
        handleSwipe(true);
    });

    document.getElementById('btnBad').addEventListener('click', () => {
        card.style.transition = 'transform 0.5s ease';
        card.style.transform = `translateX(-200px) rotate(-20deg)`;
        handleSwipe(false);
    });

    function nextCard() {
        gameState.currentCard++;

        if (gameState.currentCard >= scenarios.length) {
            finishGame(gameState.score, 100);
            return;
        }

        document.getElementById('cardCount').textContent = gameState.currentCard + 1;

        const nextScenario = scenarios[gameState.currentCard];
        const cardEl = document.getElementById('currentCard');

        // Reset card style for new content
        cardEl.style.transition = 'none';
        cardEl.style.transform = 'translate(0) rotate(0)';
        cardEl.style.opacity = '0';

        document.querySelector('.card-text').textContent = nextScenario.text;
        document.querySelector('.swipe-feedback.valid').style.opacity = 0;
        document.querySelector('.swipe-feedback.invalid').style.opacity = 0;

        setTimeout(() => {
            cardEl.style.transition = 'opacity 0.3s ease';
            cardEl.style.opacity = '1';
        }, 50);
    }
}

// ============================================
// GAME 5: MONEY MEMORY
// ============================================
function loadMoneyMemory() {
    const container = document.getElementById('gameContainer');

    // Initialize Help System
    setTimeout(() => initHelpSystem('memory'), 100);

    const terms = [
        {
            term: "Asset",
            def: "Something you own",
            icon: "💎",
            info: "An asset is anything of value that you own, like cash, property, investments, or equipment. Assets can generate income or appreciate in value over time.",
            example: "Your smartphone, savings account, or even a lemonade stand are all assets!",
            funFact: "💡 The average millionaire has 7 different income streams from various assets."
        },
        {
            term: "Liability",
            def: "Money you owe",
            icon: "📉",
            info: "A liability is a financial obligation or debt you owe to others, such as loans, credit card balances, or mortgages. Managing liabilities is key to financial health.",
            example: "Student loans, car payments, or money you borrowed from a friend are liabilities.",
            funFact: "⚠️ The average American household has over $90,000 in debt (including mortgages)."
        },
        {
            term: "Interest",
            def: "Cost of borrowing",
            icon: "📊",
            info: "Interest is the fee charged by lenders for borrowing money, or the return earned on savings and investments. It's usually expressed as a percentage (APR).",
            example: "If you borrow $100 at 10% interest, you'll pay back $110. But if you SAVE $100 at 10%, you'll EARN $10!",
            funFact: "🚀 Albert Einstein called compound interest 'the eighth wonder of the world.'"
        },
        {
            term: "Budget",
            def: "Spending plan",
            icon: "📝",
            info: "A budget is a financial plan that tracks your income and expenses. It helps you control spending, save money, and achieve your financial goals.",
            example: "The 50/30/20 rule: Spend 50% on needs, 30% on wants, and save 20% of your income.",
            funFact: "💰 People who budget regularly save 2x more money than those who don't!"
        },
        {
            term: "Dividend",
            def: "Profit share",
            icon: "💵",
            info: "A dividend is a portion of a company's profits distributed to shareholders. It's a way investors earn passive income from their stock investments.",
            example: "If you own 10 shares of a company that pays $2 per share annually, you get $20 in dividends!",
            funFact: "🎁 Some companies have paid dividends for over 100 years consecutively!"
        },
        {
            term: "Principal",
            def: "Loan amount",
            icon: "🏦",
            info: "Principal is the original amount of money borrowed in a loan, or the amount invested. Interest is calculated based on the principal amount.",
            example: "If you take a $10,000 student loan, that $10,000 is the principal. The interest is extra!",
            funFact: "💡 Paying extra toward your principal can save you thousands in interest over time!"
        }
    ];

    let cards = [];
    terms.forEach((item, index) => {
        cards.push({ id: index, type: 'term', text: item.term, info: item.info, example: item.example, funFact: item.funFact, icon: item.icon, fullTerm: item.term });
        cards.push({ id: index, type: 'def', text: item.def, info: item.info, example: item.example, funFact: item.funFact, icon: item.icon, fullTerm: item.term });
    });

    // Shuffle
    cards.sort(() => Math.random() - 0.5);

    let gameState = {
        flipped: [],
        matched: [],
        clicks: 0,
        score: 0
    };

    container.innerHTML = `
        <div class="memory-game">
            <div class="memory-stats">
                <div>Moves: <span id="moves">0</span></div>
                <div>Matches: <span id="matches">0</span>/${terms.length}</div>
            </div>
            
            <div class="memory-grid" id="memoryGrid"></div>
        </div>

        <style>
            .memory-game {
                max-width: 700px;
                margin: 0 auto;
                perspective: 1000px;
                padding: 20px;
                background: var(--bg-tertiary);
                border-radius: 20px;
            }
            .memory-stats {
                display: flex;
                justify-content: space-between;
                margin-bottom: 30px;
                font-size: 20px;
                font-weight: 700;
                color: var(--primary);
                background: var(--card-bg);
                padding: 20px 30px;
                border-radius: 20px;
                border: 1px solid var(--border-color);
                box-shadow: var(--shadow-sm);
            }
            .memory-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 20px;
            }
            .memory-card {
                aspect-ratio: 1;
                background: var(--card-bg);
                border-radius: 20px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: 700;
                text-align: center;
                padding: 15px;
                transform-style: preserve-3d;
                transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
                position: relative;
                color: transparent;
                border: 1px solid var(--border-color);
                box-shadow: var(--shadow-sm);
            }
            /* Card Back Design */
            .memory-card::after {
                content: '?';
                position: absolute;
                color: var(--text-secondary);
                font-size: 24px;
                opacity: 0.5;
            }
            .memory-card:hover {
                transform: translateY(-8px);
                box-shadow: var(--shadow-lg);
                border-color: var(--primary);
            }
            .memory-card.flipped {
                background: var(--bg-color);
                color: var(--text-primary);
                transform: rotateY(180deg);
                border-color: var(--primary);
                box-shadow: var(--shadow-md);
            }
            .memory-card.flipped::after {
                display: none;
            }
            /* Fix text orientation when flipped */
            .memory-card.flipped span {
                transform: rotateY(180deg);
                display: block;
            }
            .memory-card.matched {
                background: var(--success);
                color: white;
                border-color: transparent;
                animation: pulse 0.5s ease;
                box-shadow: 0 0 30px rgba(16, 185, 129, 0.4);
                transform: rotateY(180deg);
            }
            .memory-card.matched span {
                transform: rotateY(180deg);
                display: block;
            }
            @media (max-width: 600px) {
                .memory-grid {
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                }
                .memory-card {
                    font-size: 12px;
                    border-radius: 12px;
                }
            }
            
            /* Dark Mode Enhancements */
            [data-theme="dark"] .memory-stats {
                background: var(--glass-surface);
                border-color: var(--glass-border);
            }
            [data-theme="dark"] .memory-card {
                background: var(--glass-surface);
                border-color: var(--glass-border);
            }
            [data-theme="dark"] .memory-card.flipped {
                background: linear-gradient(135deg, var(--card-bg) 0%, rgba(30, 41, 59, 0.9) 100%);
                border-color: var(--primary);
                box-shadow: 0 0 15px rgba(99, 102, 241, 0.3);
            }
            [data-theme="dark"] .memory-card.matched {
                box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
            }
            
            /* Educational Modal */
            .edu-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s ease, visibility 0.3s ease;
            }
            .edu-modal.active {
                opacity: 1;
                visibility: visible;
            }
            .edu-modal-content {
                background: var(--card-bg);
                border-radius: 24px;
                padding: 40px;
                max-width: 500px;
                width: 90%;
                box-shadow: var(--shadow-xl);
                border: 2px solid var(--success);
                animation: modalSlideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                position: relative;
            }
            @keyframes modalSlideIn {
                from {
                    transform: scale(0.8) translateY(-50px);
                    opacity: 0;
                }
                to {
                    transform: scale(1) translateY(0);
                    opacity: 1;
                }
            }
            .edu-modal-header {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 20px;
            }
            .edu-modal-icon {
                font-size: 48px;
            }
            .edu-modal-title {
                font-size: 28px;
                font-weight: 800;
                color: var(--success);
                margin: 0;
            }
            .edu-modal-body {
                color: var(--text-primary);
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 30px;
            }
            .edu-modal-term {
                font-weight: 700;
                color: var(--primary);
                font-size: 18px;
                margin-bottom: 10px;
            }
            .edu-modal-definition {
                margin-bottom: 20px;
                color: var(--text-primary);
            }
            .edu-modal-example {
                background: var(--bg-color);
                padding: 15px;
                border-radius: 12px;
                margin-bottom: 15px;
                border-left: 4px solid var(--primary);
            }
            .example-label {
                font-weight: 700;
                color: var(--primary);
                margin-bottom: 8px;
                font-size: 14px;
            }
            .example-text {
                color: var(--text-primary);
                font-size: 15px;
                line-height: 1.5;
            }
            .edu-modal-funfact {
                background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
                padding: 15px;
                border-radius: 12px;
                border: 1px solid rgba(16, 185, 129, 0.3);
            }
            .funfact-text {
                color: var(--text-primary);
                font-size: 15px;
                line-height: 1.5;
                font-weight: 600;
            }
            .edu-modal-close {
                width: 100%;
                padding: 15px;
                background: var(--success);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 18px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .edu-modal-close:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
            }
        </style>
    `;

    const grid = document.getElementById('memoryGrid');

    cards.forEach((card, index) => {
        const div = document.createElement('div');
        div.className = 'memory-card';
        div.dataset.index = index;
        div.innerHTML = `<span>${card.text}</span>`;
        div.addEventListener('click', () => flipCard(div, card));
        grid.appendChild(div);
    });

    function flipCard(div, card) {
        if (
            gameState.flipped.length >= 2 ||
            div.classList.contains('flipped') ||
            div.classList.contains('matched')
        ) return;

        // Play card flip sound
        playSound('cardFlip');

        div.classList.add('flipped');
        gameState.flipped.push({ div, card });

        if (gameState.flipped.length === 2) {
            gameState.clicks++;
            document.getElementById('moves').textContent = gameState.clicks;
            checkMatch();
        }
    }

    function checkMatch() {
        const [obj1, obj2] = gameState.flipped;

        if (obj1.card.id === obj2.card.id) {
            // Match
            obj1.div.classList.add('matched');
            obj2.div.classList.add('matched');
            gameState.matched.push(obj1.card.id);
            document.getElementById('matches').textContent = gameState.matched.length;
            gameState.flipped = [];
            playSound('success');

            // Show educational popup
            showEducationalPopup(obj1.card);

            // Check if game is complete
            if (gameState.matched.length === terms.length) {
                // Close any open modal first
                setTimeout(() => {
                    cleanupModal();
                }, 500);

                // End game after brief delay
                setTimeout(() => {
                    const score = Math.max(0, 100 - (gameState.clicks - terms.length) * 5);
                    finishGame(score, 100);
                }, 1500);
            }
        } else {
            // No Match
            playSound('error');
            setTimeout(() => {
                obj1.div.classList.remove('flipped');
                obj2.div.classList.remove('flipped');
                gameState.flipped = [];
            }, 1000);
        }
    }

    function cleanupModal() {
        const modal = document.getElementById('eduModal');
        if (modal) {
            modal.classList.remove('active');
            // Remove from DOM after animation completes
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    function showEducationalPopup(card) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('eduModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'eduModal';
            modal.className = 'edu-modal';
            modal.innerHTML = `
                <div class="edu-modal-content">
                    <div class="edu-modal-header">
                        <div class="edu-modal-icon" id="modalIcon">✨</div>
                        <h2 class="edu-modal-title">Great Match!</h2>
                    </div>
                    <div class="edu-modal-body">
                        <div class="edu-modal-term" id="modalTerm"></div>
                        <p class="edu-modal-definition" id="modalInfo"></p>
                        <div class="edu-modal-example">
                            <div class="example-label">📌 Real Example:</div>
                            <div class="example-text" id="modalExample"></div>
                        </div>
                        <div class="edu-modal-funfact">
                            <div class="funfact-text" id="modalFunFact"></div>
                        </div>
                    </div>
                    <button class="edu-modal-close" onclick="document.getElementById('eduModal').classList.remove('active')">Continue Playing 🎮</button>
                </div>
            `;
            document.body.appendChild(modal);

            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        }

        // Update content
        document.getElementById('modalIcon').textContent = card.icon;
        document.getElementById('modalTerm').textContent = card.fullTerm;
        document.getElementById('modalInfo').textContent = card.info;
        document.getElementById('modalExample').textContent = card.example;
        document.getElementById('modalFunFact').textContent = card.funFact;

        // Show modal after a brief delay
        setTimeout(() => {
            modal.classList.add('active');
        }, 600);
    }
}

// ============================================
// GAME 6: STOCK TRADER
// ============================================
// ============================================
// GAME 6: STOCK TRADER PRO (Redigned)
// ============================================
function loadStockTrader() {
    const container = document.getElementById('gameContainer');

    // Initialize Help System
    setTimeout(() => initHelpSystem('stock'), 100);

    // Initial Stocks Config
    const stockConfig = [
        { symbol: 'BANK', name: 'FinBank', sector: 'Banking', volatility: 0.02, price: 50, trend: 0.001 },
        { symbol: 'TECH', name: 'TechCorp', sector: 'Technology', volatility: 0.05, price: 120, trend: 0.002 },
        { symbol: 'NRGY', name: 'EnergyPro', sector: 'Energy', volatility: 0.03, price: 75, trend: 0.0 },
        { symbol: 'HLTH', name: 'HealthPlus', sector: 'Healthcare', volatility: 0.015, price: 90, trend: 0.001 },
        { symbol: 'RTL', name: 'RetailMax', sector: 'Retail', volatility: 0.025, price: 45, trend: -0.001 }
    ];

    let gameState = {
        cash: 1000,
        portfolio: { 'BANK': 0, 'TECH': 0, 'NRGY': 0, 'HLTH': 0, 'RTL': 0 },
        initialPortfolioValue: 1000,
        stocks: stockConfig.map(s => ({ ...s, history: [s.price] })),
        day: 1,
        maxDays: 30,
        news: [],
        selectedStock: null,
        gameInterval: null,
        isPaused: false,
        gameActive: true
    };

    // Render Basic Layout
    container.innerHTML = `
        <div class="stock-dashboard">
            <!-- Top Bar: Portfolio Stats -->
            <div class="dashboard-header">
                <div class="dash-stat">
                    <span class="label">Cash Balance</span>
                    <span class="value" id="dashCash">$1,000.00</span>
                </div>
                <div class="dash-stat">
                    <span class="label">Portfolio Value</span>
                    <span class="value" id="dashPortfolio">$0.00</span>
                </div>
                <div class="dash-stat">
                    <span class="label">Total Equity</span>
                    <span class="value highlight" id="dashTotal">$1,000.00</span>
                </div>
                <div class="dash-stat">
                    <span class="label">P/L</span>
                    <span class="value" id="dashPL">+$0.00 (0.00%)</span>
                </div>
                <div class="dash-stat">
                    <span class="label">Day</span>
                    <span class="value" id="dashDay">1 / 30</span>
                </div>
            </div>

            <!-- Main Content Grid -->
            <div class="market-grid">
                <!-- Stock List & Charts -->
                <div class="stocks-panel">
                    <h3>Market Watch</h3>
                    <div class="stocks-list" id="stocksList"></div>
                </div>

                <!-- Trading Sidebar -->
                <div class="trading-panel">
                    <h3>Trading Desk</h3>
                    <div id="tradingForm" class="trading-form">
                        <div class="no-selection">Select a stock to trade</div>
                    </div>
                </div>
            </div>

            <!-- Bottom: News Ticker -->
            <div class="news-ticker">
                <div class="ticker-title">📰 MARKET NEWS:</div>
                <div class="ticker-content-wrapper">
                    <div class="ticker-content" id="newsTicker">Market opens with steady trading... Welcome to Stock Trader Pro...</div>
                </div>
            </div>
        </div>

        <style>
            .stock-dashboard {
                max-width: 1100px;
                margin: 0 auto;
                color: var(--text-primary);
                font-family: 'Segoe UI', sans-serif;
            }
            .dashboard-header {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 15px;
                margin-bottom: 20px;
            }
            .dash-stat {
                background: var(--card-bg);
                padding: 15px;
                border-radius: 12px;
                border: 1px solid var(--border-color);
                box-shadow: var(--shadow-sm);
                display: flex;
                flex-direction: column;
            }
            .dash-stat .label {
                font-size: 12px;
                color: var(--text-secondary);
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 5px;
            }
            .dash-stat .value {
                font-size: 20px;
                font-weight: 700;
                color: var(--text-primary);
            }
            .dash-stat .value.highlight {
                color: var(--primary);
            }

            .market-grid {
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 20px;
                height: 500px;
            }

            .stocks-panel, .trading-panel {
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: 16px;
                padding: 20px;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            .stocks-panel h3, .trading-panel h3 {
                margin-bottom: 15px;
                font-size: 18px;
                color: var(--text-primary);
                border-bottom: 1px solid var(--border-color);
                padding-bottom: 10px;
            }

            .stocks-list {
                flex: 1;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 10px;
                padding-right: 5px;
            }

            .stock-item {
                display: flex;
                align-items: center;
                background: var(--bg-tertiary);
                padding: 15px;
                border-radius: 12px;
                border: 1px solid transparent;
                cursor: pointer;
                transition: all 0.2s;
            }
            .stock-item:hover {
                transform: translateY(-2px);
                border-color: var(--primary);
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            .stock-item.selected {
                border-color: var(--primary);
                background: rgba(99, 102, 241, 0.05);
            }

            .stock-logo {
                width: 40px;
                height: 40px;
                background: var(--card-bg);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 800;
                color: var(--primary);
                margin-right: 15px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .stock-details {
                flex: 1;
            }
            .stock-symbol {
                font-weight: 700;
                font-size: 16px;
            }
            .stock-name {
                font-size: 12px;
                color: var(--text-secondary);
            }
            .stock-chart-mini {
                width: 100px;
                height: 40px;
                margin: 0 15px;
            }
            .stock-price-box {
                text-align: right;
            }
            .current-price {
                font-weight: 700;
                font-size: 16px;
            }
            .price-change {
                font-size: 12px;
                font-weight: 600;
            }
            .pos-change { color: var(--success); }
            .neg-change { color: var(--danger); }

            /* Trading Form */
            .trading-form {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            .no-selection {
                text-align: center;
                color: var(--text-secondary);
                margin-top: 50px;
                font-style: italic;
            }
            
            .trade-stock-header {
                display: flex;
                align-items: center;
                margin-bottom: 20px;
            }
            .trade-symbol {
                font-size: 24px;
                font-weight: 800;
                margin-right: 10px;
            }
            .trade-price {
                font-size: 24px;
                font-weight: 700;
                color: var(--primary);
            }
            
            .trade-holdings {
                background: var(--bg-tertiary);
                padding: 10px;
                border-radius: 8px;
                margin-bottom: 20px;
                font-size: 14px;
                display: flex;
                justify-content: space-between;
            }

            .trade-input-group {
                margin-bottom: 20px;
            }
            .trade-input-group label {
                display: block;
                font-size: 12px;
                color: var(--text-secondary);
                margin-bottom: 5px;
            }
            .trade-input-wrapper {
                display: flex;
                gap: 10px;
            }
            .trade-input {
                flex: 1;
                padding: 10px;
                border-radius: 8px;
                border: 1px solid var(--border-color);
                background: var(--card-bg);
                color: var(--text-primary);
                font-weight: 700;
            }
            .qty-btn {
                padding: 5px 10px;
                font-size: 12px;
                border-radius: 6px;
                border: 1px solid var(--border-color);
                background: var(--bg-tertiary);
                cursor: pointer;
            }
            .qty-btn:hover { background: var(--border-color); }

            .trade-actions {
                display: flex;
                gap: 10px;
                margin-top: auto;
            }
            .trade-btn {
                flex: 1;
                padding: 15px;
                border: none;
                border-radius: 12px;
                font-weight: 700;
                font-size: 16px;
                cursor: pointer;
                transition: transform 0.2s;
            }
            .trade-btn:hover { transform: translateY(-2px); }
            .btn-buy { background: var(--success); color: white; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3); }
            .btn-sell { background: var(--danger); color: white; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3); }
            .btn-buy:disabled, .btn-sell:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

            /* News Ticker */
            .news-ticker {
                margin-top: 20px;
                background: var(--bg-tertiary); // Darker tone
                border-radius: 8px;
                display: flex;
                align-items: center;
                overflow: hidden;
                border: 1px solid var(--border-color);
                height: 40px;
            }
            .ticker-title {
                background: var(--primary);
                color: white;
                padding: 0 15px;
                height: 100%;
                display: flex;
                align-items: center;
                font-weight: 700;
                font-size: 12px;
                z-index: 2;
            }
            .ticker-content-wrapper {
                flex: 1;
                overflow: hidden;
                white-space: nowrap;
                position: relative;
            }
            .ticker-content {
                display: inline-block;
                padding-left: 100%;
                animation: ticker 20s linear infinite;
                font-size: 14px;
                color: var(--text-primary);
            }
            @keyframes ticker {
                0% { transform: translate3d(0, 0, 0); }
                100% { transform: translate3d(-100%, 0, 0); }
            }
            
            @media (max-width: 768px) {
                .market-grid { grid-template-columns: 1fr; height: auto; }
                .dashboard-header { grid-template-columns: 1fr 1fr; }
            }
        </style>
    `;

    // Start Price Simulation
    gameState.gameInterval = setInterval(() => {
        if (!gameState.isPaused && gameState.gameActive) {
            updateMarket();
            updateUI();
            checkGameEnd();
        }
    }, 2000); // Update every 2 seconds
    registerGameInterval(gameState.gameInterval);

    // Initial Render
    updateUI();

    function updateMarket() {
        // Random Market Shift
        let marketMood = 0;
        if (Math.random() < 0.1) {
            // 10% chance of news event
            const events = [
                { type: 'good', text: "Tech sector booms due to AI advancements!", sector: 'Technology', impact: 0.05 },
                { type: 'bad', text: "Banking regulations tighten, investors worried.", sector: 'Banking', impact: -0.04 },
                { type: 'good', text: "Oil prices surge, energy stocks rally.", sector: 'Energy', impact: 0.06 },
                { type: 'bad', text: "Retail spending drops to 5-year low.", sector: 'Retail', impact: -0.05 },
                { type: 'good', text: "New vaccine approved! Healthcare stocks up.", sector: 'Healthcare', impact: 0.08 }
            ];
            const event = events[Math.floor(Math.random() * events.length)];
            addNews(event.text);

            // Apply impact
            gameState.stocks.forEach(stock => {
                if (stock.sector === event.sector) {
                    stock.price *= (1 + event.impact);
                }
            });
        }

        // Update Prices
        gameState.stocks.forEach(stock => {
            const volatility = stock.volatility;
            const change = 1 + (Math.random() * volatility * 2 - volatility) + stock.trend;
            stock.price = Math.max(1, stock.price * change);
            stock.history.push(stock.price);
            if (stock.history.length > 50) stock.history.shift(); // Keep last 50 points
        });

        // Advance Day
        gameState.day++;
    }

    function addNews(text) {
        const ticker = document.getElementById('newsTicker');
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        ticker.textContent = `[${timestamp}] ${text}  +++  ` + ticker.textContent.substring(0, 100) + '...';
        // Reset animation to draw attention? Maybe subtle flash
    }

    function updateUI() {
        // 1. Dashboard Stats
        const currentPortfolioValue = gameState.stocks.reduce((acc, stock) => {
            return acc + (stock.price * gameState.portfolio[stock.symbol]);
        }, 0);
        const totalValue = gameState.cash + currentPortfolioValue;
        const pl = totalValue - gameState.initialPortfolioValue;
        const plPercent = (pl / gameState.initialPortfolioValue) * 100;

        document.getElementById('dashCash').textContent = `$${gameState.cash.toFixed(2)}`;
        document.getElementById('dashPortfolio').textContent = `$${currentPortfolioValue.toFixed(2)}`;
        document.getElementById('dashTotal').textContent = `$${totalValue.toFixed(2)}`;
        document.getElementById('dashPL').textContent = `${pl >= 0 ? '+' : ''}$${pl.toFixed(2)} (${plPercent.toFixed(2)}%)`;
        document.getElementById('dashPL').style.color = pl >= 0 ? 'var(--success)' : 'var(--danger)';
        document.getElementById('dashDay').textContent = `${gameState.day} / ${gameState.maxDays}`;

        // 2. Stock List
        const list = document.getElementById('stocksList');
        // Only rebuild if selected stock changes or first run to keep scroll position, otherwise update values
        // For simplicity, we'll re-render inner part of items or just update text

        // Actually, let's just re-render to allow chart updates
        list.innerHTML = gameState.stocks.map(stock => {
            const startPrice = stock.history[0];
            const change = ((stock.price - startPrice) / startPrice) * 100;
            const isSelected = gameState.selectedStock === stock.symbol ? 'selected' : '';

            return `
                <div class="stock-item ${isSelected}" onclick="selectStock('${stock.symbol}')">
                    <div class="stock-logo">${stock.symbol}</div>
                    <div class="stock-details">
                        <div class="stock-symbol">${stock.symbol}</div>
                        <div class="stock-name">${stock.name}</div>
                    </div>
                    <canvas id="chart_${stock.symbol}" class="stock-chart-mini"></canvas>
                    <div class="stock-price-box">
                        <div class="current-price">$${stock.price.toFixed(2)}</div>
                        <div class="price-change ${change >= 0 ? 'pos-change' : 'neg-change'}">
                            ${change >= 0 ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}%
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Draw Mini Charts
        gameState.stocks.forEach(stock => {
            drawMiniChart(`chart_${stock.symbol}`, stock.history, stock.price >= stock.history[0]);
        });

        // 3. Trading Form (if selected)
        if (gameState.selectedStock) {
            updateTradingForm();
        }
    }

    function drawMiniChart(canvasId, data, isUp) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const width = canvas.width = 100;
        const height = canvas.height = 40;

        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;

        ctx.strokeStyle = isUp ? '#10b981' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.beginPath();

        data.forEach((price, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((price - min) / range) * height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    window.selectStock = (symbol) => {
        gameState.selectedStock = symbol;
        renderTradingFormInitial();
    };

    function renderTradingFormInitial() {
        const stock = gameState.stocks.find(s => s.symbol === gameState.selectedStock);
        const form = document.getElementById('tradingForm');

        form.innerHTML = `
            <div class="trade-stock-header">
                <div class="trade-symbol">${stock.symbol}</div>
                <div class="trade-price" id="tradeFormPrice">$${stock.price.toFixed(2)}</div>
            </div>
            
            <div class="trade-holdings">
                <span>Owned: <strong id="tradeOwned">${gameState.portfolio[stock.symbol]}</strong></span>
                <span>Avg Cost: $0.00</span>
            </div>

            <div class="trade-input-group">
                <label>Quantity</label>
                <div class="trade-input-wrapper">
                    <input type="number" id="tradeQty" class="trade-input" value="1" min="1">
                </div>
                <div style="margin-top: 5px; display: flex; gap: 5px;">
                    <button class="qty-btn" onclick="setMaxBuy()">Max Buy</button>
                    <button class="qty-btn" onclick="setMaxSell()">Max Sell</button>
                </div>
            </div>
            
            <div class="trade-actions">
                <button class="trade-btn btn-buy" onclick="executeTrade('buy')">BUY</button>
                <button class="trade-btn btn-sell" onclick="executeTrade('sell')">SELL</button>
            </div>
        `;
    }

    function updateTradingForm() {
        // Only update dynamic values like price and validity
        const stock = gameState.stocks.find(s => s.symbol === gameState.selectedStock);
        const priceEl = document.getElementById('tradeFormPrice');
        if (priceEl) priceEl.textContent = `$${stock.price.toFixed(2)}`;

        const ownedEl = document.getElementById('tradeOwned');
        if (ownedEl) ownedEl.textContent = gameState.portfolio[stock.symbol];
    }

    window.setMaxBuy = () => {
        const stock = gameState.stocks.find(s => s.symbol === gameState.selectedStock);
        document.getElementById('tradeQty').value = Math.floor(gameState.cash / stock.price);
    };

    window.setMaxSell = () => {
        document.getElementById('tradeQty').value = gameState.portfolio[gameState.selectedStock];
    };

    window.executeTrade = (type) => {
        const qty = parseInt(document.getElementById('tradeQty').value);
        if (isNaN(qty) || qty <= 0) return showNotification("Invalid quantity", "error");

        const stock = gameState.stocks.find(s => s.symbol === gameState.selectedStock);
        const totalCost = qty * stock.price;

        if (type === 'buy') {
            if (gameState.cash >= totalCost) {
                gameState.cash -= totalCost;
                gameState.portfolio[stock.symbol] += qty;
                playSound('success');
                showNotification(`Bought ${qty} ${stock.symbol}`, "success");
            } else {
                showNotification("Insufficient funds!", "error");
                playSound('error');
            }
        } else {
            if (gameState.portfolio[stock.symbol] >= qty) {
                gameState.cash += totalCost;
                gameState.portfolio[stock.symbol] -= qty;
                playSound('success');
                showNotification(`Sold ${qty} ${stock.symbol}`, "success");
            } else {
                showNotification("Not enough shares!", "error");
                playSound('error');
            }
        }
        updateUI();
    };

    // Cleanup on exit
    // Note: We don't have a direct 'unload' hook easily here without framework, 
    // but the interval will be cleared if the function is called again or page reloaded.
    // Check Game End
    function checkGameEnd() {
        if (gameState.day > gameState.maxDays) {
            gameState.gameActive = false;
            clearInterval(gameState.gameInterval);
            showGameOverModal();
        }
    }

    function showGameOverModal() {
        // Calculate final stats
        const currentPortfolioValue = gameState.stocks.reduce((acc, stock) => {
            return acc + (stock.price * gameState.portfolio[stock.symbol]);
        }, 0);
        const totalValue = gameState.cash + currentPortfolioValue;
        const profit = totalValue - gameState.initialPortfolioValue;
        const profitPercent = (profit / gameState.initialPortfolioValue) * 100;

        // Determine badge/feedback & Tips
        let feedback = "";
        let emoji = "";
        let tip = "";

        if (profitPercent > 50) {
            feedback = "Wall Street Wizard! 🧙‍♂️";
            emoji = "🚀";
            tip = "You're a pro! Try experimenting with 'Short Selling' strategies next time (selling high then buying low) to maximize gains even more.";
        }
        else if (profitPercent > 20) {
            feedback = "Great Trader! 📈";
            emoji = "💰";
            tip = "Solid performance! To reach Wizard status, watch the News Ticker closely for 'Sector Booms' and go all-in on those stocks.";
        }
        else if (profitPercent > 0) {
            feedback = "Safe & Steady. 👍";
            emoji = "🛡️";
            tip = "Good job keeping your money safe. To grow faster, don't be afraid to buy volatile stocks (like Tech) when they dip below $100.";
        }
        else {
            feedback = "Market Crash Survivor... barely. 📉";
            emoji = "🩹";
            tip = "Ouch! Remember: Buy LOW, Sell HIGH. Avoid buying when a stock has already spiked after good news—it might be too late!";
        }

        // Custom function to handle "Home" ensuring modal is removed
        window.goHomeFromStock = () => {
            const modal = document.getElementById('stockGameOverModal');
            if (modal) modal.remove();
            navigateToPage('home');
        };

        const modalHtml = `
            <div id="stockGameOverModal" class="uni-modal-overlay active" style="z-index: 10000;">
                <div class="uni-modal-content" style="text-align: center;">
                    <div class="uni-modal-header">
                        <div class="uni-modal-icon">${emoji}</div>
                        <h2>Market Closed!</h2>
                    </div>
                    <div class="uni-section">
                        <h3>Final Results</h3>
                        <p>Total Equity: <strong class="highlight">$${totalValue.toFixed(2)}</strong></p>
                        <p>Profit/Loss: <span style="color: ${profit >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight: bold;">
                            ${profit >= 0 ? '+' : ''}$${profit.toFixed(2)} (${profitPercent.toFixed(2)}%)
                        </span></p>
                        <p style="margin-top: 15px; font-size: 18px; font-style: italic;">"${feedback}"</p>
                    </div>
                    
                    <div class="uni-section tip" style="text-align: left; margin-top: 20px;">
                        <h3>💡 Pro Tip for Next Time</h3>
                        <p>${tip}</p>
                    </div>

                    <div style="display: flex; gap: 10px; margin-top: 20px;">
                        <button class="uni-action-btn" onclick="restartCurrentGame()">Play Again 🔄</button>
                        <button class="uni-action-btn secondary" onclick="goHomeFromStock()">🏠 Home</button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        if (window.playSound) window.playSound(profit >= 0 ? 'success' : 'error');
    }

    window.closeStockGameOver = () => {
        document.getElementById('stockGameOverModal').remove();
    };

    window.resetStockTrader = () => {
        // Stop current game loop
        if (gameState.gameInterval) clearInterval(gameState.gameInterval);

        // Remove modal
        const modal = document.getElementById('stockGameOverModal');
        if (modal) modal.remove();

        // Re-initialize game
        loadStockTrader();
    };

    // Cleanup on exit
    // Note: We don't have a direct 'unload' hook easily here without framework, 
    // but the interval will be cleared if the function is called again or page reloaded.
    // For now, we leave it running until game change.
}
