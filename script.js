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

document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("animation-container");
  const particleCount = 40; // Number of particles

  for (let i = 0; i < particleCount; i++) {
    let particle = document.createElement("div");
    particle.classList.add("particle");

    // Randomize properties for each particle
    const size = Math.random() * 6 + 2; // size between 1px and 5px
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    particle.style.left = `${Math.random() * 100}%`;

    const duration = Math.random() * 15 + 10; // duration between 10s and 25s
    particle.style.animationDuration = `${duration}s`;

    const delay = Math.random() * 15; // delay up to 15s
    particle.style.animationDelay = `${delay}s`;

    // Randomize horizontal drift direction
    if (Math.random() > 0.5) {
      particle.style.animationName = "float-reverse";
    }

    container.appendChild(particle);
  }
});

// Create a second keyframe for reverse horizontal movement
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
            @keyframes float-reverse {
                0% { transform: translateY(0) translateX(0); opacity: 0; }
                50% { opacity: 1; }
                100% { transform: translateY(-110vh) translateX(-15vw); opacity: 0; }
            }
        `;
document.head.appendChild(styleSheet);
