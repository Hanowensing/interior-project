const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase 연결
const supabaseUrl = 'https://novdkgavamxornckjcjm.supabase.co';  // Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5vdmRrZ2F2YW14b3JuY2tqY2ptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE4MzcwMjIsImV4cCI6MjA0NzQxMzAyMn0.sCmU9tJ-NA4Y-nd6q9TYu4chqLFX1EP2ssqb4xRhJ7E';  // Supabase API 키
const supabase = createClient(supabaseUrl, supabaseKey);

// 서버 설정
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
app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`);
    await saveResponsesToSupabase();  // 서버 시작 시 응답을 Supabase에 저장
});

// 응답을 Supabase에 저장하는 함수
async function saveResponsesToSupabase() {
    const responses = JSON.parse(fs.readFileSync(responsesFile, 'utf8'));

    // 응답 데이터를 Supabase 테이블에 맞게 변환
    const transformedResponses = responses.map(response => ({
        house: response["당신의 집을 알려주세요"],  // 이름 대신 house 필드로 변환
        gender: response["성별을 알려주세요:"],    // "성별을 알려주세요:" -> "gender"
        age: response["나이를 알려주세요:"],      // "나이를 알려주세요:" -> "age"
        favorite_color: response["좋아하는 색을 알려주세요:"], // "좋아하는 색을 알려주세요:" -> "favorite_color"
        budget: response["예산을 알려주세요:"],    // "예산을 알려주세요:" -> "budget"
    }));

    // 변환된 응답 데이터 삽입
    for (const response of transformedResponses) {
        const { data, error } = await supabase
            .from('survey_responses')
            .insert([response]);

        if (error) {
            console.error('Error saving response to Supabase:', error);
        } else {
            console.log('Response saved to Supabase:', data);
        }
    }
}
