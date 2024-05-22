const express = require('express');
const app = express();
const dotenv = require('dotenv')
dotenv.config();

app.listen(process.env.PORT);

const userRouter = require('./users')
const channelRouter = require('./channels')


app.use("/", userRouter)
app.use("/channels", channelRouter)

