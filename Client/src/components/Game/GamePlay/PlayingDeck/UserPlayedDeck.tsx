import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

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
  // const checkClass = (item: any) => {
  //     if (currentSelectedCard.ability === "Man_of_the_People") {
  //         if (item.strength === lowest_strength && selectedCardDeck === false) {
  //             return true
  //         }
  //         else {
  //             return false
  //         }
  //     }
  // }


  const guardAppliedChange = (items: any) => {
    return items.lock === true ? (
      <div className="position-relative">
        <img
          width="70%"
          onClick={() => handlePlayedDeck(items)}
          className={
            currentSelectedCard.name === "Consul" ||
            currentSelectedCard.name === "Praetorian_Guard"
              ? "border-style"
              : "border-style-not-allowed"
          }
          src={items.battleCard}
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
        width="70%"
        onClick={() => handlePlayedDeck(items)}
        className={
          currentSelectedCard.name === "Consul" ||
          currentSelectedCard.name === "Praetorian_Guard"
            ? "border-style"
            : "border-style-not-allowed"
        }
        src={items.battleCard}
        alt="battle-cards"
      />
    );
  };

  return (
    <div className="row show-card">
      {playedDeck?.map((items: any) => (
        <div
          style={{ marginTop: "-6%" }}
          key={items.id}
          className={"card-row-selected "}
        >
          {turn === account && selectedCardDeck === false ? (
            <>{guardAppliedChange(items)}</>
          ) : (
            <>
              {items.lock === true ? (
                <div className="position-relative">
                  <img
                    width="70%"
                    className={"border-style-not-allowed"}
                    src={items.battleCard}
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
                  width="70%"
                  className={"border-style-not-allowed"}
                  src={items.battleCard}
                  alt="battle-cards"
                />
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserPlayedDeck;
