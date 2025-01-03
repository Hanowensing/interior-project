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
    "방의 가로 세로 사이즈를 알려주세요! 대략적이어도 됩니다. (양 팔 기준)", 
    "조명 추천 서비스를 시작합니다",
    "집 안에 어떤 가구나 물건들을 추가로 배치하고 싶으신가요?",
    "인테리어에 투자하려고 하는 자금이 어느 정도인가요?",
    "이메일 주소를 입력해주세요", // 이메일 입력 추가
    "원테리어(소형 평형 인테리어의 혁신)" 
];

// 응답 저장용 배열
const responses = [];

// 현재 질문 인덱스
let currentQuestionIndex = 0;

// HTML 요소 가져오기
const questionElement = document.getElementById("question");
const answerContainer = document.getElementById("answer-container");

function updateResponses(key, value) {
    const currentResponse = responses[currentQuestionIndex] || {};
    responses[currentQuestionIndex] = {
        ...currentResponse,
        [key]: value, // key-value 형태로 응답 저장
    };
    localStorage.setItem("surveyResponses", JSON.stringify(responses)); // 로컬 저장소에 저장
}

function saveMultipleChoiceResponse(selectedOption) {
    // 현재 질문 인덱스에 선택된 값을 저장
    responses[currentQuestionIndex] = selectedOption;
    localStorage.setItem("surveyResponses", JSON.stringify(responses)); // 로컬 저장소에 동기화
}


// 질문 업데이트 함수
// 질문 업데이트 함수
function updateQuestion() {
    questionElement.textContent = questions[currentQuestionIndex];
    answerContainer.innerHTML = ""; // 기존 내용 초기화

  if (currentQuestionIndex === 0) {
        createFileInput(); // 사진 첨부 입력 필드
    }  else if (currentQuestionIndex === 1) {
        createFloatingCircles(); // 색상 원 렌더링
    } else if (currentQuestionIndex === 2) {
        createArmMeasurementInputs(); // 팔 실측
    } else if (currentQuestionIndex === 3) {
        prepareAgeTestFadeOut(); // 나이 테스트 준비 (3번째 페이지)
    } else if (currentQuestionIndex === 4){
         createTextInput2();
    }  else if (currentQuestionIndex === 5) {
        createBudgetOptions(); // 자금 질문 객관식 렌더링
    }  else if (currentQuestionIndex ===6) {
          createTextInput();
    }  else if (currentQuestionIndex === 7) {
        displayFinalMessage(); // 집 분위기 객관식 렌더링
    }



function createArmMeasurementInputs() {
    // 가로 입력 필드
    const widthInputLabel = document.createElement("label");
    widthInputLabel.textContent = "가로 (ex. 팔 1개반):";
    const widthInput = document.createElement("input");
    widthInput.type = "text";
    widthInput.id = "width-input";
    widthInput.value = responses[currentQuestionIndex]?.width || ""; // 기존 응답 복원
 widthInput.style.width = "350px"; // 가로 길이 고정

    // 세로 입력 필드
    const heightInputLabel = document.createElement("label");
    heightInputLabel.textContent = "세로 (ex. 팔 4개):";
    const heightInput = document.createElement("input");
    heightInput.type = "text";
    heightInput.id = "height-input";
    heightInput.value = responses[currentQuestionIndex]?.height || ""; // 기존 응답 복원
heightInput.style.width = "350px"; // 가로 길이 고정

    // 입력 이벤트로 응답 저장
    widthInput.addEventListener("input", () => {
        responses[currentQuestionIndex] = {
            ...responses[currentQuestionIndex],
            width: widthInput.value,
        };
    });
    heightInput.addEventListener("input", () => {
        responses[currentQuestionIndex] = {
            ...responses[currentQuestionIndex],
            height: heightInput.value,
        };
    });

  // 이전 응답 복원
    restorePreviousResponse();


    // 요소 추가
    answerContainer.appendChild(widthInputLabel);
    answerContainer.appendChild(widthInput);
    answerContainer.appendChild(heightInputLabel);
    answerContainer.appendChild(heightInput);
}


  const prevButton = document.querySelector(".previous");
    const nextButton = document.querySelector(".next");
    if (prevButton) prevButton.textContent = "previous";
    if (nextButton) nextButton.textContent = "next";
}

