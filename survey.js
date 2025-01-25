import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://fvoauhyvsyntgjepkqgk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2b2F1aHl2c3ludGdqZXBrcWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMDE2NzcsImV4cCI6MjA0ODc3NzY3N30.PzyKXN_ni8GTz7hAJsoGfGgCxmShwvQ4VZwdyf5k6Go";
const supabase = createClient(supabaseUrl, supabaseKey);

let small_responses = [];
const questions = [
    "집 구조를 알려주세요!",
    "집안에서 어떤 색상을 주로 사용하고 싶은가요?",
    "방의 가로 세로 사이즈를 알려주세요! 대략적이어도 됩니다. (양 팔 기준)",
    "조명 추천 서비스를 시작합니다",
    "집 안에 어떤 가구나 물건들을 추가로 배치하고 싶으신가요?",
    "인테리어에 투자하려고 하는 자금이 어느 정도인가요?",
    "추가적으로 요청 사항이 있으신가요?",
    "이메일 주소와 이름을 입력해주세요",
    "원테리어(소형 평형 인테리어의 혁신)"
];
const responses = [];
let currentQuestionIndex = 0;

const questionElement = document.getElementById("question");
const answerContainer = document.getElementById("answer-container");

function updateResponses(key, value) {
    const currentResponse = responses[currentQuestionIndex] || {};
    responses[currentQuestionIndex] = {
        ...currentResponse,
        [key]: value,
    };
    localStorage.setItem("surveyResponses", JSON.stringify(responses));
}

function saveMultipleChoiceResponse(selectedOption) {
    responses[currentQuestionIndex] = selectedOption;
    localStorage.setItem("surveyResponses", JSON.stringify(responses));
}

function updateQuestion() {
    questionElement.textContent = questions[currentQuestionIndex];
    answerContainer.innerHTML = "";
    if (currentQuestionIndex === 0) {
        createFileInput();
    } else if (currentQuestionIndex === 1) {
        createFloatingCircles();
    } else if (currentQuestionIndex === 2) {
        createArmMeasurementInputs();
    } else if (currentQuestionIndex === 3) {
        prepareAgeTestFadeOut(3);
    } else if (currentQuestionIndex === 4) {
        createTextInput2();
    } else if (currentQuestionIndex === 5) {
        createBudgetOptions();
    } else if (currentQuestionIndex === 6) {
        createTextInput2();
    } else if (currentQuestionIndex === 7) {
        createNameEmailInput();
    } else if (currentQuestionIndex === 8) {
        displayFinalMessage();
    }
    const prevButton = document.querySelector(".previous");
    const nextButton = document.querySelector(".next");
    if (prevButton) prevButton.textContent = "previous";
    if (nextButton) nextButton.textContent = "next";
}

function hideButtons() {
    const previousButton = document.querySelector('.previous');
    const nextButton = document.querySelector('.next');
    if (previousButton) previousButton.style.display = 'none';
    if (nextButton) nextButton.style.display = 'none';
}

function showButtons() {
    const previousButton = document.querySelector('.previous');
    const nextButton = document.querySelector('.next');
    if (previousButton) previousButton.style.display = 'inline-block';
    if (nextButton) nextButton.style.display = 'inline-block';
}

function createFileInput() {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.id = "file-answer";

    const fileLabel = document.createElement("label");
    fileLabel.textContent = "(ex 방 사진, 평면도, 방 손그림 등 )";
    fileLabel.htmlFor = "file-answer";

    const fileNameDisplay = document.createElement("p");
    fileNameDisplay.id = "file-name";
    fileNameDisplay.style.marginTop = "10px";
    fileNameDisplay.style.fontStyle = "italic";
    fileNameDisplay.style.color = "#555";

    const randomStringDisplay = document.createElement("p");
    randomStringDisplay.id = "random-string";
    randomStringDisplay.style.marginTop = "10px";
    randomStringDisplay.style.fontWeight = "bold";
    randomStringDisplay.style.color = "blue";

    const responseInput = document.createElement("input");
    responseInput.type = "text";
    responseInput.id = "response-input";
    responseInput.placeholder = "화면에 표시된 확인 코드를 입력하세요";
    responseInput.style.marginTop = "10px";
    responseInput.style.display = "none";

    fileInput.addEventListener("change", async () => {
        const file = fileInput.files[0];
        if (file) {
            const uniqueFileName = generateUniqueFileName(file.name);
            const result = await uploadFileToSupabase(file, uniqueFileName);
            const randomString = uniqueFileName.split("_")[1];

            if (result && result.success) {
                fileNameDisplay.textContent = `파일 업로드 성공! 선택된 파일: ${file.name}`;
                responses[0] = randomString;
            } else {
                fileNameDisplay.textContent = `파일 업로드 실패: ${result?.error}`;
                randomStringDisplay.style.display = "none";
                responseInput.style.display = "none";
                responses[currentQuestionIndex] = "";
            }
        } else {
            fileNameDisplay.textContent = "";
            randomStringDisplay.style.display = "none";
            responseInput.style.display = "none";
            responses[currentQuestionIndex] = "";
        }
    });

    answerContainer.appendChild(fileLabel);
    answerContainer.appendChild(fileInput);
    answerContainer.appendChild(fileNameDisplay);
    answerContainer.appendChild(randomStringDisplay);
    answerContainer.appendChild(responseInput);

    restorePreviousResponse();
}

