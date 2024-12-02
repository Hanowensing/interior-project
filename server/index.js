const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg'); // PostgreSQL 클라이언트
require('dotenv').config(); // 환경 변수 로드

const app = express();
app.use(bodyParser.json());

// PostgreSQL 연결 설정
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // 환경 변수로 설정된 DB URL
    ssl: {
        rejectUnauthorized: false, // SSL 인증 무시 (Render에서 필요)
    },
});

// POST 요청을 처리하여 설문 데이터 저장
app.post('/submit-survey', async (req, res) => {
    const answers = req.body;

    try {
        // DB에 데이터 삽입
        await pool.query(
            `INSERT INTO survey_responses (house, gender, age, favorite_color, budget, submitted)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
                answers.house,
                answers.gender,
                answers.age,
                answers.favorite_color,
                answers.budget,
                answers.submitted,
            ]
        );
        res.status(200).send({ message: 'Data saved successfully!' });
    } catch (err) {
        console.error('Database insert error:', err);
        res.status(500).send({ message: 'Database error!' });
    }
});

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
