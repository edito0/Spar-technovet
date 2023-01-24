const Client = require('../models/clientModels');
const About = require('../models/aboutdataSettingModel');
const Services = require('../models/servicesdataSettingModel');
const Project = require('../models/projectdataSettingModel');
const Home = require('../models/homedataSettingModel');
const Contact = require('../models/contactdataSettingModel');
const Media = require('../models/mediadataSettingModel');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');

const nodemailer = require('nodemailer')
const Randomstring = require('randomstring')

const config = require('../config/config');



const securePassword = async(password)=>{
    try{
        const PasswordHash = await bcrypt.hash(password,10)

        return PasswordHash;
    }
    catch(error){
        console.log(error.message);
    }
}


const sendResetPasswordMail = async(email,token)=>{
    try {
        const trasnport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, 
            requireTLS:true,
            auth: { 
              user: config.clientEmail,
              pass: config.clientPassword
            }
          });  

        const mailOptions = { 
            from:config.clientEmail,
            to:email,
            subject:"Reset Password",
            html:`<p> Hi Admin, Please click here to Reset your Password <a href="http://localhost:3000/admin/reset-password?token=${token}">Reset</a> </p>`
        }

        trasnport.sendMail(mailOptions, function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been send",info);
            }
        }) 

    } catch (error) {
        console.log(error.message);
    }
}


//FORGOT PASSWORD
const forgetPassword = async (req, res) => {
    try {
        res.render('forgetpassword')

    } catch (error) {
        console.log(error.message);
    }
}

const forgetPasswordVerify = async (req, res) => {
    try {
        const email = req.body.email;

        const clinetData = await Client.findOne({ client_email: email })

        if (clinetData) {
            const randomstring = Randomstring.generate(); 

            await Client.updateOne({ client_email: email }, 
                { $set: { token: randomstring } })

            sendResetPasswordMail(clinetData.client_email,randomstring)
            res.render('forgetpassword')
        } 
        else {
            res.render('forgetpassword') 
        } 
  
    } catch (error) {
        console.log(error.message);
    }
}

const resetPassword = async(req,res)=>{
     try {
        const token = req.query.token;
        const tokenData = await Client.findOne({token:token});
        if(tokenData)
        {
            res.render('resetpassword',{
                client_id : tokenData._id 
            })
        }
        else{
            res.send('404');
        }

     } catch (error) {
        console.log(error.message);
     }
}  


const PostResetPassword = async(req,res)=>{
    try {

        const password = req.body.password;
        const client_id = req.body.client_id;
        const securePass = await securePassword(password);
        await Client.findByIdAndUpdate({_id:client_id},{$set:{ client_password:securePass, token:""}})
        res.redirect('/admin');
        
    } catch (error) {  
        console.log(error.message);
    } 
}

//FORGOT PASSWORD ENDS

// LOGIN PAGE
const login = async (req, res) => {
    res.render('login');
}

const loginSave = async (req, res) => {
    try {
        const password = req.body.password;
        const email = req.body.email;

        const clienData = await Client.findOne({
            client_email: email
        });

        if (clienData) {
            req.session.user_id = clienData._id
            const passwordMatched = await bcrypt.compare(password, clienData.client_password);

            if (passwordMatched) {
                res.redirect('/admin/edithome');
            }
            else {
                res.render('login', {
                    alert: "Entered Password is Wrong"
                })
            }
        }
        else {
            res.render('login', {
                alert: "Entered Password is Wrong"
            })
        }


    } catch (error) {
        console.log(error.message);
    }
}
//LOGN PAGE ENDS






// LOGOUT PAGE
const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/admin');

    } catch (error) {
        console.log(error.message);
    }
}
// LOGOUT PAGE ENDS





// HOME PAGE
const editHome = async (req, res) => {
    try {
        const edithomes = await Home.find({});
        res.render('edithome', {
            edithomes
        });

    }
    catch (error) {
        console.log(error.message);
    }
}

const postEditHome = async (req, res) => {
    try {

        let compressImg = Date.now() + '-' + req.file.originalname;
        let compressImgPath = path.join(__dirname, "../public/images", compressImg);

        sharp(req.file.path).webp({ quality: 3 }).toFile(compressImgPath)

        var image = '';
        if (req.file.filename !== undefined) {
            image = "/images/" + compressImg;
        }

        const home = new Home(
            {
                home_image: image
            }
        );

        const homeData = await home.save();

    }
    catch (error) {
        console.log(error.message);
    }

    res.redirect('/admin/edithome');
}

const deleteHomeData = async (req, res) => {
    try {
        await Home.deleteOne({ _id: req.body.id })
        res.redirect('/admin/edithome');
    } catch (error) {
        console.log(error.message);
    }

}
// HOME PAGE ENDS 






