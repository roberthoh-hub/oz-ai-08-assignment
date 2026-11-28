# 실시간 암호화폐 가격 추적기는 어떻게 동작할까?
### 11/27 수업 노트(`ryunghoh_class_1127.md`)와 `claude_product` 코드 연결하기

> **이런 분께:** 이틀 동안 DOM, 이벤트, 타이머, Storage, Fetch를 배워서 하나씩은 이해했지만, 이것들이 어떻게 합쳐져 하나의 앱이 되는지는 아직 잘 안 보이는 분.
>
> **핵심:** 이 추적기에 새로운 마법은 없습니다. **수업에서 배운 Web API 5가지**(DOM, Event, Timer, Storage, Fetch)에 배열 도구 몇 개를 더해 조합한 것입니다. 어느 부분이 어떤 일을 맡는지 보이면 코드가 읽힙니다.

---

## 0. 먼저 전체 그림

수업 노트에는 브라우저가 제공하는 Web API가 나와 있습니다.

> DOM API · EVENT API · Timer API · Storage API · Fetch API

이 앱은 **다섯 가지를 모두** 쓰고, 각자 맡은 일이 하나씩 있습니다.

| Web API (수업 내용) | 추적기에서 맡은 일 | `script.js`의 위치 |
|---|---|---|
| **Timer API** – `setInterval` | 1초마다 서버에 요청 | 맨 마지막 줄 |
| **Fetch API** – `fetch().then()` | 바이낸스에서 시세 데이터 받기 | `loadCoins()` |
| **DOM API** – `createElement`, `appendChild`, `textContent` | 화면에 표 그리기 | `render()` |
| **Event API** – `addEventListener` | 별·탭 클릭, 검색창 입력에 반응 | `starBtn`, `tabAll`, `tabFav`, `searchInput` |
| **Storage API** – `localStorage` | 새로고침해도 관심 종목 기억 | `getFavorites()`, `toggleFavorite()` |

### 1초 동안 일어나는 일

```
 setInterval (1000ms마다)
        │
        ▼
 loadCoins() ──fetch──► 바이낸스 서버
        │                    │
        │  (브라우저가 약 90ms 기다리는 동안 │ 화면은 계속 사용 가능)
        │ ◄──── JSON ─────────┘
        ▼
 filter: "USDT" 심볼만 남김  →  coins에 저장
        │
        ▼
 render()  ── 읽기 ──►  coins + localStorage(관심목록) + 검색어 + 현재 탭
        │
        ▼
 createElement / appendChild로 <tr><td>… 행 생성  →  화면에 표가 보임
```

그리고 이와 별도로, **사용자가 무언가를 하면**:

```
 ☆ 클릭      → toggleFavorite() → localStorage 수정 → render()
 탭 클릭     → changeTab()      → currentTab 변경   → render()
 검색어 입력 → render()
```

**포인트:** 거의 모든 동작이 마지막에 `render()`를 부릅니다. 이것이 설계의 핵심입니다. *먼저 데이터를 바꾸고, 그 데이터로 화면을 다시 그린다.*

---

## 1. HTML: 빈자리 준비하기

수업 노트의 쿠팡 예시:

> "html상에는 이름이 들어갈 자리만 만들어놓습니다. 로그인 후에 그 이름을 채워주기만 합니다."

추적기도 똑같습니다. `index.html`에는 JavaScript가 나중에 채울 **빈 그릇**만 있습니다.

```html
<span id="updateTime">데이터 불러오는 중...</span>   <!-- 갱신 시각이 들어갈 자리 -->
<span id="countInfo"></span>                         <!-- "815개 종목"이 들어갈 자리 -->
<tbody id="tableBody"></tbody>                       <!-- 표의 행이 들어갈 자리 -->
```

HTML에는 **코인 데이터가 하나도 없습니다.** 가격은 1초마다 바뀌니 HTML에 적어 둘 수가 없습니다. 쿠팡이 사용자마다 HTML을 만들지 않는 것과 같은 이유입니다.

