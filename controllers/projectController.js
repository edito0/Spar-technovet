const projectsettings = require('../models/projectdataSettingModel');

const project =  async (req, res) => {
    try {
        const projectData = await projectsettings.find({})
        res.render('projects', {
            projectData
        });
 
    }
    catch (error) {
        console.log(error.message);
    } 
} 

const projectDetial =  async (req, res) => {
    try {
        const projectDetail = await projectsettings.findOne({_id:req.params.id})
        res.render('projectDetail', {
            projectDetail
        });
    }
    catch (error) {
        console.log(error.message);
    } 
}


module.exports = {
    project,
    projectDetial
}