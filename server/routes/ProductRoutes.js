const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const { verifyToken } = require('../middleware/authMiddleware')

router.post('/',verifyToken, productController.createProduct);

router.get('/', productController.getAllProducts);

router.get('/:id', productController.getProductById);

router.put('/:id',verifyToken, productController.updateProductById);

router.delete('/:id',verifyToken, productController.deleteProductById);

module.exports = router;