const express = require('express');
const app = express();
const port = 3000;

// 정적 파일 제공 (client 폴더 내 HTML, CSS, JS 파일 등)
app.use(express.static('client'));

app.get('/', (req, res) => {
    res.send('Survey Server is running');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
