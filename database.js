const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

class Database {

    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect('mongodb+srv://praj:8jUGwGiwLby8VwmF@one.nuysn.mongodb.net/game?retryWrites=true&w=majority')
        .then(() => {
            console.log("database connection successful");
        })
        .catch((err) => {
            console.log("Error" + err);
        })
    }
}

module.exports = new Database();
