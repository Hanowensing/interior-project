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
    "집 안에서 어떤 색상을 주로 사용하고 싶으신가요?",
    "선호하는 가구 스타일은 무엇인가요?",
    "집 안에 예술 작품이나 장식품을 두는 것을 좋아하시나요?",
    "조명 스타일에서 중요하게 생각하는 점은 무엇인가요?",
    "집을 정리정돈하는 스타일은 어떤가요?",
    "가장 선호하는 집의 분위기는 무엇인가요?",
    "휴식할 때 가장 즐기는 활동은 무엇인가요?"
];

// 객관식 질문 보기
const options = {
    2: ["차분한 뉴트럴 톤 (화이트, 베이지, 그레이)", "따뜻한 자연 톤 (우드, 그린, 브라운)", "화려하고 대담한 색상 (레드, 블루, 골드)"],
    3: ["심플하고 실용적인 가구", "빈티지하거나 독특한 디자인", "고급스럽고 화려한 가구"],
    4: ["예술 작품 중심의 심플한 공간", "다양한 장식과 빈티지 소품", "장식보다는 깔끔한 벽을 선호"],
    5: ["부드럽고 은은한 조명", "화려하고 눈에 띄는 조명", "기능적이고 실용적인 조명"],
    6: ["항상 깔끔하게 유지하려고 노력한다", "약간 어수선해도 괜찮다", "자유롭고 즉흥적으로 공간을 활용한다"],
    7: ["차분하고 안정적인 분위기", "활기차고 에너지 넘치는 분위기", "아늑하고 감성적인 분위기"],
    8: ["책을 읽거나 조용히 시간을 보낸다", "사람들과 대화하거나 영화를 감상한다", "음악을 듣거나 예술 활동을 한다"]
};

// 응답 저장용 배열
const responses = [];

// 현재 질문 인덱스
let currentQuestionIndex = 0;

// HTML 요소 가져오기
const questionElement = document.getElementById("question");
const answerContainer = document.getElementById("answer-container");

// 질문 업데이트 함수
function updateQuestion() {
    questionElement.textContent = questions[currentQuestionIndex];

    // 기존 입력/보기를 제거
    answerContainer.innerHTML = "";

    if (currentQuestionIndex === 0) {
        // 첫 번째 질문은 주관식 렌더링
        const input = document.createElement("input");
        input.type = "text";
        input.id = "answer";
        input.placeholder = "집 위치를 입력하세요 (예: 부산시 금정구 남쵸원룸)";
        input.value = responses[currentQuestionIndex] || ""; // 기존 응답 불러오기
        answerContainer.appendChild(input);
    } else {
        // 객관식 보기 렌더링
        const currentOptions = options[currentQuestionIndex + 1];
        currentOptions.forEach((option) => {
            const label = document.createElement("label");
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "response";
            radio.value = option;

            // 기존 선택 값 설정
            if (responses[currentQuestionIndex] === option) {
                radio.checked = true;
            }

            label.appendChild(radio);
            label.appendChild(document.createTextNode(option));
            answerContainer.appendChild(label);
            answerContainer.appendChild(document.createElement("br"));
        });
    }
}

// 다음 질문으로 이동
window.nextQuestion = async function () {
    let answer;

    if (currentQuestionIndex === 0) {
        // 주관식 응답 처리
        const input = document.getElementById("answer");
        answer = input.value.trim();
        if (!answer) {
            alert("답변을 입력해주세요.");
            return;
        }
    } else {
        // 객관식 응답 처리
        const selectedOption = document.querySelector("input[name='response']:checked");
        if (!selectedOption) {
            alert("답변을 선택해주세요.");
            return;
        }
        answer = selectedOption.value;
    }

    // 현재 응답 저장
    responses[currentQuestionIndex] = answer;

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        updateQuestion();
    } else {
        // 설문 완료 시 Supabase로 데이터 전송
        const payload = {
            question_1: responses[0],
            question_2: responses[1],
            question_3: responses[2],
            question_4: responses[3],
            question_5: responses[4],
            question_6: responses[5],
            question_7: responses[6]
        };

        const { data, error } = await supabase
            .from("survey_responses")
            .insert([payload]);

        if (error) {
            console.error("데이터 저장 실패:", error);
            alert("설문 저장 중 문제가 발생했습니다.");
        } else {
            console.log("데이터 저장 성공:", data);
            // 완료 페이지로 이동
            window.location.href = "Complete.html";
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
