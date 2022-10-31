const { parse } = require("dotenv");
const { default: mongoose } = require("mongoose");
const { employeeModel } = require("../../schemas/employee");
const { orderModel } = require("../../schemas/order");
const { getLocalTime } = require("../../utils/local-time");

exports.getGscopeOrdersHandler = async (req, res) => {
    try {
        const orderObjs = await orderModel.find({ $or: [{ 'status.picked_up.state': false }, { 'status.delivered.state': false }] })
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
                'status.picked_up.assignee_name': req.USEROBJ.name
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
            { 
                'status.delivered.assignee_id': req.USEROBJ._id,
                'status.delivered.assignee_name': req.USEROBJ.name
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

exports.postAssignOrderPickupDoneHandler = async (req, res) => {
    try {
        if (!req.USEROBJ)
            throw new Error('Fatal: USEROBJ key not found on request');

        const locTime = getLocalTime();

        await orderModel.findOneAndUpdate(
            { _id: req.query.id }, 
            {
                'status.picked_up.state': true,
                'status.picked_up.time': locTime
            }
        );

        await employeeModel.findOneAndUpdate(
            { _id: req.USEROBJ._id, service_history: {  $nin: new RegExp(req.query.id) } },
            { $push: { service_history: `[PICKUP] [${locTime}] ${req.query.id}` } }
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

        const locTime = getLocalTime();

        await orderModel.findOneAndUpdate(
            { _id: req.query.id }, 
            { 
                'status.delivered.state': true,
                'status.delivered.time': locTime
            }
        );

        await employeeModel.findOneAndUpdate(
            { _id: req.USEROBJ._id, service_history: {  $nin: new RegExp(req.query.id) } },
            { $push: { service_history: `[DELIVERY] [${locTime}] ${req.query.id}` } }
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
                { 'status.picked_up.assignee_id': req.USEROBJ._id, 'status.picked_up.state': false },
                { 'status.delivered.assignee_id': req.USEROBJ._id, 'status.delivered.state': false }
            ]
        });

        var parsedTasks = [];

        //console.log(JSON.stringify(tasks, null, 4))

        tasks.forEach((item) => {
            if (req.USEROBJ._id.equals(item.status.picked_up.assignee_id))
                parsedTasks.push({
                    type: "PICKUP",
                    order_id: item._id,
                    customer_id: item.customer_id,
                    customer_name: item.customer_name,
                    address: item.address,
                    verif_code: item.status.picked_up.verif_code,
                    todo: item.todo,
                    bill: item.bill
                });
            if (req.USEROBJ._id.equals(item.status.delivered.assignee_id))
                parsedTasks.push({
                    type: "DELIVERY",
                    order_id: item._id,
                    customer_id: item.customer_id,
                    customer_name: item.customer_name,
                    address: item.address,
                    verif_code: item.status.picked_up.verif_code,
                    todo: item.todo,
                    bill: item.bill
                });
        });

        return res.status(200).json({
            success: true,
            message: 'GET Acknowledged',
            payload: parsedTasks
        })
    } catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: process.env.DEBUG_MODE ? e.message : 'An error was encountered, check your request and try again'
        });
    }
}