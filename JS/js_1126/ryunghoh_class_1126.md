# WebAPI

## DOM API

브라우저가 HTML을 렌더링합니다.

브라우저는 이 HTML을 나름의 구조로 메모리에 DOM이라는 형태로 넣었다가, 이를 화면에 그립니다.

### DOM의 정의

DOM은 Document Object Model의 약자입니다.

**즉, DOM이란 브라우저가 HTML을 객체로 표현한 구조라고 합니다.**

우리가 배운 Javascript를 활용해 브라우저의 화면을 바꿀 수 있습니다.

```JavaScript
  console.log("hello, I can amend DOM(Document Object Model")
```

![1795656217042](image/README/1795656217042.png)

브라우저 내부에서는 html을 읽고 DOM을 만듭니다. 비유하자면 html은 말 그대로 문서이니 책이라고 해 볼게요.

저희가 다 같은 책을 읽더라도 각자 머리에 떠올리는 텍스트 또는 자기만의 방식으로 머리에 떠올리는 방식이 다르잖아요. 마찬가지로 브라우저가 DOM이라는 형태로 html을 읽어 저장합니다.

javascript를 활용해 브라우저 내부의 DOM을 바꿀 수 있습니다.

![1795656504879](image/README/1795656504879.png)

#### document 변수

먼저, document라는 변수를 사용해봅시다.

```JavaScript
const h1 = 
document.getElementById("msg") // msg라는 아이디로 h1을 찾습니다.

h1.textContent
// 'Hello, DOM!'
h1.textContent = "Hello, JS"
// 'Hello, JS' // DOM상태를 콘솔에서 조작할 수 있습니다.
```

![1795656963453](image/README/1795656963453.png)

여기서 질문! 원래 html은 어떻게 되어있을까요?
html은 여전히 "Hello DOM" 입니다. 내가 업데이트한 정보는 DOM에만 반영됩니다.

브라우저를 새로고침하면?

![1795656992336](image/README/1795656992336.png)

"Hello, DOM!"이 출력됩니다. html을 다시 불러왔기 때문입니다. 영어로는 Reload라고 합니다.

#### DOM 활용사례

그럼 Javascript로 DOM을 바꾸는 것은 어떻게 활용할까요? 쇼핑몰을 떠올려봅니다. 우측 상단에 내 정보가 나오지요.

제 이름은 html에 있을까요? 아니면 javascript를 통해 만들었을까요?

정답은 javascript입니다. 우리가 html은 사용자마다 만들어주지 않습니다.

쿠팡 사용자가 100만명이라고 합시다, 이 사람들을 위해 이름을 찍은 html을 100만개 만들지 않습니다. html상에는 이름이 들어갈 자리만 만들어놓습니다. 로그인 후에 그 이름을 채워주기만 합니다. 즉, 이름을 나중에 채워주는 것입니다.

어 그런데 새로고침하면 DOM에서 javascript로 작성한 내용이 날라간다면서요?

새로고침 할 때 마다 이름을 채워주면 됩니다. 포인트도 마찬가지입니다. 사용자가 쇼핑몰에서 포인트를 썼을 때도 그렇게 합니다. 다만, 잘 바뀌지 않는 정보들은 caching이라는 기술을 활용해 브라우저 내부에 저장해둡니다.(확인 필요)

#### DOM 콘솔에서 javascript로 CSS 속성 바꾸기

CSS를 활용해 글씨의 색상을 DOM에서 바꿔볼 수도 있습니다. 아까와 동일하게 javascript를 활용해볼게요.

```JavaScript
const h1=
  document.getElementById("msg")

h1.style.color = "red";
// red
h1.style.
```

![1795657531127](image/README/1795657531127.png)

그러나 html의 모든 tag에 id를 지정하지 않았을 수 있습니다. 따라서 `querySelector` 문법을 사용해 태그를 선택합니다.

`.msg` `#msg` 또는 그냥 `h1`을 불러올 수도 있습니다.

```JavaScript
const h1 = document.querySelector("h1");
h1.style.color="orange";
```

아래 Hello, DOM! 이 주황색으로 바뀌었습니다.

![1795657697049](image/README/1795657697049.png)

또는 html상에 없는 태그도 만들 수 있습니다. paragraph 태그를 만들어봅시다.

`document.createElement`는 html 상에 없는 태그를 DOM을 통해 만듭니다.

`p`라는 상수(`const`) 파라미터에 `document.createElement("p")`를 할당하고

`p.textContent`는 해당 파라미터의 내용을 받아옵니다.

`document.body.appendChild(p)`는 생성한 `p`를 `body` 에`Child`(자식)요소로 추가합니다.

