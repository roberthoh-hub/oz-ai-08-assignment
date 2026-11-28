# How the Crypto Price Tracker Works
### Connecting the 11/27 class notes (`ryunghoh_class_1127.md`) to `claude_product`

> **Who this is for:** someone who has studied DOM, events, timers, Storage and Fetch for two days and can follow each topic alone, but can't yet see how they fit into one app.
>
> **The key idea:** the tracker uses no new magic. It combines **5 Web APIs from class** (DOM, Event, Timer, Storage, Fetch) with a few array tools. Once you see which part does which job, the code becomes readable.

---

## 0. The big picture first

The class notes list the Web APIs the browser gives us:

> DOM API · EVENT API · Timer API · Storage API · Fetch API

Our app uses **all five**, and each has one job:

| Web API (from class) | Its job in the tracker | Where in `script.js` |
|---|---|---|
| **Timer API** – `setInterval` | Call the server once every second | last line |
| **Fetch API** – `fetch().then()` | Get the price data from Binance | `loadCoins()` |
| **DOM API** – `createElement`, `appendChild`, `textContent` | Draw the table on screen | `render()` |
| **Event API** – `addEventListener` | React to clicks on stars/tabs and to typing in the search box | `starBtn`, `tabAll`, `tabFav`, `searchInput` |
| **Storage API** – `localStorage` | Remember starred coins even after a reload | `getFavorites()`, `toggleFavorite()` |

### The flow of one second

```
 setInterval (every 1000 ms)
        │
        ▼
 loadCoins() ──fetch──► Binance server
        │                    │
        │   (the browser waits │ ~90 ms; your page stays usable)
        │ ◄──── JSON ─────────┘
        ▼
 filter: keep only "USDT" symbols  →  saved in  coins
        │
        ▼
 render()  ── reads ──►  coins + localStorage(favorites) + search box + current tab
        │
        ▼
 builds <tr><td>… rows with createElement / appendChild  →  you see the table
```

And separately, **when the user does something**:

```
 click ☆        → toggleFavorite() → localStorage updated → render()
 click a tab    → changeTab()      → currentTab changed   → render()
 type in search → render()
```

**Notice:** almost everything ends in `render()`. That's the design idea: *change the data first, then redraw the screen from that data.*

---

## 1. The HTML: preparing the empty spots

From the class notes (the Coupang example):

> "In the HTML we only make the place where the name will go. After login, we just fill it in."

The tracker works the same way. `index.html` has **empty containers** that JavaScript fills in later:

```html
<span id="updateTime">데이터 불러오는 중...</span>   <!-- update time goes here -->
<span id="countInfo"></span>                         <!-- "815개 종목" goes here -->
<tbody id="tableBody"></tbody>                       <!-- table rows go here -->
```

There is **no coin data in the HTML at all**. Prices change every second, so writing them into HTML would make no sense. That's the same reason Coupang doesn't make one HTML file per user.

`<script src="./script.js">` is placed **at the end of `<body>`**. That way all the HTML elements already exist when the script runs `querySelector`.

---

## 2. Finding elements: `querySelector` (DOM API)

**Class notes:**
```js
const h1 = document.querySelector("h1");
```
> `.msg`, `#msg`, or just `h1` can be used.

**Tracker:**
```js
const tabAll      = document.querySelector("#tabAll");
const searchInput = document.querySelector("#searchInput");
const tableBody   = document.querySelector("#tableBody");
```

`#` means "find by id". Each element is found **once** at the top and stored in a `const`, so the rest of the code can use it.

---

## 3. Getting data: `fetch().then()` (Fetch API)

**Class notes:**
```js
fetch("https://jsonplaceholder.typicode.com/posts")
    .then(response => response.json())
    .then(data => console.log(data))
```

**Tracker (`loadCoins`):**
```js
fetch(API_URL)
    .then(response => response.json())   // ① turn the response into a JS array
    .then(data => {                       // ② use the array
        coins = data.filter(coin => coin.symbol.includes("USDT"));
        ...
        render();
    })
```

It's **exactly the same pattern**. Only the URL and what we do with `data` are different.

### What does `data` look like?
Like `posts` in class, `data` is an **array of objects**. One item looks like this (your design PDF shows the full object):

```js
{
  symbol: "BTCUSDT",
  lastPrice: "61773.18000000",      // current price   → 현재가
  priceChangePercent: "1.410",      // 24h change %    → 24시간 변동률
  highPrice: "62248.91000000",      // 24h high        → 최고가
  lowPrice: "59915.00000000",       // 24h low         → 최저가
  ...
}
```

