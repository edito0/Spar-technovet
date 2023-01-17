const express = require('express');
const dotenv = require('dotenv');

const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

dotenv.config({path: './config/config.env'});
 
const DB = process.env.DATABASE;

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
app.use('/contact', (req, res) => {
    res.render('contact');
})

const contactsettings = require('./models/contactdataSettingModel');

app.post('/postcontact', async (req, res) => {
    try {
        const contact = new contactsettings(
            {
               name : req.body.name,
               email : req.body.email,
               phone : req.body.phone,
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

app.use('/services', async(req, res) => {

    try {
        const servicesData = await servicessettings .find({});
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

app.use('/about', async(req, res) => {

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




// HOME PAGE:-
const homesettings = require('./models/homedataSettingModel');

app.use('/', async (req, res) => {
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

// SOCIAL MEDIA PAGE:-
const mediasetting = require('./models/homedataSettingModel');

app.use('/media', async (req, res) => {
    try { 
        const homeData = await mediasetting.find({})
        res.render('media', {
            homeData 
        });                                                                                         
    }
    catch (error) {
        console.log(error.message);
    }

})   
// SOCIAL MEDIA PAGE ENDS 


const port = process.env.PORT || 3000;

//App is listening at this port:-
app.listen(port, () => {
    console.log("Server is running at port no. - "+port);
})   