function hideButtons() {
    const previousButton = document.querySelector('.previous'); // 이전 버튼
    const nextButton = document.querySelector('.next'); // 다음 버튼

    // 버튼 숨기기
    if (previousButton) previousButton.style.display = 'none';
    if (nextButton) nextButton.style.display = 'none';
}

function showButtons() {
    const previousButton = document.querySelector('.previous'); // 이전 버튼
    const nextButton = document.querySelector('.next'); // 다음 버튼

    // 버튼 보이기
    if (previousButton) previousButton.style.display = 'inline-block'; // 혹은 'block'
    if (nextButton) nextButton.style.display = 'inline-block'; // 혹은 'block'
}


function createFileInput() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.id = "file-answer";

    const fileLabel = document.createElement("label");
    fileLabel.textContent = "사진을 첨부하세요:";
    fileLabel.htmlFor = "file-answer";

    const fileNameDisplay = document.createElement("p");
    fileNameDisplay.id = "file-name";
    fileNameDisplay.style.marginTop = "10px";
    fileNameDisplay.style.fontStyle = "italic";
    fileNameDisplay.style.color = "#555";

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0];
        if (file) {
            fileNameDisplay.textContent = `선택된 파일: ${file.name}`;
            responses[currentQuestionIndex] = file.name; // 응답 저장
        } else {
            fileNameDisplay.textContent = "";
            responses[currentQuestionIndex] = ""; // 응답 초기화
        }
    });

    answerContainer.appendChild(fileLabel);
    answerContainer.appendChild(fileInput);
    answerContainer.appendChild(fileNameDisplay);

    // 이전 응답 복원
    restorePreviousResponse();
    
}


// 마지막 질문 추가 함수
// 마지막 질문 추가 함수
function displayFinalMessage() {
    const finalMessage = `
        저희 서비스를 이용해주셔서 감사합니다.<br>
        보내주신 정보들을 기반으로 인테리어 추천 결과물을 보내드리겠습니다.<br><br>
        비용은 1000원이며 아래 계좌로 입금해주시면 확인 후 2~3일 내로 결과물이 이메일로 전송됩니다.<br>
       농협 356-1488-8305-13 (예금주 한형준) <br><br>
       해당 결과물에 대한 수정은 2회 가능합니다 <br>
       수정을 원하실 경우 저희 인스타 DM으로 수정 요청을 부탁드리겠습니다.<br>
       인스타 ID: 1terior_<br><br>
       낮은 가격에 큰 기쁨을 드리도록 노력하겠습니다. 감사합니다.
    `;

    const questionElement = document.getElementById("question");
    const answerContainer = document.getElementById("answer-container");

    // 기존 내용을 초기화하고 메시지 추가
    questionElement.textContent = "원테리어 - 서비스 안내";
    answerContainer.innerHTML = finalMessage;

    // CSS 스타일 추가 (중앙 정렬 및 위치 조정)
    questionElement.style.marginTop = "-25px"; // 30px 위로 올림
    questionElement.style.textAlign = "center"; // 중앙 정렬

    answerContainer.style.textAlign = "center"; // 중앙 정렬
    answerContainer.style.margin = "0 auto"; // 가운데 정렬
    answerContainer.style.width = "80%"; // 내용의 최대 너비 제한
    answerContainer.style.lineHeight = "1.8"; // 줄 간격 조정
}

// 설문 완료 시 호출
function onSurveyComplete() {
    displayFinalMessage();
}



// 주관식 입력 렌더링 함수
function createTextInput() {
    const input = document.createElement("input");
    input.type = "text";
    input.id = "answer";
    input.placeholder = "답변을 입력하세요";
    input.value = responses[currentQuestionIndex]?.text || ""; // 기존 응답 불러오기

    // 입력 이벤트로 응답 저장
    input.addEventListener("input", () => {
        updateResponses("text", input.value); // 입력 값 저장
    });

    answerContainer.appendChild(input);

    // 스타일 설정
    input.style.width = "350px"; // 가로 길이 고정
}


function createTextInput2() {

    showButtons();
    const input = document.createElement("input");
    input.type = "text";
    input.id = "answer";
    input.placeholder = "답변을 입력하세요(없을 경우 없음)";
    input.value = responses[currentQuestionIndex]?.text || ""; // 기존 응답 불러오기

    // 입력 이벤트로 응답 저장
    input.addEventListener("input", () => {
        updateResponses("text", input.value); // 입력 값 저장
    });

    answerContainer.appendChild(input);

    // 스타일 설정
    input.style.width = "350px"; // 가로 길이 고정

    // 이전 응답 복원
    restorePreviousResponse();
}


