document.addEventListener('DOMContentLoaded',() => {
    // code goes in here
const grid = document.querySelector('.grid')
let squares = Array.from(document.querySelectorAll('.grid div'))
const scoreDisplay = document.querySelector('#score')
const startBtn = document.querySelector('#start-button')
const upBtn = document.querySelector('#up-button');
const downBtn = document.querySelector('#down-button');
const leftBtn = document.querySelector('#left-button');
const rightBtn = document.querySelector('#right-button');
const highScore = document.querySelector('.high_score');
const width = 10
let timerId;
let nextRandom = 0;
let score = 0;
let start = 0;
const colors = ['red', 'orange', 'purple', 'cyan', 'green', 'yellow', 'blue'];

    
highScore.innerHTML = localStorage.getItem('highscore');
    console.log(localStorage.getItem('highscore');

// The Tetris Blocks
const lTetromino = [
    [width+1, width*2+1, width*3+1, width*3+2],
    [width*2, width*2+1, width*2+2, width*3],
    [width, width+1, width*2+1, width*3+1],
    [width+3, width*2+1, width*2+2, width*2+3]
  ]
const jTetromino = [
    [width+2, width*2+2, width*3+1, width*3+2],
    [width+1, width*2+1, width*2+2, width*2+3],
    [width+2, width+3, width*2+2, width*3+2],
    [width*2+1, width*2+2, width*2+3, width*3+3]
]
  const zTetromino = [
    [1,width,width+1,width*2],
    [width, width+1,width*2+1,width*2+2],
    [1,width,width+1,width*2],
    [width, width+1,width*2+1,width*2+2]
  ]
  
  const sTetromino = [
    [width*2+2,width*2+3,width*3+1,width*3+2],
    [width+2,width*2+2,width*2+3,width*3+3],
    [width+2,width+3,width*2+1,width*2+2],
    [width+1,width*2+1,width*2+2,width*3+2]
  ]

  const tTetromino = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const oTetromino = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const iTetromino = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]
  

  const theTetrominoes = [jTetromino, lTetromino, zTetromino, sTetromino, tTetromino, oTetromino, iTetromino]
///////////////////////////////////////////////////////////////////////////////////////////////////////
let random = Math.floor(Math.random()*theTetrominoes.length);

let currentPosition = 3;
let currentRotation = 0;


let current = theTetrominoes [random][currentRotation]

function draw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
        squares[currentPosition + index].style.backgroundColor = colors[random]
    })
}
function undraw(){
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.backgroundColor = ''
        
    })
}
///////////////////////////////////////////////////////////////////////////////////////



//ASIGN function for movements
function control(e){
  if (e.keyCode === 37){
    moveLeft()
   } else if (e.keyCode === 38){
    rotate()
   }else if (e.keyCode === 39){
    moveRight()
   }else if (e.keyCode === 32){
    //slam()
   }

  
}
  

document.addEventListener('keyup', control)
document.addEventListener('keydown', moveDownFast)


function moveDown(){
    if (start) {
    undraw()
    currentPosition += width
    draw()
    freeze()
       }
    }




function moveDownFast(a){
  if (a.keyCode === 40){
    moveDown()
  }
}


//Play Song
var Song = document.getElementById("Tetris-music");

function play_Audio(){
  Song.play();
}
function pause_Audio(){
  Song.pause();
}


//freeze

function freeze(){
    if(current.some(index => squares[currentPosition + index + width].classList.contains("taken"))) {

        current.forEach(index =>squares[currentPosition + index].classList.add('taken'))
    
    //start a new tetris piece falling
    random = nextRandom
    nextRandom = Math.floor(Math.random() * theTetrominoes.length)
    current = theTetrominoes[random][currentRotation]
    currentPosition = 4
    draw()
    displayShape()
    addScore()
    gameOver()

  }
}





//move the tetromino left without it teleporting

