let currentQuestionIndex = 0;
const questions = [
    { type: "text", question: "당신의 집을 알려주세요" },
    { type: "radio", question: "성별을 알려주세요:", options: ["남", "여"] },
    { type: "radio", question: "나이를 알려주세요:", options: ["10대 미만", "10대", "20대", "30대", "40대", "50대", "60대", "70대 이상"] },
    {
        type: "radio",
        question: "좋아하는 색을 알려주세요:",
        options: [
            { name: "베이지", color: "#F5F5DC" },  // Beige color
            { name: "네이비", color: "#000080" },  // Navy color
            { name: "블랙", color: "#000000" },   // Black color
            { name: "딥 브라운", color: "#4B2F1A" }, // Deep brown
            { name: "연한 하늘색", color: "#87CEEB" }
        ]
    },
    { type: "radio", question: "예산을 알려주세요:", options: ["5만원", "10만원", "15만원", "20만원", "50만원", "100만원"] }
];

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    } else {
        window.location.href = "complete.html"; // 마지막 질문이 끝나면 complete.html로 이동
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    const questionContainer = document.getElementById("question-container");
    questionContainer.innerHTML = ""; // 기존 내용 삭제

    // 질문 텍스트
    const questionText = document.createElement("p");
    questionText.innerText = currentQuestion.question;
    questionContainer.appendChild(questionText);

    if (currentQuestion.type === "text") {
        const input = document.createElement("input");
        input.type = "text";
        input.id = "answer";
        input.placeholder = "답변을 입력하세요";
        questionContainer.appendChild(input);
    } else if (currentQuestion.type === "radio") {
        currentQuestion.options.forEach(option => {
            const label = document.createElement("label");
            let displayText = option;

            // 색상 질문인 경우
            if (typeof option === 'object') {
                displayText = option.name;  // 색상 이름 표시
                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = currentQuestion.question;
                radio.value = option.name;

                // 색상 박스를 생성하고 클릭 시 배경색을 변경
                radio.onclick = function() {
                    document.body.style.backgroundColor = option.color; // 배경색 변경
                };

                // 색상 박스와 라디오 버튼 및 텍스트를 수평으로 배치
                const colorBox = document.createElement("div");
                colorBox.style.backgroundColor = option.color;
                colorBox.style.width = "30px";
                colorBox.style.height = "30px";
                colorBox.style.display = "inline-block";
                colorBox.style.marginRight = "10px";
                colorBox.style.cursor = "pointer";

                questionContainer.appendChild(radio);
                questionContainer.appendChild(colorBox);
                questionContainer.appendChild(label);
                questionContainer.appendChild(document.createElement("br"));
            } else {
                // 일반적인 보기 질문 처리
                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = currentQuestion.question;
                radio.value = option;

                label.innerText = option; // 텍스트 값
                questionContainer.appendChild(radio);
                questionContainer.appendChild(label);
                questionContainer.appendChild(document.createElement("br"));
            }
        });
    }

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");

    const previousButton = document.createElement("button");
    previousButton.classList.add("previous");
    previousButton.innerText = "이전";
    previousButton.onclick = previousQuestion;
    buttonsContainer.appendChild(previousButton);

    const nextButton = document.createElement("button");
    nextButton.classList.add("next");
    nextButton.innerText = "다음";
    nextButton.onclick = nextQuestion;
    buttonsContainer.appendChild(nextButton);

    questionContainer.appendChild(buttonsContainer);
}

document.addEventListener("DOMContentLoaded", displayQuestion);
