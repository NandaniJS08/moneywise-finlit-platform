// ============================================
// GAME 4: CREDIT CARD MASTER (Cyber Arcade)
// ============================================

const ccScenarios = [
    // --- FOUNDATIONS ---
    {
        text: "ccScen1Text", // Key reference, will be resolved in render
        icon: "💳", impact: 20, category: "ccCatPaymentHistory"
        , good: true,
        explanation: "ccScen1Exp"
    },
    {
        text: "ccScen2Text",
        icon: "🌴", impact: -30, category: "ccCatPaymentHistory", good: false,
        explanation: "ccScen2Exp"
    },
    {
        text: "ccScen3Text",
        icon: "🤖", impact: 15, category: "ccCatAutomation", good: true,
        explanation: "ccScen3Exp"
    },
    {
        text: "ccScen4Text",
        icon: "📉", impact: -10, category: "ccCatInterest", good: false,
        explanation: "ccScen4Exp"
    },

    // --- COLLEGE & LIFE SCENARIOS ---
    {
        text: "ccScen5Text",
        icon: "👟", impact: -15, category: "ccCatInquiries", good: false,
        explanation: "ccScen5Exp"
    },
    {
        text: "ccScen6Text",
        icon: "📚", impact: 15, category: "ccCatRewards", good: true,
        explanation: "ccScen6Exp"
    },
    {
        text: "ccScen7Text",
        icon: "🎮", impact: -35, category: "ccCatUtilization", good: false,
        explanation: "ccScen7Exp"
    },
    {
        text: "ccScen8Text",
        icon: "👩‍👧", impact: 25, category: "ccCatHistory", good: true,
        explanation: "ccScen8Exp"
    },
    {
        text: "ccScen9Text",
        icon: "✂️", impact: -20, category: "ccCatHistory", good: false,
        explanation: "ccScen9Exp"
    },
    {
        text: "ccScen10Text",
        icon: "📨", impact: -25, category: "ccCatInquiries", good: false,
        explanation: "ccScen10Exp"
    },
    {
        text: "ccScen11Text",
        icon: "🍕", impact: 10, category: "ccCatStrategy", good: true,
        explanation: "ccScen11Exp"
    },
    {
        text: "ccScen12Text",
        icon: "🏧", impact: -20, category: "ccCatFees", good: false,
        explanation: "ccScen12Exp"
    },

    // --- SECURITY & ADVANCED ---
    {
        text: "ccScen13Text",
        icon: "🎣", impact: -30, category: "ccCatSecurity", good: false,
        explanation: "ccScen13Exp"
    },
    {
        text: "ccScen14Text",
        icon: "🔎", impact: 10, category: "ccCatSecurity", good: true,
        explanation: "ccScen14Exp"
    },
    {
        text: "ccScen15Text",
        icon: "🤝", impact: -40, category: "ccCatRisk", good: false,
        explanation: "ccScen15Exp"
    }
];

let ccState = {
    score: 500, // Start fair
    history: [],
    currentCardIndex: 0,
    deck: []
};

function loadCreditCardSwipe() {
    const container = document.getElementById('gameContainer');

    // Initialize Help System
    setTimeout(() => {
        if (window.initHelpSystem) initHelpSystem('credit');
    }, 100);

    // Reset State
    ccState = {
        score: 500,
        history: [],
        currentCardIndex: 0,
        deck: [...ccScenarios].sort(() => Math.random() - 0.5)
    };

    container.innerHTML = `
        <div class="cc-game-container" id="ccGameContainer">
            <!-- Score Dashboard (Power Bar) -->
            <div class="score-dashboard">
                <div class="score-display">
                    <div class="score-rank" id="scoreRank">${I18N.t('ccRankRookie')}</div>
                    <div class="current-score" id="scoreValue">500</div>
                </div>
                <!-- Linear Gauge -->
                <div class="gauge-wrapper">
                    <div class="gauge-fill" id="gaugeFill" style="width: 36%;"></div>
                </div>
            </div>

            <!-- Card Stack -->
            <div class="card-arena" id="cardArena">
                <!-- Cards injected here -->
            </div>

            <!-- Education Feedback Popup -->
            <div class="edu-popup" id="eduPopup">
                <div class="edu-popup-header" id="eduHeader">${I18N.t('ccImpact')}</div>
                <div class="edu-message" id="eduMessage">${I18N.t('ccMessage')}</div>
                <div class="edu-impact" id="eduImpact">Utilization (30%)</div>
                <button class="edu-close-btn" id="closeEduPopup">${I18N.t('ccGotIt')}</button>
            </div>

            <!-- Controls -->
            <div class="cc-controls">
                <button class="cc-btn no" onclick="triggerSwipe('left')">✖</button>
                <button class="cc-btn yes" onclick="triggerSwipe('right')">✔</button>
            </div>
        </div>
    `;

    // Add close listener for the popup
    document.getElementById('closeEduPopup').addEventListener('click', () => {
        document.getElementById('eduPopup').classList.remove('active');
        renderCard();
    });

    renderCard();
    updateGauge();
}

