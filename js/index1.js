
let containerNode = document.getElementById("puzzle");
let framesSize = Array.from(document.querySelectorAll(".frameItem"));
let frame = document.getElementById("current-frame");
const move = document.getElementById("move");

let itemNodes 
let myTimeout;
let compareDate = new Date();
let seconds;
let minutes;
let hours;
let stop = false;


frame.textContent = "4x4";
let moveCount = 0;
move.textContent = moveCount;
let blockedCoords= null;


const maxShuffleCount = 50;
 

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
/*Изменение количества пятнашек */
for (let i = 0; i < framesSize.length; i++) {
  framesSize[i].addEventListener("click", (event) => {
    moveCount = 0;
    move.textContent = moveCount;
    frame.textContent = framesSize[i].textContent;
    frame.dataset.frameId = framesSize[i].dataset.frameId;
    countItems = Number(frame.dataset.frameId)**2;
    deleteArray(itemNodes);
    makeArray(countItems);
    itemNodes = Array.from(containerNode.querySelectorAll(".item"));
    itemNodes[countItems - 1].style.display = "none";
    matrix = getMatrix(itemNodes.map((item) => Number(item.dataset.matrixId)));
    shuffledArray = shuffleArray(matrix.flat());
    matrix = getMatrix(shuffledArray);
    setPositionItems(matrix);
    console.log(matrix)
  })
}
/*-----------------*/
/*Количество пятнашек */
let countItems = Number(frame.dataset.frameId)**2;

makeArray(countItems)

/*Создание html массива*/
function makeArray(countItems) {
  for (let i = 0; i < countItems; i++){
    let buttonCreate = document.createElement("button");
    let spanCreate = document.createElement("span");
    buttonCreate.classList.add("item");
    buttonCreate.dataset.matrixId = i + 1;
    spanCreate.classList.add("itemVal");
    spanCreate.innerText = i + 1;
    containerNode.appendChild(buttonCreate);
    buttonCreate.appendChild(spanCreate);
    itemNodes = Array.from(document.querySelectorAll('.item'))
    buttonCreate.style.width = `calc(100%/${frame.dataset.frameId})`;
    buttonCreate.style.height = `calc(100%/${frame.dataset.frameId})`;

  }
}

/*Включение музыки по умолчанию */
let isPlay = true;
const audio = new Audio('./media/music.mp3');



/*Позиционирование */
itemNodes[countItems-1].style.display = 'none'
let matrix = getMatrix(itemNodes.map((item)=>Number(item.dataset.matrixId))
);

setPositionItems(matrix);
/*---------------------------*/

/*Перемешать пятнашки*/
document.getElementById("shuffle").addEventListener('click', shuffle)
/*-------------------------- */

/*Позиция по клику*/
const blankNumber = countItems //пустой элемент
containerNode.addEventListener('click', (event)=>{
  const buttonNode = event.target.closest('button');
  if(!buttonNode){
    return
  }
  const buttonNumber = Number(buttonNode.dataset.matrixId)
  const buttonCoords = findCoordinatesByNumber(buttonNumber, matrix)
  const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
  const isValid = isValidForSwap(buttonCoords, blankCoords);
  if (isValid) {
    
    if (isPlay) {
      audio.currentTime = 0;
      audio.load();
      audio.play();
    }else{
      audio.pause()
    }
    moveCount+=1;
      move.textContent = moveCount;
      swap(blankCoords, buttonCoords,matrix)
      setPositionItems(matrix)
}})

document.getElementById("stop").addEventListener("click", () => {
  document.getElementById("stop").classList.toggle("active");
  if (document.getElementById("stop").classList.contains("active")) {
    stop = true;
  } else {
    stop = false;
    compareDate = new Date();
    clock()
  }
});

/*Helpers */
/*Создание матрицы*/
function getMatrix(arr){
  //const matrix = [[],[],[],[]]
  let matrix=[]
  for(let i=0;i<frame.dataset.frameId;i++){
    matrix.push([])
  }
  let y = 0;
  let x = 0;

  for(let i=0; i<arr.length; i++){
    if(x>=frame.dataset.frameId){
      y++;
      x=0;
    }
    matrix[y][x] = arr[i]
    x++;
  }
  return matrix;
}

/*-------------------*/
/*Удаление массива*/
function deleteArray(arr) {
  for (let i = 0; i < itemNodes.length; i++) {
    itemNodes[i].remove();
  }
}
/*-----------------*/
function setPositionItems(matrix){
  for(let y=0; y<matrix.length; y++){
    for(let x=0;x<matrix[y].length; x++){
      const value = matrix[y][x];
      const node = itemNodes[value-1]
      setNodeStyles(node,x,y)
    }
  }
}