```JavaScript
const p = document.createElement("p")
// undefined
p.textContent = "paragraph"
// 'paragraph'
document.body.appendChild(p)
// <p>paragraph</p>
```

![1795657839295](image/README/1795657839295.png)

## 이벤트(event)란?

- 웹 페이지에서 발생하는 모든 동작이나 상태 변화.
- 주로 사용자의 행동에 의해 발생하지만, 브라우저 자체 동작도 포함.
  - 사용자 행동
  - 브라우저 동작

다음 중 이벤트가 아닌 것은?

	1. click

	2. input

	3. scroll : 쇼핑몰에서 화면을 스크롤하여 내려보면 상품이 표현됨.

	4. for

javascript를 동작하게 하는 trigger가 바로 event입니다.

event 발생 (버튼 클릭) ->  javascript의 코드가 실행 -> 입력 정보가 서버로 전송

버튼에 코드를 달아놓는 것이 우리의 역할이고, 브라우저는 사용자가 버튼을 클릭해 event가 발생되면 버튼에 달아놓은 코드를 실행합니다.

#### event.html

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <button>클릭</button>
    <script>
        // 함수를 추가할 HTML 버튼을 불러옴
        document.querySelector("button");
        // 버튼이 클릭되면 동작시킬 함수를 정의
        function clickButton() {
            alert("버튼이 클릭됨!")
        } 
        // EventListener: 어떤 이벤트가 발생했을 때, 동작하는 함수
        btn.addEventListener("click", clickButton) // 실행 조건, 함수 자체가 들어오면 안 됩니다. clickButton()이 아니라 clickButton이 들어와야 합니다.
    </script>
</body>
</html>
```

#### input.html

* 버튼을 누르면 input에 있는 값을 가져오는 동작을 javascript로 만들어보겠습니다.
* 원래 `clickButton()`함수 안에 있던 `const p = document.createElement("p")`와 `document.body.appendChild(p)`는 함수 바깥으로 빼주겠습니다. 그렇게 하면 paragraph 요소 생성 동작과 paragraph를 추가하는 동작이 clickButton()와 별도로 동작합니다.
* 이로써 입력한 값 (`p`)이 검색창 아래에 무한히 쌓이지 않고, 검색 할 때마다 가장 마지막에 입력한 값만 입력창 아래에 보입니다.

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <input type="text">
    <button>확인</button>
    <script>
        const input = document.querySelector("input");
        const button = document.querySelector("button");
        const p = document.createElement("p"); // 여기로 옮김
        document.body.appendChild(p); // 여기로 옮김
  
        function clickButton() {
            // const p = document.createElement("p");
            p.textContent = input.value;
            input.value = ""; // 확인 버튼 누르고 입력창 clear
            // document.body.appendChild(p);
        };

        button.addEventListener("click", clickButton);
    </script>
</body>
</html>
```

확인 버튼 대신 enter를 눌러서 이벤트를 실행하고 싶다면 `keydown`을 사용합니다.

의미가 명확한 코드를 작성하기 위해`clickButton` 함수를 `updateDisplay`라고 수정하겠습니다.

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <input type="text">
    <button>확인</button>
    <script>
        const input = document.querySelector("input");
        const button = document.querySelector("button");
        const p = document.createElement("p");
        document.body.appendChild(p);

        function updateDisplay() {
            // Early-Return : 문제가 되는 case를 사전에 감지.
            // trim() 공백을 사라지게 해도 빈 값이라면 "값을 입력해주세요" 출력
            if (input.value.trim() === "") {
                alert("값을 입력해주세요.");
                return
            }
            p.textContent = input.value;
            input.value = ""; // 확인 버튼 누르고 입력창 clear
        };

        function keydownEnter(event) {
            if (event.key === "Enter") {
                updateDisplay();
            } //key가 "Enter"인 경우만 잡아주면 됩니다.
        }
        button.addEventListener("click", updateDisplay);
        input.addEventListener("keydown", keydownEnter); // 한계: enter를 안 눌르고 h
    </script>
</body>
</html>
```

### password.html

- 패스워드를 검증하는 함수를 만들어보겠습니다.
- 검증은 영어로 validation. 함수 이름은 validatePassword()라고 만들어보겠습니다.

![공유된 이미지](https://cdn-static.zep.us/chats/media/2dg7Nr/e4984182-64c9-4e09-9741-3bc0ad1f4679/image.webp)

* `p.textContent`
* `p.style.color`

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <input type="password" placeholder="비밀번호 입력">
    <p></p>
    <script>
        const input = document.querySelector("input")
        const p = document.querySelector("p");
        function validatePassword() {
            if (input.value.length < 4) {
                p.textContent = "4자리 이상 입력해주세요."
                p.style.color = "red";
            } else {
                p.textContent = "사용 가능한 비밀번호입니다."
                p.style.color = "green";
            };
        }

        input.addEventListener("input", validatePassword);
        // input을 할 때마다 validatePassword 함수를 동작합니다.
    </script>
</body>
</html>
```

