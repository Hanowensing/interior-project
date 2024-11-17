let currentQuestionIndex = 0;  // 현재 질문 인덱스
const answers = {};  // 사용자가 입력한 답을 저장할 객체

// 설문 문항
const questions = [
    { type: "text", question: "당신의 집을 알려주세요" },
    { type: "radio", question: "성별을 알려주세요:", options: ["남", "여"] },
    { type: "radio", question: "나이를 알려주세요:", options: ["10대 미만", "10대", "20대", "30대", "40대", "50대", "60대", "70대 이상"] },
    { 
        type: "radio", 
        question: "좋아하는 색을 알려주세요:", 
        options: [
            { name: "베이지", color: "#F5F5DC" },
            { name: "네이비", color: "#000080" },
            { name: "블랙", color: "#000000" },
            { name: "딥 브라운", color: "#4B2F1A" },
            { name: "연한 하늘색", color: "#87CEEB" }
        ] 
    },
    { type: "radio", question: "예산을 알려주세요:", options: ["5만원", "10만원", "15만원", "20만원", "50만원", "100만원"] },
    { type: "text", question: "제출하시겠습니까?" } // 마지막 질문
];

// 질문 표시 함수
function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    const questionContainer = document.getElementById("question-container");
    questionContainer.innerHTML = ""; // 기존 내용 삭제

    // 질문 텍스트
    const questionText = document.createElement("p");
    questionText.innerText = currentQuestion.question;
    questionContainer.appendChild(questionText);

    // 텍스트 입력 필드
    if (currentQuestion.type === "text" && currentQuestionIndex !== questions.length - 1) {
        const input = document.createElement("input");
        input.type = "text";
        input.id = "answer";
        input.placeholder = "답변을 입력하세요";
        input.addEventListener('input', (event) => {
            answers[currentQuestion.question] = event.target.value;
        });
        questionContainer.appendChild(input);
    } else if (currentQuestion.type === "radio") {
        currentQuestion.options.forEach(option => {
            const label = document.createElement("label");
            let displayText = option;

            // 색상 질문인 경우
            if (typeof option === 'object') {
                displayText = option.name;
                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = currentQuestion.question;
                radio.value = option.name;

                radio.onclick = function() {
                    answers[currentQuestion.question] = option.name;
                    document.body.style.backgroundColor = option.color; // 배경색 변경
                };

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
                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = currentQuestion.question;
                radio.value = option;

                label.innerText = option;
                radio.onclick = function() {
                    answers[currentQuestion.question] = option;
                };
                questionContainer.appendChild(radio);
                questionContainer.appendChild(label);
                questionContainer.appendChild(document.createElement("br"));
            }
        });
    }

    // 마지막 질문일 경우 제출 버튼만 표시
    if (currentQuestionIndex === questions.length - 1) {
       const submitButton = document.createElement("button");
submitButton.classList.add("submit");
submitButton.innerText = "제출하기";

// '제출하기' 버튼 클릭 시 호출되는 함수
submitButton.onclick = function() {
    // saveAnswers() 호출해서 로컬스토리지에 응답을 저장
    saveAnswers();
    
    // 페이지를 Complete.html로 이동
    window.location.href = "Complete.html"; // 설문 완료 후 페이지 이동
};
questionContainer.appendChild(submitButton);
    } else {
        // 이전/다음 버튼 표시
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
}

// '다음' 버튼 클릭 시 호출
function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
    }
}

// '이전' 버튼 클릭 시 호출
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
    }
}

// 제출된 답변을 로컬스토리지에 누적하여 저장하는 함수
function saveAnswers() {
    // 로컬스토리지에서 기존 응답 불러오기, 없으면 빈 배열로 초기화
    let savedResponses = JSON.parse(localStorage.getItem('surveyAnswers'));

    // 만약 savedResponses가 배열이 아니면 빈 배열로 초기화
    if (!Array.isArray(savedResponses)) {
        savedResponses = [];
    }

    // 새로운 응답을 배열에 추가
    savedResponses.push(answers);
    
    // 배열을 로컬스토리지에 저장
    localStorage.setItem('surveyAnswers', JSON.stringify(savedResponses));

    // 데이터가 저장된 후 페이지 이동
    window.location.href = "Complete.html";
}

// 페이지 로드 시 첫 번째 질문 표시
document.addEventListener("DOMContentLoaded", displayQuestion);