class UI {
    constructor() {
        this.date = document.getElementById("date");
        this.maxOperand1 = document.getElementById("max-operand1");
        this.generatorSection = document.getElementById("generator");
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
        if (!success) {
            setTimeout(() => {
                this.clearAlert();
            }, 3000);
        }
    }

    clearAlert() {
        const currentAlert = document.querySelector(".alert");
        if (currentAlert) {
            currentAlert.remove();
        }
    }

    hideGeneratorSection() {
        this.generatorSection.style.display = "none";
    }
}

export const ui = new UI();
