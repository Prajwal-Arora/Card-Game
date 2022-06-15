import { useAppSelector } from "./store";

export const useWalletDetail = () => {
  const wallet = useAppSelector((state) => state?.walletConnect);

  return wallet;
};

export const useUserDetail = () => {
  const detail = useAppSelector((state) => state?.userDetail);

  return detail;
};

export const useSocketDetail = () => {
  const detail = useAppSelector((state) => state?.userDetail.socket);
  return detail;
};

export const useBattleDetail = () => {
  const detail: any = useAppSelector((state) => state?.userDetail.battleArray);

  return detail;
};

export const useNftCards=()=>{
  const nftCards: any = useAppSelector((state) => state?.userDetail.nftCards);
  return nftCards;
}

