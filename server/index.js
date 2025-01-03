const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');  // 파일 시스템 모듈
const path = require('path');

const app = express();
app.use(express.json());  // JSON 데이터를 자동으로 파싱

// Supabase URL과 키
const supabaseUrl = 'https://fvoauhyvsyntgjepkqgk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2b2F1aHl2c3ludGdqZXBrcWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMDE2NzcsImV4cCI6MjA0ODc3NzY3N30.PzyKXN_ni8GTz7hAJsoGfGgCxmShwvQ4VZwdyf5k6Go';

const supabase = createClient(supabaseUrl, supabaseKey);

// 정적 파일 제공 (client 폴더의 index.html과 기타 파일들)
app.use(express.static(path.join(__dirname, '../client')));

// 홈 경로 (GET 요청)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// 설문 응답 데이터 삽입 API
app.post('/submit-survey', async (req, res) => {
    const answers = req.body;

    // 클라이언트가 데이터를 제대로 보내지 않았을 때 오류 처리
    if (!answers.house || !answers.gender || !answers.age || !answers.favorite_color || !answers.budget) {
        return res.status(400).send({ message: '모든 필드를 입력해주세요.' });
    }

    // 응답 데이터를 responses.json에 저장
    const filePath = path.join(__dirname, 'responses.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('파일 읽기 오류:', err);
            return res.status(500).send({ message: '파일 읽기 오류' });
        }

        let responses = [];
        if (data) {
            try {
                responses = JSON.parse(data);  // 기존 응답 데이터 읽기
            } catch (e) {
                console.error('JSON 파싱 오류:', e);
            }
        }

        responses.push(answers);  // 새 응답 추가

        // 파일에 응답 데이터를 저장
        fs.writeFile(filePath, JSON.stringify(responses, null, 2), (err) => {
            if (err) {
                console.error('파일 쓰기 오류:', err);
                return res.status(500).send({ message: '파일 쓰기 오류' });
            }

            res.status(200).send({ message: 'Data saved successfully!' });  // 응답 성공
        });
    });
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
