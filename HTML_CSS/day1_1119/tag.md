## Anchor : 닻 (a)
```
<a href="https://www.google.com">구글</a>로 이동
```
## Base : 
- head: 제목 (페이지 이름) - meta data(메타데이타)
- body: HTML의 내용물

## form : 사용자로부터 데이터를 입력 받는 양식을 만듦.
```html 
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form action= "https://search.naver.com/search.naver">
        <input type="search" name = "query" placeholder="최신 뉴스를 검색해보세요">
        <button type = "submit">입력</button>
    </form>
</body>
</html>
```

```python
print("hello")
```
## list
<ul>: 순서가 없는 리스트 (unordered list)
<ol>: 순서가 있는 리스트 (ordered list)

## image
<img>: image 이미지 <img src="./파일명" alt="부가설명">

## paragraph
<p>: 문단 바꾸는 것  (paragraph)
<h1>: header1 # 문단 글자 크기
<h2>: header2 ##

## table 
<table>
    <thead>
        <tr>
            <th></th>
            <th></th>
            <th></th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </tbody>
</table>