function renderCard() {
    const arena = document.getElementById('cardArena');
    arena.innerHTML = ''; // Clear

    if (ccState.currentCardIndex >= ccState.deck.length) {
        showEndScreen();
        return;
    }

    const scenario = ccState.deck[ccState.currentCardIndex];

    // Determine card style based on score
    let cardClass = 'cc-card';
    if (ccState.score >= 700) cardClass += ' gold';
    if (ccState.score >= 800) cardClass += ' platinum';

    const cardHtml = `
        <div class="${cardClass}" id="activeCard">
            <div class="card-chip"></div>
            <div class="scenario-icon">${scenario.icon}</div>
            <div class="scenario-text">${I18N.t(scenario.text)}</div>
            
            <div class="swipe-feedback feedback-good">${I18N.t('ccSwipeRight')}</div>
            <div class="swipe-feedback feedback-bad">${I18N.t('ccSwipeLeft')}</div>
        </div>
    `;

    arena.innerHTML = cardHtml;
    initSwipeMechanics(document.getElementById('activeCard'), scenario);
}

function initSwipeMechanics(card, scenario) {
    let startX = 0;
    let isDragging = false;
    const threshold = 100;

    const handleStart = (e) => {
        // Don't start drag if popup is active
        if (document.getElementById('eduPopup').classList.contains('active')) return;

        isDragging = true;
        startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        card.style.transition = 'none';
        card.style.cursor = 'grabbing';
    };

    const handleMove = (e) => {
        if (!isDragging) return;

        const currentX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
        const diffX = currentX - startX;
        const rotation = diffX * 0.1; // Rotation

        card.style.transform = `translateX(${diffX}px) rotate(${rotation}deg)`;

        // Opacity of feedback
        const goodFeedback = card.querySelector('.feedback-good');
        const badFeedback = card.querySelector('.feedback-bad');

        if (diffX > 0) {
            goodFeedback.style.opacity = Math.min(diffX / 100, 1);
            badFeedback.style.opacity = 0;
            card.style.boxShadow = `0 0 30px rgba(0, 255, 157, ${Math.min(diffX / 200, 0.8)})`;
        } else {
            badFeedback.style.opacity = Math.min(Math.abs(diffX) / 100, 1);
            goodFeedback.style.opacity = 0;
            card.style.boxShadow = `0 0 30px rgba(255, 0, 222, ${Math.min(Math.abs(diffX) / 200, 0.8)})`;
        }
    };

    const handleEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;
        card.style.cursor = 'grab';

        const currentX = e.type.includes('mouse') ? e.clientX : e.changedTouches[0].clientX;
        const diffX = currentX - startX;

        if (diffX > threshold) {
            processSwipe(true, scenario); // Swipe Right (YES)
        } else if (diffX < -threshold) {
            processSwipe(false, scenario); // Swipe Left (NO)
        } else {
            // Reset
            card.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.transform = 'translate(0, 0)';
            card.querySelector('.feedback-good').style.opacity = 0;
            card.querySelector('.feedback-bad').style.opacity = 0;
            card.style.boxShadow = '';
        }
    };

    // Mouse Events
    card.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);

    // Touch Events
    card.addEventListener('touchstart', handleStart);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd);
}

function triggerSwipe(direction) {
    // Don't trigger if popup is active
    if (document.getElementById('eduPopup').classList.contains('active')) return;

    const card = document.getElementById('activeCard');
    if (!card) return;
    const scenario = ccState.deck[ccState.currentCardIndex];

    card.style.transition = 'transform 0.5s ease-in';
    if (direction === 'right') {
        processSwipe(true, scenario);
    } else {
        processSwipe(false, scenario);
    }
}

function processSwipe(accepted, scenario) {
    const card = document.getElementById('activeCard');
    const isRight = accepted;

    // Animate Card Out
    card.style.transition = 'transform 0.4s ease-in, opacity 0.2s';
    card.style.transform = `translateX(${isRight ? 1000 : -1000}px) rotate(${isRight ? 45 : -45}deg)`;
    card.style.opacity = '0';

    const isCorrect = (accepted === scenario.good);
    let scoreChange = 0;

    if (isCorrect) {
        scoreChange = Math.abs(scenario.impact);
        createParticles(true); // Confetti
        if (window.playSound) window.playSound('success');
    } else {
        scoreChange = -Math.abs(scenario.impact);
        shakeScreen(); // Shake
        if (window.playSound) window.playSound('error');
    }

    // Update Score
    ccState.score = Math.max(300, Math.min(850, ccState.score + scoreChange));
    updateGauge();

    // Show Feedback
    showFeedback(isCorrect, scoreChange, scenario);

    // Next Card
    ccState.currentCardIndex++;
    // Delay next card render until popup closes or timer ends
}

