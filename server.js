const express = require('express');
const app = express();
const port = 3003;
const cors = require('cors')
const { instrument } = require('@socket.io/admin-ui');
// const mongoose = require('./database');

app.use(cors());

const server = app.listen(port, () => console.log("Server listening on port " + port));
const io = require("socket.io")(server, { 
    cors: {
        origin: ["http://localhost:3000", "https://admin.socket.io/"]
    }
});

const battleArray = [];

io.on("connection", socket => {

    // 1st on
    socket.on("createBattleRoom", (data, callback) => {
        const payload = JSON.parse(data);
        if(payload.p1 === '' || payload.xVemp === '') {
            callback()
            console.log('EMPTY ADDRESS OR XVEMP')
        } else {
            const {newBattle} = addBattle({
                player1: payload.p1,
                team1: payload.team,
                player2: '',
                xVempLocked: payload.xVemp,
                risk1: '',
                risk2: '',
                legion1: [],
                legion2: [],
                cardsP1: [],
                cardsP2: [],
                score1: 0,
                score2: 0,
                playedCardsP1: [],
                playedCardsP2: [],
                discardedCards1: [],
                discardedCards2: [],
                turn: payload.p1,
                winner_g: '',
                winner_r1: '',
                winner_r2: '',
                roundP1: 1,
                roundP2: 1
            })
            socket.join(payload.p1);
            socket.emit("p1xObj", JSON.stringify(newBattle))
        }
    })

    //2nd on
    socket.on("joinCreatedRooms", (data) => {
        const payload = JSON.parse(data);
        const index = battleArray.findIndex(obj => obj.player1 === payload.roomOwner);
        battleArray[index].player2 = payload.client;
        socket.join(payload.roomOwner);
        io.in(payload.roomOwner).emit("p2Obj", JSON.stringify(battleArray[index]));
    })

    //3rd on
    socket.on("clean", (data) => {
        const index = battleArray.findIndex(obj => obj.player1 === data);
        battleArray.splice(index, 1);
        socket.emit("cleanedArray", JSON.stringify(battleArray))
    })

    //4th on
    socket.on("getArray", () => {
        socket.emit("arrayOnJoin", JSON.stringify(battleArray));
    })

    //5th on
    socket.on("riskButtonClick", data => {
        const array = JSON.parse(data);
        const index = battleArray.findIndex(obj => obj.player1 === array[0]);
        if(battleArray[index].player1 === array[1]) {
            battleArray[index].risk1 = array[2]
        } else {
            battleArray[index].risk2 = array[2]
        }
        io.in(array[0]).emit("riskFactorChange", JSON.stringify(battleArray[index]));
    })

    //6th on
    socket.on("cards-selected", data => {
        const array = JSON.parse(data);
        const index = battleArray.findIndex(obj => obj.player1 === array.owner);
        if(battleArray[index].player1 === array.client) {
            battleArray[index].cardsP1 = array.cards;
        } else {
            battleArray[index].cardsP2 = array.cards;
        }
        io.in(array.owner).emit("arrayWithCards", JSON.stringify(battleArray[index]));
    })

    //7th on
    socket.on("cardClick", data => {
        const array = JSON.parse(data);
        const index = battleArray.findIndex(obj => obj.player1 === array[1]);

        if(battleArray[index].player1 === array[2]) {

            // Universal Cards

            const cardIndex = battleArray[index].cardsP1.findIndex(card => card.ability === array[0].ability);

            // Legionnaire ONLY
            if (array[0].ability === "The_Machine") {
                let updated = Legionnaire(cardIndex, array[3], array[0], battleArray[index].score1, battleArray[index].score2, battleArray[index].cardsP1, battleArray[index].playedCardsP1, battleArray[index].playedCardsP2, battleArray[index].discardedCards1, battleArray[index].discardedCards2);
                battleArray[index].score1 = updated[0];
                battleArray[index].playedCardsP1 = (updated[2])
                battleArray[index].cardsP1 = updated[1];

                io.in(array[1]).emit("updater", JSON.stringify(battleArray[index]));
                return;
            }

            // Challus ONLY
            if (array[0].ability === "Rally") {
                let updated = challus(cardIndex, array[3], array[0], battleArray[index].score1, battleArray[index].score2, battleArray[index].cardsP1, battleArray[index].playedCardsP1, battleArray[index].playedCardsP2, battleArray[index].discardedCards1, battleArray[index].discardedCards2);
                battleArray[index].score1 = updated[0];
                battleArray[index].playedCardsP1 = (updated[2])
                battleArray[index].cardsP1 = updated[1];

                io.in(array[1]).emit("updater", JSON.stringify(battleArray[index]));
                return;
            }

            // julius ONLY
            if (array[0].ability === "Strategist") {
                let updated = Julius(cardIndex, array[3], array[0], battleArray[index].score1, battleArray[index].score2, battleArray[index].cardsP1, battleArray[index].playedCardsP1, battleArray[index].playedCardsP2, battleArray[index].discardedCards1, battleArray[index].discardedCards2);
                battleArray[index].score1 = updated[0];
                battleArray[index].playedCardsP1 = (updated[2])
                battleArray[index].cardsP1 = updated[1];

                io.in(array[1]).emit("updater", JSON.stringify(battleArray[index]));
                return;
            }

            // infantry ONLY
            if (array[0].ability === "Morale_Boost") {
                let updated = infantry(cardIndex, array[3], array[0], battleArray[index].score1, battleArray[index].score2, battleArray[index].cardsP1, battleArray[index].playedCardsP1, battleArray[index].playedCardsP2, battleArray[index].discardedCards1, battleArray[index].discardedCards2);
                battleArray[index].score1 = updated[0];
                battleArray[index].playedCardsP1 = (updated[2])
                battleArray[index].cardsP1 = updated[1];

                io.in(array[1]).emit("updater", JSON.stringify(battleArray[index]));
                return;
            }

            // after click
            const playedCard = battleArray[index].cardsP1.splice(cardIndex, 1);
            battleArray[index].playedCardsP1.push(playedCard[0]);

            // item empty checker
            if (Object.keys(array[3]).length !== 0 && array[0].ability !== "Ruthless_Tactics" && array[0].ability !== "Man_of_the_People" && array[0].ability !== "Eagle_Vision" && array[0].ability !== "Diplomat") {
                const itemIndex = battleArray[index].playedCardsP2.findIndex(card => card.ability === array[3].ability);
                battleArray[index].playedCardsP2.splice(itemIndex, 1);
            }

            // after ability
            let updated = Updater(array[3], array[0], battleArray[index].score1, battleArray[index].score2, battleArray[index].cardsP1, battleArray[index].playedCardsP1, battleArray[index].playedCardsP2, battleArray[index].discardedCards1, battleArray[index].discardedCards2);            
            battleArray[index].score1 = updated[0];
            battleArray[index].playedCardsP1 = (updated[2])
            battleArray[index].cardsP1 = updated[1];
            battleArray[index].score2 = updated[6];
            battleArray[index].discardedCards2 = updated[5];
            battleArray[index].discardedCards1 = updated[4];

        } else {

            // Universal Cards

            const cardIndex = battleArray[index].cardsP2.findIndex(card => card.ability === array[0].ability);

            // Legionnaire ONLY
            if (array[0].ability === "The_Machine") {
                let updated = Legionnaire(cardIndex, array[3], array[0], battleArray[index].score2, battleArray[index].score1, battleArray[index].cardsP2, battleArray[index].playedCardsP2, battleArray[index].playedCardsP1, battleArray[index].discardedCards2, battleArray[index].discardedCards1)
                battleArray[index].score2 = updated[0];
                battleArray[index].playedCardsP2 = (updated[2])
                battleArray[index].cardsP2 = updated[1];

                io.in(array[1]).emit("updater", JSON.stringify(battleArray[index]));
                return;
            }

            // Challus ONLY
            if (array[0].ability === "Rally") {
                let updated = challus(cardIndex, array[3], array[0], battleArray[index].score2, battleArray[index].score1, battleArray[index].cardsP2, battleArray[index].playedCardsP2, battleArray[index].playedCardsP1, battleArray[index].discardedCards2, battleArray[index].discardedCards1)
                battleArray[index].score2 = updated[0];
                battleArray[index].playedCardsP2 = (updated[2])
                battleArray[index].cardsP2 = updated[1];

                io.in(array[1]).emit("updater", JSON.stringify(battleArray[index]));
                return;
            }

            // julius ONLY
            if (array[0].ability === "Strategist") {
                let updated = Julius(cardIndex, array[3], array[0], battleArray[index].score2, battleArray[index].score1, battleArray[index].cardsP2, battleArray[index].playedCardsP2, battleArray[index].playedCardsP1, battleArray[index].discardedCards2, battleArray[index].discardedCards1)
                battleArray[index].score2 = updated[0];
                battleArray[index].playedCardsP2 = (updated[2])
                battleArray[index].cardsP2 = updated[1];

                io.in(array[1]).emit("updater", JSON.stringify(battleArray[index]));
                return;
            }

            // infantry ONLY
            if (array[0].ability === "Morale_Boost") {
                let updated = infantry(cardIndex, array[3], array[0], battleArray[index].score2, battleArray[index].score1, battleArray[index].cardsP2, battleArray[index].playedCardsP2, battleArray[index].playedCardsP1, battleArray[index].discardedCards2, battleArray[index].discardedCards1)
                battleArray[index].score2 = updated[0];
                battleArray[index].playedCardsP2 = (updated[2])
                battleArray[index].cardsP2 = updated[1];

                io.in(array[1]).emit("updater", JSON.stringify(battleArray[index]));
                return;
            }

            // after click
            const playedCard = battleArray[index].cardsP2.splice(cardIndex, 1);
            battleArray[index].playedCardsP2.push(playedCard[0]);

            // item empty checker 
            if (Object.keys(array[3]).length !== 0 && array[0].ability !== "Ruthless_Tactics" && array[0].ability !== "Man_of_the_People" && array[0].ability !== "Eagle_Vision" && array[0].ability !== "Diplomat") {
                const itemIndex = battleArray[index].playedCardsP1.findIndex(card => card.ability === array[3].ability);
                battleArray[index].playedCardsP1.splice(itemIndex, 1);
            }

            // after ability
            let updated = Updater(array[3], array[0], battleArray[index].score2, battleArray[index].score1, battleArray[index].cardsP2, battleArray[index].playedCardsP2, battleArray[index].playedCardsP1, battleArray[index].discardedCards2, battleArray[index].discardedCards1);
            battleArray[index].score2 = updated[0];
            battleArray[index].playedCardsP2 = (updated[2]);
            battleArray[index].cardsP2 = updated[1];
            battleArray[index].score1 = updated[6];
            battleArray[index].discardedCards1 = updated[5];
            battleArray[index].discardedCards2 = updated[4];
        }

        io.in(array[1]).emit("updater", JSON.stringify(battleArray[index]));

    })

    //8th on
    socket.on("changeTurn", data => {
        const array = JSON.parse(data);
        const index = battleArray.findIndex(obj => obj.player1 === array[1]);
        if(battleArray[index].player1 === array[2]) {
            battleArray[index].turn = battleArray[index].player2;
        } else {
            battleArray[index].turn = battleArray[index].player1;
        }
        io.in(array[1]).emit("turnChanged", JSON.stringify(battleArray[index]));
    })

    //9th on
    socket.on("endClick", data => {
        
        const array = JSON.parse(data);
        const index = battleArray.findIndex(obj => obj.player1 === array[0]);

            // empty deck in round 1 declare winner
            if (battleArray[index].cardsP1.length === 0 && battleArray[index].roundP1 === 1 && battleArray[index].cardsP2.length !== 0) {
                battleArray[index].winner_g = battleArray[index].player2;
                io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                return;
            }
            // empty deck in round 1 declare winner (opponent)
            if (battleArray[index].cardsP2.length === 0 && battleArray[index].roundP2 === 1 && battleArray[index].cardsP1.length !== 0) {
                battleArray[index].winner_g = battleArray[index].player1;
                io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                return;
            }
            
            // round +1
            if(battleArray[index].player1 === array[1]) {
                battleArray[index].roundP1 = battleArray[index].roundP1 + 1;
                io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
            }
            // round +1
            if(battleArray[index].player2 === array[1]) {
                battleArray[index].roundP2 = battleArray[index].roundP2 + 1;
                io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
            }

            // if in round 3 both press end
            if (battleArray[index].roundP1 === 4 && battleArray[index].roundP2 === 4) {
                let winCount1 = 0;
                let winCount2 = 0;
                // check round 1 winner
                if (battleArray[index].winner_r1 === battleArray[index].player1) {
                    winCount1 = winCount1 + 1;
                } else {
                    winCount2 = winCount2 + 1;
                }
                // check round 2 winner
                if (battleArray[index].winner_r2 === battleArray[index].player1) {
                    winCount1 = winCount1 + 1;
                } else {
                    winCount2 = winCount2 + 1;
                }
                // check round 3 winner
                if (battleArray[index].score1 > battleArray[index].score2) {
                    winCount1 = winCount1 + 1;
                } else {
                    winCount2 = winCount2 + 1;
                }
                // declare game winnner
                if (winCount1 > winCount2) {
                    battleArray[index].winner_g = battleArray[index].player1;
                } else {
                    battleArray[index].winner_g = battleArray[index].player2;
                }
                io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                return;
            }

            // in second round both empty decks or single empty deck
            if (battleArray[index].roundP1 === 3 && battleArray[index].roundP2 === 3 && battleArray[index].cardsP1.length === 0 || battleArray[index].cardsP2.length === 0) {
                console.log("------TEST------")
                return;
            }
            
            // when roundp1 = roundp2 (2 is for r1 , 3 is for r2) both press end
            if (battleArray[index].roundP1 === battleArray[index].roundP2) {
                // check round winner
                if (battleArray[index].score1 > battleArray[index].score2) {
                    if (battleArray[index].winner_r1 === '') {
                        battleArray[index].winner_r1 = battleArray[index].player1;
                    } else {
                        battleArray[index].winner_r2 = battleArray[index].player1;
                    }
                } else {
                    if (battleArray[index].winner_r1 === '') {
                        battleArray[index].winner_r1 = battleArray[index].player2;
                    } else {
                        battleArray[index].winner_r2 = battleArray[index].player2;
                    }
                }

                // both have empty deck after 1st round
                if (battleArray[index].cardsP1.length === 0 && battleArray[index].cardsP2.length === 0 && battleArray[index].roundP1 === 2 && battleArray[index].roundP2 === 2) {
                    battleArray[index].winner_g = battleArray[index].winner_r1;
                    io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                    return;
                }

                // winner 1 and winner 2 are same after round 2
                if (battleArray[index].winner_r1 === battleArray[index].winner_r2) {
                    battleArray[index].winner_g = battleArray[index].winner_r1;
                    io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                    return;
                }
                //score reset deck reset
                battleArray[index].score1 = 0;
                battleArray[index].score2 = 0;

                // mercenary ability 1
                let checkMercInDeck1 = battleArray[index].playedCardsP1.filter(card => card.ability === "Bought_and_Paid_For");

                if (battleArray[index].roundP1 === 2 || battleArray[index].roundP2 === 2) {

                    if (checkMercInDeck1.length !== 0 && battleArray[index].winner_r1 === battleArray[index].player1) {
                        battleArray[index].playedCardsP1.forEach((cards) => {
                            if (cards.ability === "Bought_and_Paid_For") {
                                return;
                            }
                            battleArray[index].discardedCards1.push(cards);
                        })
                        battleArray[index].playedCardsP1 = checkMercInDeck1;
                        battleArray[index].score1 = checkMercInDeck1.length * 4;
                    } else {
                        battleArray[index].playedCardsP1.forEach((cards) => {
                            battleArray[index].discardedCards1.push(cards);
                        })
                        battleArray[index].playedCardsP1 = [];
                    }
                }
                if (battleArray[index].roundP1 === 3 || battleArray[index].roundP2 === 3) {

                    if (checkMercInDeck1.length !== 0 && battleArray[index].winner_r2 === battleArray[index].player1) {
                        battleArray[index].playedCardsP1.forEach((cards) => {
                            if (cards.ability === "Bought_and_Paid_For") {
                                return;
                            }
                            battleArray[index].discardedCards1.push(cards);
                        })
                        battleArray[index].playedCardsP1 = checkMercInDeck1;
                        battleArray[index].score1 = checkMercInDeck1.length * 4;
                    } else {
                        battleArray[index].playedCardsP1.forEach((cards) => {
                            battleArray[index].discardedCards1.push(cards);
                        })
                        battleArray[index].playedCardsP1 = [];
                    }
                }

                // mercenary ability 2
                let checkMercInDeck2 = battleArray[index].playedCardsP2.filter(card => card.ability === "Bought_and_Paid_For");

                if (battleArray[index].roundP1 === 2 || battleArray[index].roundP2 === 2) {

                    if (checkMercInDeck2.length !== 0 && battleArray[index].winner_r1 === battleArray[index].player2) {
                        battleArray[index].playedCardsP2.forEach((cards) => {
                            if (cards.ability === "Bought_and_Paid_For") {
                                return;
                            }
                            battleArray[index].discardedCards2.push(cards);
                        })
                        battleArray[index].playedCardsP2 = checkMercInDeck2;
                        battleArray[index].score2 = checkMercInDeck2.length * 4;
                    } else {
                        battleArray[index].playedCardsP2.forEach((cards) => {
                            battleArray[index].discardedCards2.push(cards);
                        })
                        battleArray[index].playedCardsP2 = [];
                    }
                }

                if (battleArray[index].roundP1 === 3 || battleArray[index].roundP2 === 3) {

                    if (checkMercInDeck2.length !== 0 && battleArray[index].winner_r2 === battleArray[index].player2) {
                        battleArray[index].playedCardsP2.forEach((cards) => {
                            if (cards.ability === "Bought_and_Paid_For") {
                                return;
                            }
                            battleArray[index].discardedCards2.push(cards);
                        })
                        battleArray[index].playedCardsP2 = checkMercInDeck2;
                        battleArray[index].score2 = checkMercInDeck2.length * 4;
                    } else {
                        battleArray[index].playedCardsP2.forEach((cards) => {
                            battleArray[index].discardedCards2.push(cards);
                        })
                        battleArray[index].playedCardsP2 = [];
                    }
                }
            }
            io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
    })

})

