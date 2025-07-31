// Game State
let hopeCount = 0;
let fearCount = 0;
let hopeRoll = null;
let fearRoll = null;
let isRolling = false;

// DOM Elements
const hopeCounterEl = document.getElementById('hopeCounter');
const fearCounterEl = document.getElementById('fearCounter');
const dcInputEl = document.getElementById('dcInput');
const hopeDieEl = document.getElementById('hopeDie');
const fearDieEl = document.getElementById('fearDie');
const rollButtonEl = document.getElementById('rollButton');
const outcomeEl = document.getElementById('outcome');
const outcomeTitleEl = document.getElementById('outcomeTitle');
const outcomeDetailsEl = document.getElementById('outcomeDetails');
const outcomeTokenEl = document.getElementById('outcomeToken');

// Utility Functions
function updateCounterDisplay() {
    hopeCounterEl.textContent = hopeCount;
    fearCounterEl.textContent = fearCount;
}

function adjustCounter(type, amount) {
    if (type === 'hope') {
        hopeCount = Math.max(0, hopeCount + amount);
    } else {
        fearCount = Math.max(0, fearCount + amount);
    }
    updateCounterDisplay();
}

function updateDiceDisplay() {
    hopeDieEl.textContent = hopeRoll || '?';
    fearDieEl.textContent = fearRoll || '?';
}

function showOutcome(outcome) {
    outcomeTitleEl.textContent = outcome.title;
    
    const dc = parseInt(dcInputEl.value) || 0;
    const total = hopeRoll + fearRoll;
    
    outcomeDetailsEl.textContent = `Total: ${total} (${hopeRoll} + ${fearRoll})${dc > 0 ? ` vs DC ${dc}` : ''}`;
    
    if (outcome.tokenChange) {
        outcomeTokenEl.textContent = `+1 ${outcome.tokenChange.type === 'hope' ? '✨ Hope' : '⚡ Fear'}`;
    }
    
    // Reset outcome classes
    outcomeEl.className = 'outcome';
    outcomeEl.classList.add(outcome.type);
    outcomeEl.style.display = 'block';
}

function hideOutcome() {
    outcomeEl.style.display = 'none';
}

async function rollDice() {
    if (isRolling) return;
    
    isRolling = true;
    hideOutcome();
    
    // Update button state
    rollButtonEl.textContent = 'Rolling...';
    rollButtonEl.disabled = true;
    
    // Add rolling animation
    hopeDieEl.classList.add('rolling');
    fearDieEl.classList.add('rolling');
    
    // Quick rolling animation
    const rollDuration = 600;
    const rollInterval = 80;
    
    const rollAnimation = setInterval(() => {
        hopeRoll = Math.floor(Math.random() * 12) + 1;
        fearRoll = Math.floor(Math.random() * 12) + 1;
        updateDiceDisplay();
    }, rollInterval);

    setTimeout(() => {
        clearInterval(rollAnimation);
        
        // Final roll
        hopeRoll = Math.floor(Math.random() * 12) + 1;
        fearRoll = Math.floor(Math.random() * 12) + 1;
        updateDiceDisplay();
        
        // Remove rolling animation
        hopeDieEl.classList.remove('rolling');
        fearDieEl.classList.remove('rolling');
        
        // Reset button state
        isRolling = false;
        rollButtonEl.textContent = '🎲 ROLL DICE';
        rollButtonEl.disabled = false;

        // Calculate outcome
        const dc = parseInt(dcInputEl.value) || 0;
        const total = hopeRoll + fearRoll;
        let outcome = {};

        if (hopeRoll === fearRoll) {
            // Critical Success
            outcome = {
                type: 'critical',
                title: '⭐ CRITICAL',
                tokenChange: { type: 'hope', amount: 1 }
            };
            adjustCounter('hope', 1);
        } else {
            const succeeded = dc > 0 && total >= dc;
            const hopeHigher = hopeRoll > fearRoll;
            
            if (dc === 0) {
                // Raw roll mode - no success/failure, use success styling
                if (hopeHigher) {
                    outcome = {
                        type: 'hope',
                        title: '✨ HOPE HIGHER',
                        tokenChange: { type: 'hope', amount: 1 }
                    };
                    adjustCounter('hope', 1);
                } else {
                    outcome = {
                        type: 'hope', // Use hope styling for all raw rolls
                        title: '⚡ FEAR HIGHER',
                        tokenChange: { type: 'fear', amount: 1 }
                    };
                    adjustCounter('fear', 1);
                }
            } else {
                // Normal DC mode
                if (hopeHigher) {
                    outcome = {
                        type: 'hope',
                        title: succeeded ? '✨ SUCCESS' : '💫 FAILURE',
                        tokenChange: { type: 'hope', amount: 1 }
                    };
                    adjustCounter('hope', 1);
                } else {
                    outcome = {
                        type: 'fear',
                        title: succeeded ? '⚡ SUCCESS' : '🌩️ FAILURE',
                        tokenChange: { type: 'fear', amount: 1 }
                    };
                    adjustCounter('fear', 1);
                }
            }
        }

        showOutcome(outcome);
    }, rollDuration);
}

// Event Listeners
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.target.type !== 'number') {
        event.preventDefault();
        rollDice();
    }
});

// Initialize
updateCounterDisplay();
updateDiceDisplay();
