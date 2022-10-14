const { employeeModel } = require("../../schemas/employee");
const { orderModel } = require("../../schemas/order");
const { getLocalTime } = require("../../utils/local-time");

exports.getGscopeOrdersHandler = async (req, res) => {
    try {
        const orderObjs = await orderModel.find({})
            .sort({ createdAt: -1 })
            .limit(req.query.quantity || 1000)
            .skip(((req.query.page - 1) * req.query.quantity) || 0);
        
        return res.status(200).json({
            success: true,
            message: 'GET Acknowledged',
            payload: orderObjs
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
};

exports.postAssignOrderPickupHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');
    
        if (!req.query.id)
            return res.status(400).json({
                success: false,
                message: '`id` query parameter missing'
            });

        let doc = await orderModel.findOneAndUpdate(
            { _id: req.query.id }, 
            { 
                'status.picked_up.assignee_id': req.USEROBJ._id,
                'status.delivered.assignee_name': req.USEROBJ.name
            }
        );

        await employeeModel.findOneAndUpdate(
            { _id: req.USEROBJ._id },
            { $push: { 'service_history.pick_up': req.query.id } }
        );

        return res.status(200).json({
            success: true,
            message: 'Status updated'
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
}

exports.postAssignOrderDeliveryHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');
    
        if (!req.query.id)
            return res.status(400).json({
                success: false,
                message: '`id` query parameter missing'
            });

        await orderModel.findOneAndUpdate(
            { _id: req.query.id }, 
            { 'status.delivered.assignee_id': req.USEROBJ._id }
        );

        await employeeModel.findOneAndUpdate(
            { _id: req.USEROBJ._id },
            { $push: { 'service_history.delivery': req.query.id } }
        );

        return res.status(200).json({
            success: true,
            message: 'Status updated'
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
}

exports.postAssignOrderPickupDoneHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        await orderModel.findOneAndUpdate(
            { _id: req.query.id }, 
            {
                'status.picked_up.state': true,
                'status.picked_up.time': getLocalTime()
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Status updated'
        });        
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
}

exports.postAssignOrderDeliveryDoneHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        await orderModel.findOneAndUpdate(
            { _id: req.query.id }, 
            { 
                'status.delivered.state': true,
                'status.delivered.time': getLocalTime()
            }
        );
        
        return res.status(200).json({
            success: true,
            message: 'Status updated'
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
}

exports.getTasksHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
                throw new Error('Fatal: USEROBJ key not found on request');

        var tasks = await orderModel.find({
            $or: [
                { 'status.picked_up.assignee': req.USEROBJ._id, 'status.picked_up.state': false },
                { 'status.delivered.assignee': req.USEROBJ._id, 'status.delivered.state': false }
            ]
        });

        var pickeups = [], deliveries = [];

        tasks.forEach(item => {
            if (item.status.picked_up.assignee === req.USEROBJ._id)
                pickeups.push({
                    customer: item.customer,
                    address: item.address,
                    verif_code: item.verif_code
                });
            else if (item.status.delivered.assignee === req.USEROBJ._id)
                deliveries.push({
                    customer: item.customer,
                    address: item.address,
                    verif_code: item.verif_code
                });
        })

        return res.status(200).json({
            success: true,
            message: 'GET Acknowledged',
            payload: tasks
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
}