// 나이 테스트 준비: 기존 요소 페이드아웃
// 질문 상태를 추적하는 객체
const questionStatus = {
    answeredQuestions: new Set(), // 응답 완료된 질문 ID 저장
};


// prepareAgeTestFadeOut 함수 수정

let lastQuestionText = "";

function prepareAgeTestFadeOut(questionId) {
            // 버튼 숨기기
        hideButtons();

    const questionElement = document.getElementById("question"); // 질문 텍스트
    const houseMagicianElement = document.getElementById("house-magician"); // h1
    const previousButton = document.querySelector('.previous'); // 이전 버튼
    const nextButton = document.querySelector('.next'); // 다음 버튼

    // 이미 응답된 질문이라면 마지막 질문을 표시
    if (questionStatus.answeredQuestions.has(questionId)) {
        markQuestionAsAnswered(questionElement, questionId); // 체크 표시 유지
        displayLastQuestion(); // 마지막 질문 표시
        return;
    }

    // 소질문 확인 로직 (index === 3일 때 처리)
    if (questionId === "3") {
        const subQuestions = document.querySelectorAll('.sub-question'); // 소질문 요소
        let allAnswered = true;

        subQuestions.forEach((subQuestion, index) => {
            const inputs = subQuestion.querySelectorAll('input'); // 소질문의 입력 요소
            const answered = Array.from(inputs).some(input => input.checked || input.value.trim() !== "");
            
            if (!answered) {
                allAnswered = false;
                alert(`소질문 ${index + 1}에 답변을 입력하세요.`);
                return; // 특정 소질문에서 응답이 누락되면 경고 후 중단
            }
        });

        // 소질문 중 하나라도 응답이 누락되었으면 종료
        if (!allAnswered) {
            return;
        }
    }

    // 5초 후 "HOUSE MAGICIAN"과 질문 서서히 사라짐
    setTimeout(() => {
    const countdownElement = document.createElement("div");
    countdownElement.id = "countdown";
    countdownElement.style.position = "absolute";
    countdownElement.style.top = "calc(50% + 100px)";
    countdownElement.style.left = "50%";
    countdownElement.style.transform = "translate(-50%, -50%)";
    countdownElement.style.fontSize = "24px";
    countdownElement.style.color = "#black"; // 빨간색
    countdownElement.style.textAlign = "center";
    countdownElement.style.transition = "opacity 1s ease, transform 1s ease"; // 애니메이션 설정

    document.body.appendChild(countdownElement);

    let countdown = 3; // 카운트다운 시작 값

    // 카운트다운 업데이트
    const interval = setInterval(() => {
        countdownElement.textContent = `${countdown}`;
        countdown--;

        if (countdown < 0) {
            clearInterval(interval); // 카운트다운 종료
            countdownElement.remove(); // 카운트다운 요소 제거

            fadeOutElements([houseMagicianElement, questionElement], () => {
                // 응답 상태 업데이트
                questionStatus.answeredQuestions.add(questionId);
                responses[questionId] = { status: "completed" }; // 응답 저장 (예제)

                // 기존 선언된 markQuestionAsAnswered 호출
                markQuestionAsAnswered(questionElement, questionId);

                displaySequentialQuestions(); // 다음 질문 표시
            });
        }
    }, 1000); // 1초 간격으로 카운트다운 업데이트
}, 2500);
}

// 마지막 질문 표시 함수
function displayLastQuestion() {
    const questionElement = document.getElementById("question"); // 질문 텍스트

    if (questionElement) {
        // 마지막 질문 텍스트와 버튼 표시
        questionElement.innerHTML = `
            조명 추천 정보 수집이 완료되었습니다. <br>
            <br>
            추후 의뢰서 작성 시 반영됩니다.<br>
            <button id="retry-button">다시 추천받기 (1회 가능) </button>
        `;

        // "다시 추천받기" 버튼 클릭 이벤트 추가
        const retryButton = document.getElementById("retry-button");
        if (retryButton) {
            retryButton.addEventListener("click", handleRetryClick);
        }
    }
}

