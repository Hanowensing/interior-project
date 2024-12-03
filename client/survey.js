async function saveAnswers() {
    // 기존 응답 데이터를 Local Storage에서 가져옴
    let savedResponses = JSON.parse(localStorage.getItem('surveyAnswers')) || [];
    savedResponses.push(answers); // 새로운 응답 추가
    localStorage.setItem('surveyAnswers', JSON.stringify(savedResponses)); // Local Storage에 저장

    // 질문-필드 매핑 정의
    const fieldMapping = {
        "당신의 집을 알려주세요": "house",
        "성별을 알려주세요:": "gender",
        "나이를 알려주세요:": "age",
        "좋아하는 색을 알려주세요:": "favorite_color",
        "예산을 알려주세요:": "budget",
        "제출하시겠습니까?": "submitted"
    };

    // 매핑된 키로 데이터 변환
    const mappedAnswers = {};
    for (let question in answers) {
        const mappedKey = fieldMapping[question] || question; // 매핑되지 않은 키는 그대로 사용
        mappedAnswers[mappedKey] = answers[question];
    }

    // Supabase로 데이터 전송
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
