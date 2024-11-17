document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 기본 폼 제출 방지

    // 입력 값 가져오기
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // 로그인 정보 확인
    if (username === 'hhj1627' && password === 'han003400!') {
        // 로그인 성공 시, admin2.html로 이동
        window.location.href = 'admin2.html'; // admin2.html로 리디렉션
    } else {
        // 로그인 실패 시 에러 메시지 표시
        document.getElementById('error-message').style.display = 'block';
    }
});
