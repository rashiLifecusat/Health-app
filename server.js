/*
 * @file: server.js
 * @description: This is the main file of project All files are configure here
 * @date: 20/10/2022
 * @author: vipin
 */
require("dotenv").config();
// require("../MERN")
const lib = require("./index");
require("./config/processOn");
const env = require("./env");
const app = lib.express();
const server = lib.http.createServer(app);
const appCred = require("./config/appcredentials")[env.instance];
const logger = require("./config/logger");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDocs = require("swagger-jsdoc");
const userRouter = require('./components/user/Route')
const adminRouter= require('./components/admin/Route')

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Health Care",
      version: "1.0.0",
      description: "health care app api",
    },
    servers: [{ url: appCred.baseUrl }],
  },
  apis: ['./components/user/Route.js','./components/admin/Route.js'],
};

const swaggerSpecification = swaggerJsDocs(options);
console.log(swaggerSpecification);
app.use(lib.cors());
app.use(lib.express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(lib.express.json({ limit: "50mb", extended: true, parameterLimit: 50000 }))
app.use(lib.bodyParser.json({limit: "50mb"}));
app.use(lib.bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

//Router defining
app.use(userRouter)
app.use(adminRouter)

app.use(
  "/documentation",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecification, { explorer: true })
);

app.set('views', lib.path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', lib.hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
  }))

server.listen(appCred.port, (err) => {
  if (err) {
    logger.error(err);
  } else {
    require("./config/dbConfig");
    require('./components/admin/Service').createAdmin()
  }
  logger.debug("Server running on port " + appCred.port);
});

process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  process.exit(1);
});
