import React,{Component} from 'react';

import './App.css';

let localData={};
let highScore = [];
class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      name:'',
      change:0,
      color:"blue",
      gameOver : 0,
      gameScore : 0,
      target:0
      
    }
  }
  startGame = () => {
    let min = 0;
    let max = 63;
    let random = [];
    for(let i = 0 ; i< 8 ; i++){
      let num = Math.floor(Math.random()*(+max - +min))+ min;
      (random.includes(num)?--i:random.push(num));
    }
    let c =0;
    let board = [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0]
    ];
    let diamond = [];
    let color = [
      ["blue","blue","blue","blue","blue","blue","blue","blue"],
      ["blue","blue","blue","blue","blue","blue","blue","blue"],
      ["blue","blue","blue","blue","blue","blue","blue","blue"],
      ["blue","blue","blue","blue","blue","blue","blue","blue"],
      ["blue","blue","blue","blue","blue","blue","blue","blue"],
      ["blue","blue","blue","blue","blue","blue","blue","blue"],
      ["blue","blue","blue","blue","blue","blue","blue","blue"],
      ["blue","blue","blue","blue","blue","blue","blue","blue"]
    ];
    for(let i=0;i<8;i++){
      for(let j=0;j<8;j++){
        if(random.includes(c)){
          board[i][j]=1;
          diamond.push({
            x:i,
            y:j
          })
        }
        else{
          board[i][j] = 0;
        }
        c++;
      }
    }
    console.log(board);
    localData.color = color;
    localData.totalCount = 0;
    localData.diamondCount = 0;
    localData.score = 0;
    localData.display = "none";
    localData.target = 0;
    localData.showScore = 0;
    
    this.Calculate(board, diamond);
    localStorage.setItem("localData", JSON.stringify(localData))
    this.setState({
      color : "blue",
      change : 1,
      target : 0
  });
  }
  calcMin = (i,j,board,diamond) => {
    let min =1000000; 
    let minPos={};
    diamond.map((v)=>{
      let distance = Math.sqrt(((v.x-i)*(v.x-i))+((v.y-j)*(v.y-j)));
      if(distance < min){
        min=distance;
        minPos.x=v.x;
        minPos.y=v.y;
      }
     
    })
    this.setArrow(i,j,minPos,board,diamond);
    console.log(minPos);
   
    
  }
  setArrow = (i,j,min,board,diamond)=>{
    let x = min.x-i;
    let y = min.y-j;
    if(Math.abs(x)>Math.abs(y)){
      if(x < 0){
        board[i][j]=2;
      }
      else{
        board[i][j]=4;
      }
    }else if(Math.abs(y)>=Math.abs(x)){
      if(y<0){
        board[i][j]=5;
      }else{
        board[i][j]=3;
      }
    }
    localData.board = board;
    localData.diamond=diamond;
    localData.minPos = min;
  }
 

  Calculate = (board,diamond)=>{
    board.map((x,i) => {
      x.map((y,j) => {
        if(y !== 1)
          this.calcMin(i,j, board, diamond);
      })
    })
  }
  handleCell = (i,j) => {
    localData = JSON.parse(localStorage.getItem("localData"));
    let pos = 0;
    console.log(localData);
    
    localData.diamond.forEach((ele,index)=>{
      if(ele.x === i && ele.y === j){
        pos = index;
      }
    })
    localData.board.map((x, a) => {
      x.map((y, b) => {
          if(localData.color[a][b] === 'white' && localData.board[a][b] !== -1 && localData.board[a][b] !== 1){
              localData.board[a][b] = -1;
          }
      })
  })
    if(localData.board[i][j]===1 && localData.color[i][j]==='blue'){

      localData.diamondCount +=1;
      localData.totalCount +=1;
      if(localData.diamondCount !== 8 ){
        localData.diamond.splice(pos,1);
        localData.color[i][j] = "white";
        this.Calculate(localData.board,localData.diamond);
        localData.board.map((x, a) => {
          x.map((y, b) => {
              if(localData.color[a][b] === 'white' && localData.board[a][b] !== -1 && localData.board[a][b] !== 1){
                  localData.board[a][b] = -1;
              }
          })
      })
      
        localStorage.setItem("localData",JSON.stringify(localData))
        this.setState({change:1,color:"balck"});

      }else{

        localData.color[i][j]='white';
        localData.showScore = 1;
        localData.display="block";
        localData.target = 1;
        localData.board.map((x, a) => {
          x.map((y, b) => {
              if(localData.color[a][b] === 'blue' && localData.board[a][b] !== -1 && localData.board[a][b] !== 1){
                  localData.totalCount = localData.totalCount + 1;
              }
          })
      })
     
        localStorage.setItem('localData',JSON.stringify(localData))
        // this.calcMin(i,j,localData.board,localData.diamond);
        
        this.setState({
          target:1,
          gameOver:1,
          gameScore:64-localData.totalCount
        })
    }

    }else{
      // alert('ama');
      if(localData.color[i][j]==='blue'){
        localData.totalCount+=1;
      }
      localData.color[i][j] = "white";
      localData.target = 1;
      localData.score = 64- localData.totalCount
      localStorage.setItem("localData",JSON.stringify(localData));

      this.setState({
        name:'',
        change:1,
        color:"blue"
      })
    }
  }

  handleName = (e) => {
    this.setState({
        name : e.target.value
    })
}