const addBattle = ({player1, team1, player2, xVempLocked, risk1, risk2, legion1, legion2, cardsP1, cardsP2, score1, score2, playedCardsP1, playedCardsP2, discardedCards1, discardedCards2, turn, winner_g, winner_r1, winner_r2, roundP1, roundP2}) => {
    const newBattle = {player1, team1, player2, xVempLocked, risk1, risk2, legion1, legion2, cardsP1, cardsP2, score1, score2, playedCardsP1, playedCardsP2, discardedCards1, discardedCards2, turn, winner_g, winner_r1, winner_r2, roundP1, roundP2}
    battleArray.push(newBattle)
    return { newBattle }
}

const Legionnaire = (cardIndex, oppCardSelected, cardSelected, currentScore, oppScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD) => {

    currentScore = currentScore + cardSelected.strength;
    playedDeck.forEach((card) => {
        if (card.name === "Legionnaire") {
            currentScore = currentScore + card.strength;
        }
    })
    currentDeck.splice(cardIndex, 1);
    playedDeck.push(cardSelected);
    return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
}

const challus = (cardIndex, oppCardSelected, cardSelected, currentScore, oppScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD) => {

    currentScore = currentScore + cardSelected.strength;
    playedDeck.forEach((card) => {
        if (card.class === "Light_Soldier") {
            currentScore = currentScore + 1;
        }
    })
    currentDeck.splice(cardIndex, 1);
    playedDeck.push(cardSelected);
    return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
}