`<script src="./script.js">`는 **`<body>` 맨 끝**에 있습니다. 그래야 스크립트가 `querySelector`를 실행할 때 HTML 요소들이 이미 만들어져 있습니다.

---

## 2. 요소 찾기: `querySelector` (DOM API)

**수업 노트:**
```js
const h1 = document.querySelector("h1");
```
> `.msg` `#msg` 또는 그냥 `h1`을 불러올 수도 있습니다.

**추적기:**
```js
const tabAll      = document.querySelector("#tabAll");
const searchInput = document.querySelector("#searchInput");
const tableBody   = document.querySelector("#tableBody");
```

`#`은 "id로 찾기"라는 뜻입니다. 맨 위에서 **한 번만** 찾아서 `const`에 담아 두고, 아래 코드 전체에서 씁니다.

---

## 3. 데이터 받아오기: `fetch().then()` (Fetch API)

**수업 노트:**
```js
fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(data => console.log(data))
```

**추적기 (`loadCoins`):**
```js
fetch(API_URL)
    .then(response => response.json())   // ① 응답을 JS 배열로 변환
    .then(data => {                       // ② 그 배열을 사용
        coins = data.filter(coin => coin.symbol.includes("USDT"));
        ...
        render();
    })
```

**패턴이 완전히 같습니다.** 달라진 것은 URL과 `data`로 하는 일뿐입니다.

### `data`는 어떻게 생겼을까?
수업의 `posts`처럼 `data`는 **객체들이 담긴 배열**입니다. 항목 하나는 이렇게 생겼습니다(설계 PDF에 전체 모양이 있습니다).

```js
{
  symbol: "BTCUSDT",
  lastPrice: "61773.18000000",      // 현재가
  priceChangePercent: "1.410",      // 24시간 변동률
  highPrice: "62248.91000000",      // 최고가
  lowPrice: "59915.00000000",       // 최저가
  ...
}
```

수업에서는 `post["title"]`이라고 썼고, 여기서는 `coin.symbol`, `coin.lastPrice`라고 씁니다. **`coin.symbol`과 `coin["symbol"]`은 같은 뜻**이고, 점(.)이 더 짧을 뿐입니다.

### 비동기: 왜 `then`을 쓸까?
수업 내용: 동기식 코드는 Python의 `add(1, 2)`처럼 한 단계가 끝날 때까지 기다립니다. `fetch`는 **비동기식**이라 요청을 보내고 **바로 다음 줄로 넘어갑니다.** `.then(...)` 안의 코드는 답이 도착한 **나중에** 실행됩니다. 그래서 `render()`를 `.then` **안에서** 부릅니다. 밖에 두면 데이터가 오기도 전에 실행됩니다.

### 추가된 두 가지 (아직 수업에 없던 내용)
```js
.catch(error => { updateTime.textContent = "데이터를 불러오지 못했습니다..."; })
.finally(() => { isLoading = false; });
```
- `.catch`는 **실패했을 때만** 실행됩니다(예: 인터넷 끊김). 이게 없으면 실패해도 아무 표시가 없습니다.
- `.finally`는 성공하든 실패하든 **항상** 실행됩니다.

---

## 4. 데이터 고르기: `filter`와 `includes` (새 내용이지만 간단)

수업에서는 `posts.slice(start, end)`로 **범위**를 잘라 냈습니다. 여기서는 **조건**으로 골라야 해서 `filter`를 씁니다.

```js
coins = data.filter(coin => coin.symbol.includes("USDT"));
```

이렇게 읽으면 됩니다. *"`data`에서 `symbol`에 "USDT"라는 글자가 들어 있는 `coin`만 남겨라."*

