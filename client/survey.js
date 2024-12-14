// Supabase 라이브러리 가져오기
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Supabase 클라이언트 초기화
const supabaseUrl = "https://fvoauhyvsyntgjepkqgk.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2b2F1aHl2c3ludGdqZXBrcWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMDE2NzcsImV4cCI6MjA0ODc3NzY3N30.PzyKXN_ni8GTz7hAJsoGfGgCxmShwvQ4VZwdyf5k6Go";

const supabase = createClient(supabaseUrl, supabaseKey);

// 질문 데이터 배열
const questions = [
    "집이 어디신가요?",
    "집안에서 어떤 색상을 주로 사용하고 싶은가요?",
    "나이 테스트를 시작합니다",
    "인테리어에 투자하려고 하는 자금이 어느 정도인가요?",
    "집 안에 예술 작품이나 장식품을 두는 것을 좋아하시나요?",
    "조명 스타일에서 중요하게 생각하는 점은 무엇인가요?",
    "가장 선호하는 집의 분위기는 무엇인가요?"
];

// 응답 저장용 배열
const responses = [];

// 현재 질문 인덱스
let currentQuestionIndex = 0;

// HTML 요소 가져오기
const questionElement = document.getElementById("question");
const answerContainer = document.getElementById("answer-container");


// 질문 업데이트 함수
// 질문 업데이트 함수
function updateQuestion() {
    questionElement.textContent = questions[currentQuestionIndex];
    answerContainer.innerHTML = ""; // 기존 내용 초기화

    if (currentQuestionIndex === 0 || currentQuestionIndex === 5) {
        createTextInput(); // 주관식 입력
    } else if (currentQuestionIndex === 1) {
        createFloatingCircles(); // 색상 원 렌더링
    } else if (currentQuestionIndex === 2) {
        prepareAgeTestFadeOut(); // 나이 테스트 준비 (3번째 페이지)
    } else if (currentQuestionIndex === 3) {
        createBudgetOptions(); // 자금 질문 객관식 렌더링
    } else if (currentQuestionIndex === 4) {
        createArtPreferenceOptions(); // 예술 작품 질문 객관식 렌더링
    } else if (currentQuestionIndex === 6) {
        createHomeMoodOptions(); // 집 분위기 객관식 렌더링
    }

  const prevButton = document.querySelector(".previous");
    const nextButton = document.querySelector(".next");
    if (prevButton) prevButton.textContent = "previous";
    if (nextButton) nextButton.textContent = "next";
}


// 주관식 입력 렌더링 함수
function createTextInput() {
    const input = document.createElement("input");
    input.type = "text";
    input.id = "answer";
    input.placeholder = "답변을 입력하세요";
    input.value = responses[currentQuestionIndex] || ""; // 기존 응답 불러오기
    answerContainer.appendChild(input);
}

// 나이 테스트 준비: 기존 요소 페이드아웃
// 나이 테스트 준비: 기존 요소 페이드아웃
function prepareAgeTestFadeOut() {
    const questionElement = document.getElementById("question"); // 질문 텍스트
    const houseMagicianElement = document.getElementById("house-magician"); // h1

    // 5초 후 "HOUSE MAGICIAN"과 질문 서서히 사라짐
    setTimeout(() => {
        fadeOutElements([houseMagicianElement, questionElement], () => {
            displaySequentialQuestions(); // 질문 순차 표시
        });
    }, 2500);
}

// 특정 요소 서서히 사라지기
function fadeOutElements(elements, callback) {
    let completed = 0; // 완료된 요소 수 추적
    const total = elements.length;

    elements.forEach((element) => {
        if (element) {
            element.style.transition = "opacity 1.5s ease";
            element.style.opacity = "0";
            setTimeout(() => {
                element.style.display = "none"; // DOM에서 숨김
                completed++;
                if (completed === total && callback) callback(); // 모든 요소 처리 후 콜백 실행
            }, 1500);
        }
    });
}

// "오늘 날씨는 어때요?" 질문과 기타 질문 표시 함수
function displaySequentialQuestions() {
    const questionElement = document.getElementById("question");
    const answerContainer = document.getElementById("answer-container");

    const sequentialQuestions = [
        { question: "오늘 날씨는 어때요?", options: ["맑음", "흐림", "비", "눈", "잘 모르겠어요"] },
        { question: "오늘 기분은 어떠신가요?", options: ["좋아요", "그냥 그래요", "나빠요", "매우 나빠요", "잘 모르겠어요"] },
        { question: "좋아하는 계절은 무엇인가요?", options: ["봄", "여름", "가을", "겨울", "잘 모르겠어요"] },
        { question: "주말에는 주로 무엇을 하시나요?", options: ["영화 보기", "운동", "여행", "독서", "잘 모르겠어요"] }
    ];

    let currentQuestionIndex = 0;

    function showQuestion(index) {
        if (index >= sequentialQuestions.length) {
            alert("모든 질문에 답변하셨습니다.");
            nextQuestion(); // 다음 메인 질문으로 이동
            return;
        }

        const { question, options } = sequentialQuestions[index];

        // 질문 텍스트 업데이트
        questionElement.textContent = question;
        questionElement.style.opacity = "1";
        questionElement.style.display = "block";

        // 옵션 렌더링
        answerContainer.innerHTML = "";
        options.forEach((option, optionIndex) => {
            const optionContainer = document.createElement("div");

            const radio = document.createElement("input");
            radio.type = "radio";
            radio.id = `question-${index}-option-${optionIndex}`;
            radio.name = `question-${index}`;
            radio.value = option;

            const label = document.createElement("label");
            label.htmlFor = `question-${index}-option-${optionIndex}`;
            label.textContent = option;

            optionContainer.appendChild(radio);
            optionContainer.appendChild(label);
            answerContainer.appendChild(optionContainer);
        });

        // Next 버튼
        const nextButton = document.createElement("button");
        nextButton.textContent = "다음 질문으로";
        nextButton.onclick = () => {
            const selectedOption = document.querySelector(
                `input[name='question-${index}']:checked`
            );
            if (!selectedOption) {
                alert("답변을 선택해주세요.");
                return;
            }

            // 응답 저장 및 다음 질문으로 이동
            responses.push(selectedOption.value);
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        };

        answerContainer.appendChild(nextButton);
    }

    // 첫 번째 질문 표시
    showQuestion(currentQuestionIndex);
}


