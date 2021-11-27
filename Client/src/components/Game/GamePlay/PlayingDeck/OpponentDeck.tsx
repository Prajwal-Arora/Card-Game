import React, { useEffect, useState } from 'react'
import Slider from 'react-slick';
import { useBattleDetail } from '../../../../store/hooks';
import { battleCardClasses } from '../../../../utils/BattleCardAbilities';
import { settings } from '../../../../utils/constant/constant';

const OpponentDeck = ({setPlayedDisabled,playedDisabled,handleChangeTurnCardEmit, turn, setSelectedCardDeck, selectedCardDeck, ownerAccount, opponentPlayedDeck, currentSelectedCard, socket, account }: any) => {

  const battleArray = useBattleDetail();
  const lowest_strength = Math.min(...opponentPlayedDeck.map((item: any) => {
    let arr = item.strength
    return arr
  })
  )
  const handleOpponentCard = (item: any) => {
    // console.log(checkClass(item),"asdfghjkl")
    const array = [currentSelectedCard, ownerAccount, account, item];
    if (currentSelectedCard.ability === "Pila") {
      if (item.strength <= 3 && selectedCardDeck === false) {
        setSelectedCardDeck(true)
        setPlayedDisabled(false)
        handleChangeTurnCardEmit(array)
      }
    }

    if (currentSelectedCard.ability === "Son_of_the_Wolf") {
      if (selectedCardDeck === false) {
        setSelectedCardDeck(true)
        setPlayedDisabled(false)
        handleChangeTurnCardEmit(array)
      }

    }
    if (currentSelectedCard.ability === "Ruthless_Tactics") {
      if (selectedCardDeck === false) {
        setSelectedCardDeck(true)
        setPlayedDisabled(false)
        handleChangeTurnCardEmit(array)
      }

    }
    if (currentSelectedCard.ability === "Persuasive_Speech") {
      if (selectedCardDeck === false) {
        setSelectedCardDeck(true)
        setPlayedDisabled(false)
        handleChangeTurnCardEmit(array)
      }

    }
    if (currentSelectedCard.ability === 'Dead_Eye') {
      if (item.strength <= 6 && selectedCardDeck === false) {
        setSelectedCardDeck(true)
        setPlayedDisabled(false)
        handleChangeTurnCardEmit(array)
      }
    }
    // if (currentSelectedCard.ability === 'Our_Fearless_Leader') {
    //   setSelectedCardDeck(true)

    //  }
    

  }

  const checkClass = (item: any) => {
  if(playedDisabled===true){
    if (currentSelectedCard.name === 'Javelin') {
      if (item.strength <= 3 && selectedCardDeck === false &&item  && item.name!=='Romulus') {
        return true
      }
      else {
        return false
      }
    }
    if (currentSelectedCard.name === 'Tibia') {
      if (item.strength <= 6 && selectedCardDeck === false  && item.name!=='Romulus') {
        return true
      }
      else {
        return false
      }
    }

    if (currentSelectedCard.name === 'Remus') {
      if(item.name==='Romulus'){
        return false
      }
      return !selectedCardDeck
    }
    if (currentSelectedCard.name === 'Imperator') {
      if(item.name==='Romulus'){
        return false
      }
      return !selectedCardDeck
    }
    if (currentSelectedCard.name === "Magistrate" ) {
      
      if (item.strength === lowest_strength && selectedCardDeck === false && item.name!=='Romulus') {
        return true
      }
      else {
        return false
      }
    }
    
  }
  else{
    return false
  }
    
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
            <div
              key={items.id}
            >
              {(checkClass(items) && selectedCardDeck===false) && turn === account ?
                (<img
                  onClick={() => handleOpponentCard(items)}
                  width="85%"
                  className={"border-style "}
                  src={items.battleCard}
                  alt="battle-cards"
                />) : (
                  <img
                    width="85%"
                    className={"border-style-not-allowed "}
                    src={items.battleCard}
                    alt="battle-cards"
                  />
                )}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default OpponentDeck
