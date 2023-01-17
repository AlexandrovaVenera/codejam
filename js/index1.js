
let containerNode = document.getElementById("puzzle");
let framesSize = Array.from(document.querySelectorAll(".frameItem"));
let frame = document.getElementById("current-frame");
let itemNodes = Array.from(document.querySelectorAll('.item'))
frame.textContent = "4x4";
let moveCount = 0;
let blockedCoords= null


const maxShuffleCount = 50;
 
/*Количество пятнашек */
let countItems = 16;

makeArray(countItems)

/* */
function makeArray(countItems) {
  for (let i = 0; i < countItems; i++){
    let buttonCreate = document.createElement("button");
    let spanCreate = document.createElement("span");
    let count = Number(document.getElementById("current-frame").innerText[0]);
    buttonCreate.classList.add("item");
    buttonCreate.dataset.matrixId = i + 1;
    spanCreate.classList.add("itemVal");
    spanCreate.innerText = i + 1;
    containerNode.appendChild(buttonCreate);
    buttonCreate.appendChild(spanCreate);
    //buttonCreate.style.width = `calc(100%/${count})`;
    //buttonCreate.style.height = `calc(100%/${count})`;
    if (i - 1 === countItems) {
      buttonCreate.style.display = "none";
    }
  }
}

/*Включение музыки по умолчанию */
let isPlay = true
function playAudio(){
  const audio = new Audio();
  audio.src = './media/music.mp3'
}
playAudio()

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
const blankNumber = 16 //пустой элемент
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
      swap(blankCoords, buttonCoords,matrix)
      setPositionItems(matrix)
}})


/*Helpers */
/*Создание матрицы*/
function getMatrix(arr){
  const matrix = [[],[],[],[]]
  let y = 0;
  let x = 0;

  for(let i=0; i<arr.length; i++){
    if(x>=4){
      y++;
      x=0;
    }
    matrix[y][x] = arr[i]
    x++;
  }
  return matrix;
}

/*-------------------*/

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
/*Проверка массива на выйгрыш */
const winFlatArray = new Array(16).fill(0).map((el,i)=>el=i+1)
console.log(winFlatArray)
function isWon(matrix){
  const flatMatrix = matrix.flat();
  for(let i=0; i<winFlatArray.length; i++){
    if(flatMatrix[i]!==winFlatArray[i]){
      return false
    }
  }
return true
}
/*------------------------*/

/*В случае выйгрыша*/
let win = document.querySelector(".win");
function addWonClass(){
  win.classList.add("popup");
  win.innerHTML=`
  <div class="win-container">Hooray! You solved the puzzle in:</div>
  <button class="win-button">OK</button>
  `
  const containerWin = document.querySelector(".win-container")
  // containerWin.append(("0" + hours).slice(-2));
  // containerWin.append(":");
  // containerWin.append(("0" + minutes).slice(-2));
  // containerWin.append(":");
  // containerWin.append(("0" + seconds).slice(-2));
  // containerWin.append(" and ");
  // containerWin.append(moveCount);
  // containerWin.append(" moves");

  const winBtn = document.querySelector('.win-button')
  winBtn.addEventListener('click', goBack)
}

/*Вернуться обратно в игру */
function goBack(){
  win.classList.remove("popup");
}

/*--------------*/

let timer;

function shuffle(){
clearInterval(timer);
let shuffleCount = 0;

  timer = setInterval(()=>{
    randomSwap(matrix)
    setPositionItems(matrix)
    shuffleCount +=1;
    if(shuffleCount >= maxShuffleCount){
      shuffleCount = 0
      clearInterval(timer);
    }
  },50)

}

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