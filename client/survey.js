const express = require('express');
const bodyParser = require('body-parser');
const { db } = require('replit');  // Replit DB 사용
const cors = require('cors');  // CORS 모듈

const app = express();
const port = process.env.PORT || 3000;

// CORS 설정: 모든 도메인에서의 요청을 허용
app.use(cors());

// JSON 요청 파싱 설정
app.use(bodyParser.json());

// 설문 응답 저장 API
app.post('/submit-survey', async (req, res) => {
    const response = req.body;  // 클라이언트에서 보낸 설문 응답

    // Replit DB에 설문 응답 저장
    try {
        const currentResponses = await db.get('survey_responses') || [];  // 기존 응답을 가져오고 없으면 빈 배열로 초기화
        currentResponses.push(response);  // 새 응답 추가

        await db.set('survey_responses', currentResponses);  // Replit DB에 저장

        console.log('Response saved to Replit DB:', response);
        res.status(200).json({ message: 'Survey response saved successfully!', data: response });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

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
