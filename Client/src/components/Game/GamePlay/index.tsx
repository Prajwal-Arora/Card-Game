import React, { useCallback, useEffect, useState } from "react";
import "./index.css";
import Slider from "react-slick";
import { useHistory, useLocation } from "react-router-dom";
import {
  useBattleDetail,
  useSocketDetail,
  useUserDetail,
  useWalletDetail,
} from "../../../store/hooks";
import {
  setBattleArray,
  setEndClick,
  setEventClickable,
} from "../../../store/reducer/userReducer";
import { useDispatch } from "react-redux";
import UserPlayedDeck from "./PlayingDeck/UserPlayedDeck";
import OpponentDeck from "./PlayingDeck/OpponentDeck";
import ScoreUpdate from "./ScoreUpdate";
import { settings } from "../../../utils/config/constant/constant";
import GamePlayModal from "./GamePlayModal";
import useSound from "use-sound";
import CardInfoModal from "../CardList/CardInfoModal";
import PoolTimer from "../../common/PoolTimer";
import { toast, ToastContainer } from "react-toastify";
import {
  handleGameVictoryScreen,
  handleRoundEnd,
} from "../../../utils/SocketCommon";
import { debounce, throttle } from "lodash";
const TurnPlayMusic = require("../../../assets/Sounds/Card Played.mp3");