함수를 잠깐 `console.log("비밀번호 검사")`로 지우고 설명해볼게요.

현재는 입력하는 요소가 단순히 1개만 있지만 구글 검색창만 해도 클릭하는 버튼 개수가 많습니다.

버튼의 개수만큼 함수가 생기게 됩니다. 함수는 EventListener와 쌍으로 등장하므로, 버튼이 많아지면 코드가 복잡해질 수 있습니다.

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <input type="password" placeholder="비밀번호 입력">
    <p></p>
    <script>
        const input = document.querySelector("input")
        const p = document.querySelector("p");
        function validatePassword() {
            console.log("비밀번호 검사");
        }
        input.addEventListener("input", validatePassword);
        // input을 할 때마다 validatePassword 함수를 동작합니다.
    </script>
</body>
</html>
```

- 따라서 `function validatePassword()`라는 함수 전체를 `input.addEventListener`에 있는 `validatePassword` 자리에 그대로 넣어주겠습니다.
- function의 이름을 지워도 비밀번호 검증 함수가 제대로 동작합니다.

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <input type="password" placeholder="비밀번호 입력">
    <p></p>
    <script>
        const input = document.querySelector("input")
        const p = document.querySelector("p");
        function validatePassword() {
            if (input.value.length < 4) {
                p.textContent = "4자리 이상 입력해주세요."
                p.style.color = "red";
            } else {
                p.textContent = "사용 가능한 비밀번호입니다."
                p.style.color = "green";
            };
        }

        input.addEventListener(
            "input",
            function /* validatePassword 이름을 없애도 동작합니다. */() {
            if (input.value.length < 4) {
                p.textContent = "4자리 이상 입력해주세요."
                p.style.color = "red";
            } else {
                p.textContent = "사용 가능한 비밀번호입니다."
                p.style.color = "green";
            };
        }
        );
        // input을 할 때마다 validatePassword 함수를 동작합니다.
    </script>
</body>
</html>
```

- 또는 함수 키워드도 없이 사용하는 방법도 있습니다. `() => {}`

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <input type="password" placeholder="비밀번호 입력">
    <p></p>
    <script>
        const input = document.querySelector("input")
        const p = document.querySelector("p");
        function validatePassword() {
            if (input.value.length < 4) {
                p.textContent = "4자리 이상 입력해주세요."
                p.style.color = "red";
            } else {
                p.textContent = "사용 가능한 비밀번호입니다."
                p.style.color = "green";
            };
        }

        input.addEventListener(
            "input",
            /*function validatePassword 을 모두 없애도 동작합니다. */
          	() => {
            if (input.value.length < 4) {
                p.textContent = "4자리 이상 입력해주세요."
                p.style.color = "red";
            } else {
                p.textContent = "사용 가능한 비밀번호입니다."
                p.style.color = "green";
            };
        }
        );
        // input을 할 때마다 validatePassword 함수를 동작합니다.
    </script>
</body>
</html>
```

- 한 줄 짜리 함수일 경우에는 심지어 `() => 함수내용` 처럼 익명 함수로 정의할 수 있습니다.

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <input type="password" placeholder="비밀번호 입력">
    <p></p>
    <script>
        const input = document.querySelector("input")
        const p = document.querySelector("p");
        function validatePassword() {
            if (input.value.length < 4) {
                p.textContent = "4자리 이상 입력해주세요."
                p.style.color = "red";
            } else {
                p.textContent = "사용 가능한 비밀번호입니다."
                p.style.color = "green";
            };
        }

        input.addEventListener(
            "input", () => console.log("비밀번호 검사 중")
        );
        // input을 할 때마다 validatePassword 함수를 동작합니다.
    </script>
</body>
</html>
```

### mouse.html

- 마우스를 올리면 색상이 조금 변하게 해보겠습니다.
- 기존에 CSS 에서도 `hover` 기능을 활용하면 되었지만,
- 유투브 썸네일을 미리보는 기능은 CSS로 구현이 불가능합니다.
- 먼저 기존 CSS 코드입니다.

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        span {
            background-color: antiquewhite;
            padding: 5px;
        }

        span:hover{
            background-color: orange;
        }
    </style>
</head>
<body>
    <span>
        마우스를 올려보세요.
    </span>
