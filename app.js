class UI {
    constructor() {
        this.date = document.getElementById("date");
        this.operand1 = document.getElementById("operand1");
        this.operand2 = document.getElementById("operand2");
        this.count = document.getElementById("count");
        this.selects = document.querySelectorAll("select");
        this.additionButton = document.getElementById("addition");
        this.questionList = document.getElementById("question-list");
        this.questionsSection = document.getElementById("questions");
        this.checkAnswersButton = document.getElementById("check-answers");
    }

    init() {
        this.date.textContent = new Date().toLocaleString();
        M.FormSelect.init(this.selects);
    }

    getOperand1() {
        return +this.operand1.value;
    }

    getOperand2() {
        return +this.operand2.value;
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
}

const ui = new UI();

function init() {
    initDate();
    initMaterialize();
}

function generateAdditions(e) {
    e.preventDefault();
    const operand1 = ui.getOperand1();
    const operand2 = ui.getOperand2();
    const questionCount = ui.getCount();

    console.log(operand1, operand2, questionCount);
    questions = ["1 + 1 ", "1+1", "1+1", "1+1", "1+1"];
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

    console.log(correctCount, "/", count);
    const score = (correctCount / count) * 100;
    console.log(score);
    if (correctCount == count) {
        alert("You get all answers correct! You Are Awesome!");
        ui.disableCheckAnswersButton();
    } else {
        alert("You get " + score);
    }
}

document.addEventListener("DOMContentLoaded", () => ui.init());
ui.additionButton.addEventListener("click", generateAdditions);
ui.checkAnswersButton.addEventListener("click", checkAnswers);