/*Задаем стили для элемента*/
function setNodeStyles(node,x,y){
  const shiftPs = 100;
  node.style.transform = `translate3D(${x * shiftPs}%, ${y * shiftPs}%,0)`;
}

/*-------------------*/

function shuffleArray(arr){
return arr.map(value=>({value, sort:Math.random()})).sort((a,b)=>a.sort-b.sort).map(({value})=>value)
}

/*Находим координаты элемента */
function findCoordinatesByNumber(number, matrix){
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x] == number) {
        return { x, y };
      }
    }
  }
  return null;
}
/*-------------------*/
/*Валидация */
function isValidForSwap(coord1, coord2) {
  const diffX = Math.abs(coord1.x - coord2.x);
  const diffY = Math.abs(coord1.y - coord2.y);
  return (
    (diffX === 1 || diffY === 1) &&
    (coord1.x === coord2.x || coord1.y === coord2.y) &&
    !document.getElementById("stop").classList.contains("active")
  );
}
/*----------------------*/

/*Замена координат элемента при перемещении */
function swap(coords1, coords2, matrix, moveCount) {
  const coords1Number = matrix[coords1.y][coords1.x];
  matrix[coords1.y][coords1.x] = matrix[coords2.y][coords2.x];
  matrix[coords2.y][coords2.x] = coords1Number;
  if(isWon(matrix)){
    addWonClass();
  }
}
/*-----------------------*/
let flatMatrix
/*Проверка массива на выйгрыш */
const winFlatArray = new Array(16).fill(0).map((el,i)=>el=i+1)
function isWon(matrix){
  flatMatrix = matrix.flat();
  console.log(flatMatrix)

  for(let i=0; i<winFlatArray.length; i++){
    if(flatMatrix[i]!== winFlatArray[i]){
      return false
    }
  }
return true
}
/*------------------------*/

/*В случае выйгрыша*/
let winBlock = document.querySelector(".win-block");
function addWonClass(){
  winBlock.classList.add("popup");
  let win = document.createElement('div')
  win.classList.add('win')
  winBlock.append(win)
  win.innerHTML=`
  <div class="win-container">Hooray! You solved the puzzle in: </div>
  <button class="win-button">OK</button>
  `
  const containerWin = document.querySelector(".win-container")
  containerWin.append(("0" + hours).slice(-2));
  containerWin.append(":");
  containerWin.append(("0" + minutes).slice(-2));
  containerWin.append(":");
  containerWin.append(("0" + seconds).slice(-2));
  containerWin.append(" and ");
   containerWin.append(moveCount);
   containerWin.append(" moves");

  const winBtn = document.querySelector('.win-button')
  winBtn.addEventListener('click', goBack)
}

/*Вернуться обратно в игру */
function goBack(){
  winBlock.classList.remove("popup");
  moveCount = 0;
  move.textContent = moveCount;
  
}

/*--------------*/


/*Перемешивание элементов массива*/
let timer;
function shuffle(){
  moveCount = 0;
  
  move.textContent = moveCount;
  clearInterval(timer);
  let shuffleCount = 0;
  diffStop = 0

  compareDate = new Date();
  timer = setInterval(()=>{
    randomSwap(matrix)
    setPositionItems(matrix)
    shuffleCount +=1;
    //compareDate = new Date()
    if(shuffleCount >= maxShuffleCount){
      shuffleCount = 0
      clearInterval(timer);
    }
  },0)
    
}
/*-----------------------*/
function randomSwap(matrix){
  const blankCoords = findCoordinatesByNumber(blankNumber, matrix);
  const validCoords = findValidCoords({
    blankCoords,
    matrix,
    blockedCoords
  })

  const swapCoords = validCoords[Math.floor(Math.random()* validCoords.length)];
  swap(blankCoords, swapCoords,matrix)
  blockedCoords = blankCoords;
}


function findValidCoords({blankCoords,matrix, blockedCoords}){
  const validCoords = [];
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if(isValidForSwap({x,y}, blankCoords)){
        if(!blockedCoords || !(blockedCoords.x===x && blockedCoords.y===y)){
      validCoords.push({x,y})
      }
      }
    }
  }
  return validCoords;
}
let diff = 0;
let diffStop = 0
/*Часы*/
function clock() {

  if (stop === true || winBlock.classList.contains("popup")) {
    diffStop = diff;
  } else if (stop === false) {

    now = new Date();
    diff = diffStop + now.getTime() - compareDate.getTime();
    setTimeout(clock, 1000, diff);
    seconds = Math.floor(diff / 1000);
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
clock()

/*------------------------------*/
