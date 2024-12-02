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
        const response = await fetch('https://interior-projecs.onrender.com/submit-survey', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mappedAnswers),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('응답이 성공적으로 저장되었습니다:', result);
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
