const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const supabaseUrl = process.env.SUPABASE_URL; // 환경 변수에서 Supabase URL 가져오기
const supabaseKey = process.env.SUPABASE_KEY; // 환경 변수에서 Supabase 키 가져오기

// Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseKey);

// 데이터 삽입 테스트 함수
async function insertSurveyResponse() {
    const { data, error } = await supabase
        .from('survey_responses') // 테이블 이름
        .insert([{
            house: '아파트',
            gender: '남성',
            age: 30,
            favorite_color: '파랑',
            budget: 1000000,
        }]);

    if (error) {
        console.error('Error inserting data:', error);
    } else {
        console.log('Data inserted successfully:', data);
    }
}

// 함수 호출
insertSurveyResponse();

// 설문 응답 데이터 삽입 API
app.post('/submit-survey', async (req, res) => {
    const answers = req.body;

    try {
        const { data, error } = await supabase
            .from('survey_responses')
            .insert([{
                house: answers.house,
                gender: answers.gender,
                age: answers.age,
                favorite_color: answers.favorite_color,
                budget: answers.budget,
            }]);

        if (error) {
            console.error('Error inserting data:', error);
            return res.status(500).send({ message: 'Database insert error!' });
        }

        res.status(200).send({ message: 'Data saved successfully!', data });
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).send({ message: 'Server error!' });
    }
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
