function getRandomInt(max) {
    return max * 0.1 + Math.ceil(Math.random() * max * 0.9);
}

class Question {
    generate(operator, maxOperand1, maxOperand2, count) {
        const questions = [];
        for (let i = 0; i < count; i++) {
            let operand1 = getRandomInt(maxOperand1);
            let operand2 = getRandomInt(maxOperand2);

            if ((operator === MINUS || operator === DIVIDE) && operand1 < operand2) {
                const temp = operand1;
                operand1 = operand2;
                operand2 = temp;
            }
            if (operator === DIVIDE) {
                operand1 = Math.floor(operand1 / operand2) * operand2;
            }
            questions.push(`${operand1} ${operator} ${operand2}`);
        }
        return questions;
    }
}

export const question = new Question();

export const PLUS = "+";
export const MINUS = "-";
export const MULTIPLY = "×";
export const DIVIDE = "÷";
