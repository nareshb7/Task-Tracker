const { Router } = require('express')
const { setData, getData, signUpData, logInUserData, setCurrentUser, getCurrentUser, deleteCurrentUser, getParticularUser, getAllUsers, uploadedIssues, mailVerification, deleteUser, updateUser } = require('../controllers/TaskControllers')

const router = Router()

router.post('/setData', setData)
router.get('/getData', getData)
router.post('/signupData', signUpData)
router.post('/loginData', logInUserData)
router.post('/setCurrentUser', setCurrentUser)
router.get('/getCurrentUser', getCurrentUser)
router.delete('/deletecurrentuser', deleteCurrentUser)
router.post('/getparticularuser', getParticularUser)
router.get('/getallusers', getAllUsers)
router.post('/uploadedIssues', uploadedIssues)
router.post('/mailverification', mailVerification)
router.post('/deleteuser', deleteUser)
router.post('/adminupdateuser', updateUser)

module.exports = router