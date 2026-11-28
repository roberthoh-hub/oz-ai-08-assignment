// javascript에 링크로 api 데이터 넣어보기.

const API_URL = "https://api4.binance.com/api/v3/ticker/24hr"
const STORAGE_KEY = "favorites";

const tabALL = document.querySelector("#tabAll");
const tabFav = document.querySelector("#tabFav");
const searchInput = document.querySelector("#searchInput");
const tableBody = document.querySelector("#tableBody");
const updateTime = document.querySelector("#updateTime");
const countInfo = document.querySelector("#countInfo");
const emptyMessage = document.querySelector("#emptyMessage");


// [요구사항 3-2] 관심 심볼 목록을 localStorage에 배열(JSON 문자열)로 저장/조회

// 숫자 포맷: 1000 단위 쉼표, 소수점 끝의 0 제거

// 1초마다 바이낸스 API에서 데이터 받아오기
function loadCoins() {
    if 
}
// 현재 탭과 검색어에 맞춰 표 다시 그리기

    // [요구사항 3-3] 관심항목 탭이면 localStorage에 저장된 심볼만 표시

    // [요구사항 2] 검색어가 포함된 심볼만 표시

        // [요구사항 3-1] 관심 열: 기본은 색 없는 별(☆), 관심 등록 시 노란 별(★)


    // 표시할 데이터가 없을 때 안내 문구


    // [요구사항 4] 탭 전환: 버튼 강조 표시를 바꾸고 표 다시 그리기
