const { employeeModel } = require("../../schemas/employee");

exports.getEmployeeProfileHandler = async (req, res) => {
    try {
        if (!req.query.id) {
            const employeeObjs = await employeeModel.find()
                    .populate('name', 'email', 'phone', 'attendance', 'createdAt', 'updatedAt')
                    .sort({ name: 1 })
                    .limit(req.query.quantity || 1000);
            
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
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
};