async function uploadFileToSupabase(file, uniqueFileName) {
    const bucketName = "uploads";
    const filePath = `user_uploads/${uniqueFileName}`;
    const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);
    if (error) {
        return { success: false, error };
    }
    const fileUrl = `https://${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`;
    const randomString = uniqueFileName.split("_")[1];
    return { success: true, fileUrl, randomString };
}

function generateUniqueFileName(originalFileName) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const sanitizedFileName = sanitizeFileName(originalFileName);
    return `${timestamp}_${randomString}_${sanitizedFileName}`;
}

function sanitizeFileName(fileName) {
    return fileName.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

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
        circle.addEventListener("click", () => {
            document.body.style.backgroundColor = color.colorCode;
            responses[currentQuestionIndex] = color.label;
            const buttons = document.querySelectorAll("button");
            buttons.forEach((button) => {
                button.style.backgroundColor = color.colorCode;
                button.style.color = getContrastingColor(color.colorCode);
            });
        });
        answerContainer.appendChild(circle);
    });
}

function getContrastingColor(hexColor) {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#ffffff";
}

function createArmMeasurementInputs() {
    const widthInputLabel = document.createElement("label");
    widthInputLabel.textContent = "가로 (ex. 팔 1개반):";
    const widthInput = document.createElement("input");
    widthInput.type = "text";
    widthInput.id = "width-input";
    widthInput.style.width = "350px";
    widthInput.value = responses[currentQuestionIndex]?.width || "";

    const heightInputLabel = document.createElement("label");
    heightInputLabel.textContent = "세로 (ex. 팔 4개):";
    const heightInput = document.createElement("input");
    heightInput.type = "text";
    heightInput.id = "height-input";
    heightInput.style.width = "350px";
    heightInput.value = responses[currentQuestionIndex]?.height || "";

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

    answerContainer.appendChild(widthInputLabel);
    answerContainer.appendChild(widthInput);
    answerContainer.appendChild(heightInputLabel);
    answerContainer.appendChild(heightInput);
    restorePreviousResponse();
}

function createTextInput2() {
    showButtons();
    const input = document.createElement("input");
    input.type = "text";
    input.id = "answer";
    input.placeholder = "답변을 입력하세요(없으면 없음)";
    input.value = responses[currentQuestionIndex]?.text || "";
    input.addEventListener("input", () => {
        updateResponses("text", input.value);
    });
    answerContainer.appendChild(input);
    input.style.width = "350px";
    restorePreviousResponse();
}

function createNameEmailInput() {
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "name-input";
    nameInput.placeholder = "이름을 입력해주세요";
    nameInput.style.width = "350px";
    nameInput.value = responses[currentQuestionIndex]?.name || "";
    nameInput.addEventListener("input", () => {
        responses[currentQuestionIndex] = {
            ...responses[currentQuestionIndex],
            name: nameInput.value,
        };
    });

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.id = "email-input";
    emailInput.placeholder = "이메일 주소를 입력해주세요";
    emailInput.style.width = "350px";
    emailInput.value = responses[currentQuestionIndex]?.email || "";
    emailInput.addEventListener("input", () => {
        responses[currentQuestionIndex] = {
            ...responses[currentQuestionIndex],
            email: emailInput.value,
        };
    });

    answerContainer.appendChild(nameInput);
    answerContainer.appendChild(document.createElement("br"));
    answerContainer.appendChild(emailInput);
    restorePreviousResponse();
}

