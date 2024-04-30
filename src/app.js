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

function checkAllAnswersFilled() {
    const answerElements = ui.getAnswerElements();
    for (const input of answerElements) {
        if (!input.value) {
            ui.showAlert("Please answer all the questions before checking answers.", false);
            input.focus();
            return false;
        }
    }
    return true;
}

function checkAnswers() {
    if (!checkAllAnswersFilled()) {
        return;
    }
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
        result += question + " = " + answer;

        const correct = eval(question.replaceAll(DIVIDE, "/").replaceAll(MULTIPLY, "*")) == answer;
        result += ";" + correct + ",";

        if (correct) {
            answerElement.setAttribute("disabled", "");
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

function showLogs() {
    const keys = Object.keys(localStorage);
    const logs = keys
        .filter(key => key.startsWith(DATE_PREFIX))
        .map(key => ({date: key.substring(DATE_PREFIX.length), results: localStorage.getItem(key)}))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    ui.showLogs(logs);
}

document.addEventListener("DOMContentLoaded", () => ui.init());

ui.additionButton.addEventListener("click", (e) => generateAndShowQuestions(e, PLUS));
ui.subtractionButton.addEventListener("click", (e) => generateAndShowQuestions(e, MINUS));
ui.multiplicationButton.addEventListener("click", (e) => generateAndShowQuestions(e, MULTIPLY));
ui.divisionButton.addEventListener("click", (e) => generateAndShowQuestions(e, DIVIDE));
ui.checkAnswersButton.addEventListener("click", checkAnswers);
ui.logsButton.addEventListener("click", showLogs);
ui.logsSection.addEventListener("click", e => ui.showQuestionsWithAnswers(e));