// import the express router
const router = require('express').Router();

// import the salelist controller
const salelistALLCtrl = require('../controllers/salelistALL');

router.get('/', salelistALLCtrl.getALLSaleLists);

// export the route from this file
module.exports = router;