const questionStatus = { answeredQuestions: new Set() };

function prepareAgeTestFadeOut(questionId) {
    hideButtons();
    const qe = document.getElementById("question");
    const hm = document.getElementById("house-magician");
    if (questionStatus.answeredQuestions.has(questionId)) {
        markQuestionAsAnswered(qe, questionId);
        displayLastQuestion();
        return;
    }
    setTimeout(() => {
        const countdownElement = document.createElement("div");
        countdownElement.id = "countdown";
        countdownElement.style.position = "absolute";
        countdownElement.style.top = "calc(50% + 100px)";
        countdownElement.style.left = "50%";
        countdownElement.style.transform = "translate(-50%, -50%)";
        countdownElement.style.fontSize = "24px";
        countdownElement.style.color = "#000";
        countdownElement.style.textAlign = "center";
        countdownElement.style.transition = "opacity 1s ease, transform 1s ease";
        document.body.appendChild(countdownElement);

        let countdown = 3;
        const interval = setInterval(() => {
            countdownElement.textContent = `${countdown}`;
            countdown--;
            if (countdown < 0) {
                clearInterval(interval);
                countdownElement.remove();
                fadeOutElements([hm, qe], () => {
                    questionStatus.answeredQuestions.add(questionId);
                    responses[questionId] = { status: "completed" };
                    markQuestionAsAnswered(qe, questionId);
                    displaySequentialQuestions();
                });
            }
        }, 1000);
    }, 2500);
}

function markQuestionAsAnswered(qe, questionId) {
    if (!questionStatus.answeredQuestions.has(questionId)) {
        questionStatus.answeredQuestions.add(questionId);
        if (qe) {
            qe.innerHTML += " <span style='color: green;'>✔</span>";
        }
    }
}

function displayLastQuestion() {
    if (questionElement) {
        questionElement.innerHTML = "조명 추천 정보 수집이 완료되었습니다. <br><br>추후 의뢰서 작성 시 반영됩니다.<br><button id='retry-button'>다시 추천받기 (1회 가능)</button>";
        const retryButton = document.getElementById("retry-button");
        if (retryButton) {
            retryButton.addEventListener("click", handleRetryClick);
        }
    }
}

function handleRetryClick() {
    if (questionElement) {
        questionElement.innerHTML = "조명 추천 서비스를 재시작합니다. <br>";
        prepareAgeTestFadeOut("retry");
    }
}

function fadeOutElements(elements, callback) {
    let completed = 0;
    const total = elements.length;
    elements.forEach((element) => {
        if (element) {
            element.style.transition = "opacity 1.5s ease";
            element.style.opacity = "0";
            setTimeout(() => {
                element.style.display = "none";
                completed++;
                if (completed === total && callback) callback();
            }, 1500);
        }
    });
}

