const { employeeModel } = require("../../schemas/employee");
const { getLocalTime } = require("../../utils/local-time");

exports.postDailyAttendance = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        var doc = await employeeModel.findById(req.USEROBJ._id);

        if ((doc.attendance[doc.attendance.length - 1] instanceof String ? doc.attendance[doc.attendance.length - 1] : getLocalTime()).includes(getLocalTime().split(',')[0]))
            await employeeModel.findOneAndUpdate({ _id: req.USEROBJ._id }, { $push: { attendance: getLocalTime() } });

        res.status(200).json({
            success: true,
            message: 'Attendance updated'
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e : 'An error was encountered, check your request and try again'
        });
    }
}