In class you wrote `post["title"]`. Here we write `coin.symbol` and `coin.lastPrice`. **`coin.symbol` and `coin["symbol"]` mean the same thing.** The dot is just shorter.

### Asynchronous: why `then`?
From class: synchronous code waits for each step to finish, like Python's `add(1, 2)`. `fetch` is **asynchronous**: it sends the request and **moves on right away**. The code inside `.then(...)` runs **later**, when the answer arrives. That's why `render()` is called *inside* `.then`. If it were outside, it would run before the data exists.

### Two extra pieces (not in class yet)
```js
.catch(error => { updateTime.textContent = "데이터를 불러오지 못했습니다..."; })
.finally(() => { isLoading = false; });
```
- `.catch` runs **only if something fails** (for example, the internet is down). Without it, a failure would be silent.
- `.finally` runs **always**, whether it succeeded or failed.

---

## 4. Choosing data: `filter` and `includes` (new, but small)

The class used `posts.slice(start, end)` to cut out *a range* of items. Here we need to pick items *by a condition*, so we use `filter`:

```js
coins = data.filter(coin => coin.symbol.includes("USDT"));
```

Read it as: *"From `data`, keep each `coin` whose `symbol` includes the text "USDT"."*

| Tool | Question it answers | Example |
|---|---|---|
| `slice(0, 5)` (class) | "Give me items 0–4" | first 5 posts |
| `filter(condition)` | "Give me items that pass this test" | only USDT coins |
| `"BTCUSDT".includes("USDT")` | "Does this text contain that text?" | `true` |

`filter` is used **three times** in the app, and each time it narrows the list a little more:
1. Only USDT coins (requirement 1)
2. Only favorites, if the 관심항목 tab is active (requirement 3-3)
3. Only symbols that match the search word (requirement 2)

---

## 5. Repeating every second: `setInterval` (Timer API)

**Class notes:**
```js
const timerId = setInterval(
    () => console.log("1분 경과!"),
    1000*60
);
```

**Tracker (last two lines):**
```js
loadCoins();                    // run once immediately when the page opens
setInterval(loadCoins, 1000);   // then every 1000 ms = 1 second
```

- Why call `loadCoins()` once by itself first? `setInterval` waits 1 second **before** its first run. Without the first line, the page would stay empty for a second. This is the same idea as the class example where `loadPosts();` runs right away (the Coupang "show products without clicking" example).
- Notice it's `setInterval(loadCoins, 1000)`, **not** `loadCoins()`. Your notes say this about events: *"the function itself goes in: `clickButton`, not `clickButton()`."* Timers follow the same rule. `loadCoins()` would run the function once right now and pass its *result* (nothing) to the timer.

### The `isLoading` guard
```js
if (isLoading) return;   // Early-Return, as in your class notes!
isLoading = true;
```
If the server is ever slower than 1 second, a new request would start before the old one finishes, and they'd pile up. This **early return** (the same pattern as `if (input.value.trim() === "") { ...; return }` in your notes) skips a turn when the previous request is still busy.

---

## 6. Drawing the table: `createElement` → `textContent` → `appendChild` (DOM API)

**Class notes:**
```js
const p = document.createElement("p");
p.textContent = "paragraph";
document.body.appendChild(p);
```
and in `fetch.html`:
```js
list.innerHTML = "";
for (const post of posts.slice(0,5)) {
    const li = document.createElement("li");
    li.textContent = post["title"];
    list.appendChild(li)
}
```

**Tracker (`render`)** does exactly this, one level deeper. A table row has cells inside it:

```js
tableBody.innerHTML = "";                       // ① empty the table (no duplicates)

for (const coin of rows) {                      // ② one loop turn = one coin
    const tr = document.createElement("tr");    // ③ make a row

    const symbolTd = document.createElement("td");  // ④ make a cell
    symbolTd.textContent = coin.symbol;             //    put text in it
    tr.appendChild(symbolTd);                       //    put the cell into the row

    // ... same for price, change %, high, low ...

    tableBody.appendChild(tr);                  // ⑤ put the row into the table
}
```

| Class `fetch.html` | Tracker |
|---|---|
| `<ol>` | `<tbody>` |
| `<li>` (one per post) | `<tr>` (one per coin) |
| text directly in `li` | 6 `<td>` cells inside each `tr` |