function displaySequentialQuestions() {
    const sequentialQuestions = [
        { question: "집에서 책을 몇 권 정도 읽나요? (1달 기준)", options: ["3권 미만", "3~10권", "10권 초과"] },
        { question: "집에 친구들을 몇 번 정도 데려오나요? (1달 기준)", options: ["3번 미만", "3~10번", "10번 초과"] },
        { question: "집에 체류하는 비중이 어느 정도 되나요? (하루 24시간 기준)", options: ["30% 미만", "30% ~70%", "70% 초과"] },
        { question: "불면증과 같이 잠을 잘 자지 못하는 경우가 얼마나 되나요? (1달 기준)", options: ["거의 없음(4회 미만)", "보통임(4~10회)", "자주 그럼(11회 이상)"] }
    ];
    let currentSeqIndex = 0;
    const seqResponses = [];
    let flashingIntervalId = null;

    function applySmoothFlashingEffect(color) {
        let opacity = 0;
        let increasing = true;
        if (flashingIntervalId) clearInterval(flashingIntervalId);
        flashingIntervalId = setInterval(() => {
            if (increasing) {
                opacity += 0.02;
                if (opacity >= 0.4) increasing = false;
            } else {
                opacity -= 0.02;
                if (opacity <= 0) increasing = true;
            }
            document.body.style.backgroundImage = color.replace(/rgba\(([^,]+,[^,]+,[^,]+),[^\)]+\)/, `rgba($1, ${opacity})`);
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
            alert("모든 질문에 답변하셨습니다.");
            stopFlashingEffect();
            responses[3] = seqResponses;
            nextQuestion();
            return;
        }
        const obj = sequentialQuestions[index];
        questionElement.textContent = obj.question;
        questionElement.style.opacity = "1";
        questionElement.style.display = "block";
        answerContainer.innerHTML = "";

        obj.options.forEach((opt, i) => {
            const optionContainer = document.createElement("div");
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.id = `question-${index}-option-${i}`;
            radio.name = `question-${index}`;
            radio.value = opt;

            const label = document.createElement("label");
            label.htmlFor = `question-${index}-option-${i}`;
            label.textContent = opt;

            optionContainer.appendChild(radio);
            optionContainer.appendChild(label);
            answerContainer.appendChild(optionContainer);
        });

        const btnContainer = document.createElement("div");
        btnContainer.style.display = "flex";
        btnContainer.style.justifyContent = "space-between";
        btnContainer.style.marginTop = "20px";

        if (index > 0) {
            const prevBtn = document.createElement("button");
            prevBtn.textContent = "이전 질문으로";
            prevBtn.onclick = () => {
                currentSeqIndex--;
                showQuestion(currentSeqIndex);
            };
            btnContainer.appendChild(prevBtn);
        }

        const nextBtn = document.createElement("button");
        nextBtn.textContent = "다음 질문으로";
        nextBtn.onclick = () => {
            const selectedOption = document.querySelector(`input[name='question-${index}']:checked`);
            if (!selectedOption) {
                alert("답변을 선택해주세요.");
                return;
            }
            const val = selectedOption.value;
            seqResponses.push(val);
            if (index === 0) {
                if (val === "3권 미만") {
                    alert("책을 읽고 싶게 만드는 조명을 추천드리겠습니다!");
                    applySmoothFlashingEffect("linear-gradient(to bottom, rgba(255, 100, 100, 0.4) 0%, rgba(255, 100, 100, 0) 100%)");
                } else if (val === "3~10권") {
                    alert("과도한 자극 없이 독서 활동을 도와주는 조명을 추천드리겠습니다!");
                    applySmoothFlashingEffect("linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)");
                } else {
                    alert("피로해진 눈을 풀어주는 조명을 추천드리겠습니다!");
                    applySmoothFlashingEffect("linear-gradient(to bottom, rgba(255, 255, 0, 0.4) 0%, rgba(255, 255, 0, 0) 100%)");
                }
                small_responses.push(val);
            } else if (index === 1) {
                if (val === "3번 미만") {
                    alert("집을 소중히 여기는 마음을 반영하여 조명을 추천드립니다!");
                    applySmoothFlashingEffect("linear-gradient(to left, rgba(255, 255, 150, 0.4) 0%, rgba(255, 255, 150, 0) 100%)");
                } else if (val === "3~10번") {
                    alert("친구들이 왔을 때 편안함을 줄 수 있는 조명을 추천드립니다.");
                    applySmoothFlashingEffect("linear-gradient(to left, rgba(173, 216, 230, 0.4) 0%, rgba(173, 216, 230, 0) 100%)");
                } else {
                    alert("집 전체적으로 따뜻함을 줄 수 있는 조명을 추천드립니다.");
                    applySmoothFlashingEffect("linear-gradient(to left, rgba(255, 200, 150, 0.4) 0%, rgba(255, 200, 150, 0) 100%)");
                }
                small_responses.push(val);
            } else if (index === 2) {
                if (val === "30% 미만") {
                    alert("집에서 주로 잠을 주무시는 동안이라도 편히 쉬실 수 있는 조명을 추천드립니다.");
                    applySmoothFlashingEffect("linear-gradient(to top, rgba(255, 150, 150, 0.4) 0%, rgba(255, 150, 150, 0) 100%)");
                } else if (val === "30% ~70%") {
                    alert("집에 있는 시간 동안 편안하게 쉴 수 있는 조명을 추천드립니다");
                    applySmoothFlashingEffect("linear-gradient(to top, rgba(255, 255, 200, 0.4) 0%, rgba(255, 255, 200, 0) 100%)");
                } else {
                    alert("꽤 많은 시간을 집에서 보내시는군요. 안락한 환경을 위한 조명을 추천드립니다");
                    applySmoothFlashingEffect("linear-gradient(to top, rgba(200, 200, 200, 0.4) 0%, rgba(200, 200, 200, 0) 100%)");
                }
                small_responses.push(val);
            } else if (index === 3) {
                if (val === "거의 없음(4회 미만)") {
                    alert("불면증 없이 잘 주무신다니 좋습니다! 더욱 더 편안한 조명색을 추천드립니다.");
                    applySmoothFlashingEffect("linear-gradient(to right, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)");
                } else if (val === "보통임(4~10회)") {
                    alert("가끔 불면증이 있으시군요. 편안한 푸른빛을 추천 조명에 추가하겠습니다.");
                    applySmoothFlashingEffect("linear-gradient(to right, rgba(173, 216, 230, 0.4) 0%, rgba(173, 216, 230, 0) 100%)");
                } else {
                    alert("불면증으로 고생하시는군요. 숙면에 좋은 조명을 추천드립니다.");
                    applySmoothFlashingEffect("linear-gradient(to right, rgba(50, 100, 150, 0.4) 0%, rgba(50, 100, 150, 0) 100%)");
                }
                small_responses.push(val);
            }
            currentSeqIndex++;
            if (currentSeqIndex < sequentialQuestions.length) {
                showQuestion(currentSeqIndex);
            } else {
                alert("모든 질문에 답변하셨습니다.");
                stopFlashingEffect();
                responses[3] = seqResponses;
                nextQuestion();
            }
        };
        btnContainer.appendChild(nextBtn);

        let tlContainer = document.getElementById("top-left-buttons");
        if (!tlContainer) {
            tlContainer = document.createElement("div");
            tlContainer.id = "top-left-buttons";
            tlContainer.style.position = "absolute";
            tlContainer.style.top = "10px";
            tlContainer.style.left = "10px";
            tlContainer.style.display = "flex";
            tlContainer.style.gap = "10px";
            document.body.appendChild(tlContainer);
        }
        tlContainer.innerHTML = "";

        const resetButton = document.createElement("button");
        resetButton.textContent = "조명\n초기화";
        resetButton.style.fontSize = "80%";
        resetButton.style.transform = "scale(1.2)";
        resetButton.style.whiteSpace = "pre-wrap";
        resetButton.onclick = () => {
            resetBackgroundColor();
            const allButtons = document.querySelectorAll("button");
            allButtons.forEach((b) => {
                if (b !== resetButton) {
                    b.style.backgroundColor = "white";
                    b.style.color = "black";
                }
            });
        };
        tlContainer.appendChild(resetButton);

        const dreamlandButton = document.createElement("button");
        dreamlandButton.textContent = "꿈나라";
        dreamlandButton.style.fontSize = "80%";
        dreamlandButton.style.transform = "scale(1.2)";
        dreamlandButton.onclick = () => {
            goToDreamland();
            const allText = document.querySelectorAll("*");
            allText.forEach((el) => (el.style.color = "white"));
            const allBtns = document.querySelectorAll("button");
            allBtns.forEach((btn) => {
                btn.style.backgroundColor = "black";
                btn.style.color = "white";
            });
        };
        tlContainer.appendChild(dreamlandButton);

        answerContainer.appendChild(btnContainer);
    }
    showQuestion(currentSeqIndex);
}