| 도구 | 답하는 질문 | 예 |
|---|---|---|
| `slice(0, 5)` (수업) | "0~4번 항목 줘" | 앞의 게시글 5개 |
| `filter(조건)` | "이 조건을 통과한 항목만 줘" | USDT 코인만 |
| `"BTCUSDT".includes("USDT")` | "이 글자 안에 저 글자가 있나?" | `true` |

`filter`는 앱에서 **세 번** 쓰이고, 쓸 때마다 목록이 조금씩 좁아집니다.
1. USDT 코인만 (요구사항 1)
2. 관심항목 탭이면 관심 종목만 (요구사항 3-3)
3. 검색어와 맞는 심볼만 (요구사항 2)

---

## 5. 1초마다 반복: `setInterval` (Timer API)

**수업 노트:**
```js
const timerId = setInterval(
    () => console.log("1분 경과!"),
    1000*60
);
```

**추적기 (마지막 두 줄):**
```js
loadCoins();                    // 페이지가 열리자마자 1회 실행
setInterval(loadCoins, 1000);   // 이후 1000ms = 1초마다 실행
```

- 왜 `loadCoins()`를 먼저 한 번 따로 부를까요? `setInterval`은 첫 실행 **전에** 1초를 기다립니다. 첫 줄이 없으면 1초 동안 화면이 비어 있습니다. 수업의 "버튼을 누르지 않아도 새로고침하자마자 상품 5개를 보여주기"(쿠팡 예시)에서 `loadPosts();`를 바로 부른 것과 같은 이유입니다.
- `loadCoins()`가 **아니라** `setInterval(loadCoins, 1000)`입니다. 노트의 이벤트 부분에 *"함수 자체가 들어와야 합니다. `clickButton()`이 아니라 `clickButton`"* 이라고 적혀 있죠. 타이머도 같은 규칙입니다. `loadCoins()`라고 쓰면 그 자리에서 한 번 실행하고 그 *결과*(아무것도 없음)를 타이머에 넘기게 됩니다.

### `isLoading` 안전장치
```js
if (isLoading) return;   // 수업 노트의 Early-Return!
isLoading = true;
```
서버가 1초보다 느려지면 이전 요청이 끝나기 전에 새 요청이 시작돼 요청이 쌓입니다. 이 **early return**(노트의 `if (input.value.trim() === "") { ...; return }`과 같은 패턴)으로, 이전 요청이 아직 진행 중이면 이번 차례를 건너뜁니다.

---

## 6. 표 그리기: `createElement` → `textContent` → `appendChild` (DOM API)

**수업 노트:**
```js
const p = document.createElement("p");
p.textContent = "paragraph";
document.body.appendChild(p);
```
그리고 `fetch.html`에서:
```js
list.innerHTML = "";
for (const post of posts.slice(0,5)) {
    const li = document.createElement("li");
    li.textContent = post["title"];
    list.appendChild(li)
}
```

**추적기 (`render`)** 는 이것을 한 단계 더 깊게 한 것입니다. 표의 행 안에는 칸(셀)이 들어갑니다.

```js
tableBody.innerHTML = "";                       // ① 표 비우기 (중복 방지)

for (const coin of rows) {                      // ② 반복 한 번 = 코인 하나
    const tr = document.createElement("tr");    // ③ 행 만들기

    const symbolTd = document.createElement("td");  // ④ 칸 만들기
    symbolTd.textContent = coin.symbol;             //    글자 넣기
    tr.appendChild(symbolTd);                       //    칸을 행에 넣기

    // ... 현재가, 변동률, 최고가, 최저가도 같은 방식 ...

    tableBody.appendChild(tr);                  // ⑤ 행을 표에 넣기
}
```

| 수업 `fetch.html` | 추적기 |
|---|---|
| `<ol>` | `<tbody>` |
| `<li>` (게시글마다 하나) | `<tr>` (코인마다 하나) |
| `li`에 바로 글자 | `tr` 안에 `<td>` 6칸 |