Why `innerHTML = ""` first? Without it, each second would **add** another 800 rows under the old ones. You saw this in class: without clearing, `start += 5` kept stacking items.

---

## 7. Colors by condition: `className` and the ternary `? :`

**Class notes** changed style directly:
```js
p.style.color = "red";       // password too short
p.style.color = "green";     // OK
```
using `if / else`.

**Tracker** does the same decision, but in a shorter form:
```js
changeTd.className = percent > 0 ? "up" : percent < 0 ? "down" : "";
```
Read `A ? B : C` as **"if A, then B, otherwise C."** It's the same as:
```js
if (percent > 0)      changeTd.className = "up";    // red
else if (percent < 0) changeTd.className = "down";  // blue
else                  changeTd.className = "";
```
Instead of setting `style.color` in JS, we give the element a **class name**. The actual colors live in `style.css` (`.up { color: #e03131 }`). This keeps "what it looks like" (CSS) separate from "what it does" (JS).

The star works the same way:
```js
starBtn.className   = isFav ? "star on" : "star";   // yellow or grey
starBtn.textContent = isFav ? "★" : "☆";
```

---

## 8. Reacting to the user: `addEventListener` (Event API)

**Class notes:**
> event happens (button click) → JavaScript code runs

and the arrow function shortcut:
```js
span.addEventListener("mouseover", () => changeBGColor("red"));
```

**Tracker** uses exactly that shape:
```js
tabAll.addEventListener("click", () => changeTab("all"));
tabFav.addEventListener("click", () => changeTab("fav"));
searchInput.addEventListener("input", render);
starBtn.addEventListener("click", () => toggleFavorite(coin.symbol));
```

### Why `() => changeTab("all")` but just `render`?
This is the trickiest point in your notes (the mouse.html alert bug):
- `render` needs **no argument**, so we pass the function itself: `render`.
- `changeTab` **needs an argument** (`"all"`). Writing `changeTab("all")` directly would **run it immediately** while the page loads. That's the bug from class, where the alerts popped up right away. Wrapping it as `() => changeTab("all")` makes a **new small function** that will call `changeTab("all")` *later*, when the click happens.

### The `"input"` event
From the password example:
```js
input.addEventListener("input", validatePassword);  // runs on every keystroke
```
The search box uses the same event, so the table filters **while you type**, with no Enter key needed.

### The star button is created inside the loop
Each row gets its **own** button with its **own** listener, and each listener remembers its **own** `coin.symbol`. So clicking the star on the ETHUSDT row calls `toggleFavorite("ETHUSDT")`.

---

## 9. Remembering favorites: `localStorage` (Storage API)

