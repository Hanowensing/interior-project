// 로컬스토리지에서 모든 설문 응답을 가져오기
const responses = JSON.parse(localStorage.getItem('surveyAnswers')) || [];

if (responses.length === 0) {
    document.getElementById('surveyResponses').innerHTML = '<p>응답이 없습니다.</p>';
} else {
    let responseText = '<ul>';
    responses.forEach((response, index) => {
        responseText += `<li><strong>응답 ${index + 1}</strong><ul>`;
        for (let question in response) {
            responseText += `<li><strong>${question}</strong>: ${response[question]}</li>`;
        }
        responseText += '</ul></li>';
    });
    responseText += '</ul>';

    document.getElementById('surveyResponses').innerHTML = responseText;
}
