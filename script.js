const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let calculation = "";

/* 
   Button Handling
 */
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.innerText;

        if (button.classList.contains("clear")) {
            resetCalculator();
        } 
        else if (button.classList.contains("back")) {
            removeLast();
        }
        else if (button.classList.contains("equals")) {
            calculateResult();
        } 
        else {
            addInput(value);
        }
    });
});

/* 
   Core Logic
 */
function addInput(value) {
    const lastChar = calculation.slice(-1);

    // Replace operator if another operator is clicked
    if (isOperator(lastChar) && isOperator(value)) {
        calculation = calculation.slice(0, -1) + value;
        display.value = calculation;
        return;
    }

    // Prevent multiple decimals in same number
    if (value === "." && lastNumberHasDecimal()) return;

    calculation += value;
    display.value = calculation;
}

function removeLast() {
    calculation = calculation.slice(0, -1);
    display.value = calculation;
}

function resetCalculator() {
    calculation = "";
    display.value = "";
}

function calculateResult() {
    try {
        if (!calculation) return;

        if (/\/0(?!\d)/.test(calculation)) {
            throw new Error("Division by zero");
        }

        const result = Function(`"use strict"; return (${calculation})`)();
        calculation = result.toString();
        display.value = calculation;

    } catch {
        display.value = "Error";
        calculation = "";
    }
}

/* 
   Helpers
 */
function isOperator(char) {
    return ["+", "-", "*", "/"].includes(char);
}

function lastNumberHasDecimal() {
    const parts = calculation.split(/[\+\-\*\/]/);
    return parts[parts.length - 1].includes(".");
}

/* 
   Keyboard Support
 */
document.addEventListener("keydown", (event) => {

    if (
        (event.key >= "0" && event.key <= "9") ||
        isOperator(event.key) ||
        event.key === "."
    ) {
        addInput(event.key);
    }

    if (event.key === "Enter") {
        event.preventDefault();
        calculateResult();
    }

    if (event.key === "Backspace") {
        removeLast();
    }

    if (event.key === "Escape") {
        resetCalculator();
    }
});
