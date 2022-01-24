import { toast } from "react-toastify";
import { ThunkDispatch } from "redux-thunk";
import Web3 from "web3"
import { clearLocalStore, setLocalStore } from "../../common/localStorage";
import { setAccountBalance, setAccounts, setChainId, setConnected, setTokenBalance, setWeb3 } from "../../store/reducer/walletReducer";
import { AdminAddress, UINT256_MAX, xsVEMPTokenAddress } from "../config/constant/Address";
import xsVempTokenABI from '../config/abi/xsVempToken.json'
import adminABI from '../config/abi/Admin.json'


declare const window: any;

declare global {
    interface Window {
        ethereum: any;
        web3: Web3;
    }
}

export const fetchAccounts = () => {
    return new Promise((resolve, reject) => {
        const ethAccounts = getAccounts();
        resolve(ethAccounts)
    });
};


export const getChainId = async () => {
    try {
        const chainId = await window.web3?.eth?.getChainId()
        return chainId;
    }
    catch (e) {
        return '';
    }
}

export const getBalance = async (account:string) => {
    try{
        const balance = await window.web3.eth.getBalance(account);
        return (balance / Math.pow(10, 18)).toFixed(4);
    }
    catch(e){
        return ''
    }
    
  };

  export const getTokenBalance = async (account:string,chainId:any) => {
    try{
        if(account){
          const getChainId=chainId.toString()
          if(getChainId!=="4" && getChainId!=="1" && getChainId!=="56" && getChainId!=="97" ){
            const contract = new window.web3.eth.Contract(
                xsVempTokenABI,
                xsVEMPTokenAddress,
            );
            const balance = await contract.methods.balanceOf(account).call()
            return (balance / Math.pow(10, 18)).toFixed(3);
        }
      }
    }
    catch(error){
        console.log("error",error)
        return ''
    }
    
  };


export const getAccounts = async () => {
    try {
        return await window.web3?.eth?.getAccounts();
    } catch (e) {
        return '';
    }
}

export const openMetamask = async (dispatch: any) => {
    window.web3 = new Web3(window.ethereum);
    const chainId = await getChainId()

    let addresses = await getAccounts();
    if (!addresses.length) {
        try {
            addresses = await window.ethereum.enable();
            dispatch(setAccounts(addresses))
            dispatch(setConnected(true))
            dispatch(setWeb3(window.web3.eth))
            dispatch(setChainId(chainId))

        } catch (e) {
            return false;
        }
    }
    return addresses.length ? addresses[0] : null;
};

export const fetchWalletPublicDataAsync = async (dispatch: any) => {
    window.web3 = new Web3(window.ethereum);
    const address = await getAccounts()
    setLocalStore('account',address)
    const chainId = await getChainId()
    const balance= await getBalance(address[0])
    const tokenBalance:any= await getTokenBalance(address[0],chainId)
    chainIdChecker(chainId)
    const getConnected = async () => {
        dispatch(setAccounts(address))
        dispatch(setWeb3(window.web3.eth))
        dispatch(setChainId(chainId))
        if (address[0]) {
            dispatch(setAccountBalance(balance))
            dispatch(setTokenBalance(tokenBalance))
            dispatch(setConnected(true))
        }
        else {
            dispatch(setConnected(false))
        }
    }
    window?.ethereum?.on('accountsChanged', async (accounts: any) => {
        // dispatch(setAccounts(accounts))
        if (!accounts[0]) {
            dispatch(setAccounts(accounts))
            dispatch(setConnected(false))
            clearLocalStore('account')
        }
    })
    window.ethereum.on('networkChanged', async(chainId: any) => {
      chainIdChecker(chainId)
      dispatch(setChainId(chainId))
    });

    getConnected()
}

export const chainIdChecker=(chainId:any)=>{
  const getChainId=chainId.toString()
  if(getChainId!=="4" && getChainId!=="1" && getChainId!=="56" && getChainId!=="97" ){
    toast.warn("Please select correct network",{
      position: "top-center",
      closeOnClick: true,
    })
  }
}

    // read contract

    export const getConnection = async (dispatch: any) => {
        const account = await openMetamask(dispatch)
        if (account[0]) {
            toast("Connected to metamask");
        }
    }

      export const Allowance = async (account:any) => {
        try {
          if (account) {
            const contract = new window.web3.eth.Contract(
                xsVempTokenABI,
                xsVEMPTokenAddress,
            );
              const allowance = await contract.methods
                ?.allowance(account, xsVEMPTokenAddress)
                ?.call();
              return allowance;
            }
          }
           catch (error) {
          console.log("error", error);
          return "";
        }
      };
      
      export const isConnected = async () => {
        const accounts = await window.web3?.web3.eth.getAccounts();
      
        return !!accounts.length;
      };
      
    //   export const hexToNumber = (hex) => web3.utils.hexToNumber(hex);
      
    // write contract


      
      export const Approve = async (address:string) => {
        try {
          if (address) {
            const contract = new window.web3.eth.Contract(
                xsVempTokenABI,
                xsVEMPTokenAddress,
            );
              const approveResponse = await contract.methods
                ?.approve(xsVEMPTokenAddress, UINT256_MAX)
                ?.send({ from: address });
          
              return parseBalance(approveResponse);
            } 
          }
         catch (error) {
          console.log("Error while approving", error);
          return "";
        }
      };
      
      export const battleLockToken = async (address:string,amount:any, riskPercent:any, roomId:any) => {
        try {
          if (address) {
            const contract = new window.web3.eth.Contract(
                adminABI,
                AdminAddress,
            );
            const battleAmount = amount*(10**18)
              const confirmed = await contract.methods
                ?.battleLockTokens(battleAmount, riskPercent, roomId)
                ?.send({ from: address });
          
              return confirmed;
            } 
          }
         catch (e) {
          console.log("error while locking", e);
          return ''
        }
      };
      // export const hexToNumber = (hex) => web3.utils.hexToNumber(hex);
      
      export const parseBalance = (num:number) =>
        parseFloat((num / Math.pow(10, 18)).toFixed(4));
      