class UI {
    constructor() {
        this.date = document.getElementById("date");
        this.maxOperand1 = document.getElementById("max-operand1");
        this.maxOperand2 = document.getElementById("max-operand2");
        this.count = document.getElementById("count");
        this.selects = document.querySelectorAll("select");
        this.additionButton = document.getElementById("addition");
        this.subtractionButton = document.getElementById("subtraction");
        this.multiplicationButton = document.getElementById("multiplication");
        this.divisionButton = document.getElementById("division");
        this.questionList = document.getElementById("question-list");
        this.questionsSection = document.getElementById("questions");
        this.checkAnswersButton = document.getElementById("check-answers");
    }

    init() {
        this.date.textContent = new Date().toLocaleString();
        M.FormSelect.init(this.selects);
    }

    getMaxOperand1() {
        return +this.maxOperand1.value;
    }

    getMaxOperand2() {
        return +this.maxOperand2.value;
    }

    getCount() {
        return +this.count.value;
    }

    showQuestions(questions) {
        let html = "";
        for (let i = 0; i < questions.length; i++) {
            if (i % 4 === 0) {
                html += '</div><div class="row">';
            }
            html += `                        
                <div class="input-field col s3">
                    <input type="number" class="answer" id="answer${i}">
                    <label class="question" id="question${i}" for="answer${i}">${questions[i]}</label>
                </div>`;
        }
        if (html.startsWith("</div>")) {
            html = html.substring("</div>".length);
            html += "</div>";
        }
        this.questionList.innerHTML = html;
        this.questionsSection.style.display = "block";
    }

    getQuestionElements() {
        return document.querySelectorAll(".question");
    }

    getAnswerElement(index) {
        return document.querySelector("#answer" + index);
    }

    disableCheckAnswersButton() {
        this.checkAnswersButton.setAttribute("disabled", "");
    }

    showAlert(message, success) {
        this.clearAlert();
        const div = document.createElement("div");
        div.className = "alert " + (success ? "alert-success" : "alert-danger");
        div.textContent = message;
        this.questionsSection.insertBefore(div, this.checkAnswersButton.parentElement);
        setTimeout(() => {
            this.clearAlert();
        }, 3000);
    }

    clearAlert() {
        const currentAlert = document.querySelector(".alert");
        if (currentAlert) {
            currentAlert.remove();
        }
    }
}

const ui = new UI();

function init() {
    initDate();
    initMaterialize();
}

function getRandomInt(max) {
    return Math.ceil(Math.random() * max);
}

function generateQuestions(operator, maxOperand1, maxOperand2, count) {
    const questions = [];
    for (let i = 0; i < count; i++) {
        let operand1 = getRandomInt(maxOperand1);
        let operand2 = getRandomInt(maxOperand2);

        if (operator == "/") {
            operand1 = operand1 * operand2;
        } else if (operator == "-" && operand1 < operand2) {
            const temp = operand1;
            operand1 = operand2;
            operand2 = temp;
        }
        questions.push(`${operand1} ${operator} ${operand2}`);
    }
    return questions;
}

function generateAndShowQuestions(e, operator) {
    e.preventDefault();

    const maxOperand1 = ui.getMaxOperand1();
    const maxOperand2 = ui.getMaxOperand2();
    const questionCount = ui.getCount();

    questions = generateQuestions(operator, maxOperand1, maxOperand2, questionCount);
    ui.showQuestions(questions);
}

function checkAnswers() {
    const questionElements = ui.getQuestionElements();
    const count = questionElements.length;

    let correctCount = 0;
    questionElements.forEach((questionElement) => {
        const id = questionElement.id;
        const index = id.substring("question".length);
        const answerElement = ui.getAnswerElement(index);

        const question = questionElement.textContent;
        const expectedAnswer = eval(question);

        if (expectedAnswer != answerElement.value) {
            answerElement.style.color = "red";
        } else {
            answerElement.style.color = "lightseagreen";
            correctCount++;
        }
    });

    const score = (correctCount / count) * 100;
    if (correctCount == count) {
        ui.showAlert("You get all answers correct! You Are Awesome!", true);
        ui.disableCheckAnswersButton();
    } else {
        ui.showAlert("You get score: " + score + ", please check your answers", false);
    }
}

document.addEventListener("DOMContentLoaded", () => ui.init());
ui.additionButton.addEventListener("click", (e) => generateAndShowQuestions(e, "+"));
ui.subtractionButton.addEventListener("click", (e) => generateAndShowQuestions(e, "-"));
ui.multiplicationButton.addEventListener("click", (e) => generateAndShowQuestions(e, "*"));
ui.divisionButton.addEventListener("click", (e) => generateAndShowQuestions(e, "/"));
ui.checkAnswersButton.addEventListener("click", checkAnswers);