</body>
</html>
```

- 이제 `addEventListener` 의 `mouseover`과 `mouseout`이벤트를 활용해 이름 없는 함수를 `() => 함수내용` 형태로 만들어보겠습니다.
- 현재는 마우스를 올리면 빨간색, 마우스를 내리면 황금색으로 바뀝니다. 성공입니다.

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        span {
            background-color: gold;
            padding: 5px;
        }
    </style>
</head>
<body>
    <span> 마우스를 올려보세요.</span>
    <script>
        const span = document.querySelector("span")
  
        span.addEventListener(
            "mouseover",
            () => span.style.backgroundColor = "red"
        )
        span.addEventListener(
            "mouseout",
            () => span.style.backgroundColor = "gold"
        )
    </script>
</body>
</html>
```

- 그러나 만약에 색깔이 바뀔 때 마다 다른 동작을 해야 한다면 어떻게 할까요?
- 예를 들어 빨간 색으로 바뀌면 `alert`로 색이 변경되었음을 알려줍니다.

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        span {
            background-color: gold;
            padding: 5px;
        }
    </style>
</head>
<body>
    <span> 마우스를 올려보세요.</span>
    <script>
        const span = document.querySelector("span")
  
        function changeBGColor(color) {
            span.style.backgroundColor = color;
            alert(color + "로 변경되었습니다.")
        }

        span.addEventListener(
            "mouseover",
            () => {
                span.style.backgroundColor = "red"
                alert("red로 변경되었습니다.")
            }
        )
        span.addEventListener(
            "mouseout",
            () => span.style.backgroundColor = "gold"
        )
    </script>
</body>
</html>
```

- 여기서 문제점. html을 브라우저로 띄우자마자 red로 변경되었습니다, gold로 변경되었습니다 라는 메시지가 뜹니다.
- 메시지를 닫았는데도 문제가 생깁니다.
- 마우스를 텍스트에 올렸다가 내려도 우리가 원하는 alert가 뜨지 않습니다.
- 다시 말해서, 함수 자체를 실행했기 때문에 문제가 됩니다.
- 함수를 활용해서 alert가 마우스를 올리거나 내릴 때만 출력되도록 할 수 있습니다.

```HTML
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        span {
            background-color: gold;
            padding: 5px;
        }
    </style>
</head>
<body>
    <span> 마우스를 올려보세요.</span>
    <script>
        const span = document.querySelector("span")
  
        function changeBGColor(color) {
            span.style.backgroundColor = color;
            alert(color + "로 변경되었습니다.")
        }

        span.addEventListener(
            "mouseover", () => changeBGColor("red")
        )

        span.addEventListener(
            "mouseout", () => changeBGColor("gold")
        )
    </script>
</body>
</html>
```

## Web API

- console 내지는 document라는 객체를 통해 쿼리를 시작하고 있습니다.
- 잘 생각해보면 console, document는 어디에서도 선언하지 않은 변수입니다.
- 그럼에도 불구하고 이를 사용할 수 있는 이유는
- javascript에서 전역변수처럼 이러한 변수를 기본으로 제공하기 때문입니다.
- 그럼 이런 함수를 누가 지원하는 것일까요?
- browser 가 이를 지원하는 것입니다.

  - 이러한 기능을 Web API라고 합니다.
  - 왜 browser가 제공한 것만 사용할 수 있을까요?
  - 왜냐하면 보안 때문입니다. 브라우저가 제공하는 Web API 안에서만 구동하게 해야 해킹을 막을 수 있습니다.

#### Web API 예시

- DOM API
- EVENT API
- Timer API
- Storage API
- Fetch API

이제 Timer API, Storage API, Fetch API를 알아보겠습니다.

### timer.js

```JavaScript
// Timer API
// 특정 시간 이후에 동작할 함수를 예약
// 특정 시간 이후에 반드시 동작해야 하는 기능을 timeout을 걸어놓는다.
// setTimeout(
//     // 함수
//     () => console.log("3초 경과!"),
//     // 시간(단위는 ms: milisecond = 1/1000 second)
//     3000
// );

// 특정 시간마다 동작하는 함수를 예약
const timerId = setInterval(
    () => console.log("1분 경과!"),
    // 시간
    1000*60
);

// timer를 멈추기
clearInterval(timerId);
```

while 처럼 중단 조건을 만들어줄 수 있습니다.

```JavaScript
// 특정 시간마다 동작하는 함수를 예약
let count = 0;

const timerId = setInterval(

    // 함수
    () => {
        count++;
        console.log(count + "초 경과");
        if (count === 10) {
            clearInterval(timerId);
        }
    },
    // 시간
    1000
);
```
