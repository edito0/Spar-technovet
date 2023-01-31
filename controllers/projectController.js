const projectsettings = require('../models/projectdataSettingModel');
const Analytics = require('../models/anylaticsdataSettingModel');

const project =  async (req, res) => {
    try {
        const projectData = await projectsettings.find({})
        const analytics = await Analytics.findOne({});
        res.render('projects', {
            projectData,
            analytics
        });
 
    }
    catch (error) {
        console.log(error.message);
    } 
} 

const projectDetial =  async (req, res) => {
    try {
        const projectDetail = await projectsettings.findOne({_id:req.params.id})
        const analytics = await Analytics.findOne({});
        res.render('projectDetail', {
            projectDetail,
            analytics
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