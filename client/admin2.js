// 로컬 스토리지에서 설문 응답 가져오기
const responses = JSON.parse(localStorage.getItem('surveyAnswers')) || null;

if (!responses) {
    document.getElementById('surveyResponses').innerHTML = '<p>응답이 없습니다.</p>';
} else {
    // 응답이 있을 경우 출력
    let responseText = '<ul>';
    for (let question in responses) {
        responseText += `
            <li><strong>${question}</strong>: ${responses[question]}</li>
        `;
    }
    responseText += '</ul>';

    document.getElementById('surveyResponses').innerHTML = responseText;
}
