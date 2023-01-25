const express = require('express');
const dotenv = require('dotenv');

const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');  
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer')
var cacheService = require("express-api-cache");
var cache = cacheService.cache;

dotenv.config({ path: './config/config.env' });

const DB = process.env.DATABASE;

// DATABASE= mongodb+srv://spartechnovetpvtltd2023:puJgN8SuEAbnCqb1@sparwebdata.fsuedyd.mongodb.net/?retryWrites=true&w=majority  

mongoose.set("strictQuery", false);
mongoose.connect(DB, { useNewUrlParser: true }); 

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "./public")));



app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, "./views"));
 
//ROUTER FOR THE ADMIN PANNEL :-
const adminRoute = require('./routes/adminRoute');
app.use('/admin', adminRoute);




//CONTACT PAGE
app.use('/contact',cache("10 minutes"), (req, res) => {
    res.render('contact');
})

const contactsettings = require('./models/contactdataSettingModel');

app.post('/postcontact', async (req, res) => {

    try {

        const trasnport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            requireTLS: true,
            auth: {
                user: process.env.clientEmail, 
                pass: process.env.clientPassword
            }
        });

        const mailOptions = {
            from: process.env.clientEmail,
            to: process.env.clientEmail,
            subject: `${req.body.name} want to contact you`,
            html: `<p>Name - ${req.body.name}</p> </br>
                   <p>Email - ${req.body.email} </p> </br>
                   <p>Phone Number - ${req.body.phone} </p> </br>
                   <p>InquiryType - ${ req.body.InquiryType} </p> </br>
                   <p>message - ${ req.body.message} </p>`
        }

        trasnport.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email has been send", info);
            }
        })

        const contact = new contactsettings(
            {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                inquiryType: req.body.InquiryType,
                message: req.body.message,

            }
        );

        const contactData = await contact.save();

    }
    catch (error) {
        console.log(error.message);
    }

    res.redirect('/contact');
})


// CONTACT PAGE ENDS




//PROEJCT PAGE 
const projectRoute = require('./routes/projectRoute');
app.use('/projects', projectRoute);
// PROJECT PAGE ENDS




//SERVICES PAGE:-
const servicessettings = require('./models/servicesdataSettingModel');

app.use('/services',cache("10 minutes"), async (req, res) => {

    try {
        const servicesData = await servicessettings.find({});
        res.render('services', {
            servicesData
        });

    }
    catch (error) {
        console.log(error.message);
    }
})
//SERVICES PAGE ENDS






//ABOUT PAGE:-
const aboutsettings = require('./models/aboutdataSettingModel');

app.use('/about',cache("10 minutes"), async (req, res) => {

    try {
        const aboutData = await aboutsettings.find({});
        res.render('about', {
            aboutData
        });

    }
    catch (error) { 
        console.log(error.message);
    }
})
// ABOUT PAGE ENDS


// SOCIAL MEDIA PAGE:-
const mediasettings = require('./models/mediadataSettingModel');

app.use('/media',cache("10 minutes"), async (req, res) => {
    try {
        const mediaData = await mediasettings.find({})

        res.render('media', {
            mediaData
        })
    }
    catch (error) {
        console.log(error.message);
    }

})
// SOCIAL MEDIA PAGE ENDS 




// HOME PAGE:-
const homesettings = require('./models/homedataSettingModel');

app.use('/',cache("10 minutes"), async (req, res) => {
    try {
        const homeData = await homesettings.find({})
        res.render('home', {
            homeData
        });


    }
    catch (error) {
        console.log(error.message);
    }

})
// HOME PAGE ENDS



const port = process.env.PORT || 3000;

//App is listening at this port:-
app.listen(port, () => {
    console.log("Server is running at port no. - " + port);
})   