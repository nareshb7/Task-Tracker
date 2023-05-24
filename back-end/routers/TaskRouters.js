const { Router } = require('express')
const router = Router()
const { mailVerification, mailChangeReq, getmailchangeID, getQuote} = require('../controllers/TaskControllers')
const { setData, getData, addSolution, deleteSolution, updateSolution, uploadedIssues, getParticularSolution, issueStatus, getTicketIDs} = require('../controllers/IssueController')
const {signUpData, logInUserData, getParticularUser, getAllUsers, deleteUser, updateUser, userLogout, assignTicket} = require('../controllers/UserControllers')
const { messages, deleteMessage } = require('../controllers/MessageController')
const { todayTickts, updateTicket, getTodayTicket } = require('../controllers/TicketsController')

router.post('/setData', setData)
router.get('/getData', getData)
router.post('/addSolution', addSolution)
router.post('/signupData', signUpData)
router.post('/loginData', logInUserData)
router.post('/getparticularuser', getParticularUser)
router.get('/getallusers', getAllUsers)
router.post('/uploadedIssues', uploadedIssues)
router.post('/updatesolution', updateSolution)
router.post('/mailverification', mailVerification)
router.delete('/deleteuser', deleteUser)
router.post('/adminupdateuser', updateUser)
router.post('/deletesolution', deleteSolution)
router.post('/mailupdatereq', mailChangeReq)
router.get('/getmailreqIDs', getmailchangeID)
router.post('/getParticularSolution', getParticularSolution)
router.put('/issueStatus', issueStatus)
router.post('/logout', userLogout)
router.delete('/deletemessage', deleteMessage)
router.get('/todaytickets', todayTickts)
// router.post('/assignticket', assignTicket)
router.get('/getquote', getQuote)
router.post('/updateticket',updateTicket)
router.get('/gettodayticket', getTodayTicket)
router.get('/getticketid',getTicketIDs)
// router.get('/usermessages',messages )



module.exports = router