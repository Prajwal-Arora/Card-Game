import React, { useEffect, useState } from 'react'
import { battleCardAbility, battleCardClasses } from '../../../../utils/BattleCardAbilities'

const UserPlayedDeck = ({handleChangeTurnCardEmit, playedDeck, turn, setSelectedCardDeck, selectedCardDeck, ownerAccount, opponentPlayedDeck, currentSelectedCard, socket, account }: any) => {
    
    const handlePlayedDeck = (item: any) => {
        if (currentSelectedCard.ability === 'Man_of_the_People') {
            const arr = [currentSelectedCard, ownerAccount, account, item];
            handleChangeTurnCardEmit(arr)
            setSelectedCardDeck(true)
        }
    }
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

    return (
        <div className="row show-card">
            {playedDeck?.map((items: any) => (
                <div style={{ marginTop: "-6%" }} key={items.id}
                    className={"card-row-selected "} 
                    >
                    {
                        turn === account && selectedCardDeck===false ?
                            (<img
                                width="70%"
                                onClick={() => handlePlayedDeck(items)}
                                className={currentSelectedCard.name === 'Consul' ? "border-style" : "border-style-not-allowed"}
                                src={items.battleCard}
                                alt="battle-cards"
                            />) : (
                                <img
                                    width="70%"
                                    className={"border-style-not-allowed"}
                                    src={items.battleCard}
                                    alt="battle-cards"
                                />
                            )
                    }
                </div>
            ))}
        </div>
    )
}

export default UserPlayedDeck
