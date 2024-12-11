// Supabase 라이브러리 가져오기
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

// Supabase 클라이언트 초기화
const supabaseUrl = "https://fvoauhyvsyntgjepkqgk.supabase.co";
const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2b2F1aHl2c3ludGdqZXBrcWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMDE2NzcsImV4cCI6MjA0ODc3NzY3N30.PzyKXN_ni8GTz7hAJsoGfGgCxmShwvQ4VZwdyf5k6Go";

const supabase = createClient(supabaseUrl, supabaseKey);

// 질문 데이터 배열
const questions = [
    "집이 어디신가요",
    "성별이 어떻게 되시나요",
    "나이가 어떻게 되시나요",
    "어떤 색을 좋아하시나요",
    "예산이 어떻게 되나요"
];

// 응답 저장용 배열
const responses = [];

// 현재 질문 인덱스
let currentQuestionIndex = 0;

// HTML 요소 가져오기
const questionElement = document.getElementById("question");
const answerElement = document.getElementById("answer");

// 질문 업데이트 함수
function updateQuestion() {
    questionElement.textContent = questions[currentQuestionIndex];
    answerElement.value = responses[currentQuestionIndex] || ""; // 기존 응답 불러오기
}

// 다음 질문으로 이동
window.nextQuestion = async function () {
    const answer = answerElement.value;
    if (answer.trim() === "") {
        alert("답변을 입력해주세요.");
        return;
    }

    // 현재 응답 저장
    responses[currentQuestionIndex] = answer;

    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        updateQuestion();
    } else {
        // 설문 완료 시 Supabase로 데이터 전송
        const payload = {
            house: responses[0],
            gender: responses[1],
            age: responses[2],
            favorite_color: responses[3],
            budget: responses[4]
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
updateQuestion();
