import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import Slider from 'react-slick';
import { settings } from '../../../../utils/constant/constant';

const OpponentDeck = ({playTurnSound, filibusterPresentRemus, filibusterPresentRomulus, setPlayedDisabled, playedDisabled, handleChangeTurnCardEmit, turn, setSelectedCardDeck, selectedCardDeck, ownerAccount, opponentPlayedDeck, currentSelectedCard, socket, account }: any) => {
  const lowest_strength = opponentPlayedDeck.filter((arr:any)=>arr.class!=='Utility' && arr.class!=='Status_Effect').map((item: any) => {
    let arr = item.strength;
    return arr;
  });
  const handleOpponentCard = (item: any) => {
    const array = [currentSelectedCard, ownerAccount, account, item];
    playTurnSound()
      if(currentSelectedCard.ability === "Pila") {
        if(item.strength <= 3 && selectedCardDeck === false) {
          setSelectedCardDeck(true)
          setPlayedDisabled(false)
          handleChangeTurnCardEmit(array)
        }
      }

      if(currentSelectedCard.ability === "Son_of_the_Wolf") {
        if(selectedCardDeck === false) {
          setSelectedCardDeck(true)
          setPlayedDisabled(false)
          handleChangeTurnCardEmit(array)
        }

      }
      if(currentSelectedCard.ability === "Ruthless_Tactics") {
        if (selectedCardDeck === false) {
          setSelectedCardDeck(true)
          setPlayedDisabled(false)
          handleChangeTurnCardEmit(array)

        }

      }
      if(currentSelectedCard.ability === "Persuasive_Speech") {
        if (selectedCardDeck === false) {
          setSelectedCardDeck(true)
          setPlayedDisabled(false)
          handleChangeTurnCardEmit(array)
        }

      }
      if(currentSelectedCard.ability === 'Dead_Eye') {
        if(item.strength <= 6 && selectedCardDeck === false) {
          setSelectedCardDeck(true)
          setPlayedDisabled(false)
          handleChangeTurnCardEmit(array)
        }
      }

    //already commented
    // if (currentSelectedCard.ability === 'Our_Fearless_Leader') {
    //   setSelectedCardDeck(true)
    // }
  }



  const checkClass = (item: any) => {
    if (playedDisabled === true) {
      if (currentSelectedCard.name === 'Javelin') {
        if (item.strength <= 3 && selectedCardDeck === false && item && item.name !== 'Romulus'  && item.class!=='Utility' && item.class!=='Status_Effect') {

          return true
        }
        else {
          return false
        }
      }
      if (currentSelectedCard.name === 'Tibia') {
        if (item.strength <= 6 && selectedCardDeck === false && item.name !== 'Romulus' && item.class!=='Utility' && item.class!=='Status_Effect') {

          return true
        }
        else {
          return false
        }
      }

      if (currentSelectedCard.name === 'Remus') {
        if (item.name === 'Romulus'  && item.class==='Utility' && item.class==='Status_Effect') {

          return false
        }
        return !selectedCardDeck
      }
      if (currentSelectedCard.name === 'Imperator') {
        if (item.name === 'Romulus' && item.class==='Utility' && item.class==='Status_Effect') {
          return false
        }
        return !selectedCardDeck
      }
      if (currentSelectedCard.name === "Magistrate") {

        if (item.strength===Math.min(...lowest_strength) && selectedCardDeck === false  && item.class!=='Utility' && item.class!=='Status_Effect') {
          return true
        }
        else {
          return false
        }
      }
    }
    else {
      return false
    }
  }

  const guardAppliedChange = (items: any) => {
    return (
      items.lock === true ?
        (<div className="position-relative">
          <img
            width="85%"
            className={"border-style"}
            onClick={() => handleGuardAppliedCard(items)}
            src={items.battleCard}
            alt="battle-cards"
          />
          <div >
            <img
              width="40%"
              className="position-absolute top-0"
              src={"/images/lock-image.png"}
              alt="battle-cards"
            />
          </div>
        </div>) : (
          <img
            onClick={() => handleOpponentCard(items)}
            width="85%"
            className={"border-style"}
            src={items.battleCard}
            alt="battle-cards"
          />
        )
    )
  }

  const handleGuardAppliedCard = (item: any) => {
    const unlockArr = [ownerAccount, account, item]
    const PGArr = [currentSelectedCard, ownerAccount, account, {}]
    socket.emit("unlock", JSON.stringify(unlockArr));
    handleChangeTurnCardEmit(PGArr)
    setSelectedCardDeck(true)
    setPlayedDisabled(false)
  }

  const guardAppliedChangeWhenDisabled = (item: any) => {
    return (
      item.lock === true ?
        (<div className="position-relative">
          <img
            width="85%"
            className={"border-style-not-allowed"}
            src={item.battleCard}
            alt="battle-cards"
          />
          <div >
            <img
              width="40%"
              className="position-absolute top-0"
              src={"/images/lock-image.png"}
              alt="battle-cards"
            />
          </div>
        </div>) : (
          <img
            width="85%"
            className={"border-style-not-allowed "}
            src={item.battleCard}
            alt="battle-cards"
          />
        )
    )
  }

  return (
    <div className="row justify-content-center">
      <div
        style={{
          width: "70%",
          margin: "auto",
          height: "100px",
          marginTop: '18px'
        }}
      >
        <Slider {...settings}>
          {opponentPlayedDeck?.map((items: any) => (
            <>
              <div
                key={items.id}
              >
                {(checkClass(items) && selectedCardDeck === false) && turn === account ?
                  (<>
                    {guardAppliedChange(items)}
                  </>
                  ) : (
                    <>
                      {guardAppliedChangeWhenDisabled(items)}

                    </>

                  )}
              </div>
            </>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default OpponentDeck
