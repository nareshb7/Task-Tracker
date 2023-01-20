const {Router} = require('express')
const { setData, getData } = require('../controllers/TaskControllers')


const router = Router()

router.post('/setData',setData)
router.get('/getData', getData)

module.exports = router