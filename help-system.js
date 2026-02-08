/* Universal Help System */

const helpContent = {
    budget: {
        title: "Budget Boss",
        howto: [
            "Choose a difficulty level (Beginner, Intermediate, or Advanced).",
            "You have a fixed budget and a set number of days to survive.",
            "Each day, you'll face different scenarios and must make financial choices.",
            "Keep your balance above zero until the time runs out!",
            "Smart choices save money, while impulsive ones drain your budget."
        ],
        tips: [
            "Read each scenario carefully to understand the consequences.",
            "Always prioritize essential expenses like rent and utilities.",
            "Watch out for surprise events that might require extra cash."
        ],
        learn: {
            topic: "Survival Budgeting",
            what: "Survival budgeting is the art of prioritizing essential expenses during times of fixed income or financial crisis.",
            why: "It builds resilience and teaches you how to distinguish between true needs and temporary wants.",
            realExample: "When an emergency hit, a student cut their 'Wants' (eating out) entirely to ensure their 'Needs' (internet for class) were covered.",
            takeaway: "Maintaining a positive balance requires constant vigilance and disciplined decision-making."
        }
    },
    debt: {
        title: "Save or Sink: Debt Escape",
        howto: [
            "Navigate through 5 years of college life, each with unique financial themes.",
            "Each level has a set **Timeline (Months)**. You MUST reach your savings goal and clear all debt before time runs out!",
            "Level 4 (Career Bridge): You have 8 months to clear ₹37,000 in legacy debt and save ₹15,000 for relocation.",
            "Strategy Months: In certain months, you'll choose between Snowball (low stress) or Avalanche (low debt) strategies.",
            "Career Months: Most months focus on professional life choices where mindset matters most."
        ],
        tips: [
            "Keep an eye on the **Timeline Meter**. If you have 2 months left and high debt, prioritize 'Frugal' choices!",
            "Avalanche strategy reduces debt directly—use it if your interest is eating your savings.",
            "Snowball reduces stress—use it if you're close to 'Mental Burnout'."
        ],
        learn: {
            topic: "The Debt Bridge & Adulting",
            what: "Transitioning from college to a job often comes with 'Legacy Debt' (loans) and 'Setup Costs' (deposits). Level 4 simulates this high-pressure bridge.",
            why: "Understanding how to manage multiple debts while saving for a new life is the ultimate financial literacy test.",
            realExample: "A new graduate used the 'Avalanche Method' to pay off their 14% interest credit card before touching their 4% student loan, saving ₹12,000 in interest.",
            takeaway: "Time is money. A fixed timeline teaches you to prioritize debt clearance before it compounds out of control."
        }
    },
    savings: {
        title: "Savings Sprint",
        howto: [
            "You are the piggy bank! Move left/right to catch items.",
            "Catch coins (🪙), cash (💵), and gems (💎) to grow your savings.",
            "Avoid expenses like burgers (🍔) and shopping carts (🛒) - they reduce your lives!",
            "Survive as long as you can to build a high score."
        ],
        tips: [
            "Watch out for the speed increase as you get richer!",
            "Prioritize the Gems (💎) for big bonuses."
        ],
        learn: {
            topic: "The Power of Saving",
            what: "Saving is setting aside money today for use in the future.",
            why: "It provides financial security, freedom, and the ability to afford expensive goals.",
            realExample: "Saving $5 a day adds up to $1,825 in a year!",
            takeaway: "Small, consistent habits lead to big financial results over time."
        }
    },
    investment: {
        title: "Investment Growth",
        howto: [
            "You start with $1,000. Your goal is to grow it over 10 years.",
            "Allocate your money across Savings, Bonds, and Stocks.",
            "Advance the year to see how your investments perform.",
            "React to market events like 'Bull Markets' or 'Crashes'."
        ],
        tips: [
            "Diversify! Don't put all your eggs in one basket.",
            "Stocks are risky but offer high returns. Savings are safe but low return."
        ],
        learn: {
            topic: "Compound Interest & Investing",
            what: "Compound interest is earning interest on your interest. It makes money grow exponentially.",
            why: "It's the most powerful force in finance. Time is your best friend.",
            realExample: "Invest $10,000 at 8% for 40 years = $217,000 without adding another cent!",
            takeaway: "Start investing early and let compound interest do the heavy lifting."
        }
    },
    credit: {
        title: "Credit Card Master",
        howto: [
            "Read the financial habit on the card.",
            "Swipe RIGHT (or click ✅) if it's a GOOD habit.",
            "Swipe LEFT (or click ❌) if it's a BAD habit.",
            "Build your credit score by making smart choices."
        ],
        tips: [
            "Paying the full balance is always best.",
            "Keeping utilization low (<30%) boosts your score."
        ],
        learn: {
            topic: "Credit Scores & Why They Matter",
            what: "A 3-digit number (300-850) that rates your creditworthiness.",
            why: "A high score gets you lower interest rates on loans, saving you thousands.",
            realExample: "A good score could save you $50,000+ in interest on a home mortgage.",
            takeaway: "Treat credit like a tool, not free money. Pay it back on time, every time."
        }
    },
    memory: {
        title: "Money Memory",
        howto: [
            "Click a card to flip it over.",
            "Find the matching pair (Term + Definition).",
            "Match all pairs with the fewest moves possible.",
            "Learn new financial vocabulary along the way!"
        ],
        tips: [
            "Memorize card locations.",
            "Read the definitions to understand the concepts."
        ],
        learn: {
            topic: "Financial Literacy Basics",
            what: "Understanding how money works: earning, managing, investing, and donating.",
            why: "Financial literacy empowers you to make informed decisions and avoid pitfalls.",
            realExample: "Knowing the difference between an Asset and a Liability is the first step up to wealth.",
            takeaway: "Knowledge is the best investment you can make."
        }
    },
    stock: {
        title: "Stock Trader Pro",
        howto: [
            "You have $1,000 and 30 days to make a profit.",
            "Buy stocks (FinBank, TechCorp, etc.) when prices are LOW.",
            "Sell stocks when prices are HIGH.",
            "Watch the News Ticker for events that affect prices!",
            "Check the charts to spot trends."
        ],
        tips: [
            "Tech stocks are volatile (high risk, high reward).",
            "Banks are stable.",
            "Bad news usually drops prices - good opportunity to buy cheap!"
        ],
        learn: {
            topic: "Stock Market Basics",
            what: "The stock market is where investors buy and sell shares of companies.",
            why: "It allows companies to raise money and investors to own a piece of the company's success.",
            realExample: "If you bought Amazon stock in 1997, you'd be up over 100,000% today.",
            takeaway: "The market fluctuates daily. Focus on value and long-term trends, not just noise."
        }
    }
};

