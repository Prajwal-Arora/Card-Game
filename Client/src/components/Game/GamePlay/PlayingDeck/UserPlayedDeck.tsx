import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Slider from "react-slick";
import "../index.css";
import { settings } from "../../../../utils/config/constant/constant";
import "./stackedCard.css";
import { cardDetailModal } from "../../../../utils/CommonUsedFunction";
import { getLocalStore } from "../../../../common/localStorage";

const UserPlayedDeck = ({
  playTurnSound,
  handleChangeTurnCardEmit,
  playedDeck,
  turn,
  setSelectedCardDeck,
  selectedCardDeck,
  ownerAccount,
  opponentPlayedDeck,
  currentSelectedCard,
  socket,
  account,
}: any) => {
  const [showModal, setModal] = useState<any>("");

  const handlePlayedDeck = (item: any) => {
    playTurnSound();
    const arr = [currentSelectedCard, ownerAccount, account, item];
    if (currentSelectedCard.ability === "Man_of_the_People") {
      handleChangeTurnCardEmit(arr);
      setSelectedCardDeck(true);
    }
    if (currentSelectedCard.ability === "Praetorian_Guard") {
      const PGArr = [currentSelectedCard, ownerAccount, account, {}];
      const lockArr = [ownerAccount, account, item];
      socket.emit("lock", JSON.stringify(lockArr));
      handleChangeTurnCardEmit(PGArr);
      setSelectedCardDeck(true);
    }
  };


  const handleHover = (item: any) => {
    setModal(cardDetailModal(item));
  };

  const handleLeave = () => {
    setModal("");
  };

  const guardAppliedChange = (item: any) => {
    return item.lock === true ? (
      <div className="position-relative Stackcard">
        <img
          width="85%"
          onClick={() => handlePlayedDeck(item)}
          className={
            currentSelectedCard.name === "Consul" ||
              currentSelectedCard.name === "Praetorian_Guard"
              ? "border-style Stackcard"
              : "border-style-not-allowed Stackcard"
          }
          src={item.battleCard}
          alt="battle-cards"
        />
        <div>
          <img
            width="40%"
            className="position-absolute top-0"
            src={"/images/lock-image.png"}
            alt="battle-cards"
          />
        </div>
      </div>
    ) : (
      <img
        width="85%"
        onClick={() => handlePlayedDeck(item)}
        className={
          currentSelectedCard.name === "Consul" ||
            currentSelectedCard.name === "Praetorian_Guard"
            ? "border-style Stackcard"
            : "border-style-not-allowed Stackcard"
        }
        src={item.battleCard}
        alt="battle-cards"
      />
    );
  };

  return (
    <>
      {(
        <div className="row show-card show-user">
          {playedDeck.length &&<Slider {...settings}>
            {playedDeck.length&& playedDeck?.map((items: any) => (
              <div
                style={{ marginTop: "-6%" }}
                // key={items.id}
                onMouseLeave={() => handleLeave()}
                className={"card-row-selected "}
              >
                <div className="StackCard-list">
                  {items &&
                    items?.map((item: any) =>
                      turn === account && selectedCardDeck === false ? (
                        <>{guardAppliedChange(item)}</>
                      ) : (
                        <>
                          {item.lock === true ? (
                            <div className="position-relative Stackcard">
                              <img
                                width="85%"
                                className={"border-style-not-allowed Stackcard"}
                                src={item.battleCard}
                                alt="battle-cards"
                              />
                              <div>
                                <img
                                  width="40%"
                                  className="position-absolute top-0"
                                  src={"/images/lock-image.png"}
                                  alt="battle-cards"
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="position-relative Stackcard">
                                <img
                                  width="85%"
                                  className={
                                    "border-style-not-allowed Stackcard"
                                  }
                                  src={item.battleCard}
                                  alt="battle-cards"
                                />
                                {/* <div onMouseOver={() => handleHover(items)}>
                                  i
                                </div> */}
                              </div>
                            </>
                          )}
                        </>
                      )
                    )}
                </div>
              </div>
            ))}
          </Slider>}
          <div className="gplay-modal">{showModal}</div>
        </div>
      )}
    </>
  );
};

export default UserPlayedDeck;
