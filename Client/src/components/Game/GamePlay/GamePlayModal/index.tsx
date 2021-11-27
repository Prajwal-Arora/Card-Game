import React from 'react'
import DiscardedPileModal from './DiscardedPileModal'
import RoundModal from './RoundModal'
import WinnerUpdateModal from './WinnerUpdateModal'

const GamePlayModal = ({legion,discardedPile,currentSelectedCard,handleChangeTurnCardEmit,setOpenLegion,openLegion,setOpenDiscardedPile,openDiscardedPile,ownerAccount, socket, account, gameWinner, round, winnerRound}:any) => {
    return (
        <>
            <WinnerUpdateModal round={round} gameWinner={gameWinner} account={account} />
            <RoundModal winnerRound={winnerRound} round={round} gameWinner={gameWinner} account={account} />
            <DiscardedPileModal discardedPile={discardedPile} currentSelectedCard={currentSelectedCard} handleChangeTurnCardEmit={handleChangeTurnCardEmit} setOpenDiscardedPile={setOpenDiscardedPile} openDiscardedPile={openDiscardedPile} ownerAccount={ownerAccount} account={account}/>
        </>
    )
    }
    
export default GamePlayModal