왜 먼저 `innerHTML = ""`를 할까요? 이게 없으면 1초마다 기존 행 아래에 800개 행이 **계속 추가**됩니다. 수업에서도 비우지 않았더니 `start += 5`를 할 때마다 항목이 쌓였죠.

---

## 7. 조건에 따라 색 바꾸기: `className`과 삼항 연산자 `? :`

**수업 노트**에서는 `if / else`로 스타일을 직접 바꿨습니다.
```js
p.style.color = "red";       // 비밀번호가 짧을 때
p.style.color = "green";     // 사용 가능할 때
```

**추적기**도 같은 판단을 더 짧게 씁니다.
```js
changeTd.className = percent > 0 ? "up" : percent < 0 ? "down" : "";
```
`A ? B : C`는 **"A이면 B, 아니면 C"** 라고 읽습니다. 아래 코드와 같습니다.
```js
if (percent > 0)      changeTd.className = "up";    // 빨강
else if (percent < 0) changeTd.className = "down";  // 파랑
else                  changeTd.className = "";
```
JS에서 `style.color`를 직접 바꾸는 대신 **클래스 이름**을 붙이고, 실제 색은 `style.css`(`.up { color: #e03131 }`)에 둡니다. "어떻게 보이는지"(CSS)와 "무엇을 하는지"(JS)를 나누는 방법입니다.

별도 같은 방식입니다.
```js
starBtn.className   = isFav ? "star on" : "star";   // 노란색 또는 회색
starBtn.textContent = isFav ? "★" : "☆";
```

---

## 8. 사용자에게 반응하기: `addEventListener` (Event API)

**수업 노트:**
> event 발생 (버튼 클릭) → javascript의 코드가 실행

그리고 화살표 함수 단축형:
```js
span.addEventListener("mouseover", () => changeBGColor("red"));
```

**추적기**도 정확히 같은 모양입니다.
```js
tabAll.addEventListener("click", () => changeTab("all"));
tabFav.addEventListener("click", () => changeTab("fav"));
searchInput.addEventListener("input", render);
starBtn.addEventListener("click", () => toggleFavorite(coin.symbol));
```

### 왜 `() => changeTab("all")`인데 `render`는 그냥 쓸까?
노트에서 가장 헷갈리는 부분(mouse.html의 alert 버그)입니다.
- `render`는 **넘길 값이 없어서** 함수 자체를 넘깁니다: `render`
- `changeTab`은 **값(`"all"`)이 필요합니다.** 그냥 `changeTab("all")`이라고 쓰면 페이지가 열릴 때 **바로 실행**됩니다. 수업에서 alert가 바로 떠 버린 그 버그입니다. `() => changeTab("all")`로 감싸면 클릭이 일어난 **나중에** `changeTab("all")`을 부르는 **작은 새 함수**가 만들어집니다.

### `"input"` 이벤트
비밀번호 예제와 같습니다.
```js
input.addEventListener("input", validatePassword);  // 글자를 칠 때마다 실행
```
검색창도 같은 이벤트를 써서, Enter를 누르지 않아도 **입력하는 동안** 표가 걸러집니다.

### 별 버튼은 반복문 안에서 만들어진다
행마다 **자기만의** 버튼과 **자기만의** 리스너가 생기고, 각 리스너는 **자기** `coin.symbol`을 기억합니다. 그래서 ETHUSDT 행의 별을 누르면 `toggleFavorite("ETHUSDT")`가 실행됩니다.

---

## 9. 관심 종목 기억하기: `localStorage` (Storage API)

**수업 노트:**
```js
localStorage.setItem("name", "bob");   // key → value 저장
```
> 내가 지우기 전에는 이 데이터가 들어가 있습니다.

그래서 이것을 씁니다. DOM에서 바꾼 내용은 새로고침하면 사라지지만(노트: *"새로고침하면 'Hello, DOM!'이 출력됩니다"*), 별 표시는 남아 있어야 하니까요.