// 색상 원 렌더링 함수
// 색상 원 렌더링 함수
function createFloatingCircles() {
    const colors = [
        { className: "white", label: "화이트", colorCode: "#ffffff" },
        { className: "beige", label: "베이지", colorCode: "#f5f5dc" },
        { className: "deep-brown", label: "딥 브라운", colorCode: "#4b2f1a" },
        { className: "light-blue", label: "연한 하늘색", colorCode: "#add8e6" },
        { className: "light-orange", label: "연한 주황색", colorCode: "#f9d5a7" },
        { className: "light-gray", label: "연한 그레이색", colorCode: "#d3d3d3" },
        { className: "light-brown", label: "연한 브라운", colorCode: "#a67d5a" }
    ];

    colors.forEach((color) => {
        const circle = document.createElement("div");
        circle.className = `circle ${color.className}`;
        circle.style.top = `${Math.random() * 80}vh`;
        circle.style.left = `${Math.random() * 80}vw`;

        // 클릭 이벤트로 배경색 변경 및 버튼 색상 변경
        circle.addEventListener("click", () => {
            document.body.style.backgroundColor = color.colorCode; // 배경색 변경
            responses[currentQuestionIndex] = color.label; // 선택한 색상 저장

            // 버튼 배경색 업데이트
            const buttons = document.querySelectorAll("button");
            buttons.forEach((button) => {
                button.style.backgroundColor = color.colorCode; // 버튼 배경색 변경
                button.style.color = getContrastingColor(color.colorCode); // 버튼 텍스트 색상 변경
            });
        });

        answerContainer.appendChild(circle);
    });
}

// 색상 대비 텍스트 색상을 자동으로 설정
function getContrastingColor(hexColor) {
    // HEX -> RGB 변환
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);

    // 밝기 계산
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#ffffff"; // 밝기에 따라 검정 또는 흰색 반환
}


// 자금 질문 객관식 렌더링 함수
function createBudgetOptions() {
    const budgets = [
        "1~5만원",
        "5~10만원",
        "10~20만원",
        "20~30만원",
        "30~50만원",
        "50만원 이상"
    ];

    budgets.forEach((budget, index) => {
        const radioContainer = document.createElement("div");

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.id = `budget-${index}`;
        radio.name = "budget";
        radio.value = budget;

        const label = document.createElement("label");
        label.htmlFor = `budget-${index}`;
        label.textContent = budget;

        radioContainer.appendChild(radio);
        radioContainer.appendChild(label);
        answerContainer.appendChild(radioContainer);
    });
}


// 다음 질문으로 이동
// 다음 질문으로 이동
window.nextQuestion = async function () {
    let answer;

    if (currentQuestionIndex === 0 || currentQuestionIndex === 5) {
        // 주관식 입력 검증
        const input = document.getElementById("answer");
        answer = input?.value.trim();
        if (!answer) {
            alert("답변을 입력해주세요.");
            return;
        }
        responses[currentQuestionIndex] = answer;
    } else if (currentQuestionIndex === 1) {
        // 색상 선택 검증
        answer = responses[currentQuestionIndex]; // 색상 선택 시 responses 배열에 저장된 값
        if (!answer) {
            alert("답변을 선택해주세요."); // 값이 없으면 경고
            return;
        }
    } else {
        // 객관식 선택 검증
        const selectedOption = document.querySelector("input[name]:checked");
        if (!selectedOption) {
            alert("답변을 선택해주세요.");
            return;
        }
        responses[currentQuestionIndex] = selectedOption.value;
    }

    // 다음 질문으로 이동
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        updateQuestion();
    } else {
        // 설문 완료 시 Supabase로 데이터 전송
        const payload = {
            house: responses[0],
            favorite_color: responses[1],
            age: responses[2],
            budget: responses[3],
            art_preference: responses[4],
            lighting_preference: responses[5],
            home_mood: responses[6]
        };

        const { data, error } = await supabase.from("survey_responses").insert([payload]);

        if (error) {
            console.error("데이터 저장 실패:", error);
            alert("설문 저장 중 문제가 발생했습니다.");
        } else {
            console.log("데이터 저장 성공:", data);
            window.location.href = "complete.html";
        }
    }
};



// 이전 질문으로 이동
window.previousQuestion = function () {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        updateQuestion();
    }
};

// 초기 질문 표시
document.addEventListener("DOMContentLoaded", function () {
    updateQuestion();
});