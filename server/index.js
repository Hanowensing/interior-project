const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');  // CORS 모듈을 임포트
const cors = require('cors');

// Supabase 연결
const supabaseUrl = 'https://novdkgavamxornckjcjm.supabase.co';  // Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmRrZ2F2YW14b3JuY2tqY2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MzcwMjIsImV4cCI6MjA0NzQxMzAyMn0.sCmU9tJ-NA4Y-nd6q9TYu4chqLFX1EP2ssqb4xRhJ7E';  // Supabase API 키
const supabase = createClient(supabaseUrl, supabaseKey);

// 서버 설정
const app = express();
const port = 3000;

// CORS 설정: 모든 도메인에서의 요청을 허용
app.use(cors({
  origin: '*',  // 모든 도메인에서 접근 허용
}));

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
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// 설문 응답 저장 API
app.post('/submit-survey', async (req, res) => {
    const response = req.body;  // 클라이언트에서 보낸 설문 응답

    // Supabase에 데이터 삽입
    try {
        const { data, error } = await supabase
            .from('survey_responses')  // 'survey_responses' 테이블 이름 확인
            .insert([response]);  // 설문 데이터를 배열로 전달

        if (error) {
            console.error('Error saving to Supabase:', error.message);
            return res.status(500).json({
                message: 'Failed to save response to Supabase',
                error: error.message
            });
        }

        console.log('Response saved to Supabase:', data);
        res.status(200).json({ message: 'Survey response saved successfully!', data: data });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


