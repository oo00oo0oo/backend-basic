const express = require('express');
const app = express();

app.listen(7777);

const userRouter = require('./users')
const channelRouter = require('./channels')


app.use("/", userRouter)
app.use("/channels", channelRouter)
