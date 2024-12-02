const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { db } = require('replit');  // Replit DB 사용
const cors = require('cors');  // CORS 모듈을 한 번만 임포트

// 서버 설정
const app = express();
const port = 3000;

// 정적 파일 제공 (client 폴더 내 HTML, CSS, JS 파일 등)
app.use(express.static(path.join(__dirname, '../client')));

// JSON 요청 파싱 설정
app.use(bodyParser.json());

// CORS 설정: 모든 도메인에서의 요청을 허용
app.use(cors());

// 응답 저장 파일 경로 설정
const responsesFile = path.join(__dirname, 'responses.json');

// 초기화: 저장 파일이 없으면 빈 배열로 초기화
if (!fs.existsSync(responsesFile)) {
    fs.writeFileSync(responsesFile, JSON.stringify([]), 'utf8');
}

// 기본 라우트 (서버 상태 확인용)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// 설문 응답 저장 API
app.post('/submit-survey', async (req, res) => {
    const response = req.body;  // 클라이언트에서 보낸 설문 응답

    // Replit DB에 설문 응답 저장
    try {
        // 응답을 'survey_responses'라는 키로 저장 (중복 방지를 위해 유니크한 키를 사용할 수도 있음)
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

// 서버 실행
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