saveScore = () => {
  let highScore = JSON.parse(localStorage.getItem('highScore'));
  //alert('prateek');
  let abc = JSON.parse(localStorage.getItem("localData"));
  // alert(obj.total_count);
  let score = {
      name : this.state.name,
      score : abc.score
  }
  if(highScore == null){
      highScore =[];
      highScore.push(score);
      highScore.sort((a, b) => {

          if(parseInt(a.score) < parseInt(b.score)){
              return 1;
          } else{
              return -1;
          }
      })
      localStorage.setItem("highScore", JSON.stringify(highScore))

      this.setState({
          name: ''
      })
  }
  else if(highScore.length <10) {
      highScore.push(score);
      highScore.sort((a, b) => {

          if(parseInt(a.score) < parseInt(b.score)){
              return 1;
          } else{
              return -1;
          }
      })
      localStorage.setItem("highScore", JSON.stringify(highScore))

      this.setState({
          name: ''
      })
  }
  
}



  render(){
    let abc = JSON.parse(localStorage.getItem("localData"));
      
    let leaderBoard = JSON.parse(localStorage.getItem("highScore"));
      return (
        <div class="container app">

          <div>
            {(abc !== null)?((abc.showScore === 1)?<span><h2>Game Over</h2> <h3>Your Score : {abc.score}</h3></span>:null):null}
          </div>
          <div>
            Score : {(abc !== null)?(64-abc.totalCount):0}
          </div>
        <button type="button" onClick={this.startGame}>Start Game</button>
        {abc !== null?((abc.showScore===1)?<button data-toggle="modal" data-target="#mymodal">Save Score</button>:null):null}
        {abc!=null?<button data-toggle="modal" data-target="#mymodal2">Leaderboard</button>:null}
        <div className="container">
          <div className="row">
            <div className="col col-sm-6 col-md-6 offset-md-3 col-xs-6 offset-xs-3 offset-sm-3 ">
            <table>
                <tbody>
                    {(abc !== null)?((abc.board.map((x, i) => {
                       return (<tr>
                        {x.map((y, j) => {
                           return <td style={{backgroundColor : abc.color[i][j]}} onClick={()=>{this.handleCell(i,j)}} >{(y === 2)?<span className="fa fa-long-arrow-up"></span>:((y === 3)?<span className="fa fa-long-arrow-right"></span>:((y === 4)?<span className="fa fa-long-arrow-down"></span>:((y === 5)?<span className="fa fa-long-arrow-left"></span>:((y === -1)?<span></span>:<span className="fa fa-diamond"></span>))))}</td>
                        })}
                        </tr>)
                    }))):null
                    }
                </tbody>
            </table>
            </div>
          </div>
           
        </div>
        
        {(abc!== null && abc.showScore === 1)?<div class="modal" id="mymodal">
                    <div class="modal-dialog">
                        <div class="modal-content">

                        
                        <div class="modal-header">
                            <h4 class="modal-title">Save Your Score</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>

                        
                        <div class="modal-body">
                            <form>
                                <div className="row input">
                                    <span> Enter Your Name :</span>
                                    <span id="input_span"><input type="text" className="form-control" id="input_name" value={this.state.name} onChange={this.handleName} /></span>
                                </div>
                                <br />
                                <div className="row input">
                                    <span>Your Score :</span>
                                    <span id="score_span"><input type="text" value={abc.score} className="form-control" id="input_name"/></span>
                                </div>
                                <br />
                                <div >
                                    <button type="button" className="btn btn-success" data-dismiss="modal" onClick={this.saveScore}>Save</button>
                                </div>
                            </form>
                        </div>
                      </div>
                    </div>
                </div>:null}



                {leaderBoard!==null? <div class="modal" id="mymodal2">
                    <div class="modal-dialog">
                        <div class="modal-content">

                        
                        <div class="modal-header">
                            <h4 class="modal-title">Leader Board</h4>
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                        </div>

                        
                        <div class="modal-body">
                            <ul>
                              {
                                leaderBoard.map(leader => {
                                  return (
                                    <li>{leader.name} : {leader.score}</li>
                                  )
                                })
                              }
                            
                            </ul>
                        </div>
                      </div>
                    </div>
                </div>:null}
               






        </div>
      )
  }
}

export default App;
