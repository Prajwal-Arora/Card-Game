const mongoose = require('./database');
const express = require('express');
const app = express();
const port = 3003;
const cors = require('cors');
const { Telegraf } = require('telegraf');
const bot = new Telegraf('<BOT-TOKEN>');
const server = app.listen(port, () => console.log("Server listening on port " + port));
const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    },
    pingTimeout: 60000
});

app.use(cors());
app.use(express.json());

// Api routes
app.use("/api/user", require('./api/user'));
app.use("/api/login", require('./api/login'));
app.use("/api/signup", require('./api/signup'));
app.use("/api/forgetPass", require('./api/forgetPass'));
app.use("/api/resetPass", require('./api/resetPass'));

app.get("/", (req, res, next) => {
    res.status(200);
})

const battleArray = [];

bot.command('start', ctx => {
    console.log(ctx.from)
    bot.telegram.sendMessage(ctx.chat.id, 'Started listening!', {
    })
})

bot.launch();

io.on("connection", socket => {

    socket.on("telegram", data => {
        bot.telegram.sendMessage("<enter-chat-id>", `${data} has created a room. \n \nGot what it takes to defeat them? 👀 \n \nBattle it out here ⚔️: \n \n🔗 https://freeplay.v-empire.io/`, {})
    }) 

    // 1st on
    socket.on("createBattleRoom", (data, callback) => {
        try {
            const payload = JSON.parse(data);
            if (payload.p1 === '') {
                callback()
                console.log('EMPTY ADDRESS')
            } else {
                const index = battleArray.findIndex(obj => obj.player1 === payload.p1);
                if (index !== -1) {
                    battleArray.splice(index, 1);
                }
                const { newBattle } = addBattle({
                    player1: payload.p1,
                    team1: payload.team,
                    player2: '',
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
                    turn: '',
                    winner_g: '',
                    winner_r1: '',
                    winner_r2: '',
                    roundP1: 1,
                    roundP2: 1,
                    sudisRound: 0,
                    sudisFlag1: 0,
                    sudisFlag2: 0,
                    auxFlag: 0,
                    spectators: [],
                    url: ''
                })
                socket.join(payload.p1);
                socket.emit("p1xObj", JSON.stringify(newBattle))
            }
        } catch (e) {
            console.log(e);
        }
    })

    //2nd on
    socket.on("joinCreatedRooms", (data) => {
        try {
            const payload = JSON.parse(data);
            const index = battleArray.findIndex(obj => obj.player1 === payload.roomOwner);
            if (battleArray[index].player2 !== '') {
                socket.emit("roomFull");
                return;
            }
            battleArray[index].player2 = payload.client;
            socket.join(payload.roomOwner);
            io.in(payload.roomOwner).emit("p2Obj", JSON.stringify(battleArray[index]));
        } catch (e) {
            console.log(e);
        }
    })

    socket.on("joinAsSpectator", data => {
        try {
            const array = JSON.parse(data);
            const index = battleArray.findIndex(obj => obj.player1 === array[0]);
            battleArray[index].spectators.push(array[1]);
            socket.join(array[0]);
        } catch (e) {
            console.log(e);
        }
    })

    //3rd on
    socket.on("clean", (data) => {
        try {
            const array = JSON.parse(data);
            const index = battleArray.findIndex(obj => obj.player1 === array[0]);
            if (index === -1) {
                return;
            }

            if (battleArray[index].player1 === array[1]) {
                battleArray[index].player1 = '';
                io.in(array[0]).emit("cleanedArray", JSON.stringify(battleArray[index]));
                battleArray.splice(index, 1);
                return;
            }

            if (battleArray[index].player2 === array[1]) {
                battleArray[index].player2 = '';
                io.in(array[0]).emit("cleanedArray", JSON.stringify(battleArray[index]));
                return;
            }
        } catch (e) {
            console.log(e);
        }
    })

    //4th on
    socket.on("getArray", () => {
        socket.emit("arrayOnJoin", JSON.stringify(battleArray));
    })


    //5th on
    socket.on("riskButtonClick", data => {
        try {
            const array = JSON.parse(data);
            const index = battleArray.findIndex(obj => obj.player1 === array[0]);
            if (battleArray[index].player1 === array[1]) {
                battleArray[index].risk1 = array[2]
            } else {
                battleArray[index].risk2 = array[2]
            }
            io.in(array[0]).emit("riskFactorChange", JSON.stringify(battleArray[index]));
        } catch (e) {
            console.log(e);
        }
    })

    //6th on
    socket.on("cards-selected", data => {
        try {
            const array = JSON.parse(data);
            const index = battleArray.findIndex(obj => obj.player1 === array[0]);
            battleArray[index].url = array[3];

            if (battleArray[index].player1 === array[1]) {
                battleArray[index].legion1 = array[2];
                for (let i = 0; i < 15; i++) {
                    let randomIndex = Math.floor(Math.random() * battleArray[index].legion1.length);
                    battleArray[index].cardsP1.push(battleArray[index].legion1[randomIndex]);
                    battleArray[index].legion1.splice(randomIndex, 1);
                }
                io.in(array[0]).emit("arrayWithCards", JSON.stringify(battleArray[index]));
                return;
            }
            if (battleArray[index].player2 === array[1]) {
                battleArray[index].legion2 = array[2];
                for (let i = 0; i < 15; i++) {
                    let randomIndex = Math.floor(Math.random() * battleArray[index].legion2.length);
                    battleArray[index].cardsP2.push(battleArray[index].legion2[randomIndex]);
                    battleArray[index].legion2.splice(randomIndex, 1);
                }
                io.in(array[0]).emit("arrayWithCards", JSON.stringify(battleArray[index]));
                return;
            }
        } catch (e) {
            console.log(e);
        }
    })

    //7th on
    socket.on("cardClick", data => {
        try {
            const array = JSON.parse(data);
            const index = battleArray.findIndex(obj => obj.player1 === array[1]);

            if (battleArray[index].player1 === array[2]) {

                let cardIndex = battleArray[index].cardsP1.findIndex(card => card.id === array[0].id);

                if (battleArray[index].sudisFlag1 === 1 && battleArray[index].roundP1 === battleArray[index].sudisRound + 1) {
                    const playedCard = battleArray[index].cardsP1.splice(cardIndex, 1);
                    battleArray[index].discardedCards1.push(playedCard[0]);
                    battleArray[index].sudisFlag1 = 0;
                    io.in(array[1]).emit("updater", JSON.stringify(battleArray[index]));
                    return;
                }

                if (array[0].ability === "Sudis") {
                    battleArray[index].sudisFlag2 = 1;
                    battleArray[index].sudisRound = battleArray[index].roundP1;
                }

                // magnus ONLY
                if (array[0].ability === "Master_Spy") {
                    let updated = magnus(cardIndex, array[4], array[3], array[0], battleArray[index].score1, battleArray[index].score2, battleArray[index].cardsP1, battleArray[index].playedCardsP1, battleArray[index].playedCardsP2, battleArray[index].discardedCards1, battleArray[index].discardedCards2, battleArray[index].legion1);
                    battleArray[index].score1 = updated[0];
                    battleArray[index].playedCardsP1 = (updated[2])
                    battleArray[index].cardsP1 = updated[1];
                    battleArray[index].legion1 = updated[7];
                    battleArray[index].discardedCards1 = updated[4];

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

                // after click
                const playedCard = battleArray[index].cardsP1.splice(cardIndex, 1);
                battleArray[index].playedCardsP1.push(playedCard[0]);

                // AUX
                if (Object.keys(array[3]).length !== 0 && array[3].ability === "Expendable") {
                    let auxInDiscarded = battleArray[index].discardedCards2.filter(card => card.ability === "Expendable");
                    if (battleArray[index].auxFlag === 0 && auxInDiscarded.length !== 0) {
                        // prompt in UI auxilary discarded and brought back from discarded pile
                        battleArray[index].score2 = battleArray[index].score2 + 2;
                        battleArray[index].auxFlag === 1;
                    } else {
                        const itemIndex = battleArray[index].playedCardsP2.findIndex(card => card.id === array[3].id);
                        battleArray[index].playedCardsP2.splice(itemIndex, 1);
                        battleArray[index].discardedCards2.push(array[3]);
                    }
                }

                // item empty checker
                if (Object.keys(array[3]).length !== 0 && array[3].ability !== "Expendable" && array[0].ability !== "Ruthless_Tactics" && array[0].ability !== "Man_of_the_People" && array[0].ability !== "Diplomat" && array[0].ability !== "Reinforcements" && array[0].ability !== "Eyes_on_the_Prize") {
                    const itemIndex = battleArray[index].playedCardsP2.findIndex(card => card.id === array[3].id);
                    battleArray[index].playedCardsP2.splice(itemIndex, 1);
                }

                // after ability
                let updated = Updater(array[3], array[0], battleArray[index].score1, battleArray[index].score2, battleArray[index].cardsP1, battleArray[index].playedCardsP1, battleArray[index].playedCardsP2, battleArray[index].discardedCards1, battleArray[index].discardedCards2, battleArray[index].legion1, battleArray[index].cardsP2);
                battleArray[index].score1 = updated[0];
                battleArray[index].playedCardsP1 = (updated[2])
                battleArray[index].cardsP1 = updated[1];
                battleArray[index].score2 = updated[6];
                battleArray[index].discardedCards2 = updated[5];
                battleArray[index].discardedCards1 = updated[4];
                battleArray[index].legion1 = updated[7];
                battleArray[index].cardsP2 = updated[8];

                io.in(array[1]).emit("updater", JSON.stringify(battleArray[index]));
                return;
            }

            if (battleArray[index].player2 === array[2]) {

                let cardIndex = battleArray[index].cardsP2.findIndex(card => card.id === array[0].id);

                if (battleArray[index].sudisFlag2 === 1 && battleArray[index].roundP2 === battleArray[index].sudisRound + 1) {
                    const playedCard = battleArray[index].cardsP2.splice(cardIndex, 1);
                    battleArray[index].discardedCards2.push(playedCard[0]);
                    battleArray[index].sudisFlag2 = 0;
                    io.in(array[1]).emit("updater", JSON.stringify(battleArray[index]));
                    return;
                }

                if (array[0].ability === "Sudis") {
                    battleArray[index].sudisFlag1 = 1;
                    battleArray[index].sudisRound = battleArray[index].roundP2;
                }

                // magnus ONLY
                if (array[0].ability === "Master_Spy") {
                    let updated = magnus(cardIndex, array[4], array[3], array[0], battleArray[index].score2, battleArray[index].score1, battleArray[index].cardsP2, battleArray[index].playedCardsP2, battleArray[index].playedCardsP1, battleArray[index].discardedCards2, battleArray[index].discardedCards1, battleArray[index].legion2)
                    battleArray[index].score2 = updated[0];
                    battleArray[index].playedCardsP2 = (updated[2])
                    battleArray[index].cardsP2 = updated[1];
                    battleArray[index].legion2 = updated[7];
                    battleArray[index].discardedCards2 = updated[4];

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

                // after click
                const playedCard = battleArray[index].cardsP2.splice(cardIndex, 1);
                battleArray[index].playedCardsP2.push(playedCard[0]);

                // AUX
                if (Object.keys(array[3]).length !== 0 && array[3].ability === "Expendable") {
                    let auxInDiscarded = battleArray[index].discardedCards1.filter(card => card.ability === "Expendable");
                    if (battleArray[index].auxFlag === 0 && auxInDiscarded.length !== 0) {
                        // prompt in UI auxilary discarded and brought back from discarded pile
                        battleArray[index].score1 = battleArray[index].score1 + 2;
                        battleArray[index].auxFlag === 1;
                    } else {
                        const itemIndex = battleArray[index].playedCardsP1.findIndex(card => card.id === array[3].id);
                        battleArray[index].playedCardsP1.splice(itemIndex, 1);
                        battleArray[index].discardedCards1.push(array[3]);
                    }
                }

                // item empty checker 
                if (Object.keys(array[3]).length !== 0 && array[3].ability !== "Expendable" && array[0].ability !== "Ruthless_Tactics" && array[0].ability !== "Man_of_the_People" && array[0].ability !== "Diplomat" && array[0].ability !== "Reinforcements" && array[0].ability !== "Eyes_on_the_Prize") {
                    const itemIndex = battleArray[index].playedCardsP1.findIndex(card => card.id === array[3].id);
                    battleArray[index].playedCardsP1.splice(itemIndex, 1);
                }

                // after ability
                let updated = Updater(array[3], array[0], battleArray[index].score2, battleArray[index].score1, battleArray[index].cardsP2, battleArray[index].playedCardsP2, battleArray[index].playedCardsP1, battleArray[index].discardedCards2, battleArray[index].discardedCards1, battleArray[index].legion2, battleArray[index].cardsP1);
                battleArray[index].score2 = updated[0];
                battleArray[index].playedCardsP2 = (updated[2]);
                battleArray[index].cardsP2 = updated[1];
                battleArray[index].score1 = updated[6];
                battleArray[index].discardedCards1 = updated[5];
                battleArray[index].discardedCards2 = updated[4];
                battleArray[index].legion2 = updated[7];
                battleArray[index].cardsP1 = updated[8];

                io.in(array[1]).emit("updater", JSON.stringify(battleArray[index]));
                return;
            }
        } catch (e) {
            console.log(e);
        }
    })

    //10th on
    socket.on("lock", data => {
        try {
            const array = JSON.parse(data);
            const index = battleArray.findIndex(obj => obj.player1 === array[0]);
            if (battleArray[index].player1 === array[1]) {
                let cardIndex = battleArray[index].playedCardsP1.findIndex(card => card.id === array[2].id);
                battleArray[index].playedCardsP1[cardIndex].lock = true;
                io.in(array[0]).emit("updater", JSON.stringify(battleArray[index]));
                return;
            }
            if (battleArray[index].player2 === array[1]) {
                let cardIndex = battleArray[index].playedCardsP2.findIndex(card => card.id === array[2].id);
                battleArray[index].playedCardsP2[cardIndex].lock = true;
                io.in(array[0]).emit("updater", JSON.stringify(battleArray[index]));
                return;
            }
        } catch (e) {
            console.log(e);
        }
    })

    //11th on
    socket.on("unlock", data => {
        try {
            const array = JSON.parse(data);
            const index = battleArray.findIndex(obj => obj.player1 === array[0]);
            if (battleArray[index].player1 === array[1]) {
                let cardIndex = battleArray[index].playedCardsP2.findIndex(card => card.id === array[2].id);
                battleArray[index].playedCardsP2[cardIndex].lock = false;
                io.in(array[0]).emit("updater", JSON.stringify(battleArray[index]));
                return;
            }
            if (battleArray[index].player2 === array[1]) {
                let cardIndex = battleArray[index].playedCardsP1.findIndex(card => card.id === array[2].id);
                battleArray[index].playedCardsP1[cardIndex].lock = false;
                io.in(array[0]).emit("updater", JSON.stringify(battleArray[index]));
                return;
            }
        } catch (e) {
            console.log(e);
        }
    })

    //8th on
    socket.on("changeTurn", data => {
        try {
            const array = JSON.parse(data);
            const index = battleArray.findIndex(obj => obj.player1 === array[1]);
            if (battleArray[index].player1 === array[2]) {
                battleArray[index].turn = battleArray[index].player2;
            } else {
                battleArray[index].turn = battleArray[index].player1;
            }
            io.in(array[1]).emit("turnChanged", JSON.stringify(battleArray[index]));
        } catch (e) {
            console.log(e);
        }
    })

    //9th on
    socket.on("endClick", data => {
        try {
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
            if (battleArray[index].player1 === array[1]) {
                battleArray[index].roundP1 = battleArray[index].roundP1 + 1;
                io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
            }
            // round +1
            if (battleArray[index].player2 === array[1]) {
                battleArray[index].roundP2 = battleArray[index].roundP2 + 1;
                io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
            }

            // if in round 3 both press end
            if (battleArray[index].roundP1 === 4 && battleArray[index].roundP2 === 4) {

                // if match draw
                if (battleArray[index].score1 === battleArray[index].score2) {
                    battleArray[index].playedCardsP2 = [];
                    battleArray[index].score2 = 0;
                    battleArray[index].playedCardsP1 = [];
                    battleArray[index].score1 = 0;
                    io.in(array[0]).emit("draw", JSON.stringify(battleArray[index]));
                    return;
                }

                // check round 3 winner
                if (battleArray[index].score1 > battleArray[index].score2) {
                    battleArray[index].winner_g = battleArray[index].player1;
                    io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                    return;
                }

                // check round 3 winner
                if (battleArray[index].score2 > battleArray[index].score1) {
                    battleArray[index].winner_g = battleArray[index].player2;
                    io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                    return;
                }
            }

            // ************** roundp1 = roundp2 (2 is for r1 , 3 is for r2) both press end **************
            if (battleArray[index].roundP1 === battleArray[index].roundP2) {

                // check round winner
                if (battleArray[index].score1 > battleArray[index].score2) {
                    if (battleArray[index].winner_r1 === '') {
                        battleArray[index].winner_r1 = battleArray[index].player1;
                    } else {
                        battleArray[index].winner_r2 = battleArray[index].player1;
                    }
                }
                if (battleArray[index].score2 > battleArray[index].score1) {
                    if (battleArray[index].winner_r1 === '') {
                        battleArray[index].winner_r1 = battleArray[index].player2;
                    } else {
                        battleArray[index].winner_r2 = battleArray[index].player2;
                    }
                }

                // winner 1 and winner 2 are same after round 2
                if (battleArray[index].winner_r1 === battleArray[index].winner_r2) {
                    battleArray[index].winner_g = battleArray[index].winner_r1;
                    io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                    return;
                }

                // will only enter here after round 2 end (3-3) //////////////////////////
                if (battleArray[index].cardsP1.length === 0 || battleArray[index].cardsP2.length === 0) {

                    if (battleArray[index].cardsP1.length === 0 && battleArray[index].cardsP2.length !== 0) {
                        battleArray[index].winner_g = battleArray[index].player2;
                        io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                        return;
                    }

                    if (battleArray[index].cardsP2.length === 0 && battleArray[index].cardsP1.length !== 0) {
                        battleArray[index].winner_g = battleArray[index].player1;
                        io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                        return;
                    }

                    if (battleArray[index].cardsP2.length === 0 && battleArray[index].cardsP1.length === 0) {
                        battleArray[index].playedCardsP2 = [];
                        battleArray[index].score2 = 0;
                        battleArray[index].playedCardsP1 = [];
                        battleArray[index].score1 = 0;
                        io.in(array[0]).emit("draw", JSON.stringify(battleArray[index]));
                        return;
                    }
                }
                ////////////////////////////////////////////////////////////

                //score reset deck reset
                battleArray[index].score1 = 0;
                battleArray[index].score2 = 0;
                battleArray[index].auxFlag = 0;

                // t1 - remus | t2 - romulus 
                if (battleArray[index].team1 === "Remus") {

                    let mercInDeck = battleArray[index].playedCardsP1.filter(card => card.ability === "Bought_and_Paid_For");

                    // for round 2
                    if (battleArray[index].roundP1 === 2) {

                        if (mercInDeck.length !== 0 && battleArray[index].winner_r1 === battleArray[index].player1) {
                            battleArray[index].playedCardsP1.forEach((cards) => {
                                if (cards.ability === "Bought_and_Paid_For") {
                                    return;
                                }
                                battleArray[index].discardedCards1.push(cards);
                            })
                            battleArray[index].playedCardsP1 = mercInDeck;
                            battleArray[index].score1 = mercInDeck.length * 4;
                            battleArray[index].playedCardsP2.forEach((cards) => {
                                battleArray[index].discardedCards2.push(cards);
                            })
                            battleArray[index].playedCardsP2 = [];
                            io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                            return;
                        }

                        battleArray[index].playedCardsP1.forEach((cards) => {
                            battleArray[index].discardedCards1.push(cards);
                        })
                        battleArray[index].playedCardsP1 = [];
                        battleArray[index].playedCardsP2.forEach((cards) => {
                            battleArray[index].discardedCards2.push(cards);
                        })
                        battleArray[index].playedCardsP2 = [];
                        io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                        return;

                    }

                    // for round 3
                    if (battleArray[index].roundP1 === 3) {

                        if (mercInDeck.length !== 0 && battleArray[index].winner_r2 === battleArray[index].player1) {
                            battleArray[index].playedCardsP1.forEach((cards) => {
                                if (cards.ability === "Bought_and_Paid_For") {
                                    return;
                                }
                                battleArray[index].discardedCards1.push(cards);
                            })
                            battleArray[index].playedCardsP1 = mercInDeck;
                            battleArray[index].score1 = mercInDeck.length * 4;
                            battleArray[index].playedCardsP2.forEach((cards) => {
                                battleArray[index].discardedCards2.push(cards);
                            })
                            battleArray[index].playedCardsP2 = [];
                            io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                            return;
                        }

                        battleArray[index].playedCardsP1.forEach((cards) => {
                            battleArray[index].discardedCards1.push(cards);
                        })
                        battleArray[index].playedCardsP1 = [];
                        battleArray[index].playedCardsP2.forEach((cards) => {
                            battleArray[index].discardedCards2.push(cards);
                        })
                        battleArray[index].playedCardsP2 = [];
                        io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                        return;
                    }
                }

                // t1 - romulus | t2 - remus 
                if (battleArray[index].team1 === "Romulus") {

                    let mercInDeck = battleArray[index].playedCardsP2.filter(card => card.ability === "Bought_and_Paid_For");

                    if (battleArray[index].roundP1 === 2) {

                        if (mercInDeck.length !== 0 && battleArray[index].winner_r1 === battleArray[index].player2) {
                            battleArray[index].playedCardsP2.forEach((cards) => {
                                if (cards.ability === "Bought_and_Paid_For") {
                                    return;
                                }
                                battleArray[index].discardedCards2.push(cards);
                            })
                            battleArray[index].playedCardsP2 = mercInDeck;
                            battleArray[index].score2 = mercInDeck.length * 4;
                            battleArray[index].playedCardsP1.forEach((cards) => {
                                battleArray[index].discardedCards1.push(cards);
                            })
                            battleArray[index].playedCardsP1 = [];
                            io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                            return;
                        }

                        battleArray[index].playedCardsP1.forEach((cards) => {
                            battleArray[index].discardedCards1.push(cards);
                        })
                        battleArray[index].playedCardsP1 = [];
                        battleArray[index].playedCardsP2.forEach((cards) => {
                            battleArray[index].discardedCards2.push(cards);
                        })
                        battleArray[index].playedCardsP2 = [];
                        io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                        return;

                    }

                    if (battleArray[index].roundP1 === 3) {

                        if (mercInDeck.length !== 0 && battleArray[index].winner_r2 === battleArray[index].player2) {
                            battleArray[index].playedCardsP2.forEach((cards) => {
                                if (cards.ability === "Bought_and_Paid_For") {
                                    return;
                                }
                                battleArray[index].discardedCards2.push(cards);
                            })
                            battleArray[index].playedCardsP2 = mercInDeck;
                            battleArray[index].score2 = mercInDeck.length * 4;
                            battleArray[index].playedCardsP1.forEach((cards) => {
                                battleArray[index].discardedCards1.push(cards);
                            })
                            battleArray[index].playedCardsP1 = [];
                            io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                            return;
                        }

                        battleArray[index].playedCardsP1.forEach((cards) => {
                            battleArray[index].discardedCards1.push(cards);
                        })
                        battleArray[index].playedCardsP1 = [];
                        battleArray[index].playedCardsP2.forEach((cards) => {
                            battleArray[index].discardedCards2.push(cards);
                        })
                        battleArray[index].playedCardsP2 = [];
                        io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                        return;
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    })

    //12th on
    socket.on("afterDraw", data => {
        try {
            const array = JSON.parse(data);
            const index = battleArray.findIndex(obj => obj.player1 === array[0]);
            if (battleArray[index].player1 === array[1]) {
                let newPlayed = battleArray[index].legion1.filter(card => card.id === array[2].id);
                battleArray[index].playedCardsP1 = newPlayed;
                battleArray[index].score1 = array[2].strength;
                io.in(array[0]).emit("d2", JSON.stringify(battleArray[index]));
                return;
            }
            if (battleArray[index].player2 === array[1]) {
                let newPlayed = battleArray[index].legion2.filter(card => card.id === array[2].id);
                battleArray[index].playedCardsP2 = newPlayed;
                battleArray[index].score2 = array[2].strength;
                io.in(array[0]).emit("d2", JSON.stringify(battleArray[index]));
                return;
            }

        } catch (e) {
            console.log(e);
        }
    })

    //13th on
    socket.on("new", data => {
        try {
            const array = JSON.parse(data);
            const index = battleArray.findIndex(obj => obj.player1 === array[0]);
            if (battleArray[index].score1 === battleArray[index].score2) {
                io.in(array[0]).emit("draw", JSON.stringify(battleArray[index]));
                return;
            }
            if (battleArray[index].score1 > battleArray[index].score2) {
                battleArray[index].winner_g = battleArray[index].player1;
                io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                return;
            }
            if (battleArray[index].score1 < battleArray[index].score2) {
                battleArray[index].winner_g = battleArray[index].player2;
                io.in(array[0]).emit("afterEnd", JSON.stringify(battleArray[index]));
                return;
            }
        } catch (e) {
            console.log(e);
        }
    })

    //14th on
    socket.on("csInactive", data => {
        try {
            const array = JSON.parse(data);
            const index = battleArray.findIndex(obj => obj.player1 === array[0]);
            if (battleArray[index].player1 === array[1]) {
                battleArray[index].winner_g = battleArray[index].player2;
                io.in(array[0]).emit("decWin", JSON.stringify(battleArray[index]));
                return;
            }
            if (battleArray[index].player2 === array[1]) {
                battleArray[index].winner_g = battleArray[index].player1;
                io.in(array[0]).emit("decWin", JSON.stringify(battleArray[index]));
                return;
            }
        } catch (e) {
            console.log(e);
        }
    })

    //15th on
    socket.on("inactive", data => {
        try {
            const array = JSON.parse(data);
            const index = battleArray.findIndex(obj => obj.player1 === array[0]);
            battleArray[index].winner_g = battleArray[index].player2;
            io.in(array[0]).emit("inactiveWinner", JSON.stringify(battleArray[index]));
            return;
        } catch (e) {
            console.log(e);
        }
    })

    //16th on
    socket.on("setTurn", data => {
        try {
            const array = JSON.parse(data);
            const index = battleArray.findIndex(obj => obj.player1 === array[0]);
            battleArray[index].turn = array[1];
            io.in(array[0]).emit("turnIsSet", JSON.stringify(battleArray[index]));
        } catch (e) {
            console.log(e);
        }
    })

    //18th on
    socket.on("refresh", data => {
        try {
            const array = JSON.parse(data);
            const index = battleArray.findIndex(obj => obj.player1 === array[0]);
            if (battleArray[index].player1 === array[1]) {
                battleArray[index].winner_g = battleArray[index].player2;
                io.in(array[0]).emit("afterRefresh", JSON.stringify(battleArray[index]));
                return;
            }
            if (battleArray[index].player2 === array[1]) {
                battleArray[index].winner_g = battleArray[index].player1;
                io.in(array[0]).emit("afterRefresh", JSON.stringify(battleArray[index]));
                return;
            }
        } catch (e) {
            console.log(e);
        }
    })

    socket.on("message", data => {
        try {
            io.in(data.owner).emit("newMessage", { text: data.chat, user: data.client });
        } catch (e) {
            console.log(e);
        }
    })

    socket.on("exitSpectator", data => {
        try {
            const array = JSON.parse(data);
            const index = battleArray.findIndex(obj => obj.player1 === array[0]);
            const specToRemove = battleArray[index].spectators.findIndex(i => i === array[1]);
            battleArray[index].spectators.splice(specToRemove, 1);
            io.in(array[0]).emit("afterSpecRemove", JSON.stringify(battleArray[index]));
        } catch (e) {
            console.log(e);
        }
    })
})

const addBattle = ({ player1, team1, player2, legion1, legion2, cardsP1, cardsP2, score1, score2, playedCardsP1, playedCardsP2, discardedCards1, discardedCards2, turn, winner_g, winner_r1, winner_r2, roundP1, roundP2, sudisRound, sudisFlag1, sudisFlag2, auxFlag, spectators, url }) => {
    const newBattle = { player1, team1, player2, legion1, legion2, cardsP1, cardsP2, score1, score2, playedCardsP1, playedCardsP2, discardedCards1, discardedCards2, turn, winner_g, winner_r1, winner_r2, roundP1, roundP2, sudisRound, sudisFlag1, sudisFlag2, auxFlag, spectators, url }
    battleArray.push(newBattle)
    return { newBattle }
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
            currentScore = currentScore + Math.ceil((50 * card.strength) / 100);
        }
    })
    currentDeck.splice(cardIndex, 1);
    playedDeck.push(cardSelected);
    return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore];
}

const magnus = (cardIndex, ls_card, ds_card, cardSelected, currentScore, oppScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, currentLegion) => {
    if (Object.keys(ds_card).length === 0 && Object.keys(ls_card).length === 0) {
        currentScore = currentScore + cardSelected.strength;
        currentDeck.splice(cardIndex, 1);
        playedDeck.push(cardSelected);
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion];
    }
    if (Object.keys(ds_card).length === 0 && Object.keys(ls_card).length !== 0) {
        currentDeck.splice(cardIndex, 1);
        currentScore = currentScore + cardSelected.strength;
        currentLegion = currentLegion.filter(card => card.id !== ls_card.id);
        currentDeck.push(ls_card);
        playedDeck.push(cardSelected);
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion];
    }
    if (Object.keys(ls_card).length === 0 && Object.keys(ds_card).length !== 0) {
        currentDeck.splice(cardIndex, 1);
        currentScore = currentScore + cardSelected.strength;
        currentDD = currentDD.filter(card => card.id !== ds_card.id);
        currentDeck.push(ds_card);
        playedDeck.push(cardSelected);
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion];
    }
    currentDeck.splice(cardIndex, 1);
    currentScore = currentScore + cardSelected.strength;
    currentDD = currentDD.filter(card => card.id !== ds_card.id);
    currentDeck.push(ds_card);
    currentLegion = currentLegion.filter(card => card.id !== ls_card.id);
    currentDeck.push(ls_card);
    playedDeck.push(cardSelected);
    return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion];
}

