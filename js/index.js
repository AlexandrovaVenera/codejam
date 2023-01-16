const body = document.querySelector("body");

/*Построение страницы*/
body.innerHTML = ` 
<div class = 'win'>

</div>
<div class="wrapper">
    <h1>Gem Puzzle</h1>
    <div class="current">
    <span class="move">Movies:<span id = 'move'></span> </span>
    <span class="time">Time:  
      <span id="timedate">
          <a id="h">00</a>:<a id="m">00</a>:<a id="s">00</a>
      </span>
    </span>
    </div>
    
  <div class="puzzle" id = 'puzzle'> 

  </div>
  <div class="frame-size">Frame-size: <span id="current-frame" data-frame-id = "16"></span></div>
  <div class="sizes">
      <span>Other size:</span>
      <span><a href="#" class="frameItem" data-frame-id = "9">3x3</a></span>
      <span><a href="#" class="frameItem" data-frame-id = "16">4x4</a></span>
      <span><a href="#" class="frameItem" data-frame-id = "25">5x5</a></span>
      <span><a href="#" class="frameItem" data-frame-id = "36">6x6</a></span>
      <span><a href="#" class="frameItem" data-frame-id = "49">7x7</a></span>
      <span><a href="#" class="frameItem" data-frame-id = "64">8x8</a></span>
  </div>
  </div>
  <div class="wrapper-buttons">
  <button class="button" id="shuffle">Shuffle and start</button>
  <button class="button" id="stop">Stop</button>
  <button class="button">Save</button>
  <button class="button">Results</button>
  <div id='audio' class='audio'><audio  ></audio></div>

</div>`;

let puzzle = document.getElementById("puzzle");
let win = document.querySelector(".win");
let arrPattern = [];
/* Задаем параметру frame-size значение по умолчанию*/
let frame = document.getElementById("current-frame");
frame.textContent = "4x4";
/*Создание массива относительно frame-size по умолчанию*/
makeArray(frame.dataset.frameId);
let countItems = frame.dataset.frameId;
let isPlay = true
const audio = new Audio();
audio.src = './media/music.mp3'

/* Задаем параметру move значение по умолчанию*/
const move = document.getElementById("move");
let moveCount = 0;
move.textContent = moveCount;

/*Изменение frame-size при нажатии на other size*/
let framesSize = Array.from(document.querySelectorAll(".frameItem"));
for (let i = 0; i < framesSize.length; i++) {
  framesSize[i].addEventListener("click", (event) => {
    document.getElementById("stop").classList.remove("active");
    if (win.classList.contains("popup")) {
      win.classList.remove("popup");
    }
    moveCount = 0;
    arrPattern = [];
    move.textContent = moveCount;
    frame.textContent = framesSize[i].textContent;
    frame.dataset.frameId = framesSize[i].dataset.frameId;
    countItems = frame.dataset.frameId;
    deleteArray(itemNodes);
    makeArray(countItems);
    itemNodes = Array.from(puzzle.querySelectorAll(".item"));
    itemNodes[countItems - 1].style.display = "none";
    matrix = getMatrix(itemNodes.map((item) => Number(item.dataset.matrixId)));
    shuffledArray = shuffleArray(matrix.flat());
    matrix = getMatrix(shuffledArray);
    setPositionItems(matrix);
    arrPatternFunction(countItems);
  });
}

/*Создание массива относительно frame-size*/
function makeArray(countItems) {
  for (let i = 0; i < Number(frame.dataset.frameId); i++) {
    let buttonCreate = document.createElement("button");
    let spanCreate = document.createElement("span");
    let count = Number(document.getElementById("current-frame").innerText[0]);
    buttonCreate.classList.add("item");
    buttonCreate.dataset.matrixId = i + 1;
    spanCreate.classList.add("itemVal");
    spanCreate.innerText = i + 1;
    puzzle.appendChild(buttonCreate);
    buttonCreate.appendChild(spanCreate);
    buttonCreate.style.width = `calc(100%/${count})`;
    buttonCreate.style.height = `calc(100%/${count})`;
    if (i - 1 === Number(frame.dataset.frameId)) {
      buttonCreate.style.display = "none";
    }
  }
}
/*Удаление массива*/
function deleteArray(arr) {
  for (let i = 0; i < itemNodes.length; i++) {
    itemNodes[i].remove();
  }
}
/*Позиционирование*/

let itemNodes = Array.from(puzzle.querySelectorAll(".item"));
itemNodes[countItems - 1].style.display = "none";

let matrix = getMatrix(itemNodes.map((item) => Number(item.dataset.matrixId)));
setPositionItems(matrix);

/*Создание матрицы*/
function getMatrix(arr) {
  let matrix;

  if (arr.length === 9) {
    matrix = [[], [], []];
  } else if (arr.length === 16) {
    matrix = [[], [], [], []];
  } else if (arr.length === 25) {
    matrix = [[], [], [], [], []];
  } else if (arr.length === 36) {
    matrix = [[], [], [], [], [], []];
  } else if (arr.length === 49) {
    matrix = [[], [], [], [], [], [], []];
  } else if (arr.length === 64) {
    matrix = [[], [], [], [], [], [], [], []];
  }
  let x = 0;
  let y = 0;

  for (let i = 0; i < arr.length; i++) {
    if (x >= matrix.length) {
      y++;
      x = 0;
    }
    matrix[y][x] = arr[i];
    x++;
  }

  return matrix;
}
/*Размещение элементов массива по массиву*/
function setPositionItems(matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const value = matrix[y][x];
      const node = itemNodes[value - 1];

      setNodeStyles(node, x, y);
    }
  }
}
function setNodeStyles(node, x, y) {
  const shiftPs = 100;
  node.style.transform = `translate3D(${x * shiftPs}%, ${y * shiftPs}%,0)`;
}