// ABOUT PAGE
const editAbout = async (req, res) => {
    try {
        const editabouts = await About.find({});
        res.render('editabout', {
            editabouts
        });

    }
    catch (error) {
        console.log(error.message);
    }
}

const postEditAbout = async (req, res) => {

    try {
        let compressImg = Date.now() + '-' + req.file.originalname;
        let compressImgPath = path.join(__dirname, "../public/images", compressImg);

        sharp(req.file.path).webp({ quality: 3 }).toFile(compressImgPath)

        var image = '';
        if (req.file.filename !== undefined) {
            image = "/images/" + compressImg;
        }

        const about = new About(
            {
                about_title: req.body.title,
                about_image: image,
                about_content: req.body.content
            }
        );

        const aboutData = await about.save();

    }
    catch (error) {
        console.log(error.message);
    }

    res.redirect('/admin/editabout');
}

const deleteAboutData = async (req, res) => {
    try {
        await About.deleteOne({ _id: req.body.id })
        res.redirect('/admin/editabout');
    } catch (error) {
        console.log(error.message);
    }

}
// ABOUT PAGE ENDS








// SERVICES PAGE
const postEditServices = async (req, res) => {

    try {
        let compressImg = Date.now() + '-' + req.file.originalname;
        let compressImgPath = path.join(__dirname, "../public/images", compressImg);

        sharp(req.file.path).webp({ quality: 3 }).toFile(compressImgPath)

        var image = '';
        if (req.file.filename !== undefined) {
            image = "/images/" + compressImg;
        }

        const services = new Services(
            {
                services_title: req.body.title,
                services_image: image,
                services_content: req.body.content
            }
        );

        const servicesData = await services.save();

    }
    catch (error) {
        console.log(error.message);
    }

    res.redirect('/admin/editservices');
}

const deleteServicesData = async (req, res) => {
    try {
        await Services.deleteOne({ _id: req.body.id })
        res.redirect('/admin/editservices');
    } catch (error) {
        console.log(error.message);
    }

}

const editServices = async (req, res) => {
    try {
        const editservices = await Services.find({});
        res.render('editservices', {
            editservices
        });

    }
    catch (error) {
        console.log(error.message);
    }
}
// SERVICES PAGE ENDS







// PROJECT PAGE
const editProjects = async (req, res) => {
    try {
        const editprojects = await Project.find({});
        res.render('editprojects', {
            editprojects
        });

    }
    catch (error) {
        console.log(error.message);
    }
}

const postEditProject = async (req, res) => {

    try {
        var image = '';
        if (req.files !== undefined) {
            image = req.files.map(files => {

                let compressImg = Date.now() + '-' + files.originalname;
                let compressImgPath = path.join(__dirname, "../public/images", compressImg);

                sharp(files.path).webp({ quality: 3 }).toFile(compressImgPath)

                return ("/images/" + compressImg)
            });
        }


        const project = new Project(
            {
                project_image: image,
                project_title: req.body.title,
                project_content: req.body.content,
                project_detail: req.body.detail
            }
        );

        const projectData = await project.save();

    }
    catch (error) {
        console.log(error.message);
    }

    res.redirect('/admin/editprojects');
}

const deletePorjectData = async (req, res) => {
    try {
        await Project.deleteOne({ _id: req.body.id })
        res.redirect('/admin/editproject');
    } catch (error) {
        console.log(error.message);
    }

}
//PROJECT PAGE ENDS


// MEDIA PAGE
const editmedia = async (req, res) => {
    try {
        const editmedia = await Media.find({});
        res.render('editmedia', {
            editmedia
        });

    }
    catch (error) {
        console.log(error.message);
    }
}

const postEditMedia = async (req, res) => {

    try {

        const media = new Media(
            {
                instagram_link: req.body.instagramLink,
                pintrest_link: req.body.pintrestLink
            }
        );

        const mediaData = await media.save();

    }
    catch (error) {
        console.log(error.message);
    }

    res.redirect('/admin/editmedia');
}

const deleteMediaData = async (req, res) => {
    try {
        await Media.deleteOne({ _id: req.body.id })
        res.redirect('/admin/editMedia');
    } catch (error) {
        console.log(error.message);
    }

}


//MEDIA PAGE ENDS


// ANALYTICS 
const analytics = async (req, res) => {

    try {
        const contactData = await Contact.find({});
        res.render('analytics', { contactData }
        );
    }
    catch (error) {
        console.log(error.message);
    }
}
// ANALYTICS ENDS 




module.exports = {
    login,
    logout,
    loginSave,
    editHome,
    postEditHome,
    deleteHomeData,
    editAbout,
    postEditAbout,
    deleteAboutData,
    editServices,
    postEditServices,
    deleteServicesData,
    editProjects,
    postEditProject,
    deletePorjectData,
    analytics,
    forgetPassword,
    editmedia,
    postEditMedia,
    deleteMediaData,
    forgetPasswordVerify,
    resetPassword,
    PostResetPassword
}