const Updater = (oppCardSelected, cardSelected, currentScore, oppScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, currentLegion, opCurDeck) => {

    // 0
    if (cardSelected.ability === "None" || cardSelected.ability === "Bought_and_Paid_For" || cardSelected.ability === "Praetorian_Guard" || cardSelected.ability === "Sudis" || cardSelected.ability === "Expendable" || cardSelected.ability === "Filibuster") {
        currentScore = currentScore + cardSelected.strength;
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
    }

    // 1
    if (cardSelected.ability === "Volley") {
        currentScore = currentScore + cardSelected.strength;
        currentDeck.forEach((card) => {
            if (card.ability === "Volley") {
                currentScore = currentScore + card.strength;
                playedDeck.push(card)
            }
        })
        currentDeck = currentDeck.filter(card => card.ability !== "Volley");
        currentLegion.forEach((card) => {
            if (card.ability === "Volley") {
                currentScore = currentScore + card.strength;
                playedDeck.push(card)
            }
        })
        currentLegion = currentLegion.filter(card => card.ability !== "Volley");
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
    }

    // 2
    if (cardSelected.ability === "Efficiency") {
        currentScore = currentScore + cardSelected.strength;
        oppPlayedDeck.forEach((card) => {
            if (card.class === "Light_Soldier") {
                currentScore = currentScore + 1;
            }
        })
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
    }

    // 3
    if (cardSelected.ability === "Pila") {
        if (Object.keys(oppCardSelected).length === 0) {
            currentScore = currentScore + cardSelected.strength;
            return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
        }
        currentScore = currentScore + cardSelected.strength;
        oppDD.push(oppCardSelected);
        oppScore = oppScore - oppCardSelected.strength;
        if (oppCardSelected.ability === "The_Machine") {
            let leCount = 0;
            oppPlayedDeck.forEach((card) => {
                if (card.ability === "The_Machine") {
                    leCount = leCount + 1;
                }
            })
            if (leCount === 1) {
                oppScore = oppScore - 4;
            }
            if (leCount === 2) {
                oppScore = oppScore - 14;
            }
        }
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
    }

    // 4
    if (cardSelected.ability === "Son_of_the_Wolf" || cardSelected.ability === "Dead_Eye") {
        if (Object.keys(oppCardSelected).length === 0) {
            currentScore = currentScore + cardSelected.strength;
            return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
        }
        currentScore = currentScore + cardSelected.strength;
        oppDD.push(oppCardSelected);
        oppScore = oppScore - oppCardSelected.strength;
        if (oppCardSelected.ability === "The_Machine") {
            let leCount = 0;
            oppPlayedDeck.forEach((card) => {
                if (card.ability === "The_Machine") {
                    leCount = leCount + 1;
                }
            })
            if (leCount === 1) {
                oppScore = oppScore - 4;
            }
            if (leCount === 2) {
                oppScore = oppScore - 14;
            }
        }
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
    }

    // 5
    if (cardSelected.ability === "Ruthless_Tactics") {
        if (Object.keys(oppCardSelected).length === 0) {
            currentScore = currentScore + cardSelected.strength;
            return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
        }
        currentScore = currentScore + cardSelected.strength;
        let newDeck = oppPlayedDeck.filter(card => card.class === oppCardSelected.class);
        newDeck.forEach((card) => {
            if (card.name === "Romulus") {
                return;
            }
            oppScore = oppScore - Math.floor(card.strength / 2);
        })
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
    }

    // 6
    if (cardSelected.ability === "A_Stones_Throw") {
        currentScore = currentScore + cardSelected.strength;
        let deckWoUni = oppPlayedDeck.filter(card => card.class !== "Status_Effect" && card.class !== "Utility");
        let lowestStrength = Math.min.apply(null, deckWoUni.map(item => item.strength));
        if (lowestStrength === 10) {
            return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
        }
        if (lowestStrength > 0) {
            oppPlayedDeck.forEach((card) => {
                if (card.strength === lowestStrength && card.lock === false) {
                    oppScore = oppScore - Math.floor(card.strength / 2);
                }
            })
        }
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
    }

    // 7
    if (cardSelected.ability === "Persuasive_Speech") {
        if (Object.keys(oppCardSelected).length === 0) {
            currentScore = currentScore + cardSelected.strength;
            return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
        }
        currentScore = currentScore + cardSelected.strength + oppCardSelected.strength;
        playedDeck.push(oppCardSelected);
        oppScore = oppScore - oppCardSelected.strength;
        if (oppScore < 0) {
            oppScore = 0;
        }
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
    }

    // 8
    if (cardSelected.ability === "Man_of_the_People") {
        if (Object.keys(oppCardSelected).length === 0) {
            currentScore = currentScore + cardSelected.strength;
            return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
        }
        currentScore = currentScore + cardSelected.strength;
        let newDeck = playedDeck.filter(card => card.class === oppCardSelected.class);
        newDeck.forEach((card) => {
            currentScore = currentScore + card.strength;
        })
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
    }

    // 9
    if (cardSelected.ability === "Reinforcements" || cardSelected.ability === "Diplomat") {
        if (Object.keys(oppCardSelected).length === 0) {
            currentScore = currentScore + cardSelected.strength;
            return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
        }
        currentScore = currentScore + cardSelected.strength;
        currentLegion = currentLegion.filter(card => card.id !== oppCardSelected.id);
        currentDeck.push(oppCardSelected);
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
    }

    // 10
    if (cardSelected.ability === "Laconian_Shib") {
        currentScore = currentScore + cardSelected.strength;
        oppPlayedDeck.forEach((card) => {
            if (card.class !== "Mounted_Soldier" && card.class !== "Mounted_Troops" && card.class !== "Status_Effect" && card.class !== "Utility" && card.lock === false) {
                oppScore = oppScore - 1;
            }
        })
        if (oppScore < 0) {
            oppScore = 0;
        }
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
    }

    // 11
    if (cardSelected.ability === "Fog_of_War") {
        currentScore = currentScore + cardSelected.strength;
        oppPlayedDeck.forEach((card) => {
            if (card.class === "Ranged" && card.lock === false) {
                oppScore = oppScore - Math.floor(card.strength / 2);
            }
        })
        if (oppScore < 0) {
            oppScore = 0;
        }
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
    }

    // 12
    if (cardSelected.ability === "The_Machine") {
        let cardCount = 0;
        playedDeck.forEach((card) => {
            if (card.name === "Legionnaire") {
                cardCount = cardCount + 1
            }
        })
        let score = Math.pow(2, cardCount) * cardCount;
        currentScore = currentScore + score;
        if (cardCount === 2) {
            currentScore = currentScore - 2;
        }
        if (cardCount === 3) {
            currentScore = currentScore - 8;
        }
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
    }

    // 13
    if (cardSelected.ability === "Wild_Animals") {
        currentScore = currentScore + cardSelected.strength;
        let barbCount = 0;
        playedDeck.forEach((card) => {
            if (card.ability === "Wild_Animals") {
                barbCount = barbCount + 1;
            }
        })
        let lsCount = 0;
        oppPlayedDeck.forEach((card) => {
            if (card.class === "Light_Soldier") {
                lsCount = lsCount + 1;
            }
        })
        oppPlayedDeck.forEach((card) => {
            if (card.class === "Light_Soldier" && lsCount !== 0 && barbCount !== 0) {
                oppScore = oppScore - 1;
                lsCount = lsCount - 1;
                barbCount = barbCount - 1;
            }
        })
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
    }

    // 14
    if (cardSelected.ability === "Morale_Boost") {
        let cardCount = 0;
        playedDeck.forEach((card) => {
            if (card.name === "Light_Infantry") {
                cardCount = cardCount + 1
            }
        })
        if (cardCount === 1) {
            currentScore = currentScore + 1;
        }
        if (cardCount === 2) {
            currentScore = currentScore + 3;
        }
        if (cardCount === 3) {
            currentScore = currentScore + 5;
        }
        if (cardCount === 4) {
            currentScore = currentScore + 7;
        }
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
    }

    // 15
    if (cardSelected.ability === "Our_Fearless_Leader") {
        currentScore = currentScore + cardSelected.strength;
        playedDeck.forEach((card) => {
            if (card.class !== "Status_Effect" && card.class !== "Utility" && card.ability !== "Our_Fearless_Leader") {
                currentScore = currentScore + 1;
            }
        })
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
    }

    // 16
    if (cardSelected.ability === "Eyes_on_the_Prize") {
        if (Object.keys(oppCardSelected).length === 0) {
            currentScore = currentScore + cardSelected.strength;
            return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
        }
        currentScore = currentScore + cardSelected.strength;
        oppDD.push(oppCardSelected);
        const i = opCurDeck.findIndex(obj => obj.id === oppCardSelected.id);
        opCurDeck.splice(i, 1);
        return [currentScore, currentDeck, playedDeck, oppPlayedDeck, currentDD, oppDD, oppScore, currentLegion, opCurDeck];
    }

}