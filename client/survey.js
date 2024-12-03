let currentQuestionIndex = 0; // 현재 질문의 인덱스를 추적
const questions = [
    "당신의 집을 알려주세요", 
    "성별을 알려주세요:", 
    "나이를 알려주세요:", 
    "좋아하는 색을 알려주세요:", 
    "예산을 알려주세요:", 
    "제출하시겠습니까?"
]; // 설문 질문 목록

// 설문 제출을 위한 함수
async function submitSurvey() {
    try {
        const response = await fetch('/submit-survey', {  // 서버로 데이터 전송
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                house: answers["당신의 집을 알려주세요"],
                gender: answers["성별을 알려주세요:"],
                age: answers["나이를 알려주세요:"],
                favorite_color: answers["좋아하는 색을 알려주세요:"],
                budget: answers["예산을 알려주세요:"]
            }), 
        });

        if (response.ok) {
            const result = await response.json();
            console.log('설문이 성공적으로 제출되었습니다:', result);
            alert('설문이 성공적으로 제출되었습니다!');
        } else {
            console.error('서버 오류:', await response.text());
            alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    } catch (error) {
        console.error('네트워크 오류:', error);
        alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    }
}


// 답변을 저장할 객체
let answers = {};

// 처음 페이지 로드 시 첫 번째 질문을 표시
window.onload = function() {
    loadQuestion();
};

// 질문을 불러오는 함수
function loadQuestion() {
    // 현재 질문을 화면에 표시
    const questionElement = document.getElementById('question');
    questionElement.innerText = questions[currentQuestionIndex];

    // 답변 입력 필드 초기화
    const answerElement = document.getElementById('answer');
    answerElement.value = answers[questions[currentQuestionIndex]] || ''; // 이전에 저장된 답변이 있으면 표시
}

// "다음" 버튼 클릭 시
document.getElementById('nextButton').addEventListener('click', function(event) {
    event.preventDefault();  // 폼 제출을 막습니다.

    // 현재 질문에 대한 답변을 answers 객체에 저장
    const answerElement = document.getElementById('answer');
    answers[questions[currentQuestionIndex]] = answerElement.value;

    // 마지막 질문이면 설문 제출, 아니면 다음 질문으로
    currentQuestionIndex++;

    if (currentQuestionIndex >= questions.length) {
        alert("설문이 모두 제출되었습니다!");
        // 설문을 제출하려면 saveAnswers에서 추가 로직을 작성하여 제출
        submitSurvey();
    } else {
        loadQuestion(); // 다음 질문을 로드
    }
});

// "이전" 버튼 클릭 시
function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion(); // 이전 질문을 로드
    }
}

// 설문 답변을 저장하는 함수
async function saveAnswers() {
    // Local Storage에서 기존 응답 데이터를 가져옴
    let savedResponses = JSON.parse(localStorage.getItem('surveyAnswers')) || [];
    savedResponses.push(answers); // 새로운 응답 추가
    localStorage.setItem('surveyAnswers', JSON.stringify(savedResponses)); // Local Storage에 저장

    // Supabase로 데이터 전송
    try {
        const response = await fetch('https://fvoauhyvsyntgjepkqgk.supabase.co/rest/v1/survey_responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2b2F1aHl2c3ludGdqZXBrcWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMDE2NzcsImV4cCI6MjA0ODc3NzY3N30.PzyKXN_ni8GTz7hAJsoGfGgCxmShwvQ4VZwdyf5k6Go'  // 여기에 Supabase의 `anon` API 키를 넣어야 합니다.
            },
            body: JSON.stringify({
                house: answers["당신의 집을 알려주세요"],
                gender: answers["성별을 알려주세요:"],
                age: answers["나이를 알려주세요:"],
                favorite_color: answers["좋아하는 색을 알려주세요:"],
                budget: answers["예산을 알려주세요:"]
            }), // 답변을 올바른 필드 이름으로 전송
        });

        if (response.ok) {
            const result = await response.json();
            console.log('응답이 성공적으로 저장되었습니다:', result);
        } else {
            console.error('서버 오류:', await response.text());
            alert('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        }
    } catch (error) {
        console.error('네트워크 오류:', error);
        alert('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.');
    }
}


