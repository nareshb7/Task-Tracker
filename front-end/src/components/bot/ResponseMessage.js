import data from './messages.json'
import { uploadedIssues } from '../issues/UserIssues'


const loggedInUserResponse = async (currentUserVal, message) => {
    switch (message.toLowerCase()) {
        case 'help keys': {
            return data.map((val, idx) => `${idx + 1}:${val.key.split(',')[0]} \n`)
        }
        case "faq's": {
            return "<div> FAQ's by user's</div>"
        }
        case 'stats':
        case 'stats page': {
            return `<div>Want to go to stats page <a href="/empstats">click here</a><button onClick={handleClick}>click</button> </div>`
        }
        case 'my uploaded issues':
        case 'my uploaded tickets':
        case 'my tickets':
            try {
                const resp = await uploadedIssues(currentUserVal._id)
                let msz = `<div>You worked on ${resp.length} tickets those are `
                const names = resp.map(res => `${res.cName}, `)
                msz += names
                const link = ` <p>click here to go to <a href='/login'>Profile Page</a> </p> <p>after that click on my tickets page</p></div>`
                msz += link
                return msz
            } catch (err) {
                return 'ERROR OCCURED '
            }
        default: {
            const reply = data.find(msz => msz.key.split(',').includes(message.toLowerCase()))
            return reply?.node ? reply.node : reply?.value
        }
    }
}

export const responseMessage = async (currentUserVal, message) => {
    const isUser = currentUserVal._id
    if (isUser) {
        return await loggedInUserResponse(currentUserVal, message)
    } else {
        return "Click here to contact admin"
    }
}