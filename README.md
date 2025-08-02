# Oracle's Table - Daggerheart TTGPG Inspired Dice Roller

This project is a lightweight web-based dice roller tailored for the Daggerheart tabletop playtest. It provides an easy way to roll the game's Hope and Fear d12 dice, compare the total against a Difficulty Class (DC) and see the resulting outcome.

## Opening the App

Simply open `index.html` in a modern web browser (Chrome, Firefox, etc.). All logic and styling are contained locally so no build step is required.

## Hope/Fear/DC System Overview

Two d12 dice are rolled each time: the **Hope** die and the **Fear** die. The sum of both dice is compared to your chosen DC:

- **Critical Success** – both dice show the same value.
- **Hope Result Higher** – you gain a Hope token; with a DC this may be a success or failure.
- **Fear Result Higher** – the GM gains a Fear token; with a DC this may be a success or failure.

Enter `0` for the DC if you just want to see the raw roll result without determining success or failure.

## Browser Requirements and Dependencies

- Uses custom CSS styles bundled with the project (no external framework required).
- Requires a modern browser with JavaScript enabled.

