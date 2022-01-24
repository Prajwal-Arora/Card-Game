import React, { useCallback, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import './index.css'

const LegionModal = ({  socket, isDraw, setIsDraw, discardedPile, setLegionData, setOpenLegion, openLegion, legion, handleChangeTurnCardEmit, currentSelectedCard, ownerAccount, account }: any) => {
    const [selectedCardVisibility, setSelectedCardVisibility] = useState<boolean>(false)
    const [selectedCard, setSelectedCard] = useState<number[]>([])
    const [selectedLegionCard, setSelectedLegionCard] = useState<any>([])

    const cardSelect = (itemId: number, item: any) => {
        if (itemId !== undefined) {
            setSelectedCard((prev: number[]) => {
                let newList = new Set(prev)
                console.log(newList, "newList")
                if (newList.size < 1) {
                    if (!newList.has(itemId)) {
                        setSelectedLegionCard(item);
                        newList.add(itemId)
                    }
                }

                return Array.from(newList)
            })
        }
    }

    const getCardImage = useCallback((card: any) => {
        if (selectedCard.includes(card.id) && selectedCardVisibility) {
            return card.battleCard
        }
        return '/images/blackCard.jpg'
    }, [selectedCardVisibility, selectedCard])

    const toggleSelection = (itemId: number, item: any) => {
        setSelectedCardVisibility(true)
        if (!selectedCard.includes(itemId)) {
            cardSelect(itemId, item)
        }
    }

    const handleLegion = () => {
        console.log(selectedLegionCard, "selectedLegionCardselectedLegionCard")
        if (isDraw) {
            const arr = [ownerAccount, account, selectedLegionCard]
            socket.emit("afterDraw", JSON.stringify(arr))
        }
        else {
            if (currentSelectedCard.name === 'Magnus' && discardedPile.length !== 0) {
                setLegionData(selectedLegionCard)
            }
            else if (currentSelectedCard.name === 'Magnus' && discardedPile.length === 0) {
                const array = [currentSelectedCard, ownerAccount, account, {}, selectedLegionCard];
                handleChangeTurnCardEmit(array)
            }
            else {
                const array = [currentSelectedCard, ownerAccount, account, selectedLegionCard];
                setLegionData(selectedLegionCard)
                handleChangeTurnCardEmit(array)
            }
        }
        setIsDraw(false)
        setOpenLegion(false)
        setSelectedCard([])
        setSelectedCardVisibility(false)
        setSelectedLegionCard([])
    }


    return (
        <div className="discarded-pile">
            <Modal size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                show={openLegion || isDraw}>
                <Modal.Body className="modal-bg discarded-pile-modal">
                    <div className="text-center" style={{ fontSize: '24px', color: 'yellow' }}>{isDraw ? 'Match draw! Please select one card' : 'Legion'}</div>
                    <div className="row ">
                        {legion.map((items: any) => {
                            return (
                                <>
                                    <div
                                        className="card card-row relative"
                                        key={items.id}
                                    >
                                        <img
                                            width="100%"
                                            onClick={() => toggleSelection(items.id, items)}
                                            className={`${selectedCard.includes(items.id) ? 'active' : ''} discarded-legion-radius font-weight-bold`}
                                            src={getCardImage(items)}
                                            alt="battle-cards"
                                        />
                                    </div>
                                </>
                            );
                        })}
                    </div>
                    <div className="d-flex justify-content-center">
                        <button
                            onClick={handleLegion}
                            disabled={selectedCard.length !== 1}
                            className="mx-3 mt-4 cancel-btn  d-flex align-items-center"
                        >
                            <div className=" d-flex align-items-center position-relative">
                                <div >Select</div>
                            </div>
                        </button>

                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default LegionModal