function moveLeft() {
if (start) {
  undraw()
  const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
  if(!isAtLeftEdge) currentPosition -=1

  if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
    currentPosition += 1
  }
  draw()
}
}


  function moveRight() {
if (start) {
  undraw()
const isAtRightEdge = current.some(index => (currentPosition + index) % width === width-1 )

if (!isAtRightEdge) currentPosition +=1

if (current.some(index => squares[currentPosition + index].classList.contains('taken'))){
  currentPosition -= 1
}
draw()
}
}
 ///FIX ROTATION OF TETROMINOS A THE EDGE 
 function isAtRight() {
  return current.some(index=> (currentPosition + index + 1) % width === 0)  
}

function isAtLeft() {
  return current.some(index=> (currentPosition + index) % width === 0)
}

function checkRotatedPosition(P){
  P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
  if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
    if (isAtRight()){            //use actual position to check if it's flipped over to right side
      currentPosition += 1    //if so, add one to wrap it back around
      checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
      }
  }
  else if (P % width > 5) {
    if (isAtLeft()){
      currentPosition -= 1
    checkRotatedPosition(P)
    }
  }
}
//rotate tetromino
function rotate()  {
if (start) {
   undraw()
   currentRotation ++
   if(currentRotation === theTetrominoes[random].length){
    currentRotation = 0
   }
   current = theTetrominoes[random][currentRotation]
   draw()
}
}
function slam(){
  timerId = setInterval(moveDown, 0)

  timerId = setInterval(moveDown, 1000)
}


//show next Tetromino
const displaySquares = document.querySelectorAll('.mini-grid div');
const displayWidth = 4;
let displayIndex = 0;


const upNextTetrominos = [
  [displayWidth+2, displayWidth*2+2, displayWidth*3+1, displayWidth*3+2], //J
  [1, displayWidth+1, displayWidth*2+1, 2], //L
  [0, displayWidth, displayWidth+1, displayWidth*2+1], //Z
  [1,displayWidth,displayWidth+1,displayWidth*2], //S
  [1,displayWidth,displayWidth+1,displayWidth+2], //T
  [0,1,displayWidth,displayWidth+1], //O
  [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1] //I
  
]

function displayShape() {
  displaySquares.forEach(square => {
     square.classList.remove('tetromino')
     square.style.backgroundColor = ''
  })
  upNextTetrominos[nextRandom].forEach(  index => {
    displaySquares[displayIndex + index].classList.add('tetromino')
    displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
  })
}

//Start/Pause functionalty
startBtn.addEventListener('click', () => {
  if(timerId) {
    clearInterval(timerId)
    timerId = null
    pause_Audio()
  }else {
    draw()
    timerId = setInterval(moveDown, 500)
    nextRandom =Math.floor(Math.random()*theTetrominoes.length)
    displayShape()
    play_Audio()
    start = 1
  }
})

//on screen control buttons
upBtn.addEventListener('click',() =>{
  rotate();
})
downBtn.addEventListener('click',() =>{
  moveDownInstant();
})
leftBtn.addEventListener('click',() =>{
  moveLeft();
})
rightBtn.addEventListener('click',() =>{
  moveRight();
})


//add score
function addScore(){
  for (let i = 0; i < 199; i+= width){
    
    const row = [i, i+1, i+2, i+3, i+4, i+5,i+6,i+7,i+8,i+9]
  if(row.every(index => squares[index].classList.contains('taken'))){
   score += 10
   scoreDisplay.innerHTML = score
   row.forEach(index => {
    squares[index].classList.remove('taken')
    squares[index].classList.remove('tetromino')
    squares[index].style.backgroundColor = ''
   })
   const squaresRemoved = squares.splice(i, width) 
   squares = squaresRemoved.concat(squares)
   squares.forEach(cell => grid.appendChild(cell))
}
  }
    }
   
    //game over
  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      pause_Audio()
      scoreDisplay.innerHTML = ' Game Over'
      clearInterval(timerId)
      start = 0
      setHightScore()
    }
  }  

    
    
    //high score save tings
    function setHighScore() {
        if(highScore < score){
            localStorage.setItem('highscore', score)
            }}
    
})