### 새로 생기는 문제 하나: localStorage는 **글자(문자열)** 만 저장
우리가 저장하고 싶은 것은 **목록**(`["BTCUSDT", "ETHUSDT"]`)이라 변환이 필요합니다.

```js
// 저장: 배열 → 글자
localStorage.setItem("favorites", JSON.stringify(favorites));
//   '["BTCUSDT","ETHUSDT"]'라는 문자열로 저장됨

// 불러오기: 글자 → 배열
JSON.parse(localStorage.getItem("favorites")) || [];
```

`JSON.stringify`는 노트의 POST 예제(`body: JSON.stringify({...})`)에서 이미 봤습니다. `JSON.parse`는 그 반대입니다.

`|| []`는 *"저장된 게 아직 없으면(`null`) 빈 목록을 써라"* 라는 뜻입니다. 처음 페이지를 열 때 에러가 나지 않게 막아 줍니다.

### 별 토글하기
```js
function toggleFavorite(symbol) {
    let favorites = getFavorites();                       // 1. 목록 불러오기
    if (favorites.includes(symbol)) {                     // 2. 이미 별표했나?
        favorites = favorites.filter(item => item !== symbol);  //    → 빼기
    } else {
        favorites.push(symbol);                           //    → 넣기
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));  // 3. 저장
    render();                                             // 4. 다시 그리기
}
```
매번 **불러오기 → 바꾸기 → 저장 → 다시 그리기** 순서입니다.

**직접 확인해 보기:** 수업처럼 크롬 개발자도구 → **Application** → **Local Storage**를 열어 보세요. 별을 누를 때마다 `favorites` 키의 값이 바뀝니다.

---

## 10. 탭: 변수 하나가 무엇을 보여줄지 정한다

```js
let currentTab = "all";   // "all" = 전체보기, "fav" = 관심항목

function changeTab(tab) {
    currentTab = tab;
    tabAll.classList.toggle("active", tab === "all");   // 선택된 버튼 강조
    tabFav.classList.toggle("active", tab === "fav");
    render();
}
```

탭을 눌러도 새 표가 만들어지지 **않습니다.** 변수 `currentTab` 하나만 바뀌고, `render()`가 그 변수를 읽습니다.

```js
if (currentTab === "fav") {
    rows = rows.filter(coin => favorites.includes(coin.symbol));
}
```

페이지네이션 코드의 `page`와 같은 원리입니다. `page++`로 숫자를 바꾸면 `loadPosts()`가 그 숫자로 어느 부분을 잘라 보여줄지 정했죠. 여기서는 `currentTab`이 어떤 filter를 적용할지 정합니다.

`classList.toggle("active", 조건)`은 조건이 `true`면 `active` 클래스를 붙이고 `false`면 뗍니다.

---

## 11. 합쳐 보기: `render()` 한 단계씩

```js
function render() {
    const favorites = getFavorites();                             // localStorage에서
    const keyword = searchInput.value.trim().toUpperCase();       // 검색창에서

    let rows = coins;                                             // 시작: USDT 코인 전체
    if (currentTab === "fav") rows = rows.filter(/* 관심 */);      // 탭으로 좁히기
    if (keyword !== "")       rows = rows.filter(/* 검색 */);      // 검색어로 좁히기

    tableBody.innerHTML = "";                                     // 비우기
    for (const coin of rows) { /* <tr> 만들기 … */ }              // 그리기
    countInfo.textContent = rows.length + "개 종목";               // 개수 표시
}
```

- `.trim()`은 노트에 나온 그대로, 앞뒤 공백을 없앱니다.
- `.toUpperCase()`는 `"eth"`를 `"ETH"`로 바꿔서, 소문자로 검색해도 `ETHUSDT`가 나오게 합니다.

**핵심:** `render()`는 자기가 *왜* 불렸는지(타이머, 별, 탭, 검색) 신경 쓰지 않습니다. 항상 **지금 상태**를 읽어서 표를 처음부터 다시 그립니다. 그래서 서로 다른 네 가지 이벤트가 모두 그냥 `render()`를 부르면 됩니다.