// 버튼 클릭 이벤트 핸들러
function handleRetryClick() {
    const questionElement = document.getElementById("question"); // 질문 텍스트

    if (questionElement) {
        // "조명 추천 서비스를 재시작합니다" 문구 표시
        questionElement.innerHTML = `
            조명 추천 서비스를 재시작합니다. <br>
        `;

        // prepareAgeTestFadeOut 함수 실행
        prepareAgeTestFadeOut("retry");

    }
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

// 응답 완료된 질문을 체크 표시로 마킹
function markQuestionAsAnswered(questionElement, questionId) {
    if (!questionStatus.answeredQuestions.has(questionId)) {
        // 상태 업데이트
        questionStatus.answeredQuestions.add(questionId);

        // 체크 표시 추가
        if (questionElement) {
            questionElement.innerHTML += " <span style='color: green;'>✔</span>";
        }
    }
}


// "오늘 날씨는 어때요?" 질문과 기타 질문 표시 함수
function displaySequentialQuestions() {
    const questionElement = document.getElementById("question");
    const answerContainer = document.getElementById("answer-container");

    const sequentialQuestions = [
        { question: "집에서 책을 몇 권 정도 읽나요? (1달 기준)", options: ["3권 미만", "3~10권", "10권 이상"] },
        { question: "집에 친구들을 몇 번 정도 데려오나요? (1달 기준)", options: ["3번 미만", "3~10번", "11번 이상"] },
        { question: "집에 체류하는 비중이 어느 정도 되나요? (하루 24시간 기준)", options: ["30% 미만", "30% ~70%", "70% 초과"] },
        { question: "불면증과 같이 잠을 잘 자지 못하는 경우가 얼마나 되나요? (1달 기준)", options: ["거의 없음(4회 미만)", "보통임 (4~10회)", "자주 그럼(11회 이상)"] }
    ];

    let currentQuestionIndex = 0;
    const responses = [];
    let flashingIntervalId = null;

    function applySmoothFlashingEffect(color) {
        let opacity = 0;
        let increasing = true;

        if (flashingIntervalId) {
            clearInterval(flashingIntervalId);
        }

        flashingIntervalId = setInterval(() => {
            if (increasing) {
                opacity += 0.02;
                if (opacity >= 0.4) increasing = false;
            } else {
                opacity -= 0.02;
                if (opacity <= 0) increasing = true;
            }
            document.body.style.backgroundImage = `${color.replace(/rgba\(([^,]+,[^,]+,[^,]+),[^\)]+\)/, `rgba($1, ${opacity})`)}`;
        }, 50);
    }

    function stopFlashingEffect() {
        if (flashingIntervalId) {
            clearInterval(flashingIntervalId);
            flashingIntervalId = null;
            document.body.style.backgroundImage = "none";
        }
    }

    function showQuestion(index) {
        if (index >= sequentialQuestions.length) {
            // 모든 질문 완료 후 KNN 알고리즘 실행 및 추천 조명 표시
            const recommendedLighting = recommendLighting(responses);
            alert(`${recommendedLighting} 조명을 추천드립니다!`);
            nextQuestion(); // 주요 설문 흐름으로 복귀
            return;
        }

        const { question, options } = sequentialQuestions[index];

        // 질문 텍스트 업데이트
        questionElement.textContent = question;
        answerContainer.innerHTML = "";

        // 보기 옵션 렌더링
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

        const nextButton = document.getElementById("next-button");
        if (nextButton) {
            nextButton.onclick = () => {
                const selectedOption = document.querySelector(`input[name='question-${index}']:checked`);
                if (!selectedOption) {
                    alert("답변을 선택해주세요.");
                    return;
                }

                const selectedValue = selectedOption.value;
                responses.push(selectedValue); // 응답 저장
                currentQuestionIndex++;
                showQuestion(currentQuestionIndex);
            };
        }
    

    // 첫 번째 질문 표시
    showQuestion(currentQuestionIndex);
}

function resetBackgroundColor() {
 
      // 모든 조명 효과 제거
    const lightingEffects = document.querySelectorAll(".lighting-effect");
    lightingEffects.forEach((effect) => effect.remove());

    document.body.style.backgroundColor = "white";

    // 모든 텍스트 요소의 색상을 검정색으로 변경
    const allTextElements = document.querySelectorAll("*");
    allTextElements.forEach((element) => {
        element.style.color = "black"; // 텍스트 색상을 검정색으로 변경
    });

    // 버튼 색상도 흰색으로 변경
    const resetButton = document.querySelector("#top-left-buttons button:first-child");
    if (resetButton) {
        resetButton.style.backgroundColor = "white";
        resetButton.style.color = "black";
    }
}

    function goToDreamland() {
        stopFlashingEffect();
        document.body.style.backgroundColor = "black";
    }

    function showQuestion(index) {
        if (index >= sequentialQuestions.length) {
            alert("모든 질문에 답변하셨습니다.");
            stopFlashingEffect();
            nextQuestion();
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

        // 버튼 컨테이너 생성
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "space-between";
        buttonContainer.style.marginTop = "20px";

        // 이전 버튼
        if (index > 0) {
            const prevButton = document.createElement("button");
            prevButton.textContent = "이전 질문으로";
            prevButton.onclick = () => {
                currentQuestionIndex--;
                showQuestion(currentQuestionIndex);
            };
            buttonContainer.appendChild(prevButton);
        }

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

            const selectedValue = selectedOption.value;

            // 각 질문에 대한 조명 효과 및 알림 처리
            if (index === 0) {
                if (selectedValue === "3권 미만") {
                    alert("책을 읽고 싶게 만들어드리겠습니다. 빨간색이 독서활동 증진에 효과가 있습니다!");
                    applySmoothFlashingEffect("linear-gradient(to bottom, rgba(255, 100, 100, 0.4) 0%, rgba(255, 100, 100, 0) 100%)");
                } else if (selectedValue === "3~10권") {
                    alert("적절한 독서는 인생을 변화시킵니다. 흰색은 과도한 자극 없이 독서 활동을 도와줍니다!");
                    applySmoothFlashingEffect("linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)");
                } else if (selectedValue === "10권 이상") {
                    alert("책을 정말 잘 읽는 당신이 대단합니다. 노란색은 당신의 눈의 피로를 풀어줍니다.");
                    applySmoothFlashingEffect("linear-gradient(to bottom, rgba(255, 255, 0, 0.4) 0%, rgba(255, 255, 0, 0) 100%)");
                }
            } 

else if (index === 1) {
                if (selectedValue === "3번 미만") {
                    alert("집에서 친구를 부르는 비율이 낮으시군요. 은은한 노란색으로 집을 따뜻하게 만들어드립니다!");
                    applySmoothFlashingEffect("linear-gradient(to left, rgba(255, 255, 150, 0.4) 0%, rgba(255, 255, 150, 0) 100%)");
                } else if (selectedValue === "3~10번") {
                    alert("친구들이 간간히 집에 오는군요. 연한 하늘색으로 친구들이 왔을 때 편안함을 줄 수 있습니다.");
                    applySmoothFlashingEffect("linear-gradient(to left, rgba(173, 216, 230, 0.4) 0%, rgba(173, 216, 230, 0) 100%)");
                } else if (selectedValue === "11번 이상") {
                    alert("친구들이 꽤 자주 오시네요. 연한 주황색 조명이 따뜻함을 줄 수 있습니다.");
                    applySmoothFlashingEffect("linear-gradient(to left, rgba(255, 200, 150, 0.4) 0%, rgba(255, 200, 150, 0) 100%)");
                }                 
            } 
else if (index === 2) {
                if (selectedValue === "30% 미만") {
                    alert("집에서 주로 잠을 주무시는 동안이라도 편히 쉬실 수 있는 연한 핑크색을 추천드립니다.");
                    applySmoothFlashingEffect("linear-gradient(to top, rgba(255, 150, 150, 0.4) 0%, rgba(255, 150, 150, 0) 100%)");
                } else if (selectedValue === "30% ~70%") {
                    alert("집에 있는 시간 동안 편안하게 쉴 수 있는 연한 노란색을 추천드립니다");
                    applySmoothFlashingEffect("linear-gradient(to top, rgba(255, 255, 200, 0.4) 0%, rgba(255, 255, 200, 0) 100%)");
                } else if (selectedValue === "70% 초과") {
                    alert("꽤 많은 시간을 집에서 보내시는군요. 안락한 환경을 위한 연한 회색을 추천드립니다.");
                    applySmoothFlashingEffect("linear-gradient(to top, rgba(200, 200, 200, 0.4) 0%, rgba(200, 200, 200, 0) 100%)");
                } 
          
            } else if (index === 3) {
                if (selectedValue === "거의 없음(4회 미만)") {
                    alert("불면증 없이 잘 주무신다니 좋습니다! 편안한 흰색 조명을 추천드립니다.");
                    applySmoothFlashingEffect("linear-gradient(to right, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)");
                } else if (selectedValue === "보통임(4~10회)") {
                    alert("가끔 불면증이 있으시군요. 편안한 푸른빛을 추천드립니다.");
                    applySmoothFlashingEffect("linear-gradient(to right, rgba(173, 216, 230, 0.4) 0%, rgba(173, 216, 230, 0) 100%)");
                } else if (selectedValue === "자주 그럼(11회 이상)") {
                    alert("불면증으로 고생하시는군요. 차분한 어두운 푸른 조명을 추천드립니다.");
                    applySmoothFlashingEffect("linear-gradient(to right, rgba(50, 100, 150, 0.4) 0%, rgba(50, 100, 150, 0) 100%)");
                } 
            }

            // 응답 저장
            responses[index] = selectedValue;

            // 다음 질문으로 이동
            currentQuestionIndex++;
            if (currentQuestionIndex < sequentialQuestions.length) {
                showQuestion(currentQuestionIndex);
            } else {
                alert("모든 질문에 답변하셨습니다.");
                stopFlashingEffect();
                nextQuestion();
            }
        };

        buttonContainer.appendChild(nextButton);

        // 왼쪽 상단에 배경 초기화 버튼과 꿈나라 버튼 생성
        let topLeftContainer = document.getElementById("top-left-buttons");
        if (!topLeftContainer) {
            topLeftContainer = document.createElement("div");
            topLeftContainer.id = "top-left-buttons";
            topLeftContainer.style.position = "absolute";
            topLeftContainer.style.top = "10px";
            topLeftContainer.style.left = "10px";
            topLeftContainer.style.display = "flex";
            topLeftContainer.style.gap = "10px";

            document.body.appendChild(topLeftContainer);
        }
        topLeftContainer.innerHTML = "";


const resetButton = document.createElement("button");
resetButton.textContent = "조명\n초기화";
resetButton.onclick = () => {
    resetBackgroundColor();

    // previous와 next 버튼의 색상을 흰색으로 변경
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
        if (button !== resetButton) { // resetButton 제외
            button.style.backgroundColor = "white";
            button.style.color = "black"; // 텍스트 색상은 가독성을 위해 검정색
        }
    });
};


resetButton.style.fontSize = "80%";
resetButton.style.transform = "scale(1.2)"; // 크기를 50% 증가
resetButton.style.whiteSpace = "pre-wrap"; // 텍스트 줄바꿈 설정
topLeftContainer.appendChild(resetButton);

const dreamlandButton = document.createElement("button");
dreamlandButton.textContent = "꿈나라";

dreamlandButton.onclick = () => {
    goToDreamland();

    // 모든 텍스트를 흰색으로 변경
    const allTextElements = document.querySelectorAll("*");
    allTextElements.forEach((element) => {
        element.style.color = "white"; // 텍스트 색상 변경
    });

    // 모든 버튼 배경색과 텍스트 색상 변경
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
        button.style.backgroundColor = "black"; // 배경색 검정
        button.style.color = "white"; // 텍스트 흰색
    });

    // 꿈나라 버튼도 검정 배경과 흰색 텍스트로 변경
    dreamlandButton.style.backgroundColor = "black";
    dreamlandButton.style.color = "white";
};

