  /* JavaScript for the Daggerheart Dice Roller
    This section handles the core logic:
    - Rolling the dice.
    - Calculating outcomes based on Daggerheart rules.
    - Updating the Hope/Fear counters.
    - Displaying the results dynamically.
  */

  /**
   * Adjusts the value of the Hope or Fear counters.
   * @param {string} type - 'hope' or 'fear'.
   * @param {number} amount - The value to add (can be negative).
   */
  function adjustCounter(type, amount) {
    const counterElement = document.getElementById(`${type}Counter`);
    let currentValue = parseInt(counterElement.textContent);
    currentValue += amount;
    if (currentValue < 0) currentValue = 0; // Prevent negative counts
    counterElement.textContent = currentValue;
  }

  /**
   * Simulates rolling the Daggerheart dice and determines the outcome.
   */
  function rollDice() {
    const hopeDieEl = document.getElementById("hopeDie");
    const fearDieEl = document.getElementById("fearDie");
    const outcomeDiv = document.getElementById("outcome");

    // Start rolling animation and hide previous outcome
    hopeDieEl.classList.add("rolling");
    fearDieEl.classList.add("rolling");
    outcomeDiv.style.display = "none";

    // Use a timeout to allow the animation to play
    setTimeout(() => {
      // Generate random numbers for each d12
      const hopeRoll = Math.floor(Math.random() * 12) + 1;
      const fearRoll = Math.floor(Math.random() * 12) + 1;
      const dc = parseInt(document.getElementById("dcInput").value) || 0;
      const total = hopeRoll + fearRoll;

      // Update die faces with results and stop animation
      hopeDieEl.textContent = hopeRoll;
      fearDieEl.textContent = fearRoll;
      hopeDieEl.classList.remove("rolling");
      fearDieEl.classList.remove("rolling");

      let outcomeHTML = "";
      let outcomeClass = "";

      // Check for Critical Success (doubles)
      if (hopeRoll === fearRoll) {
        outcomeClass = "critical-success";
        outcomeHTML = `
          <h3>🌟 CRITICAL SUCCESS! 🌟</h3>
          <p class="roll-breakdown">Both dice rolled ${hopeRoll}! Total: ${total}</p>
          <p class="duality-text">Automatic success with spectacular results!</p>
        `;
        adjustCounter('hope', 1); // Crit Success always gives Hope
      } else {
        // Standard roll logic
        const succeeded = dc > 0 && total >= dc;
        let successFailureText = dc > 0 ? (succeeded ? "SUCCESS" : "FAILURE") : "RAW ROLL";
        let rollBreakdown = `Total: ${total} (${hopeRoll} + ${fearRoll})` + (dc > 0 ? ` vs DC ${dc}` : '');

        // Check if Hope or Fear die is higher
        if (hopeRoll > fearRoll) {
          adjustCounter('hope', 1);
          if (dc > 0) {
            outcomeClass = succeeded ? "hope-success" : "failure-with-hope";
          } else {
            outcomeClass = "hope-success";
          }
          outcomeHTML = `
            <h3>${successFailureText}</h3>
            <p class="roll-breakdown">${rollBreakdown}</p>
            <p class="duality-text">🌟 Hope die higher! Gain 1 Hope.</p>
          `;
        } else {
          adjustCounter('fear', 1);
          if (dc > 0) {
            outcomeClass = succeeded ? "success-with-fear" : "fear-outcome";
          } else {
              outcomeClass = "fear-outcome";
          }
          outcomeHTML = `
            <h3>${successFailureText}</h3>
            <p class="roll-breakdown">${rollBreakdown}</p>
            <p class="duality-text">⚠️ Fear die higher! GM gains 1 Fear.</p>
          `;
        }
      }

      // Display the final outcome
      outcomeDiv.innerHTML = outcomeHTML;
      outcomeDiv.className = `outcome-card ${outcomeClass}`;
      outcomeDiv.style.display = "block";
    }, 600); // Duration should match the CSS roll animation
  }

  // Add event listener to allow rolling with the Enter key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      // Prevents rolling while typing in the input field
      if (document.activeElement.id !== 'dcInput') {
          rollDice();
      }
    }
  });
