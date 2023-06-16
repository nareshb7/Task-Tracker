const { Router } = require('express')
const router = Router()
const { mailVerification, mailChangeReq, getmailchangeID, getQuote, contactusData, addContactUsData, getNews} = require('../controllers/TaskControllers')
const { setData, getData, addSolution, deleteSolution, updateSolution, uploadedIssues, getParticularSolution, issueStatus, getTicketIDs} = require('../controllers/IssueController')
const {signUpData, logInUserData, getParticularUser, getAllUsers, deleteUser, updateUser, userLogout, assignTicket, addNewActivity, getActivity} = require('../controllers/UserControllers')
const { messages, deleteMessage } = require('../controllers/MessageController')
const { todayTickts, updateTicket, getTodayTicket, addNewTicket, deleteTicket, addNewClient, clientList } = require('../controllers/TicketsController')

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
router.get('/contactusmessage', contactusData)
router.post('/addcontactus', addContactUsData)
router.post('/addnewticket', addNewTicket)
router.delete('/deleteticket', deleteTicket)
router.post('/addnewclient', addNewClient)
router.get('/getclientslist', clientList)
router.get('/getnews', getNews)
router.post('/addactivity', addNewActivity)
router.get('/getactivity', getActivity)



module.exports = router