dreamlandButton.style.fontSize = "80%";
dreamlandButton.style.transform = "scale(1.2)";
topLeftContainer.appendChild(dreamlandButton);


        answerContainer.appendChild(buttonContainer);
    }

    // 첫 번째 질문 표시
    showQuestion(currentQuestionIndex);
}







// 조명 효과 추가 함수
function applyLightingEffect(gradientColor) {
    const body = document.body;

    // 기존 조명 효과가 있다면 제거
    const existingLighting = document.querySelectorAll(".lighting-effect");
    existingLighting.forEach((el) => el.remove());

    // 조명 효과 추가
    const lightEffect = document.createElement("div");
    lightEffect.className = "lighting-effect";
    lightEffect.style.background = gradientColor; // 채도에 따른 그라데이션
    body.appendChild(lightEffect);

    // 왼쪽 위 조명
    const leftLight = document.createElement("div");
    leftLight.className = "lighting-effect top-left";
    leftLight.style.background = gradientColor; // 조명 색상 설정
    body.appendChild(leftLight);

    // 오른쪽 위 조명
    const rightLight = document.createElement("div");
    rightLight.className = "lighting-effect top-right";
    rightLight.style.background = gradientColor; // 조명 색상 설정
    body.appendChild(rightLight);
}



// 색상 원 렌더링 함수
// 색상 원 렌더링 함수
function createFloatingCircles() {
    const colors = [
        { className: "white", label: "화이트", colorCode: "#ffffff" },
        { className: "beige", label: "베이지", colorCode: "#f5f5dc" },
        { className: "olive-green", label: "올리브 그린", colorCode: "#808000" },
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
        radio.name = `question-${currentQuestionIndex}`; // 각 질문별 고유 name
        radio.value = budget;

        const label = document.createElement("label");
        label.htmlFor = `budget-${index}`;
        label.textContent = budget;

        // 기존 응답 복원
        if (responses[currentQuestionIndex] === budget) {
            radio.checked = true;
        }

        // 응답 저장
        radio.addEventListener("change", () => {
            saveMultipleChoiceResponse(budget); // 객관식 응답 저장
        });

        radioContainer.appendChild(radio);
        radioContainer.appendChild(label);
        answerContainer.appendChild(radioContainer);
    });

    restorePreviousResponse();
}


