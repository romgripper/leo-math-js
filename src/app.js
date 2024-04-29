import { ui } from "./ui";
import { question } from "./question";

function generateAndShowQuestions(e, operator) {
    e.preventDefault();

    const maxOperand1 = ui.getMaxOperand1();
    const maxOperand2 = ui.getMaxOperand2();
    const questionCount = ui.getCount();

    const questions = question.generate(operator, maxOperand1, maxOperand2, questionCount);

    ui.setDate();
    ui.showQuestions(questions);
    ui.hideGeneratorSection();
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
        result += question.replaceAll(" ", "") + "=" + answer;

        const correct = eval(question) == answer;
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
    localStorage.setItem(ui.getDate(), result);
}

document.addEventListener("DOMContentLoaded", () => ui.init());

ui.additionButton.addEventListener("click", (e) => generateAndShowQuestions(e, "+"));
ui.subtractionButton.addEventListener("click", (e) => generateAndShowQuestions(e, "-"));
ui.multiplicationButton.addEventListener("click", (e) => generateAndShowQuestions(e, "*"));
ui.divisionButton.addEventListener("click", (e) => generateAndShowQuestions(e, "/"));
ui.checkAnswersButton.addEventListener("click", checkAnswers);
