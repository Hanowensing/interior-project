async function saveAnswers() {
    let savedResponses = JSON.parse(localStorage.getItem('surveyAnswers')) || [];
    savedResponses.push(answers);
    localStorage.setItem('surveyAnswers', JSON.stringify(savedResponses));

    // 각 질문에 대한 매핑을 정의
    const fieldMapping = {
        "당신의 집을 알려주세요": "house",
        "성별을 알려주세요:": "gender",
        "나이를 알려주세요:": "age",
        "좋아하는 색을 알려주세요:": "favorite_color",
        "예산을 알려주세요:": "budget",
        "제출하시겠습니까?": "submitted"
    };

    // 질문을 매핑된 키로 변환
    const mappedAnswers = {};
    for (let question in answers) {
        const mappedKey = fieldMapping[question] || question;
        mappedAnswers[mappedKey] = answers[question];
    }

    // 설문 데이터 서버로 전송
    try {
        const response = await fetch('/submit-survey', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mappedAnswers),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('응답이 성공적으로 저장되었습니다:', result);
        } else {
            console.error('서버 오류:', await response.text());
        }
    } catch (error) {
        console.error('네트워크 오류:', error);
    }
}

// 설문 응답 조회 API
app.get('/survey-responses', async (req, res) => {
    try {
        const responses = await db.get('survey_responses');  // Replit DB에서 응답 불러오기
        res.status(200).json(responses);  // 응답 반환
    } catch (error) {
        console.error('Error fetching survey responses:', error);
        res.status(500).json({ message: 'Failed to fetch survey responses', error: error.message });
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