const Julius = (cardIndex, oppCardSelected, cardSelected, currentScore, oppScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD) => {

    currentScore = currentScore + cardSelected.strength;
    playedDeck.forEach((card) => {
        if (card.class === "Heavy_Soldier") {
            currentScore = currentScore + Math.ceil((25 * card.strength) / 100);
        }
    })
    currentDeck.splice(cardIndex, 1);
    playedDeck.push(cardSelected);
    return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
}

const infantry = (cardIndex, oppCardSelected, cardSelected, currentScore, oppScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD) => {

    currentScore = currentScore + cardSelected.strength;
    playedDeck.forEach((card) => {
        if (card.name === "Light_Infantry") {
            currentScore = currentScore + 1;
        }
    })
    currentDeck.splice(cardIndex, 1);
    playedDeck.push(cardSelected);
    return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
}

const Updater = (oppCardSelected, cardSelected, currentScore, oppScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD) => {

    // 0
    if(cardSelected.ability === "None" || cardSelected.ability === "Our_Fearless_Leader" || cardSelected.ability === "Bought_and_Paid_For") {
        currentScore = currentScore + cardSelected.strength;
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
    }
    
    // 1
    if(cardSelected.ability === "Volley") {
        currentScore = currentScore + cardSelected.strength;
        currentDeck.forEach((card) => {
            if(card.ability === "Volley") {
                currentScore = currentScore + card.strength;
                playedDeck.push(card)
            }
        })
        currentDeck = currentDeck.filter(card => card.ability !== "Volley");
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
    }

    // 2
    if (cardSelected.ability === "Efficiency") {
        currentScore = currentScore + cardSelected.strength;
        oppPlayedDeck.forEach((card) => {
            if (card.class === "Light_Soldier") {
                currentScore = currentScore + 1;
            }
        })
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
    }

    // 3
    if (cardSelected.ability === "Pila") {
        if (Object.keys(oppCardSelected).length === 0) {
            currentScore = currentScore + cardSelected.strength;
            return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
        }
        currentScore = currentScore + cardSelected.strength;
        oppDD.push(oppCardSelected);
        oppScore = oppScore - oppCardSelected.strength;
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
    }

    // 4
    if (cardSelected.ability === "Son_of_the_Wolf" || cardSelected.ability === "Dead_Eye") {
        if (Object.keys(oppCardSelected).length === 0) {
            currentScore = currentScore + cardSelected.strength;
            return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
        }
        currentScore = currentScore + cardSelected.strength;
        oppDD.push(oppCardSelected);
        oppScore = oppScore - oppCardSelected.strength;
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
    }

    // 5
    if (cardSelected.ability === "Ruthless_Tactics") {
        if (Object.keys(oppCardSelected).length === 0) {
            currentScore = currentScore + cardSelected.strength;
            return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
        }
        currentScore = currentScore + cardSelected.strength;
        oppPlayedDeck.forEach((card) => {
            // romulus ability  
            if (oppCardSelected.class === "Heavy_Soldier" && oppCardSelected.name === "Romulus") {
                return;
            }
            if (card.class === oppCardSelected.class) {
                oppScore = oppScore - Math.round(card.strength / 2);
            }
        })
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
    }

    // 6
    if (cardSelected.ability === "A_Stones_Throw") {
        currentScore = currentScore + cardSelected.strength;
        let lowestStrength = Math.min.apply(null, oppPlayedDeck.map(item => item.strength));
        if (lowestStrength > 0) {
            oppPlayedDeck.forEach((card) => {
                if (card.strength === lowestStrength) {
                    oppScore = oppScore - Math.round(card.strength / 2);
                }
            })
        }
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
    }

    // 7
    if (cardSelected.ability === "Persuasive_Speech") {
        if (Object.keys(oppCardSelected).length === 0) {
            currentScore = currentScore + cardSelected.strength;
            return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
        }
        currentScore = currentScore + cardSelected.strength + oppCardSelected.strength;
        playedDeck.push(oppCardSelected);
        oppScore = oppScore - oppCardSelected.strength;
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
    }

    // 8
    if (cardSelected.ability === "Man_of_the_People") {
        if (Object.keys(oppCardSelected).length === 0) {
            currentScore = currentScore + cardSelected.strength;
            return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
        }
        currentScore = currentScore + cardSelected.strength;
        playedDeck.forEach((card) => {
            if(card.class === oppCardSelected.class) {
                currentScore = currentScore + cardSelected.strength;
            }
        })
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
    }

    // 9
    if (cardSelected.ability === "Eagle_Vision") {
        if (Object.keys(oppCardSelected).length === 0) {
            currentScore = currentScore + cardSelected.strength;
            return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
        }
        currentScore = currentScore + cardSelected.strength;
        currentDD = currentDD.filter(card => card.name !== oppCardSelected.name);
        playedDeck.push(oppCardSelected);
        currentScore = currentScore + oppCardSelected.strength;
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
    }

    // 10
    if (cardSelected.ability === "Diplomat") {
        if (Object.keys(oppCardSelected).length === 0) {
            currentScore = currentScore + cardSelected.strength;
            return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
        }
        currentScore = currentScore + cardSelected.strength;
        currentLegion = currentLegion.filter(card => card.name !== oppCardSelected.name);
        playedDeck.push(oppCardSelected);
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
    }
    
    // if (cardSelected.ability === "Wild_Animals") {
    //     currentScore = currentScore + cardSelected.strength;
    //     let barbCount = 0;
    //     playedDeck.forEach((card) => {
    //         if (card.ability === "Wild_Animals") {
    //             barbCount = barbCount + 1;
    //         }
    //     })
    //     let lsCount = 0;
    //     oppPlayedDeck.forEach((card) => {
    //         if (card.class === "Light_Soldier") {
    //             lsCount = lsCount + 1;
    //         }
    //     })
    //     if (lsCount !== 0) {
    //         //
    //     }
    // }
}

instrument(io, { auth: false });