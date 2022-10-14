const { employeeModel } = require("../../schemas/employee");
const { rtokenModel } = require("../../schemas/rtoken");
const { decrypt } = require("../../utils/rsa_4096");
const { sha256_hex } = require("../../utils/sha256");

exports.getEmployeeProfileHandler = async (req, res) => {
    try {
        if (!req.query.id) {
            const employeeObjs = await employeeModel.find({})
                    .select('_id meta name email phone attendance service_history createdAt updatedAt')
                    .sort({ name: 1 })
                    .limit(req.query.quantity || 2000)
                    .skip(req.query.skip || 0);
            
            return res.status(200).json({
                success: true,
                message: 'GET Acknowledged',
                payload: employeeObjs
            });
        }

        const employeeObj = await employeeModel.findOne({ _id: req.query.id });
        if (!employeeObj)
            res.send(404).json({
                success: false,
                message: 'Employee not found'
            });

        res.status(200).json(employeeObj);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
};

exports.postEmployeeDetailsHandler = async (req, res) => {
    try {
        if (!req.query.id) {
            if (!!(await employeeModel.findOne({ email: req.body.email }))) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already registered'
                });
            }

            console.log(req.body);
            const newEmployeeObj = new employeeModel(req.body);
            newEmployeeObj.password = sha256_hex(decrypt(newEmployeeObj.password))
            await newEmployeeObj.save();

            return res.status(200).json({
                success: true,
                message: 'Employee added'
            });
        }
        
        await employeeModel.findOneAndUpdate({ _id: req.query.id }, { 
            'meta.is_activated': req.body.meta.is_activated ,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        });

        return res.status(200).json({
            success: true,
            message: 'Employee details updated'
        });
    } catch (e) {
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
};

exports.deleteEmployeeProfileHandler = async (req, res) => {
    try {
        if (!req.query.id)
            return res.send(400).json({
                success: false,
                message: 'Employee `id` is a required parameter'
            });
        
        const employeeObj = await employeeModel.findOne({ _id: req.query.id })
        
        const x = await employeeModel.findOneAndRemove({ _id: req.query.id });
        const y = await rtokenModel.findOneAndRemove({ email: employeeObj.email });

        if (!employeeObj && !x && !y)
            return res.status(400).json({
                success: false,
                message: 'DELETE unsuccessful: an error occured'
            });
        
        return res.status(200).json({
            success: false,
            message: 'Employee deleted'
        });
    
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
}