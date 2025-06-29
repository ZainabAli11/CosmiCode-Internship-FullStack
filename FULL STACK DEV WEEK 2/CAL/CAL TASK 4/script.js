// === Calculator Logic (time-safe CSV) ===
let expression = '';
let history = [];

const display = document.getElementById('display');
const historySection = document.getElementById('historySection');
const historyDiv = document.getElementById('history');
const clearBtn = document.getElementById('clearHistory');
const exportBtn = document.getElementById('exportHistory');
const themeBtn = document.getElementById('toggleTheme');
const toggleHistoryBtn = document.getElementById('toggleHistory');

// Theme toggle
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// Show/Hide History toggle
toggleHistoryBtn.addEventListener('click', () => {
  historySection.classList.toggle('hidden');
  toggleHistoryBtn.textContent = historySection.classList.contains('hidden')
    ? 'Show History'
    : 'Hide History';
});

// Clear history
clearBtn.addEventListener('click', () => {
  history = [];
  updateHistory();
  clearDisplay();
});

// Export history to CSV (safe, comma‑free time)
exportBtn.addEventListener('click', () => {
  if (!history.length) return alert('History is empty!');
  const csvHeader = 'Expression,Result,Time\n';
  const csvRows = history
    .map(h => h.split('||').map(x => `"${x}"`).join(','))
    .join('\n');
  const csvData = 'data:text/csv;charset=utf-8,' + csvHeader + csvRows;

  const link = document.createElement('a');
  link.href = encodeURI(csvData);
  link.download = `calculator-history-${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

// Keyboard input support
document.addEventListener('keydown', e => {
  const key = e.key;
  if (/^[0-9]$/.test(key) || '+-*/().'.includes(key)) {
    if (key === '.' && !canAddDot(expression)) return;
    press(key);
  } else if (key === 'Enter') {
    calculate();
  } else if (key === 'Backspace') {
    backspace();
  } else if (['Escape', 'Delete'].includes(key)) {
    clearDisplay();
  }
});

// Append character to expression
function press(val) {
  if (isOperator(val)) {
    if (!expression && val !== '-') return;
    const last = expression.slice(-1);
    if (isOperator(last) && !(val === '-' && last !== '-')) {
      expression = expression.slice(0, -1);
    }
  }
  expression += val;
  updateDisplay();
}

function updateDisplay() {
  display.value = expression;
}

function clearDisplay() {
  expression = '';
  updateDisplay();
}

function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function updateHistory() {
  historySection.innerHTML = history.slice(-100).map(h => {
    const [expr, res, time] = h.split('||');
    return `<div><strong>${expr}</strong> = ${res} <span style="float:right;font-size:0.8em;color:#888">${time}</span></div>`;
  }).join('');
  historySection.scrollTop = historySection.scrollHeight;
}

function calculate() {
  if (!expression || isOperator(expression.slice(-1))) return;
  try {
    const result = evaluate(expression);
    const time = new Date().toLocaleTimeString('en-US', { hour12: false }); // HH:MM:SS (no commas)
    history.push(`${expression}||${result}||${time}`);
    expression = result.toString();
    updateDisplay();
    updateHistory();
  } catch {
    expression = 'Error';
    updateDisplay();
  }
}

function isOperator(c) { return ['+', '-', '*', '/'].includes(c); }

function canAddDot(expr) {
  const tokens = tokenize(expr);
  const last = tokens[tokens.length - 1];
  return !last || !last.includes('.');
}

function tokenize(expr) {
  const tokens = [];
  let num = '', last = '';
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (/\d|\./.test(ch)) {
      num += ch;
    } else {
      if (num) tokens.push(num), num = '';
      if (ch === '-' && (i === 0 || '*/+-(,'.includes(last))) num = '-';
      else if ('+-*/()'.includes(ch)) tokens.push(ch);
      last = ch;
    }
  }
  if (num) tokens.push(num);
  return tokens;
}

function evaluate(expr) {
  const output = [], ops = [];
  const prec = { '+': 1, '-': 1, '*': 2, '/': 2 };
  const assoc = { '+': 'L', '-': 'L', '*': 'L', '/': 'L' };
  const tokens = tokenize(expr);

  for (const tok of tokens) {
    if (!isNaN(tok)) output.push(parseFloat(tok));
    else if (tok === '(') ops.push(tok);
    else if (tok === ')') {
      while (ops.length && ops[ops.length - 1] !== '(') output.push(ops.pop());
      ops.pop();
    } else {
      while (ops.length && prec[ops[ops.length - 1]] >= prec[tok] && assoc[tok] === 'L') {
        output.push(ops.pop());
      }
      ops.push(tok);
    }
  }
  while (ops.length) output.push(ops.pop());

  const stack = [];
  for (const tok of output) {
    if (typeof tok === 'number') stack.push(tok);
    else {
      const b = stack.pop();
      const a = stack.pop();
      stack.push(tok === '+' ? a + b : tok === '-' ? a - b : tok === '*' ? a * b : a / b);
    }
  }
  return stack[0];
}
