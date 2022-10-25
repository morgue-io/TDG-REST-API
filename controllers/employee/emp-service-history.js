const { employeeModel } = require("../../schemas/employee");

exports.getServiceHistory = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        var doc = await employeeModel.findById(req.USEROBJ._id)

        res.status(200).json({
            success: true,
            message: 'Attendance updated',
            payload: doc.service_history
        });
    } catch {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e : 'An error was encountered, check your request and try again'
        });
    }
}