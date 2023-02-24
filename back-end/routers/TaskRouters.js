const { Router } = require('express')
const { setData, getData, signUpData, logInUserData, setCurrentUser, getCurrentUser, deleteCurrentUser, getParticularUser, getAllUsers, uploadedIssues, mailVerification, deleteUser, updateUser, addSolution, deleteSolution, mailChangeReq, getmailchangeID, updateSolution } = require('../controllers/TaskControllers')

const router = Router()

router.post('/setData', setData)
router.get('/getData', getData)
router.post('/addSolution', addSolution)
router.post('/signupData', signUpData)
router.post('/loginData', logInUserData)
router.post('/setCurrentUser', setCurrentUser)
router.get('/getCurrentUser', getCurrentUser)
router.delete('/deletecurrentuser', deleteCurrentUser)
router.post('/getparticularuser', getParticularUser)
router.get('/getallusers', getAllUsers)
router.post('/uploadedIssues', uploadedIssues)
router.post('/updatesolution', updateSolution)
router.post('/mailverification', mailVerification)
router.post('/deleteuser', deleteUser)
router.post('/adminupdateuser', updateUser)
router.post('/deletesolution', deleteSolution)
router.post('/mailupdatereq', mailChangeReq)
router.get('/getmailreqIDs', getmailchangeID)


module.exports = router