import { toast } from "react-toastify";
import copy from 'copy-to-clipboard';
import CardInfoModal from "../components/Game/CardList/CardInfoModal";


export const addressSubstring = (walletAddress: string) => {
  const accountEllipsis = walletAddress ? `${walletAddress.substring(0, 8)}...${walletAddress.substring(walletAddress.length - 7)}` : '';
  return accountEllipsis
}

export const handleRemoveActive = (cardList:any) => {
  
  for (let i = 0; i < cardList.length; i++) {
    if( cardList[i]["active"]){
      cardList[i]["active"] = false;
    }
  }
};

export const copyToClipboard = async (text: string) => {
  copy(text);
  toast('Address copied');
}

export const cardDetailModal = (items: any) => {
  return (
    <>
      <CardInfoModal
        css={{
          top: "1rem",
          left: "1rem",
          borderRadius: "24px",
        }}
        battleCard={items}
      />
    </>
  );
};

export const InfoModalCardList = (items: any) => {
  return (
    <>
      <CardInfoModal battleCard={items} />
    </>
  );
};


export const handleRedirect: any = (team: any, message: any, history: any) => {
  history.push({
    pathname: "/game-winner",
    search: team,
    state: message
  });
}

export const routeToCardSelection = (walletState: any, owner: any, team: any, history: any) => {
  let selectedTeam = "";
  if (owner !== walletState?.userName) {
    if (team === "Romulus") {
      selectedTeam = "Remus";
    } else if (team === "Remus") {
      selectedTeam = "Romulus";
    }
  } else {
    selectedTeam = team;
  }
  history.push({
    pathname: `/cards-selection/${owner}`,
    search: selectedTeam,
    state: {
      team: selectedTeam,
      owner: owner,
    },
  });
}

export const chainNetwork = (chainId: any) => {
  switch (chainId) {
    case "1":
      return 'ETH';
    case "4":
      return 'RINKEBY';
    case "56":
      return 'BSC';
    case "97":
      return 'BSC-TESTNET';
    case "3":
      return 'ROPSTEN';
    case "5":
      return 'GOERLI';
    default:
      return 'OTH';
  }
}