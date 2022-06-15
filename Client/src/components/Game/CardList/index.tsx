import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import { Card, Modal, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useNftCards,
  useSocketDetail,
  useWalletDetail,
} from "../../../store/hooks";
import { setBattleArray } from "../../../store/reducer/userReducer";
import {
  RemusCards,
  RomulusCards,
} from "../../../utils/config/constant/BattleCardCollection";
import { handleGameVictoryScreen, refreshCardSelection, refreshScreen, roomDelete } from "../../../utils/SocketCommon";
import PoolTimer from "../../common/PoolTimer";
import AdditionalInfoModal from "./AdditionalInfoModal";
import CoinToss from "../CoinToss";
import "./index.css";
import { handleRedirect, handleRemoveActive, InfoModalCardList } from "../../../utils/CommonUsedFunction";
import { getLocalStore, setLocalStore } from "../../../common/localStorage";
import { inactiveMessage, refreshMessage } from "../../../utils/config/constant/notificationText";
import { apiHandler } from "../../../services/apiService/axios";
import { putLosses } from "../../../services/apiService/userServices";

const CardList = () => {
  let location: any = useLocation();
  const socket: any = useSocketDetail();
  const dispatch = useDispatch();
  let history = useHistory();
  const nftCards = useNftCards();
  const [showModal, setModal] = useState<any>("");
  const [battleId, setBattleId] = useState<any>();
  const walletState: any = useWalletDetail();
  const [selectedBattleList, setSelectedBattleList] = useState<any>([]);
  const [battleList, setBattleList] = useState<any>([]);
  const [isPlayer, setIsplayer] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(true);
  const [openCoinTossModal, setOpenCoinTossModal] = useState(false);
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deck, setDeck] = useState({
    player1: [],
    player2: [],
  });
  const [timer, setTimer] = useState(true);

  window.onoffline = function () {
    toast("Your Internet is disconnected")
    return true;
  };

  window.onload = function () {
    history.push('/')
  };

  window.onbeforeunload = function (evt) {
    evt.preventDefault()
    evt.returnValue = '';
    //  user closes the tab
    apiHandler(
      () => putLosses(getLocalStore('userName'))
    );
    refreshScreen(location.state.owner, socket)
    roomDelete(socket, location.state.owner, getLocalStore('userName'))
   
    return true
  }

  useEffect(() => {
    refreshCardSelection(dispatch, socket, history)
  }, [dispatch, history, socket]);

  useEffect(() => {
    setTimer(false);
    setTimeout(() => {
      setTimer(true);
    }, 1);
  }, [battleList]);



  const inactiveCardSelection = () => {
    handleRemoveActive(selectedBattleList);
    const arr = [location.state.owner, getLocalStore('userName')];
    socket.emit("csInactive", JSON.stringify(arr));
  };



  const redirectToGamePlay = useCallback(() => {
    history.push({
      pathname: `/game-play/${location.state.owner}`,
      search: location.state.team,
      state: {
        team: location.state.team,
        owner: location.state.owner,
      },
    });
  }, [history]);

  useEffect(() => {
    if (deck.player1.length !== 0 && deck.player2.length !== 0) {
      setOpenCoinTossModal(true);
    }
  }, [deck.player1.length, deck.player2.length, history, location.state]);

  useEffect(() => {
    if (socket) {
      socket.on("arrayWithCards", (obj: any) => {
        const cardsObj = JSON.parse(obj);
        setLocalStore('battleArray', cardsObj)
        dispatch(setBattleArray(cardsObj));
        setDeck({
          player1: cardsObj.cardsP1,
          player2: cardsObj.cardsP2,
        });
      });

      socket.on("afterRefresh", (obj: any) => {
        const battleObj = JSON.parse(obj);
        setLocalStore('battleArray', battleObj)
        dispatch(setBattleArray(battleObj));
        if (battleObj.winner_g) {
          handleGameVictoryScreen(
            battleObj.winner_g,
            battleObj.player1,
            battleObj.team1,
            refreshMessage,
            handleRedirect,
            history
          );
        }
      });
    }
    handleRequiredCard();
  }, [location.state, socket]);

  const handleRequiredCard = () => {
    if (location.state.team === "Remus") {
      addedNftCards(RemusCards);
    } else {
      addedNftCards(RomulusCards);
    }
  };


  useEffect(() => {
    return () => {
      handleRemoveActive(selectedBattleList);

    };
  }, [])


  useEffect(() => {
    if (location.state.owner === walletState.userName) {
      if (deck.player1.length !== 0 && deck.player2.length === 0) {
        setIsplayer(true);
      } else {
        setIsplayer(false);
      }
    } else {
      if (deck.player2.length !== 0 && deck.player1.length === 0) {
        setIsplayer(true);
      } else {
        setIsplayer(false);
      }
    }
  }, [
    deck.player1.length,
    deck.player2.length,
    location.state,
    walletState.userName,
  ]);


  const addedNftCards = (cardList: any) => {
    handleRemoveActive(cardList);
    let cardCount: any = {}
    let nftCount: any = {}

    const nftArray: any = [];
    nftCards.forEach((item: any) => {
      let strength;
      const findCard: any = Array.from(cardList)?.find(
        (cards: any) => cards.name === item.name
      );
      if (findCard !== undefined && findCard !== '') {

        if (item.type === "Common") {
          strength = findCard.strength + 1;
        }
        if (item.type === "Rare") {
          strength = findCard.strength + 2;
        }
        if (item.type === "Unique") {
          strength = findCard.strength + 3;
        }

        nftArray.push({
          isNft: true,
          ...findCard,
          id: item.id,
          strength: strength,
        });
      }
    });

    for (const element of nftCards.map((i: any) => i.name)) {
      if (nftCount[element]) {
        nftCount[element] += 1;
      } else {
        nftCount[element] = 1;
      }
    }

    for (const element of cardList.map((i: any) => i.name)) {
      if (cardCount[element]) {
        cardCount[element] += 1;
      } else {
        cardCount[element] = 1;
      }
    }

    Object.keys(nftCount).forEach((i: any) => {
      if (!nftCount[i] || !cardCount[i]) {
        return
      }
      if (nftCount[i] <= cardCount[i]) {
        cardCount[i] -= nftCount[i]
      }
      else {
        nftCount[i] = cardCount[i]
        cardCount[i] = 0
      }
    })

    const nftFilter = nftArray.filter((i: any) => {
      if (nftCount[i.name]) {
        nftCount[i.name]--
        return true
      }
      return false
    })

    const cardFilter = cardList.filter((i: any) => {
      if (cardCount[i.name]) {
        cardCount[i.name]--
        return true
      }
      return false
    })

    const reqArray = cardFilter.concat(nftFilter);
    setBattleList(reqArray);
  };


  const handleHover = (items: any) => {
    setBattleId(items.id);
    setModal(InfoModalCardList(items));
  };

  const handleLeave = () => {
    setModal("");
  };

  const selectCard = (cardData: any) => {
    if (selectedBattleList.length < 25) {
      const cardIndex = selectedBattleList.findIndex((item: any) => {
        return item.id === cardData.id;
      });
      if (cardIndex === -1) {
        setSelectedBattleList([...selectedBattleList, cardData]);
      }
      const newBattleList = battleList.map((item: any) => {
        if (item.id === cardData.id) {
          item.active = true;
        }

        return item;
      });
      setBattleList(newBattleList);
    } else {
      toast("25 cards already selected");
    }
  };

  const unSelectCard = (cardId: any) => {
    if (cardId) {
      const cardIndex = selectedBattleList.findIndex((item: any) => {
        return item.id === cardId;
      });
      if (cardIndex !== -1) {
        const newData = [...selectedBattleList];
        newData.splice(cardIndex, 1);
        setSelectedBattleList(newData);
        const newBattleList = battleList.map((item: any) => {
          if (item.id === cardId) {
            item.active = false;
          }
          return item;
        });
        setBattleList(newBattleList);
      }
    }
  };

  const toggleCardSelect = (cardData: any, isSelected: boolean = false) => {
    if (isSelected) {
      unSelectCard(cardData?.id);
    } else {
      selectCard(cardData);
    }
  };


  const handleContinue = () => {

    if (!flag && socket) {
      for (let i = 0; i < selectedBattleList.length; i++) {
        selectedBattleList[i]["active"] = false;
      }
      const client = walletState?.userName;
      const data = [location.state.owner, client, selectedBattleList];
      socket.emit("cards-selected", JSON.stringify(data));
      setFlag(true);
    }
  };

  return (
    <div className="card-collection-container text-center">
      <div className="position-relative " style={{ top: "25px" }}>
        <div className=" d-flex z-0 justify-content-end">
          <div
            className=" position-relative d-flex z-0"
            style={{ width: "300px" }}
          >
            <img
              style={{ width: "90%" }}
              className="m-auto "
              src="/images/Rectangle 4.png"
              alt=""
            />
            <div className="card-selection w-100">CARD SELECTION</div>
          </div>
          {timer && !showInfoModal && !openCoinTossModal && !isPlayer ? (
            <PoolTimer time={300} response={inactiveCardSelection} />
          ) : (
            <div style={{ marginLeft: "45px" }}></div>
          )}
        </div>

        <div
          className="my-2 d-flex justify-content-start text-white align-items-center"
          style={{ height: "50px" }}
        >
          <div
            className="position-absolute text-uppercase px-4 rounded bg-dark"
            style={{ border: "1px solid yellow" }}
          >
            Select 25 cards ({selectedBattleList?.length} Selected)
          </div>
        </div>

        <div className="row ">
          {battleList.map((items: any) => {
            return (
              <>
                <div
                  onMouseLeave={() => handleLeave()}
                  onClick={() => toggleCardSelect(items, items?.active)}
                  className="card card-row relative"
                  key={items.id}
                >
                  <div
                    className="hover-detail"
                    onMouseOver={() => handleHover(items)}
                  >
                    i
                  </div>
                  <Card
                    className="card-border"
                    style={{
                      display: loading ? "block" : "none",
                      width: "18rem",
                      height: "16vw",
                    }}
                  >
                    <Card.Body>
                      <Spinner className="cardLoading" animation="border" />
                    </Card.Body>
                  </Card>
                  <img
                    width="100%"
                    style={{ display: loading ? "none" : "block" }}
                    className={
                      items?.active
                        ? items.isNft
                          ? "nft-active"
                          : "active"
                        : items.isNft
                          ? "nft-card"
                          : "card-border"
                    }
                    src={items.battleCard}
                    onLoad={() => setLoading(false)}
                    alt="battle-cards"
                  />
                  {items.id === battleId ? showModal : ""}
                </div>
              </>
            );
          })}
        </div>
        <div style={{height:'70px'}}> 
          <button
            disabled={selectedBattleList?.length !== 25}
            onClick={() => handleContinue()}
            className="m-auto mt-3 custom-btn d-flex align-items-center"
          >
            <div className="d-flex align-items-center position-relative">
              <div>Continue</div>
              <div className="position-absolute right-arrow-position">
                <img src="/images/right-arrow.png" alt="" className="w-75" />
              </div>
            </div>
          </button>
          <div className="waiting-opponent">
            <Modal show={isPlayer}>
              <Spinner animation="border" />
              <Modal.Body style={{ background: "black", color: "yellow" }}>
                Waiting for other player to select their cards
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </div>
      {showInfoModal && (
        <AdditionalInfoModal
          showInfoModal={showInfoModal}
          setShowInfoModal={setShowInfoModal}
        />
      )}
      {openCoinTossModal && (
        <CoinToss
          account={walletState.userName}
          setOpenCoinTossModal={setOpenCoinTossModal}
          openCoinTossModal={openCoinTossModal}
          redirectToGamePlay={redirectToGamePlay}
        />
      )}
      
    </div>
  );
};

export default CardList;