const GamePlay = () => {
  let location: any = useLocation();
  let history = useHistory();
  const dispatch = useDispatch();
  const [playTurnSound] = useSound(TurnPlayMusic.default);
  const userDetails = useUserDetail()
  const [showModal, setModal] = useState<any>("");
  const [turn, setTurn] = useState(location.state.owner);
  const [playedDisabled, setPlayedDisabled] = useState(false);
  const [selectedCardDeck, setSelectedCardDeck] = useState(false);
  const [gameWinner, setGameWinner] = useState("");
  const [round, setround] = useState({ roundP1: 1, roundP2: 1 });
  const [currentRound, setCurrentRound] = useState(1);
  const [winnerRound, setWinnerRound] = useState({ p1: "", p2: "" });
  const [battleList, setBattleList] = useState<any>([]);
  
  const [battleListOpponent, setBattleListOpponent] = useState<any>([]);
  const [currentSelectedCard, setcurrentSelectedCard] = useState({});
  const [openLegion, setOpenLegion] = useState(false);
  const [openDiscardedPile, setOpenDiscardedPile] = useState(false);
  const [openExploratoryModal, setOpenExploratoryModal] = useState(false);
  const [filibusterPresentRemus, setFilibusterPresentRemus] = useState(false);
  const [timerOff, setTimerOff] = useState(false);
  const [filibusterPresentRomulus, setFilibusterPresentRomulus] =
    useState(false);
  const [playedDeck, setPlayedDeck] = useState<any>([]);
  const [opponentPlayedDeck, setOpponentPlayedDeck] = useState<any>([]);
  const [discardedPile, setDiscardedPile] = useState<any>([]);
  const [isDraw, setIsDraw] = useState(false);
  const [roundModalDraw, setroundModalDraw] = useState(false);
  const [resetCounter, setResetCounter] = useState(true);
  const [legion, setLegion] = useState<any>([]);
  const [score, setScore] = useState<any>({
    p1Score: 0,
    p2Score: 0,
  });
  const battleArray = useBattleDetail();
  const walletState: any = useWalletDetail();
  const socket: any = useSocketDetail();

  window.onbeforeunload = function () {
    return "Your work will be lost.";
  };

  useEffect(() => {
    setResetCounter(false);
    setTimeout(() => {
      setResetCounter(true);
    }, 1);
  }, [userDetails.eventClickable]);

  useEffect(() => {
    handleUpdateBattleArray();

    if (location.state.owner === walletState.accounts[0]) {
      setBattleList(battleArray.cardsP1);
      setBattleListOpponent(battleArray.cardsP2);
      setDiscardedPile(battleArray.discardedCards1);
      setLegion(battleArray.legion1);
    } else {
      setBattleList(battleArray.cardsP2);
      setBattleListOpponent(battleArray.cardsP1);
      setDiscardedPile(battleArray.discardedCards2);
      setLegion(battleArray.legion2);
    }
  }, [socket]);

  const handleRedirect = useCallback(
    (team) => {
      history.push({
        pathname: "/game-winner",
        search: team,
      });
    },
    [history]
  );

  const isFilibusterPresentDeck=(count:number)=>{
    if (count > 0) {
      if (battleArray.team1 === "Remus") {
        setFilibusterPresentRemus(true);
      }
      if (battleArray.team1 === "Romulus") {
        setFilibusterPresentRomulus(true);
      }
    }
    else{
      if (battleArray.team1 === "Remus") {
        setFilibusterPresentRemus(false);
      }
      if (battleArray.team1 === "Romulus") {
        setFilibusterPresentRomulus(false);
      }
    }
  }

  useEffect(() => {
    handleGameVictoryScreen(
      gameWinner,
      battleArray.player1,
      battleArray.team1,
      handleRedirect
    );
  }, [currentSelectedCard, gameWinner, turn]);

  const handleChangeTurnCardEmit = (array: any[]) => {
    socket.emit("cardClick", JSON.stringify(array));
    if (round.roundP1 === round.roundP2) {
      socket.emit("changeTurn", JSON.stringify(array));
      dispatch(setEventClickable(false))
      // setFlag(false)
    }
  };

  useEffect(() => {
    dispatch(setEventClickable(true))
    // setFlag(true)
  }, [turn])

  //Check filibuster
  useEffect(() => {
    
    if (location.state.owner === walletState.accounts[0]) {
      const count = battleArray.playedCardsP2.filter(
        (item: any) => item.name === "Filibuster"
      ).length;
      isFilibusterPresentDeck(count)
    } else {
      const count = battleArray.playedCardsP1.filter(
        (item: any) => item.name === "Filibuster"
      ).length;
      isFilibusterPresentDeck(count)
    }
  }, [
    battleArray.cardsP1,
    battleArray.playedCardsP1,
    battleArray.playedCardsP2,
    battleArray.team1,
    location.state.owner,
    walletState.accounts,
  ]);

  const delayCardPlay = () => {
    if (location.state.owner===walletState.accounts[0]) {
      const arr = [location.state.owner];
      socket.emit("inactive", JSON.stringify(arr));
    }
    else{
      handleRoundEnd(
        currentSelectedCard,
        location.state.owner,
        walletState.accounts[0],
        turn,
        socket
      );
    }
    dispatch(setEndClick(true));
  };

  const handleRemove = (event: any, data: any) => {
    // setFlag(false);
    //When player played his turn
    playTurnSound();
    if (walletState.accounts[0] === turn) {
      const onlyUniversalCard =
        opponentPlayedDeck.filter(
          (item: any) =>
            item.class === "utility" || item.class === "Status_Effect"
        ).length === opponentPlayedDeck.length;
      //method call based on player turn
      setPlayedDisabled(false);
      setSelectedCardDeck(false);
      setcurrentSelectedCard(data);
      const array = [data, location.state.owner, walletState.accounts[0], {}];

      if (
        data.ability !== "Pila" &&
        data.ability !== "Son_of_the_Wolf" &&
        data.ability !== "Ruthless_Tactics" &&
        data.ability !== "Persuasive_Speech" &&
        data.ability !== "Man_of_the_People" &&
        data.ability !== "Dead_Eye" &&
        data.ability !== "Our_Fearless_Leader" &&
        data.ability !== "Master_Spy" &&
        data.ability !== "Diplomat" &&
        data.ability !== "Reinforcements" &&
        data.ability !== "Exploratores" &&
        data.ability !== "Eyes_on_the_Prize" &&
        data.ability !== "Praetorian_Guard"
      ) {
        handleChangeTurnCardEmit(array);
        setSelectedCardDeck(false);
        setPlayedDisabled(false);
      }
      if (data.ability === "Pila") {
        //for Javeline
        if (opponentPlayedDeck.length !== 0 && !onlyUniversalCard) {
          setPlayedDeck([...playedDeck, data]);
          const cardMoreThan3 =
            opponentPlayedDeck.filter((item: any) => item.strength > 3)
              .length ===
            opponentPlayedDeck.filter(
              (item: any) =>
                item.class !== "Utility" && item.class !== "Status_Effect"
            ).length;
          // if opponent player has no card less than strength 3
          if (cardMoreThan3) {
            handleChangeTurnCardEmit(array);
            setPlayedDisabled(false);
          } else {
            toast("Select enemy card to discard");
            setPlayedDisabled(true);
          }
        } else {
          handleChangeTurnCardEmit(array);
        }
      }

      if (data.ability === "Son_of_the_Wolf") {
        if (opponentPlayedDeck.length !== 0 && !onlyUniversalCard) {
          toast("Select enemy card to discard");
          setPlayedDeck([...playedDeck, data]);
          setPlayedDisabled(true);
        } else {
          handleChangeTurnCardEmit(array);
        }
      }
      if (data.ability === "Ruthless_Tactics") {
        if (filibusterPresentRemus) {
          handleChangeTurnCardEmit(array);
        } else {
          if (opponentPlayedDeck.length !== 0 && !onlyUniversalCard) {
            toast("Select enemy class to half");
            setPlayedDeck([...playedDeck, data]);
            setPlayedDisabled(true);
          } else {
            handleChangeTurnCardEmit(array);
          }
        }
      }
      if (data.ability === "Persuasive_Speech") {
        // setPlayedDeck([...playedDeck, data])
        if (filibusterPresentRemus) {
          handleChangeTurnCardEmit(array);
        } else {
          if (opponentPlayedDeck.length !== 0 && !onlyUniversalCard) {
            const lowest_strength = opponentPlayedDeck
              .filter(
                (arr: any) =>
                  arr.class !== "Utility" && arr.class !== "Status_Effect"
              )
              .map((item: any) => {
                let arr = item.strength;
                return arr;
              });
            const lowestArraysLength = opponentPlayedDeck.filter(
              (item: any) => item.strength === Math.min(...lowest_strength)
            ).length;
            if (lowestArraysLength === 1) {
              const reqArr = opponentPlayedDeck.find(
                (item: any) => item.strength === Math.min(...lowest_strength)
              );
              if (reqArr.name === "Romulus") {
                const arr = [
                  data,
                  location.state.owner,
                  walletState.accounts[0],
                  {},
                ];
                handleChangeTurnCardEmit(arr);
              } else {
                const arr = [
                  data,
                  location.state.owner,
                  walletState.accounts[0],
                  reqArr,
                ];
                handleChangeTurnCardEmit(arr);
              }

              // setPlayedDisabled(true)
            } else {
              // toast("Pick the enemy troop with the lowest strength on the field and move them to your side.")
              setPlayedDeck([...playedDeck, data]);
              setPlayedDisabled(true);
            }
          } else {
            handleChangeTurnCardEmit(array);
          }
        }
      }
      if (data.ability === "Man_of_the_People") {
        if (filibusterPresentRomulus) {
          handleChangeTurnCardEmit(array);
        } else {
          if (playedDeck.length === 0) {
            handleChangeTurnCardEmit(array);
          } else {
            toast("Select a class to double ");
            setPlayedDisabled(true);
          }
        }
      }
      if (data.ability === "Dead_Eye") {
        const cardMoreThan6 =
          opponentPlayedDeck.filter((item: any) => item.strength > 6).length ===
          opponentPlayedDeck.filter(
            (item: any) =>
              item.class !== "Utility" && item.class !== "Status_Effect"
          ).length;
        if (
          opponentPlayedDeck.length !== 0 &&
          !cardMoreThan6 &&
          !onlyUniversalCard
        ) {
          toast("Select enemy card to discard");
          setPlayedDeck([...playedDeck, data]);
          setPlayedDisabled(true);
        } else {
          handleChangeTurnCardEmit(array);
        }
      }
      if (data.ability === "Our_Fearless_Leader") {
        handleChangeTurnCardEmit(array);
        //  setPlayedDisabled(false)
      }
      if (data.ability === "Master_Spy") {
        if (legion.length === 0 && discardedPile.length === 0) {
          const arr = [
            data,
            location.state.owner,
            walletState.accounts[0],
            {},
            {},
          ];
          handleChangeTurnCardEmit(arr);
        } else if (legion.length === 0 && discardedPile.length !== 0) {
          setOpenDiscardedPile(true);
        } else if (legion.length !== 0 && discardedPile.length === 0) {
          setOpenLegion(true);
        } else {
          // toast("Pick a card from your Legion and discarded pile");
          setOpenLegion(true);
          setOpenDiscardedPile(true);
        }
      }
      if (data.ability === "Diplomat") {
        if (filibusterPresentRomulus) {
          handleChangeTurnCardEmit(array);
        } else {
          if (legion.length === 0) {
            handleChangeTurnCardEmit(array);
          } else {
            // toast("Pick a card from your Legion");
            setOpenLegion(true);
          }
        }
      }
      if (data.ability === "Reinforcements") {
        if (legion.length === 0) {
          handleChangeTurnCardEmit(array);
        } else {
          setOpenLegion(true);
        }
      }
      if (data.ability === "Eyes_on_the_Prize") {
        if (battleListOpponent.length !== 0) {
          toast("Select two cards to view and click to again discard one");
          setOpenExploratoryModal(true);
        } else {
          handleChangeTurnCardEmit(array);
        }
      }
      if (data.ability === "Praetorian_Guard") {
        if (playedDeck.length !== 0) {
          toast("Select a card to protect");
          setPlayedDisabled(true);
        } else {
          handleChangeTurnCardEmit(array);
        }
      }
    }
  };

  const modal = (items: any) => {
    return (
      <>
        <CardInfoModal
          css={{
            top: "1rem",
            left: "1rem",
            borderRadius: "24px",
          }}
          battleCard={items}
        />
      </>
    );
  };
  const handleSetBattleState = (battleObj: {
    playedCardsP1: any;
    score1: any;
    score2: any;
    cardsP1: any;
    playedCardsP2: any;
    cardsP2: any;
    discardedCards1: any;
    discardedCards2: any;
    legion1: any;
    legion2: any;
  }) => {
    if (location.state.owner === walletState.accounts[0]) {
      setPlayedDeck(battleObj.playedCardsP1);
      setDiscardedPile(battleObj?.discardedCards1);
      setLegion(battleObj?.legion1);
      setScore({
        p1Score: battleObj.score1,
        p2Score: battleObj.score2,
      });
      setBattleList(battleObj.cardsP1);
      setBattleListOpponent(battleObj.cardsP2);
      setOpponentPlayedDeck(battleObj.playedCardsP2);
    } else {
      setPlayedDeck(battleObj.playedCardsP2);
      setLegion(battleObj?.legion2);
      setDiscardedPile(battleObj?.discardedCards2);
      setScore({
        p1Score: battleObj.score2,
        p2Score: battleObj.score1,
      });
      setBattleList(battleObj.cardsP2);
      setBattleListOpponent(battleObj.cardsP1);
      setOpponentPlayedDeck(battleObj.playedCardsP1);
    }
  };

  const checkCurrentRound = (roundP1: any, roundP2: any) => {
    if (roundP1 === roundP2) {
      if (roundP1 === 4 && roundP2 === 4) {
        setCurrentRound(3);
      } else {
        setCurrentRound(roundP1);
      }
    } else {
      if (roundP1 > roundP2) {
        setCurrentRound(roundP2);
      } else {
        setCurrentRound(roundP1);
      }
    }
  };

  const handleUpdateBattleArray = () => {
    socket.on("afterEnd", (obj: any) => {
      const battleObj = JSON.parse(obj);
      console.log(battleObj, "After End");
      dispatch(setBattleArray(battleObj));
      setGameWinner(battleObj.winner_g);
      checkCurrentRound(battleObj.roundP1, battleObj.roundP2);
      setround({
        roundP1: battleObj.roundP1,
        roundP2: battleObj.roundP2,
      });
      setWinnerRound({
        p1: battleObj.winner_r1,
        p2: battleObj.winner_r2,
      });
      handleSetBattleState(battleObj);
    });
    if (userDetails.eventClickable === true) {
      socket.on("updater", (obj: any) => {
        const battleObj = JSON.parse(obj);
        dispatch(setBattleArray(battleObj));
        console.log(
          battleObj,
          "----------------------CLICK-------------------------"
        );
        handleSetBattleState(battleObj);
        // setFlag(true);
      });

      socket.on("turnChanged", (obj: any) => {
        const battleObj = JSON.parse(obj);
        console.log(
          battleObj,
          "----------------------TURN-------------------------"
        );
        setTurn(battleObj.turn);
      });
    };
  }


  socket.on("draw", (obj: any) => {
    setTimerOff(true);
    setIsDraw(true);
    setroundModalDraw(true);
    const battleObj = JSON.parse(obj);
    dispatch(setBattleArray(battleObj));
  });

  socket.on("d2", (obj: any) => {
    const battleObj = JSON.parse(obj);
    handleSetBattleState(battleObj);
    dispatch(setBattleArray(battleObj));
    if (
      battleObj.playedCardsP1.length !== 0 &&
      battleObj.playedCardsP2.length !== 0
    ) {
      setTimeout(() => {
        const arr = [location.state.owner];
        socket.emit("new", JSON.stringify(arr));
      }, 2500);
    }
  });



  const handleHover = (items: any) => {
    setModal(modal(items));
  };
  const handleLeave = () => {
    setModal("");
  };

  return (
    <>
      <div className="game-play">
        <div className=" custom-btn-round d-flex align-items-center justify-content-center">
          <div>Round {currentRound}</div>
        </div>
        {turn !== walletState.accounts[0] ? (
          <div className="opponent-turn-wait">
            <div className="d-flex justify-content-center align-items-center opponent-playing">
              <div className="mx-3" style={{ color: "yellow" }}>
                Opponent is playing...
              </div>
            </div>
          </div>
        ) : resetCounter && !timerOff ? (
          <div className="opponent-turn-wait">
            <div className="d-flex justify-content-center align-items-center">
              <PoolTimer time={90} response={delayCardPlay} />
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="d-flex justify-content-end opponent-card-left">
          {battleListOpponent.length}
        </div>
        <div className="opponet-sec mt-2" style={{ height: "90px" }}>
          <OpponentDeck
            playTurnSound={playTurnSound}
            filibusterPresentRemus={filibusterPresentRemus}
            filibusterPresentRomulus={filibusterPresentRomulus}
            playedDisabled={playedDisabled}
            setPlayedDisabled={setPlayedDisabled}
            handleChangeTurnCardEmit={handleChangeTurnCardEmit}
            round={round}
            turn={turn}
            setSelectedCardDeck={setSelectedCardDeck}
            selectedCardDeck={selectedCardDeck}
            ownerAccount={location.state.owner}
            account={walletState.accounts[0]}
            socket={socket}
            currentSelectedCard={currentSelectedCard}
            opponentPlayedDeck={opponentPlayedDeck}
          />
        </div>

        <ScoreUpdate
          isDraw={isDraw}
          currentSelectedCard={currentSelectedCard}
          turn={turn}
          round={round}
          p1Score={score.p1Score}
          p2Score={score.p2Score}
          ownerAccount={location.state.owner}
          account={walletState.accounts[0]}
          socket={socket}
        />
        <UserPlayedDeck
          playTurnSound={playTurnSound}
          handleChangeTurnCardEmit={handleChangeTurnCardEmit}
          turn={turn}
          setSelectedCardDeck={setSelectedCardDeck}
          selectedCardDeck={selectedCardDeck}
          currentSelectedCard={currentSelectedCard}
          battleList={battleList}
          playedDeck={playedDeck}
          ownerAccount={location.state.owner}
          account={walletState.accounts[0]}
          socket={socket}
          opponentPlayedDeck={opponentPlayedDeck}
        />
        {userDetails.eventClickable ? (
          <div className="game-play-corousel">
            <Slider {...settings}>
              {battleList?.map((items: any) => (
                <div key={items.id}>
                  {(playedDisabled === false || selectedCardDeck) &&
                    turn === walletState.accounts[0] ? (
                    <div
                      className="p-game-play"
                      onMouseLeave={() => handleLeave()}
                    >
                      <div
                        className={`card bottom-card-row relative ${turn === walletState.accounts[0]
                            ? "border-style"
                            : "border-style-not-allowed"
                          }`}
                        key={items.id}
                      >
                        <div
                          className="hover-detail-gplay"
                          onMouseOver={() => handleHover(items)}
                        >
                          i
                        </div>
                        <img
                          src={items.battleCard}
                          alt="battle-cards"
                          onClick={(event) => handleRemove(event, items)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      className="p-game-play"
                      onMouseLeave={() => handleLeave()}
                    >
                      {" "}
                      <div
                        className="card border-style bottom-card-row relative p-game-play"
                        key={items.id}
                      >
                        <div
                          className="hover-detail-gplay"
                          onMouseOver={() => handleHover(items)}
                        >
                          i
                        </div>
                        <img
                          style={{ cursor: "not-allowed", width: "100%" }}
                          src={items.battleCard}
                          alt="battle-cards"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </Slider>
            <div className="gplay-modal">{showModal}</div>
          </div>
        ) : (
          <>
            {" "}
            <div className="game-play-corousel">
              <Slider {...settings}>
                {battleList?.map((items: any) => (
                  <div key={items.id}>
                    {(playedDisabled === false || selectedCardDeck) &&
                      turn === walletState.accounts[0] ? (
                      <div
                        className="p-game-play"
                        onMouseLeave={() => handleLeave()}
                      >
                        <div
                          className={`card bottom-card-row relative ${turn === walletState.accounts[0]
                              ? "border-style"
                              : "border-style-not-allowed"
                            }`}
                          key={items.id}
                        >
                          <div
                            className="hover-detail-gplay"
                            onMouseOver={() => handleHover(items)}
                          >
                            i
                          </div>
                          <img src={items.battleCard} alt="battle-cards" />
                        </div>
                      </div>
                    ) : (
                      <div
                        className="p-game-play"
                        onMouseLeave={() => handleLeave()}
                      >
                        {" "}
                        <div
                          className="card border-style bottom-card-row relative p-game-play"
                          key={items.id}
                        >
                          <div
                            className="hover-detail-gplay"
                            onMouseOver={() => handleHover(items)}
                          >
                            i
                          </div>
                          <img
                            style={{ cursor: "not-allowed", width: "100%" }}
                            src={items.battleCard}
                            alt="battle-cards"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </Slider>
              <div className="gplay-modal">{showModal}</div>
            </div>
          </>
        )}
        <div className="d-flex justify-content-end user-card-left">
          {battleList.length}
        </div>
        <GamePlayModal
          socket={socket}
          roundModalDraw={roundModalDraw}
          battleListOpponent={battleListOpponent}
          openExploratoryModal={openExploratoryModal}
          setOpenExploratoryModal={setOpenExploratoryModal}
          opponentPlayedDeck={opponentPlayedDeck}
          legion={legion}
          discardedPile={discardedPile}
          currentSelectedCard={currentSelectedCard}
          handleChangeTurnCardEmit={handleChangeTurnCardEmit}
          setOpenLegion={setOpenLegion}
          openLegion={openLegion}
          setOpenDiscardedPile={setOpenDiscardedPile}
          openDiscardedPile={openDiscardedPile}
          ownerAccount={location.state.owner}
          winnerRound={winnerRound}
          round={round}
          gameWinner={gameWinner}
          account={walletState.accounts[0]}
          setIsDraw={setIsDraw}
          isDraw={isDraw}
        />
        {/* <ToastContainer toastClassName="toastr" progressClassName="toastProgress"/> */}
      </div>
    </>
  );
};

export default GamePlay;
