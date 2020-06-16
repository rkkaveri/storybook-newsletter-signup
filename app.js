const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
require('dotenv/config');

const port = 3000

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));


app.get('/', (req, res) => {
    res.sendFile(__dirname+"/pages/signup.html");
});


app.post('/', (req, res) => {

    const LIST_ID = process.env.MAIL_CHIMP_LIST_ID;
    const API_KEY = process.env.MAIL_CHIMP_API_KEY;
    const REGION_ID = process.env.MAIL_CHIMP_REGION_ID;

    let fName = req.body.firstName
    let lName = req.body.lastName
    let email = req.body.email

    // console.log(fName, lName, email);

    const  data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME : fName,
                    LNAME : lName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const url = `https://${REGION_ID}.api.mailchimp.com/3.0/lists/${LIST_ID}`;

    const options = {
        method: 'POST',
        auth: API_KEY
    }

    console.log(options)

    const request = https.request(url, options, (response) => {
        
        if ( response.statusCode === 200 ){
            res.sendFile(__dirname+'/pages/success.html')
        }
        else{
            res.sendFile(__dirname+"/pages/failure.html")
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data)); //receiving response from mail chimp
        });
    });

    request.write(jsonData); //sending data to mail chimp
    request.end();

});


app.post('/failure', (req, res) => {
    res.redirect('/'); //redirecting to home sign up page
});



app.listen( process.env.PORT || port, (req,res) => {
    console.log(`Server started at port ${port}`)
});
