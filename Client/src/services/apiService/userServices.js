import getAxiosInst from "./axios";

// GET - fetch user details
export const getUser = (userAddress) => {
  return getAxiosInst().get(`/api/user/${userAddress}`);
};
// POST - create db entry
export const postUser = (userAddress) => {
  return getAxiosInst().post(`/api/user/${userAddress}`);
};
// PUT - update wins and matches played by 1
export const putWins = (userAddress) => {
  return getAxiosInst().put(`/api/user/${userAddress}/winner`);
};
// PUT - update losses and matches played by 1
export const putLosses = (userAddress) => {
  return getAxiosInst().put(`/api/user/${userAddress}/loser`);
};
// GET - fetch leaderboard top 20 entries
export const getLeaderBoard = () => {
  return getAxiosInst().get('/api/user/leaderboard/top20');
};

// need to change below - prajwal.
export const getUniqueNumber = (OwnerAddress) => {
  return getAxiosInst().get(`/api/user/room/uniqueid/${OwnerAddress}`);
};

export const createUniqueNumber = (OwnerAddress) => {
  return getAxiosInst().post(`/api/user/create/room/${OwnerAddress}`);
};

export const addUserDetail= (ownerAddress,addressP2,xVempLocked,winnerAddress) => {
  return getAxiosInst().post('/api/user/create/game',{
    player1Address:ownerAddress,
    player2Address:addressP2,
    tokens:xVempLocked,
    winnerAddress:winnerAddress
  });
};

export const getBattleHistory= (ownerAddress) => {
  return getAxiosInst().get(`/api/user/game/history/${ownerAddress}`)
};
