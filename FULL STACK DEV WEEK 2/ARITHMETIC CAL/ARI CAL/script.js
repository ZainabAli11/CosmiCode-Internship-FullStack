function getValues() {
  const a = parseFloat(document.getElementById("a").value);
  const b = parseFloat(document.getElementById("b").value);
  return [a, b];
}

function showResult(text) {
  document.getElementById("output").textContent = text;
}

function add() {
  const [a, b] = getValues();
  showResult(`Result: ${a + b}`);
}

function subtract() {
  const [a, b] = getValues();
  showResult(`Result: ${a - b}`);
}

function multiply() {
  const [a, b] = getValues();
  showResult(`Result: ${a * b}`);
}

function divide() {
  const [a, b] = getValues();
  if (b === 0) {
    showResult("Error: Cannot divide by zero");
  } else {
    showResult(`Result: ${a / b}`);
  }
}
