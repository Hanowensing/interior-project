const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// 정적 파일 제공 (client 폴더 내 HTML, CSS, JS 파일 등)
app.use(express.static(path.join(__dirname, '../client')));

// JSON 요청 파싱 설정
app.use(bodyParser.json());

// 응답 저장 파일 경로 설정
const responsesFile = path.join(__dirname, 'responses.json');

// 초기화: 저장 파일이 없으면 빈 배열로 초기화
if (!fs.existsSync(responsesFile)) {
    fs.writeFileSync(responsesFile, JSON.stringify([]), 'utf8');
}

// 기본 라우트 (서버 상태 확인용)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'survey.html'));
});

// 설문 응답 저장 API
app.post('/submit-survey', (req, res) => {
    const response = req.body;

    // 저장된 응답 읽기
    let responses = [];
    try {
        const data = fs.readFileSync(responsesFile, 'utf8');
        responses = JSON.parse(data);
    } catch (error) {
        console.error('Error reading responses file:', error);
    }

    // 새로운 응답 추가
    responses.push(response);

    // 파일에 저장
    try {
        fs.writeFileSync(responsesFile, JSON.stringify(responses, null, 2), 'utf8');
        console.log('New response saved:', response);
        res.status(200).send({ message: 'Survey response saved successfully!' });
    } catch (error) {
        console.error('Error writing responses file:', error);
        res.status(500).send({ message: 'Failed to save response.' });
    }
});

// 설문 완료 후 페이지 제공
app.get('/complete.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'complete.html'));
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
