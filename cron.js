const Battle = require('./BattleSchema')
const moment = require('moment')

module.exports = winner = () => {

    let CronJob = require('cron').CronJob;

    let job = new CronJob('0 */5 * * *', async function () {
        console.log('cron Job started')

        let date = moment(new Date()).subtract(2, 'minutes').toDate();
        let battle = await Battle.find({createdAt: { $lt: date}, status: false }).lean()
        let winnerAddress=[];
        let winnerRoomId =[];

        for (const iterator of battle) {

            if(iterator.winner != null){
                winnerAddress.push(iterator.winner)
                winnerRoomId.push((iterator._id).toString())
                }
            
            await Battle.findOneAndUpdate({ _id: iterator._id }, { status: true });
            
        }

        console.log(winnerAddress);
        console.log(winnerRoomId);

        
    }, null, true, 'Asia/Kolkata');
    job.start();

}
