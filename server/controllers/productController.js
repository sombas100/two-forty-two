const Product = require('../models/Product')

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().limit(5)
            res.json(products)
    } catch (error) {
        console.error(error)
        res.status(500).send('Internal Server Error');
    }
}

const getShopPageProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products'})
    }
}

const createProduct = async (req, res) => {
    const { name, description, price, category, image, stock } = req.body
try {
    const newProduct = await Product({
        name,
        description,
        price,
        category,
        image,
        stock,
    })

    const product = await newProduct.save()
    res.json(product)
    
} catch (err) {
    console.error(err.message)
    res.status(500).send('Internal Server Error')
    }
}

const getProductById = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: 'Item not found'});
        }
        res.json(product)
    } catch (error) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found'})
        }
        res.status(500).send('Internal Server Error');
    }
}

const updateProductById = async (req, res) => {
    const { name, description, price, category, image, stock } = req.body

    try {
        let product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: 'Item not found'})
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: { name, description, price, category, image, stock}},
            { new: true }
        );

        res.json(product)
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(500).json({ message: 'Item not found' })
        }
        res.status(500).send('Internal Server Error');
    }
}

const deleteProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return res.status(404).json({ message: 'Item not found'})
        }

        await product.remove();

        res.json({ message: 'Item has been successfully removed' })
    } catch (err) {
        console.error(err.message)
        if (err.kind === 'ObjectId'){
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProductById,
    deleteProductById,
    getShopPageProducts,

}