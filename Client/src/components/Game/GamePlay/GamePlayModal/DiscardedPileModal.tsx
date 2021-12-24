import React, { useCallback, useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { useBattleDetail } from '../../../../store/hooks';
import './index.css'

const DiscardedPileModal = ({legionData,discardedPile,currentSelectedCard,handleChangeTurnCardEmit,openDiscardedPile,setOpenDiscardedPile, ownerAccount, account }: any) => {
    const [selectedCardVisibility, setSelectedCardVisibility] = useState<boolean>(false)
    const [selectedCard, setSelectedCard] = useState<number[]>([])
    const [selectedDiscardedCard, setSelectedDiscardedCard] = useState<[]>([])

    const cardSelect=(item:number)=>{
        if(item!==undefined){
            setSelectedCard((prev:number[])=>{
                let newList= new Set(prev)
                    if(newList.size<1){
                        if(!newList.has(item)){
                            newList.add(item)
                        }
                    }
                    else{
                        console.log("cannot select more that 1 cards")
                    }
                return Array.from(newList)
            })  
        }
    }

    const getCardImage=useCallback((card:any)=>{
        if(selectedCard.includes(card.id) && selectedCardVisibility){
            return card.battleCard
        }
        return '/images/blackCard.jpg'
    },[selectedCardVisibility, selectedCard])
    
    const toggleSelection=(itemId:number,item:any)=>{
        setSelectedCardVisibility(true)
        if(!selectedCard.includes(itemId)){
            setSelectedDiscardedCard(item)
            cardSelect(itemId)
        }
    }


    const handleDiscardedPile = () => {
        if(currentSelectedCard.name==='Magnus'&& legionData.length!==0 ){
            const array= [currentSelectedCard, ownerAccount, account, selectedDiscardedCard,legionData]
            handleChangeTurnCardEmit(array)
        }
        else if(currentSelectedCard.name==='Magnus'&& legionData.length===0 ){
            const array = [currentSelectedCard, ownerAccount, account, selectedDiscardedCard,{}];
            handleChangeTurnCardEmit(array)
        }
        else{
            const array = [currentSelectedCard, ownerAccount, account, selectedDiscardedCard];
            handleChangeTurnCardEmit(array)
        }
        
        setOpenDiscardedPile(false)
    }

   
    return (
        <div className="discarded-pile">
            <Modal size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                 show={openDiscardedPile}>
                <Modal.Body className="modal-bg discarded-pile-modal">
                    <div className="text-center" style={{ fontSize: '24px', color: 'yellow' }}>Discarded Pile</div>
                    <div className="row ">
                        {discardedPile.map((items: any) => {
                            return (
                                <>
                                    <div
                                        className="card card-row relative"
                                        key={items.id}
                                    >
                                        <img
                                            width="100%"
                                            onClick={() => toggleSelection(items.id,items)}
                                            className={`${selectedCard.includes(items.id)?  'active':''} discarded-legion-radius font-weight-bold`}
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
                            onClick={handleDiscardedPile}
                            disabled={selectedDiscardedCard.length===0}
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

export default DiscardedPileModal
