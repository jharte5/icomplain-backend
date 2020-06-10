const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/create-user', userController.createUser)

router.post('/login', userController.login)

router.get('/logout', userController.logout)

// router.get('/profile', jwtHelp./ (req,res,next) => {
  // if (req.isAuthenticated()) {
  //   return res.render('user-profile')
  // }else {
  //   return res.send('Unauthorized')
  // }

// });
router.put('/update-profile', userController.updateProfile)

router.get('/update-profile', userController.updateProfile)

module.exports = router;