function restorePreviousResponse() {
    const currentResponse = responses[currentQuestionIndex];
    if (!currentResponse) return; // 이전 응답이 없으면 리턴

    if (currentQuestionIndex === 0) {
        const fileInput = document.getElementById("file-answer");
        const fileNameDisplay = document.getElementById("file-name");
        if (fileInput && fileNameDisplay) {
            fileNameDisplay.textContent = `선택된 파일: ${currentResponse}`;
        }
    } else if (currentQuestionIndex === 1) {
        const circles = document.querySelectorAll(".circle");
        circles.forEach((circle) => {
            if (circle.dataset.label === currentResponse) {
                circle.classList.add("selected");
            }
        });
    } else if (currentQuestionIndex === 2) {
        const widthInput = document.getElementById("width-input");
        const heightInput = document.getElementById("height-input");
        if (widthInput && heightInput) {
            widthInput.value = currentResponse.width || "";
            heightInput.value = currentResponse.height || "";
        }
    } else if (currentQuestionIndex === 5) {
        const radios = document.querySelectorAll("input[name='budget']");
        radios.forEach((radio) => {
            if (radio.value === currentResponse) {
                radio.checked = true;
            }
        });
    } else if (currentQuestionIndex === 6) {
        const input = document.getElementById("answer");
        if (input) {
            input.value = currentResponse || "";
        }
    }
}



