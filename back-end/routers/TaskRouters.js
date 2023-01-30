const {Router} = require('express')
const { setData, getData, signUpData, logInUserData, setCurrentUser, getCurrentUser, deleteCurrentUser } = require('../controllers/TaskControllers')

const router = Router()

router.post('/setData', setData)
router.get('/getData', getData)
router.post('/signupData', signUpData)
router.post('/loginData',logInUserData)
router.post('/setCurrentUser', setCurrentUser)
router.get('/getCurrentUser', getCurrentUser)
router.delete('/deletecurrentuser', deleteCurrentUser)

module.exports = router