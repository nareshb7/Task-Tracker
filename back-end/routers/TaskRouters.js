const {Router} = require('express')
const { setData, getData, signUpData, logInUserData, setCurrentUser, getCurrentUser, deleteCurrentUser, setCurrentUserID, getParticularUser, getAllUsers, uploadedIssues } = require('../controllers/TaskControllers')

const router = Router()

router.post('/setData', setData)
router.get('/getData', getData)
router.post('/signupData', signUpData)
router.post('/loginData',logInUserData)
router.post('/setCurrentUser', setCurrentUser)
router.get('/getCurrentUser', getCurrentUser)
router.delete('/deletecurrentuser', deleteCurrentUser)
router.post('/currentuserid', setCurrentUserID)
router.post('/getparticularuser', getParticularUser)
router.get('/getallusers', getAllUsers)
router.post('/uploadedIssues', uploadedIssues)

module.exports = router