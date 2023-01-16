
let puzzle = document.getElementById("puzzle");
let framesSize = Array.from(document.querySelectorAll(".frameItem"));
let frame = document.getElementById("current-frame");
let itemNodes = Array.from(document.querySelectorAll('.item'))

frame.textContent = "4x4";
let moveCount = 0;


/*Количество пятнашек */
let countItems = 16;


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
document.getElementById("shuffle").addEventListener('click',()=>{
  const flatMatrix = matrix.flat();
})


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