function resetBackgroundColor() {
    const lightingEffects = document.querySelectorAll(".lighting-effect");
    lightingEffects.forEach((effect) => effect.remove());
    document.body.style.backgroundColor = "white";
    const allTextElements = document.querySelectorAll("*");
    allTextElements.forEach((element) => {
        element.style.color = "black";
    });
}

function goToDreamland() {
    document.body.style.backgroundColor = "black";
}

function createBudgetOptions() {
    const budgets = ["1~5만원","5~10만원","10~20만원","20~30만원","30~50만원","50만원 이상"];
    budgets.forEach((budget, i) => {
        const radioContainer = document.createElement("div");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.id = `budget-${i}`;
        radio.name = `question-${currentQuestionIndex}`;
        radio.value = budget;
        const label = document.createElement("label");
        label.htmlFor = `budget-${i}`;
        label.textContent = budget;
        if (responses[currentQuestionIndex] === budget) {
            radio.checked = true;
        }
        radio.addEventListener("change", () => {
            saveMultipleChoiceResponse(budget);
        });
        radioContainer.appendChild(radio);
        radioContainer.appendChild(label);
        answerContainer.appendChild(radioContainer);
    });
    restorePreviousResponse();
}

function restorePreviousResponse() {
    const currentResponse = responses[currentQuestionIndex];
    if (!currentResponse) return;
    if (currentQuestionIndex === 0) {
        const fileNameDisplay = document.getElementById("file-name");
        if (fileNameDisplay && typeof currentResponse === "string") {
            fileNameDisplay.textContent = `선택된 파일: ${currentResponse}`;
        }
    } else if (currentQuestionIndex === 2) {
        const widthInput = document.getElementById("width-input");
        const heightInput = document.getElementById("height-input");
        if (widthInput && heightInput && typeof currentResponse === "object") {
            widthInput.value = currentResponse.width || "";
            heightInput.value = currentResponse.height || "";
        }
    } else if (currentQuestionIndex === 5 || currentQuestionIndex === 6) {
        const input = document.getElementById("answer");
        if (input && typeof currentResponse === "object") {
            input.value = currentResponse.text || "";
        }
    } else if (currentQuestionIndex === 7) {
        const nameInput = document.getElementById("name-input");
        const emailInput = document.getElementById("email-input");
        if (nameInput && emailInput && typeof currentResponse === "object") {
            nameInput.value = currentResponse.name || "";
            emailInput.value = currentResponse.email || "";
        }
    }
}

