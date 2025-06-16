const dialogflow = require('@google-cloud/dialogflow');
const { WebhookClient, Suggestion } = require('dialogflow-fulfillment');
const express = require("express")
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json())
app.use(cors());

const PORT = process.env.PORT || 8080;

app.post("/webhook", async (req, res) => {
    var id = (res.req.body.session).substr(43);
    console.log(id)
    const agent = new WebhookClient({ request: req, response: res });

    function hi(agent) {
        console.log(`intent  =>  hi`);
        agent.add("👋 Welcome to LUNA! Ready to book your table? 🍽️")
    }

    function BookTable(agent) {
        const { person, number, email, phone } = agent.parameters;
        const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "shafiqmisbah30@gmail.com",
    pass: "guuh nugy klug viui",
  },
});

agent.add(`Hi ${person}, your table has been successfully booked for ${number} people. 📅  A confirmation email has been sent to ${email}, and we've also messaged your phone number ${phone}, If you have any questions or need to make changes, feel free to contact us.  We look forward to serving you!: 🍽️`);

transporter.sendMail({
  from: '"shafiqmisbah30@gmail.com"',
  to: email,
  subject: "Hello Email Sent ✔",
  text: `Hi ${person}, your table has been successfully booked for ${number} people. 📅  A confirmation email has been sent to ${email}, and we've also messaged your phone number ${phone}, If you have any questions or need to make changes, feel free to contact us.  We look forward to serving you!: 🍽️`, // plain‑text body
  // html: "<b>Hello world?</b>", // HTML body
}).then((info) => {
  console.log("Message sent:", info.messageId);
}).catch((error) => {
  console.error("Error sending email:", error);
});

console.log("🧾 Number of People:", number);
console.log("👤 User Name:", person);
console.log("📧 User Email:", email);
console.log("📱 User Phone Number:", phone);

    }
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', hi); 
    intentMap.set('BookTable', BookTable);
    agent.handleRequest(intentMap);
})
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});