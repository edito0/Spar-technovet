const Client = require('../models/clientModels');
const About = require('../models/aboutdataSettingModel');
const Services = require('../models/servicesdataSettingModel');
const Project = require('../models/projectdataSettingModel');
const Home = require('../models/homedataSettingModel');
const bcrypt = require('bcrypt');



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
        var image = '';
        if (req.file.filename !== undefined) {
            image = "/images/" + req.file.filename;
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
        await Home.deleteOne({_id:req.body.id})
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
        var image = '';
        if (req.file.filename !== undefined) {
            image = "/images/" + req.file.filename;
        }

        const about = new About(
            {
                about_title: req.body.title,
                about_image: image,
                about_content : req.body.content
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
        await About.deleteOne({_id:req.body.id})
        res.redirect('/admin/editabout');
    } catch (error) { 
        console.log(error.message); 
    } 

} 
// ABOUT PAGE ENDS








// SERVICES PAGE
const postEditServices = async (req, res) => {

    try {
        var image = '';
        if (req.file.filename !== undefined) {
            image = "/images/" + req.file.filename;
        }

        const services = new Services(
            {
                services_title: req.body.title,
                services_image: image,
                services_content : req.body.content
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
        await Services.deleteOne({_id:req.body.id})
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
        if (req.file.filename !== undefined) {
            image = "/images/" + req.file.filename;
        }

        console.log(image);


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
        await Project.deleteOne({_id:req.body.id})
        res.redirect('/admin/editproject');
    } catch (error) { 
        console.log(error.message); 
    } 

} 
//PROJECT PAGE ENDS







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
    deletePorjectData
}











