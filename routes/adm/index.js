const router = require('express').Router();

const admAuth = require('../../controllers/admin/adm-auth');
const admEmpProfile = require('../../controllers/admin/adm-employee-profile');
const admGscopeOrders = require('../../controllers/admin/adm-gscope-orders');
const admLogin = require('../../controllers/admin/adm-login');
const admRegister = require('../../controllers/admin/adm-register');
const admProfile = require('../../controllers/admin/adm-profile');
const admBillboard = require('../../controllers/admin/adm-billboard');

router.route('/login')
    .post(admLogin.adminLoginHandler);

router.route('/logout')
    .post(admAuth.authorisationHandler, admLogin.adminLogoutHandler);

router.route('/register')
    .post(admAuth.authorisationHandler, admRegister.registrationHandler);

router.route('/deregister')
    .post(admAuth.authorisationHandler, admRegister.deregistrationHandler);

router.route('/change-credentials')
    .post(admAuth.authorisationHandler, admProfile.postUserCredentialHandler);

router.route('/employee-view')
    .get(admAuth.authorisationHandler, admEmpProfile.getEmployeeProfileHandler)
    .post(admAuth.authorisationHandler, admEmpProfile.postEmployeeDetailsHandler)
    .delete(admAuth.authorisationHandler, admEmpProfile.deleteEmployeeProfileHandler);

router.route('/billboard')
    .get(admAuth.authorisationHandler, admBillboard.getBillboardHandler)
    .post(admAuth.authorisationHandler, admBillboard.postBillboardHandler);

router.route('/admins')
    .get(admAuth.authorisationHandler, admRegister.getAdminsHandler);

router.route('/orders')
    .get(admAuth.authorisationHandler, admGscopeOrders.getGscopeOrdersHandler)
    .post(admAuth.authorisationHandler, admGscopeOrders.postGscopeOrdersStatusHandler);

router.route('/token')
    .get(admAuth.refreshAuthorisationHandler);

module.exports = router;