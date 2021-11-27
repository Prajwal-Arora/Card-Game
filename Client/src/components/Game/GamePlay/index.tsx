import React, { useEffect, useState } from "react";
import "./index.css";

import Slider from "react-slick";
import { useLocation } from "react-router-dom";
import {
  useBattleDetail,
  useSocketDetail,
  useWalletDetail,
} from "../../../store/hooks";
import { socketCreateIntegration } from "../../../utils/contractIntegration/socketIntegration";
import { setBattleArray } from "../../../store/reducer/userReducer";
import { useDispatch } from "react-redux";
import UserPlayedDeck from "./PlayingDeck/UserPlayedDeck";
import OpponentDeck from "./PlayingDeck/OpponentDeck";
import ScoreUpdate from "./ScoreUpdate";
import { settings } from "../../../utils/constant/constant";
import GamePlayModal from "./GamePlayModal";

const GamePlay = () => {
  let location: any = useLocation();
  const dispatch = useDispatch();
  const [turn, setTurn] = useState(location.state.owner)
  const [playedDisabled, setPlayedDisabled] = useState(false)
  const [selectedCardDeck, setSelectedCardDeck] = useState(false)
  const [gameWinner, setGameWinner] = useState('')
  const [round, setround] = useState({roundP1: 1,roundP2: 1})
  const [currentRound, setCurrentRound] = useState(1)
  const [winnerRound, setWinnerRound] = useState({p1: '',p2: ''})
  const [battleList, setBattleList] = useState<any>([]);
  const [currentSelectedCard, setcurrentSelectedCard] = useState({})
  const [openLegion, setOpenLegion] = useState(false)
  const [openDiscardedPile, setOpenDiscardedPile] = useState(false)
  const [romulusInDeck, setRomulusInDeck] = useState(false)
  const [playedDeck, setPlayedDeck] = useState<any>([]);
  const [opponentPlayedDeck, setOpponentPlayedDeck] = useState<any>([])
  const [discardedPile,setDiscardedPile]=useState<any>([])
  const [legion,setLegion]=useState<any>([])
  const [score, setScore] = useState<any>({
    p1Score: 0,
    p2Score: 0
  });
  const battleArray = useBattleDetail();
  const walletState: any = useWalletDetail();
  const socket: any = useSocketDetail();

  const handleChangeTurnCardEmit = (array: any[]) => {
    socket.emit("cardClick", JSON.stringify(array));
    if (round.roundP1 === round.roundP2) {
      socket.emit("changeTurn", JSON.stringify(array));
    }
  }

  const handleRemove = (data: any) => {
    //When player played his turn

    if (walletState.accounts[0] === turn) {
      //method call based on player turn
      setPlayedDisabled(false)
      setSelectedCardDeck(false)
      setcurrentSelectedCard(data)
      const array = [data, location.state.owner, walletState.accounts[0], {}];

      if (data.ability !== 'Pila' && data.ability !== 'Son_of_the_Wolf' && data.ability !== 'Ruthless_Tactics' && data.ability !== 'Persuasive_Speech' && data.ability !== 'Man_of_the_People' && data.ability !== 'Dead_Eye' && data.ability !== 'Our_Fearless_Leader' && data.ability!=='Master_Spy' ) {
        //Emit for ability other than javelin
        socket.emit("cardClick", JSON.stringify(array));
        if (round.roundP1 === round.roundP2) {
          socket.emit("changeTurn", JSON.stringify(array));
        }
        setSelectedCardDeck(false)
        setPlayedDisabled(false)
      }
      if (data.ability === 'Pila') {
        //for Javeline
        if (opponentPlayedDeck.length === 0) {
          handleChangeTurnCardEmit(array)
        }
        else {
          setPlayedDeck([...playedDeck, data])
          const opponentDeckItems = opponentPlayedDeck.map((data: any) => {
            if (data.strength <= 3) {
              return false
            }
            return true
          })
          // if opponent player has no card less than strength 3
          if (opponentDeckItems.includes(false) !== true) {
            socket.emit("cardClick", JSON.stringify(array));
            if (round.roundP1 === round.roundP2) {
              socket.emit("changeTurn", JSON.stringify(array));
            }
            setPlayedDisabled(false)
          }
          else {
            setPlayedDisabled(true)
          }
        }
      }

      if (data.ability === 'Son_of_the_Wolf') {
        if (opponentPlayedDeck.length !== 0) {
          setPlayedDeck([...playedDeck, data])
          setPlayedDisabled(true)
        }
        else {
          handleChangeTurnCardEmit(array)
        }
      }
      if (data.ability === 'Ruthless_Tactics') {
        if (opponentPlayedDeck.length !== 0) {
          setPlayedDeck([...playedDeck, data])
          setPlayedDisabled(true)
        }
        else {
          handleChangeTurnCardEmit(array)
        }
      }
      if (data.ability === 'Persuasive_Speech') {
        // setPlayedDeck([...playedDeck, data])
        if (opponentPlayedDeck.length !== 0) {
          const lowest_strength = opponentPlayedDeck.map((item: any) => {
            let arr = item.strength
            return arr
          })
          const lowestArraysLength = opponentPlayedDeck.filter((item: any) => item.strength === Math.min(...lowest_strength)).length
          if (lowestArraysLength === 1) {
            const reqArr = opponentPlayedDeck.find((item: any) => item.strength === Math.min(...lowest_strength))
            if(reqArr.name==='Romulus'){
              const arr = [data, location.state.owner, walletState.accounts[0], {}];
              handleChangeTurnCardEmit(arr)
            }
            else{
              const arr = [data, location.state.owner, walletState.accounts[0], reqArr];
              handleChangeTurnCardEmit(arr)
            }
            
            
            // setPlayedDisabled(true)
          }
          else {
            setPlayedDeck([...playedDeck, data])
            setPlayedDisabled(true)
          }
        }
        else {
          // socket.emit("cardClick", JSON.stringify(array));
          handleChangeTurnCardEmit(array)
        }
      }
      if (data.ability === 'Man_of_the_People') {
        if (playedDeck.length === 0) {
          handleChangeTurnCardEmit(array)
        }
        else {
          setPlayedDisabled(true)
        }

      }
      if (data.ability === 'Dead_Eye') {
        if (opponentPlayedDeck.length !== 0) {
          setPlayedDeck([...playedDeck, data])
          setPlayedDisabled(true)
        }
        else {
          handleChangeTurnCardEmit(array)
        }
      }
      if (data.ability === 'Our_Fearless_Leader') {
       handleChangeTurnCardEmit(array)
      //  setPlayedDisabled(false)
       setRomulusInDeck(true)
      }
      if(data.ability==='Master_Spy'){
        setOpenLegion(true)
        setOpenDiscardedPile(true)
      }
      if(data.ability==='Eagle_Vision'){
        if(discardedPile.length===0){
          handleChangeTurnCardEmit(array)
        }
        else{
          setPlayedDeck([...playedDeck, data])
          setOpenDiscardedPile(true)
        }
      }
    }
  };

  const handleSetBattleState = (battleObj: { playedCardsP1: any; score1: any; score2: any; cardsP1: any; playedCardsP2: any; cardsP2: any;discardedCards1:any,discardedCards2:any,legion1:any,legion2:any}) => {
    if (location.state.owner === walletState.accounts[0]) {
      setPlayedDeck(battleObj.playedCardsP1)
      setDiscardedPile(battleObj?.discardedCards1)
      setLegion(battleObj?.legion1)
      setScore({
        p1Score: battleObj.score1,
        p2Score: battleObj.score2
      })
      setBattleList(battleObj.cardsP1);
      setOpponentPlayedDeck(battleObj.playedCardsP2)
      
    }
    else {
      setPlayedDeck(battleObj.playedCardsP2)
      setLegion(battleObj?.legion2)
      setDiscardedPile(battleObj?.discardedCards2)
      setScore({
        p1Score: battleObj.score2,
        p2Score: battleObj.score1
      })
      setBattleList(battleObj.cardsP2);
      setOpponentPlayedDeck(battleObj.playedCardsP1)
    }
  }

  const checkCurrentRound=(roundP1:any,roundP2:any)=>{
    if(roundP1 ===roundP2){
      if(roundP1===4 && roundP2===4){
        setCurrentRound(3)
      }
      else{
        setCurrentRound(roundP1)
      }
    }
    else{
      if(roundP1>roundP2){
        setCurrentRound(roundP2)
      }
      else{
        setCurrentRound(roundP1)
      }
    }
    
  }

  const handleUpdateBattleArray = () => {
    socket.on("afterEnd", (obj: any) => {
      const battleObj = JSON.parse(obj);
      dispatch(setBattleArray(battleObj));
      setGameWinner(battleObj.winner_g)
      checkCurrentRound(battleObj.roundP1,battleObj.roundP2)
      setround({
        roundP1: battleObj.roundP1,
        roundP2: battleObj.roundP2
      })
      setWinnerRound({
        p1: battleObj.winner_r1,
        p2: battleObj.winner_r2
      })
      handleSetBattleState(battleObj)
    })

    socket.on("updater", (obj: any) => {
      const battleObj = JSON.parse(obj);

      dispatch(setBattleArray(battleObj));
      console.log(battleObj, "----------------------CLICK-------------------------");
      handleSetBattleState(battleObj)
    })
    socket.on("turnChanged", (obj: any) => {
      const battleObj = JSON.parse(obj);
      console.log(battleObj, "----------------------TURN-------------------------");
      setTurn(battleObj.turn)
    })
  }

  useEffect(() => {
    handleUpdateBattleArray()

    if (location.state.owner === walletState.accounts[0]) {
      setBattleList(battleArray.cardsP1);
    } else {
      setBattleList(battleArray.cardsP2);
    }

  }, [socket]);


  return (
    <div className="game-play">
      <div className=" custom-btn-round d-flex align-items-center justify-content-center">
        <div>Round {currentRound}</div>
      </div>
      {turn !== walletState.accounts[0] &&
        (<div className="opponent-turn-wait">
          <div className="d-flex justify-content-center align-items-center opponent-playing">
         
            <div className="mx-3" style={{ color: 'yellow' }}>Opponent is playing...</div>
          </div>
        </div>)
      }
      <div className="opponet-sec mt-2" style={{ height: "90px" }}>
        <OpponentDeck playedDisabled={playedDisabled} setPlayedDisabled={setPlayedDisabled} romulusInDeck={romulusInDeck} handleChangeTurnCardEmit={handleChangeTurnCardEmit} round={round} turn={turn} setSelectedCardDeck={setSelectedCardDeck} selectedCardDeck={selectedCardDeck} ownerAccount={location.state.owner} account={walletState.accounts[0]} socket={socket} currentSelectedCard={currentSelectedCard} opponentPlayedDeck={opponentPlayedDeck} />
      </div>
      <ScoreUpdate currentSelectedCard={currentSelectedCard} turn={turn} round={round} p1Score={score.p1Score} p2Score={score.p2Score} ownerAccount={location.state.owner} account={walletState.accounts[0]} socket={socket} />
      <UserPlayedDeck handleChangeTurnCardEmit={handleChangeTurnCardEmit} turn={turn} setSelectedCardDeck={setSelectedCardDeck} selectedCardDeck={selectedCardDeck} currentSelectedCard={currentSelectedCard} battleList={battleList} playedDeck={playedDeck} ownerAccount={location.state.owner} account={walletState.accounts[0]} socket={socket} opponentPlayedDeck={opponentPlayedDeck} />

      <div
        style={{
          width: "85%",
          margin: "auto",
          height: "100%",
          marginTop: '18px'
        }}
      >
        <Slider {...settings}>
          {battleList?.map((items: any) => (
            <div key={items.id}>
              {(playedDisabled === false || selectedCardDeck) && turn === walletState.accounts[0] ?
                (<img
                  className={turn === walletState.accounts[0] ? "border-style width" : "border-style-not-allowed width"}
                  src={items.battleCard}
                  alt="battle-cards"
                  onClick={() => handleRemove(items)}
                />) :
                (<img
                  style={{ cursor: 'not-allowed' }}
                  className="border-style width"
                  src={items.battleCard}
                  alt="battle-cards"
                />)}
            </div>
          ))}
        </Slider>
      </div>
      <GamePlayModal legion={legion} discardedPile={discardedPile}  currentSelectedCard={currentSelectedCard} handleChangeTurnCardEmit={handleChangeTurnCardEmit} setOpenLegion={setOpenLegion} openLegion={openLegion}  setOpenDiscardedPile={setOpenDiscardedPile} openDiscardedPile={openDiscardedPile}  ownerAccount={location.state.owner} winnerRound={winnerRound} round={round} gameWinner={gameWinner} account={walletState.accounts[0]} />
     
    </div>
  );
};

export default GamePlay;