// 다음 질문으로 이동
window.nextQuestion = async function () {
    const currentQuestion = questions[currentQuestionIndex];

    let answer;
    if (currentQuestionIndex === 0) {
        const fileInput = document.getElementById("file-answer");
        if (fileInput && fileInput.files.length > 0) {
            answer = fileInput.files[0].name;
            responses[currentQuestionIndex] = answer; // 응답 저장
        } else if (responses[currentQuestionIndex]) {
            // 이미 저장된 파일 이름이 있는 경우
            answer = responses[currentQuestionIndex];
        } else {
            alert("파일을 선택하세요.");
            return;
        }
    } else if (currentQuestionIndex === 1) {
        answer = responses[currentQuestionIndex];
        if (!answer) {
            alert("원을 클릭해주세요.");
            return;
        }
    } else if (currentQuestionIndex === 2 || currentQuestionIndex === 4 || currentQuestionIndex === 6){
       answer = responses[currentQuestionIndex];
       if (!answer) {
            alert("답변을 입력하세요.");
            return;
            }
   } else if (currentQuestionIndex === 5){
       answer = responses[currentQuestionIndex];
       if (!answer) {
            alert("답변을 입력하세요.");
            return;
            }
         }


    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        updateQuestion();
    } else {
        const payload = {
            house: responses[0],
            gender: responses[1],
            age: responses[2],
            favorite_color: responses[3],
            budget: responses[4],
            furniture_preferences: responses[5],
        };

        const { data, error } = await supabase.from("survey_responses").insert([payload]);

        if (error) {
            console.error("데이터 저장 실패:", error);
            alert("설문 저장 중 문제가 발생했습니다.");
        } else {
            console.log("데이터 저장 성공:", data);
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