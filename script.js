let currentInput = '';

function appendToDisplay(value) {
  currentInput += value;
  document.getElementById('display').value = currentInput;
}

function clearDisplay() {
  currentInput = '';
  document.getElementById('display').value = '';
}

function calculate() {
  let result = 'Error';
  try {
    result = evaluateExpression(currentInput);
  } catch (error) {
    console.error('Error evaluating expression:', error);
  }
  document.getElementById('display').value = result;
  currentInput = result.toString(); // Store result for further calculations
}

function evaluateExpression(expression) {
  const tokens = tokenize(expression);
  const parsedExpression = parse(tokens);
  return evaluate(parsedExpression);
}

function tokenize(expression) {
  const pattern = /\d+\.?\d*|[+\-*/()]/g;
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
    } else if (!isNaN(parseFloat(token))) {
      return parseFloat(token);
    } else {
      throw new Error('Unexpected token: ' + token);
    }
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


