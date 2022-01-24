import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, Modal, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useSocketDetail, useWalletDetail } from "../../../store/hooks";
import { setBattleArray } from "../../../store/reducer/userReducer";
import { RemusCards, RomulusCards } from "../../../utils/config/constant/BattleCardCollection";
import { handleGameVictoryScreen } from "../../../utils/SocketCommon";
import PoolTimer from "../../common/PoolTimer";
import AdditionalInfoModal from "./AdditionalInfoModal";
import CardInfoModal from "./CardInfoModal";
import "./index.css";

const CardList = () => {
  let location: any = useLocation();
  const dispatch = useDispatch();
  let history = useHistory();
  const [showModal, setModal] = useState<any>("");
  const [battleId, setBattleId] = useState<any>();
  const walletState: any = useWalletDetail();
  const [selectedBattleList, setSelectedBattleList] = useState<any>([]);
  const [battleList, setBattleList] = useState<any>([]);
  const [isPlayer, setIsplayer] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(true)
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deck, setDeck] = useState({
    player1: [],
    player2: [],
  });

  const [timer, setTimer] = useState(true);

  useEffect(() => {
    setTimer(false);
    setTimeout(() => {
      setTimer(true);
    }, 1);
  }, [battleList]);

  const socket: any = useSocketDetail();

  const inactiveCardSelection = () => {
    const arr = [location.state.owner, walletState.accounts[0]];
    socket.emit("csInactive", JSON.stringify(arr));
  };

  const modal = (items: any) => {
    return (
      <>
        <CardInfoModal battleCard={items} />
      </>
    );
  };

  const handleRedirect = useCallback(
    (team) => {
      history.push({
        pathname: "/game-winner",
        search: team,
      });
    },
    [history]
  );

  useEffect(() => {
    socket.on("decWin", (obj: any) => {
      const battleObj = JSON.parse(obj);
      dispatch(setBattleArray(battleObj));
      if (battleObj.winner_g) {
        handleGameVictoryScreen(
          battleObj.winner_g,
          battleObj.player1,
          battleObj.team1,
          handleRedirect
        );
      }
    });
  }, [socket]);

  useEffect(() => {
    if (deck.player1.length !== 0 && deck.player2.length !== 0) {
      history.push({
        pathname: `/game-play/${location.state.owner}`,
        search: location.state.team,
        state: {
          team: location.state.team,
          owner: location.state.owner,
        },
      });
    }
  }, [deck.player1.length, deck.player2.length, history, location.state]);

  useEffect(() => {
    if (flag === true) {
      socket.on("arrayWithCards", (obj: any) => {
        const cardsObj = JSON.parse(obj);
        dispatch(setBattleArray(cardsObj));
        setDeck({
          player1: cardsObj.cardsP1,
          player2: cardsObj.cardsP2,
        });
      });
    }
    handleRequiredCard();

    return () => {
      let arr: any = [];
      for (let i = 0; i < battleList.length; i++) {
        battleList[i]["active"] = false;
        arr.push(battleList[i]);
      }
    };
  }, [location.state, flag, socket]);

  useEffect(() => {
    if (location.state.owner === walletState.accounts[0]) {
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
    walletState.accounts,
  ]);

  const handleRequiredCard = () => {
    if (location.state.team === "Remus") {
      setBattleList(RemusCards);
    } else {
      setBattleList(RomulusCards);
    }
  };

  const handleHover = (items: any) => {
    setBattleId(items.id);
    setModal(modal(items));
  };

  const handleLeave = () => {
    setModal("");
  };

  const selectCard = (cardData: any) => {
    if (selectedBattleList.length < 15) {
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
      toast("15 cards already selected");
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
    if (!flag) {
      const client = walletState.accounts[0];
      const data = [location.state.owner, client, selectedBattleList];
      socket.emit("cards-selected", JSON.stringify(data));
      setFlag(true);
    }
  };


  window.onbeforeunload = function () {
    return "Your work will be lost.";
  };

  return (
    <div className="card-collection-container text-center">
      <div className="position-relative " style={{ bottom: "55px" }}>
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
            <div
              style={{
                width: "60%",
                fontSize: "21px",
                position: "absolute",
                top: "46%",
                left: "50%",
                transform: " translate(-50%, -50%)",
                color: "white",
              }}
            >
              CARD SELECTION
            </div>
          </div>
          {timer && !showInfoModal ? (
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
            Select 15 cards ({selectedBattleList?.length} Selected)
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
                  <Card className="card-border" style={{ display: loading ? "block" : "none", width: '18rem', height: '16vw' }} >
                    <Card.Body>
                      <Spinner className="cardLoading" animation="border" />
                    </Card.Body>
                  </Card>
                  <img
                    width="100%"
                    style={{ display: loading ? "none" : "block" }}
                    className={items?.active ? "active" : "card-border"}
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
        <div>
          <button
            disabled={selectedBattleList?.length !== 15}
            onClick={() => handleContinue()}
            className="m-auto mt-3 custom-btn d-flex align-items-center"
          >
            <div className="d-flex align-items-center position-relative">
              <div>Continue</div>
              <div className="position-absolute right-arrow-position">
                <img src="/images/right-arrow.png" alt="" className="w-75" />
              </div>
            </div>
          </button>{" "}
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
      <AdditionalInfoModal showInfoModal={showInfoModal} setShowInfoModal={setShowInfoModal}/>
      <ToastContainer toastClassName="toastr" hideProgressBar={true} progressClassName="toastProgress" />
    </div>
  );
};

export default CardList;