/*Изменение позиции при нажатии на элемент*/
let i=0
puzzle.addEventListener("click", (event) => {
  const blankNumber = Number(frame.dataset.frameId);
  const buttonNode = event.target.closest("button");
  console.log(isPlay)
  if (!buttonNode) {
    return;
  }
  const buttonNumber = Number(buttonNode.dataset.matrixId);
  const buttonCoords = findCoordinatesByNumber(buttonNumber, matrix);
  const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
  const isValid = isValidForSwap(buttonCoords, blankCoords);
  if (
    isValid &&
    !document.getElementById("stop").classList.contains("active")
  ) {
    arrNew = [];
    if (isPlay) {
      audio.currentTime = 0;
      audio.load();
      audio.play();
    }else{
      audio.pause()
    }
    swap(blankCoords, buttonCoords, matrix);
    setPositionItems(matrix);
    moveCount++;
    move.textContent = moveCount;
    check(buttonNumber, matrix);
    equalArrays(arrPattern, arrNew);
  }
});

function findCoordinatesByNumber(number, matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] == number) {
        return { x, y };
      }
    }
  }
  return null;
}
function isValidForSwap(coord1, coord2) {
  const diffX = Math.abs(coord1.x - coord2.x);
  const diffY = Math.abs(coord1.y - coord2.y);
  return (
    (diffX === 1 || diffY === 1) &&
    (coord1.x === coord2.x || coord1.y === coord2.y) &&
    !document.getElementById("stop").classList.contains("active")
  );
}
function swap(coords1, coords2, matrix, moveCount) {
  const coords1Number = matrix[coords1.y][coords1.x];
  matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x];
  matrix[coords2.y][coords2.x] = coords1Number;
}

moveCount = 0;
move.textContent = moveCount;
let shuffledArray = shuffleArray(matrix.flat());
matrix = getMatrix(shuffledArray);
setPositionItems(matrix);

/*Перемешать при нажатии на кнопку Shuffle and start*/
document.getElementById("shuffle").addEventListener("click", () => {
  document.getElementById("stop").classList.remove("active");
  if (win.classList.contains("popup")) {
    win.classList.remove("popup");
  }
  moveCount = 0;
  move.textContent = moveCount;
  let shuffledArray = shuffleArray(matrix.flat());
  matrix = getMatrix(shuffledArray);
  setPositionItems(matrix);
  setTimeout(clock(), 0);
  compareDate = new Date();
});
function shuffleArray(arr) {
  return arr
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

/*Нажатие на кнопку Stop*/
let stop = false;
document.getElementById("stop").addEventListener("click", () => {
  document.getElementById("stop").classList.toggle("active");
  if (document.getElementById("stop").classList.contains("active")) {
    stop = true;
    console.log(stop);
  } else {
    stop = false;
    console.log(stop);
    compareDate = new Date();
    setTimeout(clock(), 1000);
  }
});

/* Подключение музыки*/

let audioBtn = document.getElementById("audio");

audioBtn.addEventListener("click", () => {
  if(isPlay){
    isPlay = false;
    audioBtn.classList.add("audio-turn-off")
  }else{
    isPlay = true;
    audioBtn.classList.remove("audio-turn-off")
  }
});

let myTimeout;
let compareDate = new Date();
let seconds;
let minutes;
let hours;
function clock() {
  let number;
  if (stop === true || win.classList.contains("popup")) {
    clearTimeout();
  } else if (stop === false) {
    //compareDate = new Date();

    now = new Date();
    number = now.getTime() - compareDate.getTime();
    setTimeout(clock, 1000, 1000 + number);
    seconds = Math.floor(number / 1000);
    minutes = Math.floor(seconds / 60);
    hours = Math.floor(minutes / 60);

    hours %= 24;
    minutes %= 60;
    seconds %= 60;

    document.getElementById("h").innerHTML = ("0" + hours).slice(-2);
    document.getElementById("m").innerHTML = ("0" + minutes).slice(-2);
    document.getElementById("s").innerHTML = ("0" + seconds).slice(-2);
  }
}

setTimeout(clock(), 1000);

let arrNew = [];
function check(number, matrix) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      arrNew.push(matrix[y][x]);
    }
  }
  return arrNew;
}

arrPatternFunction(countItems);

function arrPatternFunction(countItems) {
  for (let i = 0; i < Number(frame.dataset.frameId); i++) {
    arrPattern.push(i + 1);
  }
  return arrPattern;
}
/*Проверка на выйгрыш*/
function equalArrays(arr1, arr2) {
  if (arr1.length != arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  win.classList.add("popup");
  win.innerText = `Hooray! You solved the puzzle in: `;
  win.append(("0" + hours).slice(-2));
  win.append(":");
  win.append(("0" + minutes).slice(-2));
  win.append(":");
  win.append(("0" + seconds).slice(-2));
  win.append(" and ");
  win.append(moveCount);
  win.append(" moves");
}

equalArrays(arrPattern, arrNew);
