const router = require('express').Router();

const empAuth = require('../../controllers/employee/emp-auth');
const empLogin = require('../../controllers/employee/emp-login');
const empOrders = require('../../controllers/employee/emp-gscope-orders');
const empAttendance = require('../../controllers/employee/emp-attendance');
const empServiceHistory = require('../../controllers/employee/emp-service-history');

router.route('/login')
    .post(empLogin.userLoginHandler);

router.route('/logout')
    .post(empAuth.authorisationHandler, empLogin.userLogoutHandler);

router.route('/service-history/pick-up')
    .get(empAuth.authorisationHandler, empServiceHistory.getPickupServiceHistory);

router.route('/service-history/delivery')
    .get(empAuth.authorisationHandler, empServiceHistory.getDeliveryServiceHistory);

router.route('/orders')
    .get(empAuth.authorisationHandler, empOrders.getGscopeOrdersHandler);

router.route('/orders/self-assign/pick-up')
    .post(empAuth.authorisationHandler, empOrders.postAssignOrderPickupHandler);

router.route('/orders/self-assign/pick-up/done')
    .post(empAuth.authorisationHandler, empOrders.postAssignOrderPickupDoneHandler);

router.route('/orders/self-assign/delivery')
    .post(empAuth.authorisationHandler, empOrders.postAssignOrderDeliveryHandler);

router.route('/orders/self-assign/delivery/done')
    .post(empAuth.authorisationHandler, empOrders.postAssignOrderDeliveryDoneHandler);

router.route('/attendance')
    .post(empAuth.authorisationHandler, empAttendance.postDailyAttendance);

router.route('/tasks')
    .get(empAuth.authorisationHandler, empOrders.getTasksHandler);

module.exports = router;