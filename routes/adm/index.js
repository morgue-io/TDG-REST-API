const router = require('express').Router();

const admAuth = require('../../controllers/admin/adm-auth');
const admEmpProfile = require('../../controllers/admin/adm-employee-profile');
const admEmpRegister = require('../../controllers/admin/adm-employee-register');
const admGscopeOrders = require('../../controllers/admin/adm-gscope-orders');
const admLogin = require('../../controllers/admin/adm-login');
const admRegister = require('../../controllers/admin/adm-register');
const admProfile = require('../../controllers/admin/adm-profile');

router.route('/login')
    .post(admLogin.adminLoginHandler);

router.route('/logout')
    .post(admAuth.authorisationHandler, admLogin.adminLogoutHandler);

router.route('/register')
    .post(admRegister.registrationHandler);

router.route('/deregister')
    .post(admAuth.authorisationHandler, admRegister.deregistrationHandler);

router.route('/change-credentials')
    .post(admAuth.authorisationHandler, admProfile.postUserCredentialHandler);

router.route('/employee-register')
    .post(admAuth.authorisationHandler, admEmpRegister.registrationHandler);

router.route('/employee-deregister')
    .post(admAuth.authorisationHandler, admEmpRegister.deregistrationHandler);

router.route('/employee-view')
    .get(admAuth.authorisationHandler, admEmpProfile.getEmployeeProfileHandler);

router.route('/orders')
    .get(admAuth.authorisationHandler, admGscopeOrders.getGscopeOrdersHandler)
    .post(admAuth.authorisationHandler, admGscopeOrders.postGscopeOrdersStatusHandler);

module.exports = router;