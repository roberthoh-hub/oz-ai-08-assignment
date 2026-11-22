# HTML 태그 정리

## 1. 기본 구조 (Base)

HTML 문서는 크게 `head`와 `body` 두 부분으로 나뉜다.

| 영역 | 역할 | 화면에 보이나? |
|---|---|---|
| `<head>` | 페이지 정보(메타데이터): 제목, 문자 인코딩 등 | ❌ (제목은 브라우저 탭에만 표시) |
| `<body>` | 실제 내용물: 글, 이미지, 표, 폼 등 | ✅ |

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">                                                  <!-- 한글 깨짐 방지 -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  <!-- 모바일 화면 맞춤 -->
    <title>Document</title>                                                 <!-- 브라우저 탭 이름 -->
</head>
<body>
    <!-- 여기에 내용 작성 -->
</body>
</html>
```

> 💡 VS Code에서 `!` 입력 후 `Tab` → 기본 구조 자동 생성

---

## 2. 제목과 문단 (Heading / Paragraph)

| 태그 | 의미 | 마크다운으로 치면 |
|---|---|---|
| `<h1>` | 가장 큰 제목 (header 1) | `#` |
| `<h2>` | 두 번째 제목 (header 2) | `##` |
| `<h3>` ~ `<h6>` | 점점 작은 제목 | `###` ~ `######` |
| `<p>` | 문단 (paragraph) | 빈 줄로 문단 구분 |

```html
<h1>큰 제목</h1>
<h2>작은 제목</h2>
<p>이것은 하나의 문단입니다.</p>
```

---

## 3. 링크 (Anchor, `<a>`)

anchor = 닻. 다른 페이지로 연결하는 태그.

```html
<a href="https://www.google.com">구글</a>로 이동
```

- `href` : 이동할 주소
- 태그 사이 글자(`구글`) : 화면에 보이는 클릭할 글자

---

## 4. 이미지 (`<img>`)

```html
<img src="./파일명.png" alt="부가설명">
```

- `src` : 이미지 파일 경로
- `alt` : 이미지가 안 뜰 때 대신 보이는 설명 (시각장애인용 화면 낭독에도 사용)
- 닫는 태그(`</img>`)가 **없다**

---

## 5. 리스트 (List)

| 태그 | 의미 | 표시 모양 |
|---|---|---|
| `<ul>` | 순서 없는 리스트 (unordered list) | • 점 |
| `<ol>` | 순서 있는 리스트 (ordered list) | 1. 2. 3. |
| `<li>` | 리스트의 각 항목 (list item) | — |

```html
<ul>
    <li>사과</li>
    <li>바나나</li>
</ul>

<ol>
    <li>첫 번째</li>
    <li>두 번째</li>
</ol>
```

---

## 6. 표 (Table)

| 태그 | 의미 |
|---|---|
| `<table>` | 표 전체 |
| `<thead>` | 머리글 영역 (제목 줄) |
| `<tbody>` | 본문 영역 (데이터 줄) |
| `<tr>` | 한 줄 (table row) |
| `<th>` | 제목 칸 (table header) — 굵게 표시 |
| `<td>` | 데이터 칸 (table data) |

```html
<table>
    <thead>
        <tr>
            <th>이름</th>
            <th>나이</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>홍길동</td>
            <td>20</td>
        </tr>
    </tbody>
</table>
```

> 💡 Emmet으로 빠르게 만들기: `table>thead>tr>th*3^^tbody>tr*2>td*3` 입력 후 `Tab`
> - `>` 안쪽으로 · `*` 반복 · `^` 바깥으로 · `+` 옆에

---

## 7. 폼 (Form)

사용자에게 데이터를 입력받는 양식. 예: 네이버 검색창 만들기

```html
<form action="https://search.naver.com/search.naver">
    <input type="search" name="query" placeholder="최신 뉴스를 검색해보세요">
    <button type="submit">입력</button>
</form>
```

| 부분 | 역할 |
|---|---|
| `action` | 입력값을 보낼 주소 |
| `name="query"` | 보낼 때 붙는 이름 → 주소가 `...search.naver?query=검색어`가 됨 |
| `placeholder` | 입력칸에 흐리게 보이는 안내 문구 |
| `type="submit"` | 누르면 폼을 제출하는 버튼 |

> ⚠️ 실수 주의
> - `action="..."` 에서 `=` 빠뜨리지 않기
> - `name`은 사이트마다 다름 (네이버 `query`, 구글 `q`)

---

## 부록: 마크다운에 코드 넣기

코드는 백틱 3개로 감싸고, 언어 이름을 붙이면 색이 입혀진다.

````markdown
```python
print("hello")
```
````

> ⚠️ 마크다운 파일에서 `<ul>`, `<table>` 같은 태그를 그냥 쓰면 **태그로 실행돼서 글자가 사라진다.**
> 설명용으로 쓸 때는 `` `<ul>` ``처럼 백틱으로 감싸거나 코드 블록 안에 넣기.
