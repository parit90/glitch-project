// server.js
// where your node app starts

// init project
const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');


const {checkValidUser} = require('./fetchData')
const {runCron} = require('./cronjob')

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(cors());
app.use(morgan());

let mailToSend = [];
// set up email transport service

/**
 * route http://localhost:3000/user
 * @input: object containing {userId, wish}
 * @output: object containing error or success based on age calculation logic
 * route dependecy:  checkValidUser and runCron methods
 */
app.post('/user', async (req, res) => {
  const result = await checkValidUser(req.body)
  if (result.success){
    let obj = {
      username: result.username,
      address: result.address,
      request: result.message
    }
    mailToSend.push(obj)
    await runCron(mailToSend)
  }
  res.send(result)
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', (request, response) => {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
const listener = app.listen(process.env.PORT || 5500, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
