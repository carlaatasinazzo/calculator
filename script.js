let currentInput = '';

function appendToDisplay(value) {
  // Check if appending a decimal point is valid
  if (value === '.') {
    // Ensure only one decimal point is added
    if (currentInput.includes('.')) {
      return;
    }
    // If currentInput is empty, append '0.' to start with a decimal number
    if (currentInput === '') {
      currentInput = '0.';
    } else {
      currentInput += '.';
    }
  } else {
    currentInput += value;
  }
  
  updateDisplay();
}

function backspace() {
  currentInput = currentInput.slice(0, -1); // Remove the last character
  updateDisplay();
}

function clearDisplay() {
  currentInput = '';
  updateDisplay();
}

function calculate() {
  let result = 'Error';
  try {
    result = evaluateExpression(currentInput);
    result = roundResult(result, 2); // Round result to 2 decimal places
  } catch (error) {
    console.error('Error evaluating expression:', error);
  }
  document.getElementById('display').value = result;
  currentInput = result.toString(); // Store rounded result for further calculations
}

function evaluateExpression(expression) {
  const tokens = tokenize(expression);
  const parsedExpression = parse(tokens);
  return evaluate(parsedExpression);
}

function tokenize(expression) {
  // Tokenize expression considering numbers with decimals
  const pattern = /\d+(\.\d+)?|[+\-*/()]/g;
  return expression.match(pattern) || [];
}

function parse(tokens) {
  let index = 0;

  function parseExpression() {
    let left = parseTerm();

    while (index < tokens.length) {
      const operator = tokens[index];
      if (operator !== '+' && operator !== '-') {
        break;
      }
      index++;
      const right = parseTerm();
      left = { type: operator, left, right };
    }

    return left;
  }

  function parseTerm() {
    let left = parseFactor();

    while (index < tokens.length) {
      const operator = tokens[index];
      if (operator !== '*' && operator !== '/') {
        break;
      }
      index++;
      const right = parseFactor();
      left = { type: operator, left, right };
    }

    return left;
  }

  function parseFactor() {
    const token = tokens[index++];
    if (token === '(') {
      const expression = parseExpression();
      if (tokens[index] !== ')') {
        throw new Error('Expected closing parenthesis )');
      }
      index++;
      return expression;
    } else if (!isNaN(parseNumber(token))) {
      return parseNumber(token);
    } else {
      throw new Error('Unexpected token: ' + token);
    }
  }

  function parseNumber(token) {
    // Parse number and handle decimals
    return parseFloat(token);
  }

  return parseExpression();
}

function evaluate(expression) {
  if (typeof expression === 'number') {
    return expression;
  }

  const { type, left, right } = expression;

  switch (type) {
    case '+':
      return evaluate(left) + evaluate(right);
    case '-':
      return evaluate(left) - evaluate(right);
    case '*':
      return evaluate(left) * evaluate(right);
    case '/':
      const denominator = evaluate(right);
      if (denominator === 0) {
        throw new Error('Division by zero');
      }
      return evaluate(left) / denominator;
    default:
      throw new Error('Unknown operator: ' + type);
  }
}

function roundResult(value, decimals) {
  return parseFloat(value.toFixed(decimals));
}

function updateDisplay() {
  document.getElementById('display').value = currentInput;
}