**Class notes:**
```js
localStorage.setItem("name", "bob");   // save key → value
```
> Data stays until I delete it. (A reload doesn't erase it, unlike the DOM.)

That's exactly why we use it. DOM changes vanish on reload (your notes: *"refresh → 'Hello, DOM!' comes back"*), but the stars need to survive.

### The one new problem: localStorage only stores **text**
We want to save a **list**: `["BTCUSDT", "ETHUSDT"]`. So we convert it:

```js
// save: array → text
localStorage.setItem("favorites", JSON.stringify(favorites));
//   stored as the string '["BTCUSDT","ETHUSDT"]'

// load: text → array
JSON.parse(localStorage.getItem("favorites")) || [];
```

You've seen `JSON.stringify` before, in the POST example in your notes (`body: JSON.stringify({...})`). `JSON.parse` is its opposite.

`|| []` means: *"if nothing is saved yet (`null`), use an empty list instead."* This prevents an error the first time someone opens the page.

### Toggling a star
```js
function toggleFavorite(symbol) {
    let favorites = getFavorites();                       // 1. load the list
    if (favorites.includes(symbol)) {                     // 2. already starred?
        favorites = favorites.filter(item => item !== symbol);  //    → remove it
    } else {
        favorites.push(symbol);                           //    → add it
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));  // 3. save
    render();                                             // 4. redraw
}
```
It's the same **load → change → save → redraw** cycle every time.

**Check it yourself:** in Chrome, open DevTools → **Application** → **Local Storage**, as in class. You'll see the key `favorites` change when you click a star.

---

## 10. Tabs: one variable decides what to show

```js
let currentTab = "all";   // "all" = 전체보기, "fav" = 관심항목

function changeTab(tab) {
    currentTab = tab;
    tabAll.classList.toggle("active", tab === "all");   // highlight the right button
    tabFav.classList.toggle("active", tab === "fav");
    render();
}
```

A tab **does not** create a new table. It changes one variable, `currentTab`, and `render()` reads that variable:

```js
if (currentTab === "fav") {
    rows = rows.filter(coin => favorites.includes(coin.symbol));
}
```

This works like `page` in your pagination code: `page++` changed a number, and `loadPosts()` used that number to decide which slice to show. Here, `currentTab` decides which filter to apply.

`classList.toggle("active", condition)` adds the class `active` when the condition is `true` and removes it when it's `false`.

---

## 11. Putting it together: `render()` step by step

```js
function render() {
    const favorites = getFavorites();                             // from localStorage
    const keyword = searchInput.value.trim().toUpperCase();       // from the search box

    let rows = coins;                                             // start: all USDT coins
    if (currentTab === "fav") rows = rows.filter(/* favorites */);  // narrow by tab
    if (keyword !== "")       rows = rows.filter(/* search */);     // narrow by search

    tableBody.innerHTML = "";                                     // clear
    for (const coin of rows) { /* build <tr> … */ }               // draw
    countInfo.textContent = rows.length + "개 종목";               // show count
}
```

- `.trim()` comes from your notes: it removes spaces at the start and end.
- `.toUpperCase()` turns `"eth"` into `"ETH"`, so lowercase searches still match `ETHUSDT`.

**The key point:** `render()` doesn't care *why* it was called (timer, star, tab, or search). It always reads the **current state** and draws the table from scratch. That's why four different events can all just call `render()`.

---

## 12. Summary table: class notes → tracker

| In your notes | Example from class | Where it shows up in the tracker |
|---|---|---|
| `querySelector` | `document.querySelector("h1")` | every `const ... = document.querySelector("#...")` |
| `createElement` / `appendChild` | making `<p>`, `<li>` | building `<tr>` and `<td>` in `render()` |
| `textContent` | `h1.textContent = "Hello, JS"` | prices, symbols, update time |
| `innerHTML = ""` | clearing the list in `fetch.html` | clearing the table every second |
| style change | `p.style.color = "red"` | `className = "up"` / `"down"` / `"star on"` |
| `addEventListener("click")` | button alert | stars and tabs |
| `addEventListener("input")` | password check | live search |
| `() => fn(arg)` | `() => changeBGColor("red")` | `() => changeTab("all")` |
| pass the function, don't call it | `clickButton`, not `clickButton()` | `setInterval(loadCoins, 1000)` |
| early return | `if (...) { alert(); return }` | `if (isLoading) return;` |
| `.trim()` | `input.value.trim()` | search keyword |
| `setInterval` | "1분 경과!" | refresh every 1 s |
| `localStorage.setItem` | `("name", "bob")` | saving favorites |
| `JSON.stringify` | POST body | turning the favorites array into text |
| `fetch().then(r => r.json())` | jsonplaceholder posts | Binance 24hr ticker |
| `for...of` + `slice` | `posts.slice(start, end)` | `for (const coin of rows)` + `filter` |
| a state variable + reload function | `page++` → `loadPosts()` | `currentTab = ...` → `render()` |

### New in this app (not in the 11/27 notes)
| New syntax | Meaning in one line |
|---|---|
| `array.filter(x => condition)` | keep only items that pass the test |
| `text.includes("abc")` / `array.includes(x)` | "does it contain …?" → `true` / `false` |
| `JSON.parse(text)` | the opposite of `JSON.stringify`: text → array/object |
| `A ? B : C` | short `if / else` |
| `classList.toggle("name", condition)` | add or remove a CSS class |
| `.catch()` / `.finally()` | runs on failure / runs every time |
| `Number(x).toLocaleString("ko-KR")` | `"61773.18"` → `61,773.18` |
| `x \|\| []` | "use `x`, or `[]` if `x` is empty" |

---

## 13. Check yourself (try before looking at the code)

1. If you delete the line `tableBody.innerHTML = "";`, what will happen after 5 seconds?
2. Why does `setInterval(loadCoins(), 1000)` not work, but `setInterval(loadCoins, 1000)` does?
3. You star BTCUSDT and press reload (⌘R). Does the yellow star come back? Which Web API makes that possible?
4. What would `localStorage.getItem("favorites")` return the very first time someone opens the page? Which part of `getFavorites()` handles that?
5. **Mini challenge:** add a "관심 전체 해제" (clear all favorites) button. Which 2 lines would its click listener need? (Hint: think about what `toggleFavorite` does in steps 3 and 4.)
