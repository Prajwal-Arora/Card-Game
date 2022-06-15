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
import { BsInfoLg } from "react-icons/bs";
import useSound from "use-sound";
import PoolTimer from "../../common/PoolTimer";
import { toast } from "react-toastify";
import {
  // handleChangeTurnCardEmit,
  handleGameVictoryScreen,
  handleRoundEnd,
  refreshCardSelection,
  refreshScreen,
  roomDelete,
} from "../../../utils/SocketCommon";
import { cardDetailModal } from "../../../utils/CommonUsedFunction";
import { getLocalStore, setLocalStore } from "../../../common/localStorage";
import { refreshMessage } from "../../../utils/config/constant/notificationText";
import { putLosses } from "../../../services/apiService/userServices";
import { apiHandler } from "../../../services/apiService/axios";
const TurnPlayMusic = require("../../../assets/Sounds/Card Played.mp3");

const GamePlay = () => {
  let location: any = useLocation();
  let history = useHistory();
  const dispatch = useDispatch();
  const [playTurnSound] = useSound(TurnPlayMusic.default);
  const userDetails = useUserDetail();
  const [showModal, setModal] = useState<any>("");
  const [turn, setTurn] = useState();
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
  const [roundShow, setRoundShow] = useState(false);
  const [resetCounter, setResetCounter] = useState(true);
  const [legion, setLegion] = useState<any>([]);
  const [score, setScore] = useState<any>({
    p1Score: 0,
    p2Score: 0,
  });
  const battleArray = useBattleDetail();
  const walletState: any = useWalletDetail();
  const socket: any = useSocketDetail();

  window.onoffline = function () {
    toast("Your Internet is disconnected")
    return true;
  };

  window.onbeforeunload = function () {
    //  user closes the tab
    apiHandler(
      () => putLosses(getLocalStore('userName'))
    );
    refreshScreen(location?.state?.owner, socket)
    roomDelete(socket, location?.state.owner, getLocalStore('userName'))
   
    return true
  }

  window.onload = () => {
    
    history.push('/')
  }


  useEffect(() => {
    if (getLocalStore('battleArray').winner_g) {
      handleGameVictoryScreen(
        getLocalStore('battleArray').winner_g,
        getLocalStore('battleArray').player1,
        getLocalStore('battleArray').team1,
        refreshMessage,
        handleRedirect,
        history
      );
    }
    refreshCardSelection(dispatch, socket, history)
  }, [socket, getLocalStore('battleArray')]);



  useEffect(() => {
    setResetCounter(false);
    setTimeout(() => {
      setResetCounter(true);
    }, 1);
  }, [userDetails.eventClickable, battleList?.length, battleArray?.cardsP1?.length, battleArray?.cardsP2?.length]);

  const stackedCards = (cardDeck: any) => {
    let deck: any = [];
    let uniqueChars = cardDeck.map((i: any) => i.name).filter((c: any, index: any, ar: any) => {
      return ar.indexOf(c) === index;
    });
    const c = uniqueChars?.map((name: any) => {
      const a = cardDeck?.filter((current: any) => {
        return current?.name === name;
      });
      deck.push(a);
    });
    setPlayedDeck(deck);
  };

  useEffect(() => {
    setLocalStore('battleArray', battleArray)
    handleUpdateBattleArray();
    setTurn(battleArray.turn);
    if (location?.state?.owner === walletState.userName) {
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

  const isFilibusterPresentP1Deck = (count: number) => {
    if (count > 0) {
      if (battleArray.team1 === "Remus") {
        setFilibusterPresentRemus(true);
      }
      if (battleArray.team1 === "Romulus") {
        setFilibusterPresentRomulus(true);
      }
    } else {
      if (battleArray.team1 === "Remus") {
        setFilibusterPresentRemus(false);
      }
      if (battleArray.team1 === "Romulus") {
        setFilibusterPresentRomulus(false);
      }
    }
  };

  const isFilibusterPresentP2Deck = (count: number) => {
    if (count > 0) {
      if (battleArray.team1 === "Remus") {
        setFilibusterPresentRomulus(true);
      }
      if (battleArray.team1 === "Romulus") {
        setFilibusterPresentRemus(true);
      }
    } else {
      if (battleArray.team1 === "Remus") {
        setFilibusterPresentRomulus(false);
      }
      if (battleArray.team1 === "Romulus") {
        setFilibusterPresentRemus(false);
      }
    }
  };

  useEffect(() => {
    if (
      round.roundP1 === round.roundP2 &&
      round.roundP1 !== 1 &&
      round.roundP2 !== 1
    ) {
      setRoundShow(true);
    }
  }, [round.roundP1, round.roundP2]);



  useEffect(() => {
    dispatch(setEventClickable(true));
  }, [turn]);

  //Check filibuster
  useEffect(() => {
    if (location?.state?.owner === walletState?.userName) {
      const count = battleArray?.playedCardsP2?.filter(
        (item: any) => item.name === "Filibuster"
      ).length;
      isFilibusterPresentP1Deck(count);
    } else {
      const count = battleArray?.playedCardsP1?.filter(
        (item: any) => item.name === "Filibuster"
      ).length;
      isFilibusterPresentP2Deck(count);
    }
  }, [
    battleArray?.round,
    battleArray?.cardsP1,
    battleArray?.playedCardsP1,
    battleArray?.playedCardsP2,
    battleArray?.team1,
    location?.state?.owner,
    walletState.userName,
  ]);

  const delayCardPlay = () => {
    if (location.state.owner === walletState.userName) {
      const arr = [location.state.owner];
      socket.emit("inactive", JSON.stringify(arr));
    } else {
      handleRoundEnd(
        currentSelectedCard,
        location.state.owner,
        walletState.userName,
        turn,
        socket
      );
    }
    dispatch(setEndClick(true));
  };

  const handleChangeTurnCardEmit = (array: any[]) => {
    socket.emit("cardClick", JSON.stringify(array));
    if (round.roundP1 === round.roundP2) {
      socket.emit("changeTurn", JSON.stringify(array));
      dispatch(setEventClickable(false));
      // setFlag(false)
    }
  };

  const handleRemove = (event: any, data: any) => {
    // setFlag(false);
    //When player played his turn
    playTurnSound();
    if (walletState.userName === turn) {
      const onlyUniversalCard =
        opponentPlayedDeck.filter(
          (item: any) =>
            item.class === "utility" || item.class === "Status_Effect"
        ).length === opponentPlayedDeck.length;
      //method call based on player turn
      setPlayedDisabled(false);
      setSelectedCardDeck(false);
      setcurrentSelectedCard(data);
      const array = [data, location.state.owner, walletState.userName, {}];

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
          // setPlayedDeck([...playedDeck, data]);
          const cardMoreThan3 =
            opponentPlayedDeck.filter((item: any) => item.strength > data.strength)
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
          // setPlayedDeck([...playedDeck, data]);
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
            // setPlayedDeck([...playedDeck, data]);
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
                  walletState.userName,
                  {},
                ];
                handleChangeTurnCardEmit(arr);
              } else {
                const arr = [
                  data,
                  location.state.owner,
                  walletState.userName,
                  reqArr,
                ];
                handleChangeTurnCardEmit(arr);
              }

              // setPlayedDisabled(true)
            } else {
              toast("Pick the enemy troop with the lowest strength on the field and move them to your side.")
              // setPlayedDeck([...playedDeck, data]);
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
          opponentPlayedDeck.filter((item: any) => item.strength > data.strength).length ===
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
          // setPlayedDeck([...playedDeck, data]);
          setPlayedDisabled(true);
        } else {
          handleChangeTurnCardEmit(array);
        }
      }
      if (data.ability === "Our_Fearless_Leader") {
        handleChangeTurnCardEmit(array);
      }
      if (data.ability === "Master_Spy") {
        if (legion.length === 0 && discardedPile.length === 0) {
          const arr = [
            data,
            location.state.owner,
            walletState.userName,
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
        if (battleListOpponent.length > 1) {
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
    setLocalStore('battleArray', battleObj)
    if (location.state.owner === walletState.userName) {
      stackedCards(battleObj.playedCardsP1);
      // setPlayedDeck(battleObj.playedCardsP1);
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
      stackedCards(battleObj.playedCardsP2);
      // setPlayedDeck(battleObj.playedCardsP1);
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
    if (socket) {
      socket.on("draw", (obj: any) => {
        setTimerOff(true);
        setIsDraw(true);
        setroundModalDraw(true);
        const battleObj = JSON.parse(obj);
        handleSetBattleState(battleObj);
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

      socket.on("afterEnd", (obj: any) => {
        const battleObj = JSON.parse(obj);
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

      if (userDetails.eventClickable === true && socket) {
        socket.on("updater", (obj: any) => {
          const battleObj = JSON.parse(obj);
          dispatch(setBattleArray(battleObj));
          setLocalStore('battleArray', battleObj)
          handleSetBattleState(battleObj);
          // setFlag(true);
        });

        socket.on("turnChanged", (obj: any) => {
          const battleObj = JSON.parse(obj);
          setTurn(battleObj.turn);
        });
      }
    }
  };

  const handleHover = (items: any) => {
    setModal(cardDetailModal(items));
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
        {turn !== walletState.userName ? (
          <div className="opponent-turn-wait">
            <div className="d-flex justify-content-center align-items-center opponent-playing">
              <div className="mx-3" style={{ color: "yellow" }}>
                Opponent is playing...
              </div>
            </div>
          </div>
        ) : resetCounter && !timerOff && !roundShow ? (
          <div className="opponent-turn-wait">
            <div className="d-flex justify-content-center align-items-center">
              <PoolTimer time={90} response={delayCardPlay} />
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="d-flex justify-content-end opponent-card-left">
          {battleListOpponent?.length}
        </div>
        <div className="opponet-sec mt-2" style={{ height: "105px", marginBottom: '5px' }}>
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
            ownerAccount={location?.state?.owner}
            account={walletState?.userName}
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
          ownerAccount={location?.state?.owner}
          account={walletState.userName}
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
          ownerAccount={location?.state?.owner}
          account={walletState.userName}
          socket={socket}
          opponentPlayedDeck={opponentPlayedDeck}
        />
        {
          <div className="game-play-corousel">
            < Slider {...settings}>
              {battleList?.length!==0 ?
                battleList?.map((items: any) => (
                  <div key={items.id}>
                    <div
                      className="p-game-play"
                      onMouseLeave={() => handleLeave()}
                    >
                      <div
                        className={`card bottom-card-row position-relative ${turn === walletState.userName
                          ? "border-style"
                          : "border-style-not-allowed"
                          }`}
                        key={items.id}
                      >
                        <div
                          className="hover-detail-gplay"
                          onMouseOver={() => handleHover(items)}
                        >
                          <BsInfoLg/>
                        </div>
                        <img
                          src={items.battleCard}
                          className={items.isNft ? "nft-game-card" : ""}
                          alt="battle-cards"
                          onClick={(event) =>
                            (playedDisabled === false || selectedCardDeck) &&
                              turn === walletState.userName
                              ? userDetails.eventClickable &&
                              handleRemove(event, items)
                              : ""
                          }
                        />
                      </div>
                    </div>

                  </div>
                )) : (
                  <div style={{height:'16vh'}}>
                  </div>
                )}
            </Slider>
            <div className="gplay-modal">{showModal}</div>
          </div>
        }
        <div className="d-flex justify-content-end user-card-left">
          {battleList?.length}
        </div>
        {socket && (
          <GamePlayModal
            socket={socket}
            setRoundShow={setRoundShow}
            roundShow={roundShow}
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
            ownerAccount={location?.state?.owner}
            winnerRound={winnerRound}
            round={round}
            account={walletState.userName}
            setIsDraw={setIsDraw}
            isDraw={isDraw}
          />
        )}
        {/* <ToastContainer toastClassName="toastr" progressClassName="toastProgress"/> */}
      </div>
    </>
  );
};

export default GamePlay;
