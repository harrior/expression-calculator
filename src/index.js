function eval() {
    // Do not use eval!!!
    return;
}

const OPERATIONS = {'+': 1, '-': 1, '*': 2, '/': 2, '(': 0, ')': 0, '^':3}
const NUMBERS = '1234567890.'

function parseString(str){
    let operands = []
    let s = []
    for (let i of str+' '){
        if (NUMBERS.indexOf(i)>=0){
            s.push(i)
        }
        else {
            if (s.length > 0){
                operands.push(Number(s.join('')))
                s = []
            }
            if (OPERATIONS[i] !== undefined){
                operands.push(i)
            }
        }
    }
    return operands
}

function makeRPN(operands){
    let rpnList = []
    let stack = []
    for (let token of operands){
        if (typeof token === 'number'){
            rpnList.push(token)
        }
        else if (token === '('){
            stack.push(token)
        }
        else if (token === ')'){
            let parsedToken = stack.pop()
            while (parsedToken !== '('){
                rpnList.push(parsedToken);
                parsedToken = stack.pop();
            }
        }
        else if (OPERATIONS[token] !== 'undefined'){
            while ( (stack.length > 0) &&
                    (OPERATIONS[stack[stack.length-1]] >= OPERATIONS[token])){
                rpnList.push(stack.pop())
            }
            stack.push(token)
        }
    }
    while (stack.length > 0)
            rpnList.push(stack.pop())
    return rpnList
}

function evaluateExpression(operator, param1, param2){
    if (operator === '+')
        return param1 + param2
    else if (operator === '-')
        return param1 - param2
    else if (operator === '*')
        return param1 * param2
    else if (operator === '/'){
        if (param2 === 0)
            throw 'TypeError: Division by zero.';
        return param1 / param2
    }
    else if (operator === '^')
        return param1 ** param2
}

function evaluateRpn(rpn){
    while (rpn.length > 1){
        for (let i=0; i< rpn.length; i++) {
            if (typeof rpn[i] !== 'number') {
                let param1 = rpn[i - 2]
                let param2 = rpn[i - 1]
                let operator = rpn[i]
                rpn[i] = evaluateExpression(operator, param1, param2);
                rpn.splice(i-2, 2);
                break
            }
        }
    }
    return rpn[rpn.length-1]
}

function checkBrackets(operands){
    let onlyBrackets = operands.filter(char => char === '(' || char===')');
    let count = 0;
    for (let i of onlyBrackets){
        if (i === '(')
            count += 1;
        else
            count -= 1;
    }
    if (count !== 0)
        throw "ExpressionError: Brackets must be paired"
}

function expressionCalculator(expr) {
    let operands = parseString(expr);
    checkBrackets(operands);
    let rpn = makeRPN(operands);
    return evaluateRpn(rpn)
}

module.exports = {
    expressionCalculator
}