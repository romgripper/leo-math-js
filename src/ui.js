import { DIVIDE } from "./question";

class UI {
    constructor() {
        this.dateElement = document.getElementById("date");
        this.localDateElement = document.getElementById("local-date");

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

        this.historyButton = document.getElementById("show-history");
        this.historySection = document.getElementById("history");
        this.historyList = document.getElementById("history-list");
    }

    init() {
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

    showQuestions(questions, answers, remainders, date) {
        if (!date) date = new Date();
        this.setDate(date);

        if (!remainders) remainders = [];

        const isDivision = questions[0].includes(DIVIDE);
        let html = '<div class="row">';
        for (let i = 0; i < questions.length; i++) {
            html += isDivision ?
                `<div class="input-field col s3 m2">
                    <input type="number" class="answer" id="answer${i}" value="${answers[i] || ''}">
                    <label class="question ${answers[i] && 'active'}" id="question${i}" for="answer${i}">${questions[i]}</label>
                </div>
                <div class="input-field col s3 m2" style="padding-right: 40px">
                    <input type="number" class="answer" id="remainder${i}" value="${remainders[i] || ''}">
                    <label class="${remainders[i] && 'active'}" for="remainder${i}">Remainder</label>
                </div>`
                :
                `<div class="input-field col s4 m3">
                    <input type="number" class="answer" id="answer${i}" value="${answers[i] || ''}">
                    <label class="question ${answers[i] && 'active'}" id="question${i}" for="answer${i}">${questions[i]}</label>
                </div>`;
        }
        html += "</div>";

        this.questionList.innerHTML = html;
        this.questionsSection.style.display = "block";
        this.hideGeneratorSection();
        this.hideHistorySection();
    }

    showQuestionsWithAnswers(e) {
        let row = e.target.parentElement;
        while (row.nodeName !== "TR") {
            row = row.parentElement;
        }

        const questions = [];
        const answers = [];
        const remainders = [];
        const date = new Date(row.querySelector(".date").textContent);
        const self = this;
        row.querySelectorAll("span").forEach(span => self.parseResult(span.textContent, questions, answers, remainders));
        this.showQuestions(questions, answers, remainders, date);
    }

    parseResult(result, questions, answers, remainders) {
        const tokens = result.split("=");
        questions.push(tokens[0].trim());
        if (tokens[1].includes("...")) {
            const answerTokens = tokens[1].split("...");
            answers.push(answerTokens[0].trim());
            remainders.push(answerTokens[1].trim());
        } else {
            answers.push(tokens[1].trim());
        }
    }

    showHistory(history) {
        this.historyList.innerHTML = history.map(history =>
                `<tr>
                    <td>${new Date(history.date).toLocaleString()}</td>
                    <td class="date" style="display: none;">${history.date}</td>
                    <td class="results">${this.mapResults(history.results)}</td>
                </tr>`)
            .join("\n");
        this.historySection.style.display = "block";
        this.hideGeneratorSection();
    }

    mapResults(results) {
        return results.split(",")
            .map(this.mapResult)
            .join("&nbsp;&nbsp;&nbsp;&nbsp;");
    }

    /**
     * 63/21=1;false or 70/35=2;true
     */
    mapResult(result) {
        const color = result.substring(result.indexOf(";") + 1) === "true"? "green" : "red";
        return `<span style="color: ${color}">${result.substring(0, result.indexOf(";"))}</span>`;
    }

    getQuestionElements() {
        return document.querySelectorAll(".question");
    }

    getAnswerElements() {
        return document.querySelectorAll(".answer");
    }

    getAnswerElement(index) {
        return document.querySelector("#answer" + index);
    }

    getRemainderElement(index) {
        return document.querySelector("#remainder" + index);
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

    hideHistorySection() {
        this.historySection.style.display = "none";
    }

    setDate(date) {
        this.dateElement.textContent = date;
        this.localDateElement.textContent = date.toLocaleString();
    }

    getDate() {
        return new Date(this.dateElement.textContent);
    }
}

export const ui = new UI();
