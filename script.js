// 애니메이션을 실행하는 함수
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate'); // 'animate' 클래스를 가진 모든 요소 선택
    const triggerBottom = window.innerHeight * 0.85; // 화면 하단 85% 지점에서 애니메이션 실행

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top; // 요소의 위치 계산
        if (elementTop < triggerBottom) {
            element.classList.add('visible'); // 화면에 보이면 'visible' 클래스를 추가
        } else {
            element.classList.remove('visible'); // 화면에 보이지 않으면 'visible' 클래스를 제거
        }
    });
}

// 스크롤 및 페이지 로드 시 애니메이션 실행
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// 색상 변경 이벤트
document.getElementById("darkGray").addEventListener("click", function() {
    document.body.style.backgroundColor = "#2E2E2E"; // 다크 그레이 색상
});

document.getElementById("deepBrown").addEventListener("click", function() {
    document.body.style.backgroundColor = "#4B2F1A"; // 딥 브라운 색상
});

document.getElementById("warmBrown").addEventListener("click", function() {
    document.body.style.backgroundColor = "#7F4B3B"; // 웜 브라운 색상
});

document.getElementById("navy").addEventListener("click", function() {
    document.body.style.backgroundColor = "#000033"; // 네이비 색상
});

// 마지막 색상을 #4B3D33으로 변경
document.getElementById("deepBrown").addEventListener("click", function() {
    document.body.style.backgroundColor = "#4B2F1A"; // 기존 색상 딥 브라운으로 설정
});

// 관리자 페이지로 이동하는 버튼 이벤트 추가
document.getElementById("adminButton").addEventListener("click", function() {
    location.href = 'admin.html'; // 관리자 페이지로 이동
});
