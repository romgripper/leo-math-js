function getRandomInt(max) {
    return Math.ceil(Math.random() * max);
}

class Question {
    generate(operator, maxOperand1, maxOperand2, count) {
        const questions = [];
        for (let i = 0; i < count; i++) {
            let operand1 = getRandomInt(maxOperand1);
            let operand2 = getRandomInt(maxOperand2);

            if ((operator === "-" || operator === "/") && operand1 < operand2) {
                const temp = operand1;
                operand1 = operand2;
                operand2 = temp;
            }
            if (operator === "÷") {
                operand1 = Math.floor(operand1 / operand2) * operand2;
            }
            questions.push(`${operand1} ${operator} ${operand2}`);
        }
        return questions;
    }
}

export const question = new Question();
