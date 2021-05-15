const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
// const logger = require('morgan');
const _ = require('lodash');

const app = express();

app.use(cors());

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const { User } = require('./Helpers/UserClass');

require('./socket/streams')(io, User, _);
require('./socket/private')(io); 

const dbConfig = require('./config/secret');
const auth = require('./routes/authRoutes'); 
const posts = require('./routes/postRoutes');
const users = require('./routes/userRoutes');
const friends = require('./routes/friendsRoutes');
const message = require('./routes/messageRoutes');
const image = require('./routes/imageRoutes');




 /* lession  211  
app.use((req, res, next) => {
    res.header('Access-Control-Allow-origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET', 'POST', 
    'DELETE', 'PUT', 'OPTIONS');
    res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization', 
    );
    next();
});  */







app.use(express.json({limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
// app.use(logger('dev'));

mongoose.Promise = global.Promise;     
mongoose.connect(
   dbConfig.url,  
    { useUnifiedTopology: true, 
     useNewUrlParser: true } 
);
  
app.use('/api/chatapp', auth);
app.use('/api/chatapp', posts);
//app.use('/userRoutes', require('./routes/userRoutes').users);
app.use('/api/chatapp', users);
//app.use(function(req, res, next) {('/api/chatapp', users);});
/*  app.use('/api/chatapp', users);
users.initialize(app);  */
app.use('/api/chatapp', friends); 
app.use('/api/chatapp', message);   
app.use('/api/chatapp', image);

server.listen(3000, () => {
    console.log('Listening on port 3000');
});     