---

## 12. 정리표: 수업 노트 → 추적기

| 노트의 내용 | 수업 예제 | 추적기에서 쓰인 곳 |
|---|---|---|
| `querySelector` | `document.querySelector("h1")` | 모든 `const ... = document.querySelector("#...")` |
| `createElement` / `appendChild` | `<p>`, `<li>` 만들기 | `render()`에서 `<tr>`, `<td>` 만들기 |
| `textContent` | `h1.textContent = "Hello, JS"` | 가격, 심볼, 갱신 시각 |
| `innerHTML = ""` | `fetch.html`에서 목록 비우기 | 1초마다 표 비우기 |
| 스타일 바꾸기 | `p.style.color = "red"` | `className = "up"` / `"down"` / `"star on"` |
| `addEventListener("click")` | 버튼 alert | 별, 탭 |
| `addEventListener("input")` | 비밀번호 검사 | 실시간 검색 |
| `() => 함수(값)` | `() => changeBGColor("red")` | `() => changeTab("all")` |
| 함수를 실행하지 말고 넘기기 | `clickButton()`이 아니라 `clickButton` | `setInterval(loadCoins, 1000)` |
| early return | `if (...) { alert(); return }` | `if (isLoading) return;` |
| `.trim()` | `input.value.trim()` | 검색어 |
| `setInterval` | "1분 경과!" | 1초마다 갱신 |
| `localStorage.setItem` | `("name", "bob")` | 관심 종목 저장 |
| `JSON.stringify` | POST body | 관심 목록 배열을 글자로 변환 |
| `fetch().then(r => r.json())` | jsonplaceholder 게시글 | 바이낸스 24hr 시세 |
| `for...of` + `slice` | `posts.slice(start, end)` | `for (const coin of rows)` + `filter` |
| 상태 변수 + 다시 불러오는 함수 | `page++` → `loadPosts()` | `currentTab = ...` → `render()` |

### 이 앱에서 새로 나온 것 (11/27 노트에는 없음)
| 새 문법 | 한 줄 뜻 |
|---|---|
| `배열.filter(x => 조건)` | 조건을 통과한 항목만 남기기 |
| `글자.includes("abc")` / `배열.includes(x)` | "~을 포함하나?" → `true` / `false` |
| `JSON.parse(글자)` | `JSON.stringify`의 반대: 글자 → 배열/객체 |
| `A ? B : C` | 짧은 `if / else` |
| `classList.toggle("이름", 조건)` | CSS 클래스 붙이기/떼기 |
| `.catch()` / `.finally()` | 실패 시 실행 / 항상 실행 |
| `Number(x).toLocaleString("ko-KR")` | `"61773.18"` → `61,773.18` |
| `x \|\| []` | "`x`를 쓰되, 비어 있으면 `[]`" |

---

## 13. 스스로 확인하기 (코드를 보기 전에 먼저 생각해 보세요)

1. `tableBody.innerHTML = "";` 줄을 지우면 5초 뒤에 어떻게 될까요?
2. `setInterval(loadCoins(), 1000)`은 왜 안 되고, `setInterval(loadCoins, 1000)`은 될까요?
3. BTCUSDT에 별을 누르고 새로고침(⌘R)하면 노란 별이 다시 나올까요? 어떤 Web API 덕분일까요?
4. 페이지를 처음 열었을 때 `localStorage.getItem("favorites")`는 무엇을 돌려줄까요? `getFavorites()`의 어느 부분이 이 경우를 처리할까요?
5. **미니 도전:** "관심 전체 해제" 버튼을 추가해 보세요. 클릭 리스너 안에 어떤 2줄이 필요할까요? (힌트: `toggleFavorite`의 3, 4단계가 무엇을 하는지 생각해 보세요.)