function initHelpSystem(gameId) {
    const data = helpContent[gameId];
    if (!data) return;

    // 1. Inject Help Buttons
    // Target the game header for better placement
    const gameHeader = document.querySelector('.game-header');

    // Create button container if it doesn't exist
    let btnContainer = gameHeader.querySelector('.game-help-buttons');
    if (!btnContainer) {
        btnContainer = document.createElement('div');
        btnContainer.className = 'game-help-buttons';

        // Insert after the title (h2)
        const title = gameHeader.querySelector('h2');
        if (title) {
            title.parentNode.insertBefore(btnContainer, title.nextSibling);
        } else {
            gameHeader.appendChild(btnContainer);
        }
    }

    // Clear existing buttons to avoid duplicates on re-render
    btnContainer.innerHTML = `
        <button class="help-btn" onclick="openHelpModal('${gameId}', 'howto')">
            <span class="icon">ℹ️</span> <span class="text">How to Play</span>
        </button>
        <button class="help-btn" onclick="openHelpModal('${gameId}', 'learn')">
            <span class="icon">📚</span> <span class="text">Learn More</span>
        </button>
    `;

    // 2. Inject Modal Container (if not exists)
    if (!document.getElementById('universalHelpModal')) {
        const modalHtml = `
            <div id="universalHelpModal" class="uni-modal-overlay">
                <div class="uni-modal-content">
                    <button class="uni-modal-close" onclick="closeHelpModal()">×</button>
                    <div id="uniModalBody"></div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Close on outside click
        document.getElementById('universalHelpModal').addEventListener('click', (e) => {
            if (e.target.id === 'universalHelpModal') closeHelpModal();
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeHelpModal();
        });
    }
}

window.openHelpModal = (gameId, type) => {
    const data = helpContent[gameId];
    const modal = document.getElementById('universalHelpModal');
    const body = document.getElementById('uniModalBody');

    let content = '';

    if (type === 'howto') {
        content = `
            <div class="uni-modal-header">
                <div class="uni-modal-icon">🎮</div>
                <h2>How to Play: ${data.title}</h2>
            </div>
            <div class="uni-section">
                <h3>🎯 Objective</h3>
                <ul class="uni-list">
                    ${data.howto.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <div class="uni-section tip">
                <h3>💡 Pro Tips</h3>
                <ul class="uni-list">
                    ${data.tips.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
            <button class="uni-action-btn" onclick="closeHelpModal()">Got it! Let's Play 🚀</button>
        `;
    } else {
        content = `
            <div class="uni-modal-header">
                <div class="uni-modal-icon">🧠</div>
                <h2>Learn: ${data.learn.topic}</h2>
            </div>
            <div class="uni-section">
                <h3>📖 What is it?</h3>
                <p>${data.learn.what}</p>
            </div>
            <div class="uni-section">
                <h3>🌟 Why it matters</h3>
                <p>${data.learn.why}</p>
            </div>
            <div class="uni-section example">
                <h3>💼 Real World Example</h3>
                <p>${data.learn.realExample}</p>
            </div>
            <div class="uni-section">
                <h3>🎓 Key Takeaway</h3>
                <p class="highlight">${data.learn.takeaway}</p>
            </div>
            <button class="uni-action-btn secondary" onclick="closeHelpModal()">Close</button>
        `;
    }

    body.innerHTML = content;
    modal.classList.add('active');

    // Play sound if available
    if (window.playSound) window.playSound('click');
};

window.closeHelpModal = () => {
    const modal = document.getElementById('universalHelpModal');
    modal.classList.remove('active');
};
