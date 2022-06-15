import React, { useCallback, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import './index.css'

const EmploratorsModal = ({ handleChangeTurnCardEmit, ownerAccount, currentSelectedCard, account, openExploratoryModal, setOpenExploratoryModal, battleListOpponent,socket }: any) => {

    const [selectedCardVisibility, setSelectedCardVisibility] = useState<boolean>(false)
    const [selectedCards, setSelectedCards] = useState<number[]>([])

    const cardSelect = (id: number) => {
        if (id !== undefined) {
            setSelectedCards((prev: number[]) => {
                let newList = new Set(prev)
                if (newList.size < 2) {

                    if (!newList.has(id)) {
                        newList.add(id)
                    }
                }
                else {
                    console.log("cannot select more that 2 cards")
                }
                return Array.from(newList)
            })
        }
    }

    const toggleSelection = (id: number, items: any) => {
        setSelectedCardVisibility(true)
        const arr = [currentSelectedCard, ownerAccount, account, items]
        if (selectedCards.includes(id)) {
            if (battleListOpponent.length > 1) {
                if (selectedCards.length === 2) {
                    handleChangeTurnCardEmit(arr)
                    setSelectedCards([])
                    setOpenExploratoryModal(false)
                }
            }
            else {
                handleChangeTurnCardEmit(arr)
                setSelectedCards([])
                setOpenExploratoryModal(false)
            }
            
        }
        if (!selectedCards.includes(id)) {
            cardSelect(id)
        }
    }

    const getCardImage = useCallback((card: any) => {
        if (selectedCards.includes(card.id) && selectedCardVisibility) {
            return card.battleCard
        }
        return '/images/blackCard.jpg'
    }, [selectedCardVisibility, selectedCards])


    return (
        <div className="discarded-pile">
            <Modal size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                show={openExploratoryModal}>
                <Modal.Body className="modal-bg discarded-pile-modal">
                    <div className="text-center" style={{ fontSize: '24px', color: 'yellow' }}>Choose Card</div>
                    <div className="row ">
                        {battleListOpponent.map((items: any) => {
                            return (
                                <>
                                    <div
                                        className="card card-row relative"
                                        key={items.id}
                                    >
                                        <img
                                            width="100%"
                                            onClick={() => toggleSelection(items.id, items)}
                                            className={`${selectedCards.includes(items.id) ? 'active' : ''} discarded-legion-radius font-weight-bold`}
                                            // src={items.battleCard}
                                            src={getCardImage(items)}
                                            alt="battle-cards"
                                        />
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </Modal.Body>

            </Modal>
        </div>
    )
}

export default EmploratorsModal
