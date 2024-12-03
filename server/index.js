const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(bodyParser.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseKey);

// 루트 경로 처리
app.get('/', (req, res) => {
    res.send('Welcome to the Survey Project!');
});

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