function showFeedback(isCorrect, change, scenario) {
    const popup = document.getElementById('eduPopup');
    const header = document.getElementById('eduHeader');
    const message = document.getElementById('eduMessage');
    const impact = document.getElementById('eduImpact');


    header.textContent = isCorrect ? I18N.t('ccCombo') : I18N.t('ccMiss');
    header.style.color = isCorrect ? 'var(--neon-green)' : 'var(--neon-pink)';

    // Construct message
    let msg = I18N.t(scenario.explanation);
    if (change > 0) msg += ` (+${change} XP)`;
    else msg += ` (${change} XP)`;

    message.textContent = msg;
    impact.textContent = `${I18N.t('ccImpact')}: ${I18N.t(scenario.category)}`;

    popup.classList.add('active');

    // Clear any existing timeout to avoid collision
    if (window.eduPopupTimeout) clearTimeout(window.eduPopupTimeout);

    // Hide after 5 seconds instead of 2
    window.eduPopupTimeout = setTimeout(() => {
        if (popup.classList.contains('active')) {
            popup.classList.remove('active');
            renderCard(); // Render next card only AFTER popup closes
        }
    }, 5000);
}

function updateGauge() {
    const fill = document.getElementById('gaugeFill');
    const scoreVal = document.getElementById('scoreValue');
    const scoreRank = document.getElementById('scoreRank');

    // 300 to 850 range
    const min = 300;
    const max = 850;
    const percentage = Math.max(0, Math.min(100, ((ccState.score - min) / (max - min)) * 100));

    fill.style.width = `${percentage}%`;
    scoreVal.textContent = ccState.score;

    // Rank Logic
    if (ccState.score >= 800) { scoreRank.textContent = I18N.t('ccRankLegend'); scoreRank.style.color = "var(--neon-blue)"; }
    else if (ccState.score >= 740) { scoreRank.textContent = I18N.t('ccRankElite'); scoreRank.style.color = "var(--neon-green)"; }
    else if (ccState.score >= 670) { scoreRank.textContent = I18N.t('ccRankPro'); scoreRank.style.color = "var(--neon-yellow)"; }
    else if (ccState.score >= 580) { scoreRank.textContent = I18N.t('ccRankRookie'); scoreRank.style.color = "#orange"; }
    else { scoreRank.textContent = I18N.t('ccRankNoob'); scoreRank.style.color = "var(--neon-pink)"; }
}

function showEndScreen() {
    const container = document.getElementById('gameContainer');
    const finalScore = ccState.score;

    let feedback = "";
    if (finalScore >= 750) feedback = I18N.t('ccFeedbackLevelCleared');
    else if (finalScore >= 650) feedback = I18N.t('ccFeedbackStageComplete');
    else feedback = I18N.t('ccFeedbackGameOver');

    container.innerHTML = `
        <div class="cc-game-container">
            <h1 style="color: var(--neon-blue); font-family: 'Press Start 2P'; margin-bottom: 30px; line-height: 1.5;">${I18N.t('ccSessionComplete')}</h1>
            
            <div class="current-score" style="font-size: 60px; margin-bottom: 20px;">${finalScore}</div>
            <p style="font-family: 'Rajdhani'; font-size: 24px; color: #fff; margin-bottom: 40px;">${feedback}</p>
            
            <button class="cc-btn yes" style="width: auto; height: auto; padding: 15px 40px; border-radius: 12px; font-size: 18px; font-family: 'Press Start 2P';" onclick="loadCreditCardSwipe()">${I18N.t('ccReplay')}</button>
            <button class="uni-action-btn secondary" onclick="navigateToPage('home')">${I18N.t('btnExit')}</button>
        </div>
    `;
}

// --- VISUAL EFFECTS ---

function shakeScreen() {
    const container = document.getElementById('ccGameContainer');
    if (container) {
        container.classList.remove('shake');
        void container.offsetWidth; // Force reflow
        container.classList.add('shake');
    }
}

function createParticles(isGood) {
    const container = document.getElementById('ccGameContainer');
    if (!container) return;

    const count = 20;
    const color = isGood ? '#00ff9d' : '#ff00de';

    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.style.position = 'absolute';
        p.style.left = '50%';
        p.style.top = '50%';
        p.style.width = '10px';
        p.style.height = '10px';
        p.style.backgroundColor = color;
        p.style.borderRadius = '50%';
        p.style.pointerEvents = 'none';
        p.style.zIndex = '1000';

        // Random velocity
        const vx = (Math.random() - 0.5) * 200;
        const vy = (Math.random() - 0.5) * 200;

        p.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${vx}px, ${vy}px) scale(0)`, opacity: 0 }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        }).onfinish = () => p.remove();

        container.appendChild(p);
    }
}
// Re-render game when language changes
window.addEventListener('languageChanged', () => {
    if (window.AppState?.currentGame?.id === 'credit-card-swipe') {
        loadCreditCardSwipe();
    }
});
