const Client = require('../models/clientModels');
const About = require('../models/aboutdataSettingModel');
const Services = require('../models/servicesdataSettingModel');
const Project = require('../models/projectdataSettingModel');
const Home = require('../models/homedataSettingModel');
const Contact = require('../models/contactdataSettingModel');
const Media = require('../models/mediadataSettingModel');
const Article = require('../models/mediadataarticleSettingModel');
const Analytics = require('../models/anylaticsdataSettingModel');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer'); 
const sharp = require('sharp');
const fs = require('fs');

const nodemailer = require('nodemailer')
const Randomstring = require('randomstring')

const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });




const securePassword = async (password) => {
    try {
        const PasswordHash = await bcrypt.hash(password, 10)

        return PasswordHash;
    }
    catch (error) {
        console.log(error.message);
    }
}


const sendResetPasswordMail = async (email, token) => {
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
            to: email,
            subject: "Reset Password",
            html: `<p> Hi Admin, Please click here to Reset your Password <a href="https://spartechnovet.com/admin/reset-password?token=${token}">Reset</a> </p>`
        }

        trasnport.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email has been send", info);
            }
        })

    } catch (error) {
        console.log(error.message);
    }
}


//FORGOT PASSWORD
const forgetPassword = async (req, res) => {
    try {
        const analytics = await Analytics.findOne({});
        res.render('forgetpassword', {
            analytics
        })

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

            sendResetPasswordMail(clinetData.client_email, randomstring)
            res.redirect('/admin');
        }
        else {
            res.render('forgetpassword')
        }

    } catch (error) {
        console.log(error.message);
    }
}

const resetPassword = async (req, res) => {
    try {
        const token = req.query.token;
        const tokenData = await Client.findOne({ token: token });
        const analytics = await Analytics.findOne({});
        if (tokenData) {
            res.render('resetpassword', {
                client_id: tokenData._id,
                analytics
            })
        }
        else {
            res.send('404');
        }

    } catch (error) {
        console.log(error.message);
    }
}


const PostResetPassword = async (req, res) => {
    try {

        const password = req.body.password;
        const client_id = req.body.client_id;
        const securePass = await securePassword(password);
        await Client.findByIdAndUpdate({ _id: client_id }, { $set: { client_password: securePass, token: "" } })
        res.redirect('/admin');

    } catch (error) {
        console.log(error.message);
    }
}

//FORGOT PASSWORD ENDS

// LOGIN PAGEadd
const login = async (req, res) => {
    try {
        const analytics = await Analytics.findOne({});
        res.render('login', {
            analytics
        });

    } catch (error) {
        console.log(error.message);
    }

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
                alert: "Entered Password is Wrong "
            })
        }


    } catch (error) {
        console.log(error.message);
    }
}
//LOGN PAGE ENDS






// LOGOUT  
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
        let compressImgPath = path.join(__dirname, "../public/images", req.file.filename);
        sharp(req.file.path).resize(1000).webp({ quality: 100 }).toFile(compressImgPath)

        var image = '';
        if (req.file.filename !== undefined) {
            image = req.file.filename;
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


        const homeData = await Home.findOne({ _id: req.body.id });
        fs.unlink(path.join(__dirname, "../public/images", homeData.home_image), () => { });
        fs.unlink(path.join(__dirname, "../public/images/original-img", homeData.home_image), () => { });
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
        let compressImgPath = path.join(__dirname, "../public/images", req.file.filename);

        sharp(req.file.path).resize(600).webp({ quality: 100 }).toFile(compressImgPath)

        var image = '';
        if (req.file.filename !== undefined) {
            image = req.file.filename;
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

        const aboutData = await About.findOne({ _id: req.body.id });
        fs.unlink(path.join(__dirname, "../public/images", aboutData.about_image), () => { });
        fs.unlink(path.join(__dirname, "../public/images/original-img", aboutData.about_image), () => { });
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
        let compressImgPath = path.join(__dirname, "../public/images", req.file.filename);

        sharp(req.file.path).resize(600).webp({ quality: 100 }).toFile(compressImgPath)

        var image = '';
        if (req.file.filename !== undefined) {
            image = req.file.filename;
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

        const serviceData = await Services.findOne({ _id: req.body.id });
        fs.unlink(path.join(__dirname, "../public/images", serviceData.services_image), () => { });
        fs.unlink(path.join(__dirname, "../public/images/original-img", serviceData.services_image), () => { });
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

                let compressImgPath = path.join(__dirname, "../public/images", files.filename);

                sharp(files.path).resize(600).webp({ quality: 100 }).toFile(compressImgPath)

                return (files.filename)
            });
        }


        const project = new Project(
            {
                project_image: image,
                project_title: req.body.title,
                project_content: req.body.content,
                scope: req.body.scope,
                location: req.body.location,
                photographer: req.body.photographer,
                featuredin: req.body.featuredin
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
        const projectData = await Project.findOne({ _id: req.body.id });

        projectData.project_image.map(images => {
            fs.unlink(path.join(__dirname, "../public/images", images), () => { });
            fs.unlink(path.join(__dirname, "../public/images/original-img", images), () => { });
        })
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
        const editarticle = await Article.find({});
        res.render('editmedia', {
            editmedia,
            editarticle
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

const postEditMediaArticle = async (req, res) => {

    try {
        let compressImgPath = path.join(__dirname, "../public/images", req.file.filename);

        sharp(req.file.path).resize(500).webp({ quality: 100 }).toFile(compressImgPath)

        var image = '';
        if (req.file.filename !== undefined) {
            image = req.file.filename;
        }



        const article = new Article(
            {
                featured_link: req.body.featuredLink,
                featured_title: req.body.featuredTitle,
                featured_image: image
            }
        );

        await article.save();

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

const deleteMediaDataArticle = async (req, res) => {
    try {
        const mediaData = await Article.findOne({ _id: req.body.id });
        fs.unlink(path.join(__dirname, "../public/images", mediaData.featured_image), () => { });
        fs.unlink(path.join(__dirname, "../public/images/original-img", mediaData.featured_image), () => { });
        await Article.deleteOne({ _id: req.body.id })

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

const postAnalytics = async (req, res) => {
    try {

        const data = await Analytics.findOne({});
        const address = req.body.address;
        const linkedin = req.body.linkedin;
        const instagram = req.body.instagram;
        const pinterest = req.body.pinterest; 

        console.log(data);
        await Analytics.updateOne({ _id: data._id }, { $set: { address: address, linkedin: linkedin, instagram: instagram, pinterest: pinterest } })

        const data1 = await Analytics.findOne({});
        console.log(data1);
        res.redirect('/admin/analytics');

    } catch (error) {
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
    PostResetPassword,
    postAnalytics,
    postEditMediaArticle,
    deleteMediaDataArticle
}











