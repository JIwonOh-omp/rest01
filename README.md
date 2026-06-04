# 오지원 개인 이력서 웹사이트

**rest01** — 개인 이력서를 보여주는 반응형 정적 웹사이트입니다.

## 파일 구조

```
rest01/
├── index.html      # 메인 페이지 (섹션별 이력서)
├── style.css       # 스타일
├── script.js       # 스크롤 애니메이션 / 네비게이션
├── images/
│   └── photo.jpg   # 프로필 사진 (직접 업로드)
└── README.md
```

## 콘텐츠 수정 방법

`index.html` 에서 아래 항목을 채워주세요:

| 항목 | 위치 | 내용 |
|------|------|------|
| 프로필 사진 | `images/photo.jpg` | 본인 사진 파일 업로드 |
| 이메일 / 전화 | `.contact-bar` | 실제 연락처로 변경 |
| 한 줄 소개 | `.tagline` | 직함 또는 슬로건 |
| 자기소개 | `#about` 섹션 | 본인 소개 문단 |
| 기술 스택 | `#skills` 섹션 | 사용 기술 태그 |
| 경력 | `#experience` 섹션 | 회사, 기간, 업무 |
| 학력 | `#education` 섹션 | 학교, 학과, 기간 |
| 프로젝트 | `#projects` 섹션 | 프로젝트 카드 |
| 자격증 | `#certifications` 섹션 | 자격증 목록 |

## 로컬 실행

`index.html` 파일을 브라우저에서 직접 열거나,
VS Code Live Server 확장을 사용하면 됩니다.

## 색상 커스터마이징

`style.css` 상단의 CSS 변수만 바꾸면 전체 테마가 변경됩니다.

```css
:root {
  --primary:    #4F8FFF;   /* 메인 색상 */
  --accent:     #06B6D4;   /* 포인트 색상 */
}
```