function displayFinalMessage() {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "white";
    questionElement.textContent = "원테리어 - 서비스 안내";
    questionElement.style.color = "white";
    questionElement.style.marginTop = "-25px";
    questionElement.style.textAlign = "center";
    questionElement.style.fontSize = "24px";
    questionElement.style.fontWeight = "bold";
    questionElement.style.marginBottom = "20px";
    answerContainer.innerHTML = `
        저희 서비스를 이용해주셔서 감사합니다.<br>
        보내주신 정보들을 기반으로 인테리어 추천 결과물을 보내드리겠습니다.<br><br>
        1~3일 내로 결과물이 입력하신 이메일로 전송됩니다! <br>

        해당 결과물에 대한 수정은 1회 가능합니다! <br><br>
        수정을 원하실 경우 저희 인스타 DM으로 수정 요청을 부탁드리겠습니다.<br>
        인스타 ID: 1terior_<br><br>
        낮은 가격에 큰 기쁨을 드리도록 노력하는 원테리어가 되도록 노력하겠습니다. <br>
        감사합니다.
    `;
    answerContainer.style.color = "white";
    answerContainer.style.textAlign = "center";
    answerContainer.style.margin = "0 auto";
    answerContainer.style.width = "100%";
    answerContainer.style.lineHeight = "1.8";
}

window.nextQuestion = async function () {
    let answer;
    if (currentQuestionIndex === 0) {
        const fileInput = document.getElementById("file-answer");
        if (!fileInput || fileInput.files.length === 0) {
            alert("파일을 선택하세요.");
            return;
        }
    } else if (currentQuestionIndex === 1) {
        answer = responses[currentQuestionIndex];
        if (!answer) {
            alert("원(색상)을 클릭해주세요.");
            return;
        }
    } else if ([2, 4, 6].includes(currentQuestionIndex)) {
        answer = responses[currentQuestionIndex];
        if (!answer) {
            alert("답변을 입력하세요.");
            return;
        }
    } else if (currentQuestionIndex === 3) {
    } else if (currentQuestionIndex === 5) {
        answer = responses[currentQuestionIndex];
        if (!answer) {
            alert("예산을 선택해주세요.");
            return;
        }
    } else if (currentQuestionIndex === 7) {
        const nameInput = document.getElementById("name-input");
        const emailInput = document.getElementById("email-input");
        if (!nameInput.value.trim() || !emailInput.value.trim()) {
            alert("이름과 이메일을 모두 입력해주세요.");
            return;
        }
    }
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        updateQuestion();
    } else {
        const payload = {
            house: responses[0],
            color: responses[1],
            measurement: responses[2],
            lightRecommendation: responses[3],
            furniture: responses[4],
            budget: responses[5],
            additional_request: responses[6],
            user_info: responses[7]
        };
        const { data, error } = await supabase.from("survey_responses").insert([payload]);
        if (error) {
            alert("설문 저장 중 문제가 발생했습니다.");
        } else {
            window.location.href = "Complete.html";
        }
    }
};

window.previousQuestion = function () {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        updateQuestion();
    }
};

updateQuestion();