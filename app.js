require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const cors         = require('cors');
const passport     = require('./helpers/passport');

mongoose.Promise = Promise;
mongoose.connect(process.env.DB).then(() => console.log('Connected to the DB!')).catch(err => console.error('Error connecting to mongo', err));

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(bodyParser.json({limit:'50mb'})); 
app.use(bodyParser.urlencoded({extended:true, limit:'50mb'}));
app.use(cookieParser());

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.locals.title = 'Express - Generated with IronGenerator';

const index   = require('./routes/index');
const cohort  = require('./routes/cohort');
const student = require('./routes/student');
const project = require('./routes/project');
const auth    = require('./routes/auth');
app.use('/auth', auth);
app.use('/project', project);
app.use('/student', student);
app.use('/cohort', cohort);
app.use('/', index);

module.exports = app;
