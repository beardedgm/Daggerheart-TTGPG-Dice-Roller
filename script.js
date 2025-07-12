function rollDice() {
  const hopeDie = document.getElementById("hopeDie");
  const fearDie = document.getElementById("fearDie");
  const outcomeDiv = document.getElementById("outcome");

  // Add rolling animation
  hopeDie.classList.add("rolling");
  fearDie.classList.add("rolling");

  // Hide previous outcome
  outcomeDiv.style.display = "none";

  // Simulate rolling delay
  setTimeout(() => {
    // Generate random numbers 1-12
    const hopeRoll = Math.floor(Math.random() * 12) + 1;
    const fearRoll = Math.floor(Math.random() * 12) + 1;
    const dc = parseInt(document.getElementById("dcInput").value) || 0;

    // Calculate total (sum of both dice for DC check)
    const total = hopeRoll + fearRoll;

    // Update die faces
    hopeDie.textContent = hopeRoll;
    fearDie.textContent = fearRoll;

    // Remove rolling animation
    hopeDie.classList.remove("rolling");
    fearDie.classList.remove("rolling");

    // Determine outcome
    let outcomeText = "";
    let outcomeClass = "";

    if (hopeRoll === fearRoll) {
      // Critical Success - both dice show same number
      outcomeText = `🌟 CRITICAL SUCCESS! 🌟<br>Both dice rolled ${hopeRoll}!<br>Total: ${total} - Automatic success with spectacular results!`;
      outcomeClass = "critical-success";
    } else {
      // Determine success/failure first
      let succeeded = false;
      let successFailureText = "";

      if (dc > 0) {
        succeeded = total >= dc;
        successFailureText = succeeded ? "SUCCESS" : "FAILURE";
      }

      // Show the roll results
      let resultText =
        dc > 0
          ? `${successFailureText}<br>Total: ${total} (${hopeRoll} + ${fearRoll}) vs DC ${dc}`
          : `<strong>Total Result: ${total}</strong><br>Hope: ${hopeRoll} + Fear: ${fearRoll}`;

      // Determine Hope/Fear token outcome and overall state
      let tokenText = "";
      if (hopeRoll > fearRoll) {
        tokenText = "<br>🌟 Hope die higher! Gain 1 Hope token!";
        if (dc > 0) {
          if (succeeded) {
            outcomeText = `✅ ${resultText}${tokenText}`;
            outcomeClass = "hope-success"; // Success with Hope - Green
          } else {
            outcomeText = `❌ ${resultText}${tokenText}`;
            outcomeClass = "failure-with-hope"; // Failure with Hope - Blue
          }
        } else {
          outcomeText = `${resultText}${tokenText}`;
          outcomeClass = "hope-success";
        }
      } else {
        tokenText = "<br>⚠️ Fear die higher! GM gains 1 Fear token!";
        if (dc > 0) {
          if (succeeded) {
            outcomeText = `✅ ${resultText}${tokenText}`;
            outcomeClass = "success-with-fear"; // Success with Fear - Orange
          } else {
            outcomeText = `❌ ${resultText}${tokenText}`;
            outcomeClass = "fear-outcome"; // Failure with Fear - Red
          }
        } else {
          outcomeText = `${resultText}${tokenText}`;
          outcomeClass = "fear-outcome";
        }
      }
    }

    // Display outcome
    outcomeDiv.innerHTML = outcomeText;
    outcomeDiv.className = `outcome-card ${outcomeClass}`;
    outcomeDiv.style.display = "block";
  }, 600); // Match animation duration
}

// Allow Enter key to roll dice
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    rollDice();
  }
});