const express = require('express');
const router = express.Router();

const userAuth = require('../../controllers/user/usr-auth');
const userCart = require('../../controllers/user/usr-cart');
const userLogin = require('../../controllers/user/usr-login');
const userOrders = require('../../controllers/user/usr-orders');
const userProfile = require('../../controllers/user/usr-profile');
const userRegister = require('../../controllers/user/usr-register');

// Routes with userAuth.authorisationHandler middleware are protected and resource access requires auth token
router.route('/register')
    .post(userRegister.registrationHandler);

router.route('/deregister')
    .post(userAuth.authorisationHandler, userRegister.deregistrationHandler);

router.route('/login')
    .post(userLogin.userLoginHandler);

router.route('/logout')
    .post(userAuth.authorisationHandler, userLogin.userLogoutHandler);

router.route('/cart')
    .get(userAuth.authorisationHandler, userCart.getCartHandler)
    .post(userAuth.authorisationHandler, userCart.postCartHandler);

router.route('/order-history')
    .get(userAuth.authorisationHandler, userOrders.getOrderHistoryHandler)

router.route('/new-order')
    .post(userAuth.authorisationHandler, userOrders.postNewOrderHandler);

router.route('/profile')
    .get(userAuth.authorisationHandler, userProfile.getUserProfileHandler)
    .post(userAuth.authorisationHandler, userProfile.postUserProfiletHandler);

router.route('/change-credentials')
    .post(userAuth.authorisationHandler, userProfile.postUserCredentialHandler);

router.route('/token')
    .post(userAuth.refreshAuthorisationHandler);

module.exports = router;