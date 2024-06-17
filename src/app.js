import { ui } from "./ui";
import { question, PLUS, MINUS, MULTIPLY, DIVIDE } from "./question";

const DATE_PREFIX = "date:";

function generateAndShowQuestions(e, operator) {
    e.preventDefault();

    const maxOperand1 = ui.getMaxOperand1();
    const maxOperand2 = ui.getMaxOperand2();
    const questionCount = ui.getCount();

    const questions = question.generate(operator, maxOperand1, maxOperand2, questionCount);

    ui.showQuestions(questions, []);
}

function checkAnswers() {
    const questionElements = ui.getQuestionElements();
    const count = questionElements.length;

    let result = "";

    let correctCount = 0;
    let firstWrongAnswer = true;
    questionElements.forEach((questionElement) => {
        const id = questionElement.id;
        const index = id.substring("question".length);
        const answerElement = ui.getAnswerElement(index);

        const question = questionElement.textContent;
        const answer = answerElement.value;
        const isDivision = question.includes(DIVIDE);
        const remainderElement = ui.getRemainderElement(index);
        let remainder;

        result += question + " = " + answer;

        if (isDivision) {
            remainder = remainderElement.value || 0;
            result += " ... " + remainderElement.value;
        }

        let correct;
        if (isDivision) {
            correct = eval( "(" + question.replaceAll(DIVIDE, "-" + remainder + ")/")) === Number(answer);
            correct = correct && Number(remainder) < Number(question.substring(question.indexOf(DIVIDE) + 1).trim());
        } else {
            correct = eval(question.replaceAll(MULTIPLY, "*")) == answer;
        }
        result += ";" + correct + ",";

        if (correct) {
            answerElement.setAttribute("disabled", "");
            if (isDivision) {
                remainderElement.setAttribute("disabled", "");
            }
            correctCount++;
        } else if (firstWrongAnswer) {
            answerElement.focus();
            firstWrongAnswer = false;
        }
    });

    if (correctCount == count) {
        ui.showAlert("You get all answers correct! You Are Awesome!", true);
        ui.disableCheckAnswersButton();
    } else {
        ui.showAlert(
            "You get " + correctCount + " of " + count + " answers correct. Please correct the wrong ones.",
            false
        );
    }
    result = result.substring(0, result.length - 1); // remove trailing ,
    localStorage.setItem(DATE_PREFIX + ui.getDate(), result);
}

function showHistory() {
    const keys = Object.keys(localStorage);
    const history = keys
        .filter(key => key.startsWith(DATE_PREFIX))
        .map(key => ({date: key.substring(DATE_PREFIX.length), results: localStorage.getItem(key)}))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    ui.showHistory(history);
}

document.addEventListener("DOMContentLoaded", () => ui.init());

ui.additionButton.addEventListener("click", (e) => generateAndShowQuestions(e, PLUS));
ui.subtractionButton.addEventListener("click", (e) => generateAndShowQuestions(e, MINUS));
ui.multiplicationButton.addEventListener("click", (e) => generateAndShowQuestions(e, MULTIPLY));
ui.divisionButton.addEventListener("click", (e) => generateAndShowQuestions(e, DIVIDE));
ui.checkAnswersButton.addEventListener("click", checkAnswers);
ui.historyButton.addEventListener("click", showHistory);
ui.historySection.addEventListener("click", e => {
    ui.showQuestionsWithAnswers(e);
    checkAnswers();
});