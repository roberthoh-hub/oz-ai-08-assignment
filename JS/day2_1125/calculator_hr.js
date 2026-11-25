function calculate(expression) {
  const tokens = String(expression ?? '').match(/(\d+(\.\d+)?|[+\-*/])/g);
//   if (!tokens) return NaN;

  // 1차 계산: 곱셈(*), 나눗셈(/) 우선 처리
  const stack = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === '*' || token === '/') {
      const prev = Number(stack.pop());
      const next = Number(tokens[++i]);
      stack.push(token === '*' ? prev * next : prev / next);
    } else {
      stack.push(token);
    }
  }

  // 2차 계산: 덧셈(+), 뺄셈(-) 순서대로 처리
  let result = Number(stack[0]);
  for (let i = 1; i < stack.length; i += 2) {
    const operator = stack[i];
    const next = Number(stack[i + 1]);
    if (operator === '+') result += next;
    else if (operator === '-') result -= next;
  }

  return result;
}

function start() {
  const message = '계산식을 입력하세요.(예: 1 + 1 * 4) ';

  // 브라우저: prompt 사용
  if (typeof prompt === 'function') {
    const input = prompt(message);
    console.log(`${input} = ${calculate(input)}`);
    return;
  }

  // Node.js: prompt가 없으므로 readline 사용
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(message, (input) => {
    console.log(`${input} = ${calculate(input)}`);
    rl.close();
  });
}

start();