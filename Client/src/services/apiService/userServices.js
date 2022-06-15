import getAxiosInst from "./axios";
import Axios from "axios";


// GET - fetch user details
export const getUser = (userName) => {
  return getAxiosInst().get(`/api/user/${userName}`);
};

// PUT - update wins and matches played by 1
export const putWins = (userName) => {
  return getAxiosInst().put(`/api/user/${userName}/winner`);
};
// PUT - update losses and matches played by 1
export const putLosses = (userName) => {
  return getAxiosInst().put(`/api/user/${userName}/loser`);
};
// GET - fetch leaderboard top 20 entries
export const getLeaderBoard = () => {
  return getAxiosInst().get('/api/user/leaderboard/top20');
};

//Get NFT of user
export const getUserNft = (userAddress) => {
  return Axios.get(`https://api.opensea.io/api/v1/assets?owner=${userAddress}&asset_contract_address=0x495f947276749Ce646f68AC8c248420045cb7b5e&order_direction=desc&offset=0&limit=20&collection=vempire-the-founding-soldiers`, { headers: { 'X-API-KEY': '822cac54559947c29f7f6ef8b4840e5b' } })
}

export const getLoggedIn = (userName, userPassword) => {
  return getAxiosInst().post('/api/login', {
    logUsername: userName,
    logPassword: userPassword
  });
}

export const getSigin = (userName,userEmail, userPassword) => {
  return getAxiosInst().post('/api/signup', {
    username: userName,
    email:userEmail,
    password: userPassword
  });
}

// export const getSigin = (userName, userEmail, userPassword) => {
//   return Axios({
//     method: 'post',
//     url: 'http://localhost:3003/api/signup',
//     data: {
//       username: userName,
//       email: userEmail,
//       password: userPassword
//     }
//   })
// }

