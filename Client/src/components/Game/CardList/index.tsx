import React, { useCallback, useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useSocketDetail, useWalletDetail } from "../../../store/hooks";
import { setBattleArray } from "../../../store/reducer/userReducer";
import { RemusCards, RomulusCards } from "../../../utils/constant/BattleCardCollection";
import CardInfoModal from "./CardInfoModal";
import "./index.css";

const CardList = () => {
  let location: any = useLocation();
  let history = useHistory();
  const [showModal, setModal] = useState<any>("");
  const [battleId, setBattleId] = useState<any>();
  const walletState: any = useWalletDetail();
  const [selectedBattleList, setSelectedBattleList] = useState<any>([]);
  const [battleList, setBattleList] = useState<any>([]);
  const dispatch = useDispatch();
  const [isPlayer, setIsplayer] = useState(false);
  const [flag, setFlag] = useState(false);
  const [deck, setDeck] = useState({
    player1: [],
    player2: [],
  });
  const socket: any = useSocketDetail();

  const modal = (items: any) => {
    return (
      <>
        <CardInfoModal battleCard={items} />
      </>
    );
  };

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
    if (selectedBattleList.length < 10) {
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
      toast("10 cards already selected");
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
    const getRandomBattleArray = selectedBattleList
      .sort(() => Math.random() - Math.random())
      .slice(0, 7);
    console.log(getRandomBattleArray, "getRandomBattleArray");
    const client = walletState.accounts[0];
    const data = {
      owner: location.state.owner,
      client: client,
      cards: getRandomBattleArray,
    };
    socket.emit("cards-selected", JSON.stringify(data));
    setFlag(true);
  };

  return (
    <div className="card-collection-container text-center">
      <div className="position-relative " style={{ bottom: "55px" }}>
        <div className=" d-flex z-0">
          <img
            width="25%"
            className="m-auto "
            src="/images/Rectangle 4.png"
            alt=""
          />
          <div
            style={{ fontSize: "24px" }}
            className="gradient-text position-absolute w-100 text-white text-center m-auto"
          >
            SELECT CARDS
          </div>
        </div>
        <div className="my-2 text-white text-uppercase">
          Select 10 cards ({selectedBattleList?.length} Selected)
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
                  <img
                    width="100%"
                    className={items?.active ? "active" : ""}
                    src={items.battleCard}
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
            disabled={selectedBattleList?.length !== 10}
            onClick={handleContinue}
            className="m-auto mt-3 custom-btn d-flex align-items-center"
          >
            <div className="d-flex align-items-center position-relative">
              <div>Continue</div>
              <div className="position-absolute right-arrow-position">
                <img src="/images/right-arrow.png" alt="" className="w-75" />
              </div>
            </div>
          </button>
          ({" "}
          <div className="waiting-opponent">
            <Modal show={isPlayer}>
              <Spinner animation="border" />
              <Modal.Body style={{ background: "black", color: "yellow" }}>
                Waiting for other player to select his cards
              </Modal.Body>
            </Modal>
          </div>
          )
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CardList;
