const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

class Database {

    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect('<ENTER-MONGO-CONNECTION-STRING>')
        .then(() => {
            console.log("database connection successful");
        })
        .catch((err) => {
            console.log("Error" + err);
        })
    }
}

module.exports = new Database();