export const battleCardAbility = ({currentPlayedCard}:any) => {
        switch (currentPlayedCard.name) {
            case 'Archer': {
                return
                
            }
    
            case 'Aristocrat':
                // code block
                break;
            case 'Decaea':
                // code block
                break;
            case 'Barbarians':
                // code block
                break;
            case 'Consul':
                // code block
                break;
            default:
                return false
            // code block
        }
        return false
   
}

export const battleCardClasses=(item:any,itemDeck:any)=>{
    const cardsPresent= itemDeck.map((item:any)=>item.name)
    const cardPresentLength=cardsPresent.length
    const ArcherLength= cardsPresent.filter((item:any)=>item.name==='Archer').length
    if(item.name==='Archer'){
    
        // if(cardPresentLength===ArcherLength){
        // row-fluid col-lg-3 
        return 'card-stacking staking-on-end';
        // }
        // else{
        //     console.log("2")
        //     return 'card-stacking staking-on-end';
        // }
      
    }
    else{
      return 'card-row-selected ';
    }
  }