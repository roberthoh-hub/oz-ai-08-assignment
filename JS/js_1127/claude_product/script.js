const API_URL = "https://api4.binance.com/api/v3/ticker/24hr";
const STORAGE_KEY = "favorites";

const tabAll = document.querySelector("#tabAll");
const tabFav = document.querySelector("#tabFav");
const searchInput = document.querySelector("#searchInput");
const tableBody = document.querySelector("#tableBody");
const updateTime = document.querySelector("#updateTime");
const countInfo = document.querySelector("#countInfo");
const emptyMessage = document.querySelector("#emptyMessage");

let coins = [];          // USDT 코인 목록(가장 최근 응답)
let currentTab = "all";  // "all" = 전체보기, "fav" = 관심항목
let isLoading = false;   // 이전 요청이 안 끝났으면 새 요청을 건너뜀
let fetchCount = 0;      // 갱신 횟수(1초마다 받아오는지 확인용)

// [요구사항 3-2] 관심 심볼 목록을 localStorage에 배열(JSON 문자열)로 저장/조회
function getFavorites() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function toggleFavorite(symbol) {
    let favorites = getFavorites();
    if (favorites.includes(symbol)) {
        favorites = favorites.filter(item => item !== symbol); // 이미 있으면 해제
    } else {
        favorites.push(symbol);                                // 없으면 추가
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    render();
}

// 숫자 포맷: 1000 단위 쉼표, 소수점 끝의 0 제거
function formatPrice(value) {
    return Number(value).toLocaleString("ko-KR", { maximumFractionDigits: 8 });
}

// 1초마다 바이낸스 API에서 데이터 받아오기
function loadCoins() {
    if (isLoading) return;
    isLoading = true;

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            // [요구사항 1] symbol에 "USDT"가 들어간 데이터만 선택
            // (거래가 중단돼 현재가가 0인 종목은 제외)
            coins = data.filter(coin =>
                coin.symbol.includes("USDT") && Number(coin.lastPrice) > 0
            );

            fetchCount++;
            updateTime.textContent =
                "마지막 갱신: " + new Date().toLocaleTimeString("ko-KR") +
                " (" + fetchCount + "회째)";
            render();
        })
        .catch(error => {
            updateTime.textContent = "데이터를 불러오지 못했습니다. 잠시 후 다시 시도합니다.";
            console.error(error);
        })
        .finally(() => {
            isLoading = false;
        });
}

// 현재 탭과 검색어에 맞춰 표 다시 그리기
function render() {
    const favorites = getFavorites();
    const keyword = searchInput.value.trim().toUpperCase();

    let rows = coins;

    // [요구사항 3-3] 관심항목 탭이면 localStorage에 저장된 심볼만 표시
    if (currentTab === "fav") {
        rows = rows.filter(coin => favorites.includes(coin.symbol));
    }

    // [요구사항 2] 검색어가 포함된 심볼만 표시
    if (keyword !== "") {
        rows = rows.filter(coin => coin.symbol.includes(keyword));
    }

    tableBody.innerHTML = "";

    for (const coin of rows) {
        const tr = document.createElement("tr");
        const isFav = favorites.includes(coin.symbol);
        const percent = Number(coin.priceChangePercent);

        // [요구사항 3-1] 관심 열: 기본은 색 없는 별(☆), 관심 등록 시 노란 별(★)
        const starTd = document.createElement("td");
        const starBtn = document.createElement("button");
        starBtn.className = isFav ? "star on" : "star";
        starBtn.textContent = isFav ? "★" : "☆";
        starBtn.title = isFav ? "관심 해제" : "관심 등록";
        starBtn.addEventListener("click", () => toggleFavorite(coin.symbol));
        starTd.appendChild(starBtn);
        tr.appendChild(starTd);

        const symbolTd = document.createElement("td");
        symbolTd.className = "symbol";
        symbolTd.textContent = coin.symbol;
        tr.appendChild(symbolTd);

        const priceTd = document.createElement("td");
        priceTd.textContent = formatPrice(coin.lastPrice);
        tr.appendChild(priceTd);

        const changeTd = document.createElement("td");
        changeTd.className = percent > 0 ? "up" : percent < 0 ? "down" : "";
        changeTd.textContent = (percent > 0 ? "+" : "") + percent.toFixed(2) + "%";
        tr.appendChild(changeTd);

        const highTd = document.createElement("td");
        highTd.textContent = formatPrice(coin.highPrice);
        tr.appendChild(highTd);

        const lowTd = document.createElement("td");
        lowTd.textContent = formatPrice(coin.lowPrice);
        tr.appendChild(lowTd);

        tableBody.appendChild(tr);
    }

    countInfo.textContent = rows.length + "개 종목";

    // 표시할 데이터가 없을 때 안내 문구
    if (rows.length === 0 && coins.length > 0) {
        emptyMessage.hidden = false;
        emptyMessage.textContent = currentTab === "fav" && favorites.length === 0
            ? "관심항목이 없습니다. ☆를 눌러 추가해 보세요."
            : "검색 결과가 없습니다.";
    } else {
        emptyMessage.hidden = true;
    }
}

// [요구사항 4] 탭 전환: 버튼 강조 표시를 바꾸고 표 다시 그리기
function changeTab(tab) {
    currentTab = tab;
    tabAll.classList.toggle("active", tab === "all");
    tabFav.classList.toggle("active", tab === "fav");
    render();
}

tabAll.addEventListener("click", () => changeTab("all"));
tabFav.addEventListener("click", () => changeTab("fav"));
searchInput.addEventListener("input", render);

loadCoins();                    // 처음 열 때 바로 1회 조회
setInterval(loadCoins, 1000);   // 이후 1초마다 자동 갱신
