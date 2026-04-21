import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import connectDatabase from "../config/db.js";
import Category from "../models/Category.js";
import Question from "../models/Question.js";
import QuizSettings from "../models/QuizSettings.js";
import Score from "../models/Score.js";
import User from "../models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const createQuestion = (question, options, correctOption, category, difficulty) => {
  const correctAnswer = options.indexOf(correctOption);

  if (correctAnswer === -1) {
    throw new Error(`Correct option "${correctOption}" is missing for question: ${question}`);
  }

  return {
    question,
    options,
    correctAnswer,
    category,
    difficulty
  };
};

const categories = [
  { name: "JavaScript", description: "Core JavaScript language concepts, syntax, and runtime behavior." },
  { name: "React", description: "React fundamentals, component patterns, hooks, and rendering behavior." },
  { name: "Node.js", description: "Server-side JavaScript, modules, event loop, and npm ecosystem basics." },
  { name: "Express.js", description: "Routing, middleware, APIs, and backend patterns with Express." },
  { name: "MongoDB", description: "Documents, collections, queries, indexing, and Mongoose-friendly concepts." },
  { name: "HTML", description: "Markup structure, semantics, forms, accessibility, and document basics." },
  { name: "CSS", description: "Selectors, layout, responsiveness, box model, and styling fundamentals." },
  { name: "Web Security", description: "Authentication, authorization, common attacks, and defensive web practices." },
  { name: "Computer Science", description: "Algorithms, data structures, logic, and systems fundamentals." },
  { name: "General Knowledge", description: "Broad knowledge across science, geography, history, and everyday facts." }
];

const questions = [
  createQuestion(
    "Which method converts a JSON string into a JavaScript object?",
    ["JSON.parse()", "JSON.stringify()", "Object.from()", "String.toObject()"],
    "JSON.parse()",
    "JavaScript",
    "easy"
  ),
  createQuestion(
    "Which keyword creates a block-scoped variable in JavaScript?",
    ["var", "const", "scope", "define"],
    "const",
    "JavaScript",
    "easy"
  ),
  createQuestion(
    "What is the result type of `typeof null` in JavaScript?",
    ["null", "object", "undefined", "number"],
    "object",
    "JavaScript",
    "medium"
  ),
  createQuestion(
    "Which array method creates a new array with elements that pass a test?",
    ["reduce", "map", "filter", "findIndex"],
    "filter",
    "JavaScript",
    "easy"
  ),
  createQuestion(
    "Which value is considered falsy in JavaScript?",
    ["[]", "{}", "'0'", "0"],
    "0",
    "JavaScript",
    "easy"
  ),
  createQuestion(
    "What does the spread operator (`...`) do in JavaScript arrays?",
    ["Deletes items", "Copies or expands iterable values", "Sorts values", "Creates private fields"],
    "Copies or expands iterable values",
    "JavaScript",
    "medium"
  ),
  createQuestion(
    "Which function schedules code to run after the current call stack is clear and a delay passes?",
    ["setInterval", "queueMicrotask", "setTimeout", "requestIdleCallback"],
    "setTimeout",
    "JavaScript",
    "easy"
  ),
  createQuestion(
    "What does `Array.prototype.map()` return?",
    ["A mutated original array", "A new array", "A boolean", "The first matching item"],
    "A new array",
    "JavaScript",
    "easy"
  ),
  createQuestion(
    "Which statement about `===` is correct?",
    ["It compares value only", "It compares value and type", "It converts both sides to strings", "It checks reference only"],
    "It compares value and type",
    "JavaScript",
    "easy"
  ),
  createQuestion(
    "Which company originally created Node.js?",
    ["Google", "Joyent", "Meta", "Microsoft"],
    "Joyent",
    "JavaScript",
    "hard"
  ),

  createQuestion(
    "Which hook is used for side effects in React?",
    ["useState", "useEffect", "useRef", "useContext"],
    "useEffect",
    "React",
    "easy"
  ),
  createQuestion(
    "What prop helps React identify list items efficiently?",
    ["index", "id", "name", "key"],
    "key",
    "React",
    "easy"
  ),
  createQuestion(
    "Which hook shares data deeply through the component tree without prop drilling?",
    ["useMemo", "useContext", "useReducer", "useRef"],
    "useContext",
    "React",
    "medium"
  ),
  createQuestion(
    "What does JSX compile into?",
    ["SQL queries", "Browser templates", "JavaScript function calls", "CSS classes"],
    "JavaScript function calls",
    "React",
    "medium"
  ),
  createQuestion(
    "Which hook is commonly used to store local component state?",
    ["useState", "useId", "useEffect", "useImperativeHandle"],
    "useState",
    "React",
    "easy"
  ),
  createQuestion(
    "What is a React component expected to return?",
    ["A database object", "UI description", "A CSS file", "A command line flag"],
    "UI description",
    "React",
    "easy"
  ),
  createQuestion(
    "Which hook can help manage more complex state transitions?",
    ["useReducer", "useLayoutEffect", "useId", "useTransition"],
    "useReducer",
    "React",
    "medium"
  ),
  createQuestion(
    "What happens when React state updates?",
    ["The app always reloads", "The component can re-render", "CSS resets", "All timers stop"],
    "The component can re-render",
    "React",
    "easy"
  ),
  createQuestion(
    "Which hook is useful for storing a mutable value that does not trigger a re-render?",
    ["useRef", "useContext", "useState", "useDeferredValue"],
    "useRef",
    "React",
    "medium"
  ),
  createQuestion(
    "What is the default port for the Vite development server in many setups?",
    ["3000", "5173", "8080", "4200"],
    "5173",
    "React",
    "easy"
  ),

  createQuestion(
    "Which runtime is required to execute Node.js applications?",
    ["JVM", "Node.js runtime", "CLR", "Python VM"],
    "Node.js runtime",
    "Node.js",
    "easy"
  ),
  createQuestion(
    "Which global object is commonly used to work with environment variables in Node.js?",
    ["window.env", "process.env", "global.env", "module.env"],
    "process.env",
    "Node.js",
    "easy"
  ),
  createQuestion(
    "Which file usually defines package metadata and scripts in a Node.js project?",
    ["server.json", "package.json", "node.config", "manifest.js"],
    "package.json",
    "Node.js",
    "easy"
  ),
  createQuestion(
    "Which built-in module is used to work with file paths in Node.js?",
    ["http", "events", "path", "worker"],
    "path",
    "Node.js",
    "easy"
  ),
  createQuestion(
    "What does `npm` stand for?",
    ["Node Package Manager", "New Programming Module", "Network Package Mode", "Node Project Maker"],
    "Node Package Manager",
    "Node.js",
    "easy"
  ),
  createQuestion(
    "Which Node.js model allows it to handle many operations without many threads per request?",
    ["Blocking model", "Event-driven non-blocking I/O", "GPU rendering loop", "Recursive threading"],
    "Event-driven non-blocking I/O",
    "Node.js",
    "medium"
  ),
  createQuestion(
    "Which method is used to import a CommonJS module?",
    ["include()", "require()", "attach()", "loadModule()"],
    "require()",
    "Node.js",
    "medium"
  ),
  createQuestion(
    "Which package is commonly used to load environment variables from a `.env` file?",
    ["dotenv", "cors", "morgan", "helmet"],
    "dotenv",
    "Node.js",
    "easy"
  ),
  createQuestion(
    "Which module lets Node.js create an HTTP server?",
    ["http", "stream", "dns", "timers"],
    "http",
    "Node.js",
    "medium"
  ),
  createQuestion(
    "What is the event loop in Node.js responsible for?",
    ["Compiling CSS", "Managing asynchronous operations", "Drawing HTML elements", "Encrypting databases"],
    "Managing asynchronous operations",
    "Node.js",
    "hard"
  ),

  createQuestion(
    "Which Express method is used to register middleware for all HTTP methods on a path?",
    ["app.use()", "app.send()", "app.listen()", "app.engine()"],
    "app.use()",
    "Express.js",
    "easy"
  ),
  createQuestion(
    "Which object in an Express route contains data sent by the client in JSON format?",
    ["req.body", "req.path", "res.locals", "app.data"],
    "req.body",
    "Express.js",
    "easy"
  ),
  createQuestion(
    "Which Express method starts the server listening on a port?",
    ["app.route()", "app.listen()", "app.start()", "app.open()"],
    "app.listen()",
    "Express.js",
    "easy"
  ),
  createQuestion(
    "What is middleware in Express?",
    ["A database table", "A function in the request-response cycle", "A CSS preprocessor", "A React hook"],
    "A function in the request-response cycle",
    "Express.js",
    "easy"
  ),
  createQuestion(
    "Which response method sends JSON from an Express handler?",
    ["res.json()", "res.sendFile()", "res.mount()", "res.pipeJSON()"],
    "res.json()",
    "Express.js",
    "easy"
  ),
  createQuestion(
    "Which package is commonly used to handle Cross-Origin Resource Sharing in Express?",
    ["dotenv", "cors", "mongoose", "bcryptjs"],
    "cors",
    "Express.js",
    "easy"
  ),
  createQuestion(
    "In Express, what does `next()` do?",
    ["Stops the app", "Moves to the next middleware", "Restarts the server", "Encrypts the response"],
    "Moves to the next middleware",
    "Express.js",
    "medium"
  ),
  createQuestion(
    "Which Express parser helps read incoming JSON request bodies?",
    ["express.json()", "express.static()", "express.view()", "express.file()"],
    "express.json()",
    "Express.js",
    "easy"
  ),
  createQuestion(
    "What is the main purpose of route parameters like `/users/:id`?",
    ["To create CSS variables", "To capture dynamic values from the URL", "To compress responses", "To hash passwords"],
    "To capture dynamic values from the URL",
    "Express.js",
    "medium"
  ),
  createQuestion(
    "Which middleware pattern is commonly used for centralized error handling in Express?",
    ["A middleware with four parameters", "A middleware with zero parameters", "A React boundary", "A static file server"],
    "A middleware with four parameters",
    "Express.js",
    "hard"
  ),

  createQuestion(
    "MongoDB stores data primarily as what?",
    ["Rows", "XML blocks", "Documents", "Graphs only"],
    "Documents",
    "MongoDB",
    "easy"
  ),
  createQuestion(
    "What is a collection in MongoDB most similar to?",
    ["A SQL table", "A CSS class", "A Node module", "A route handler"],
    "A SQL table",
    "MongoDB",
    "easy"
  ),
  createQuestion(
    "Which field is commonly used as the default primary identifier in MongoDB?",
    ["id", "_id", "uuid", "primary"],
    "_id",
    "MongoDB",
    "easy"
  ),
  createQuestion(
    "Which Mongoose method creates and saves a new document in one step?",
    ["Model.create()", "Model.build()", "Model.saveAll()", "Model.insertObject()"],
    "Model.create()",
    "MongoDB",
    "easy"
  ),
  createQuestion(
    "What does `findOne()` return when no document matches?",
    ["0", "undefined", "null", "false"],
    "null",
    "MongoDB",
    "medium"
  ),
  createQuestion(
    "Which MongoDB query operator means 'greater than'?",
    ["$gt", "$gteq", "$more", "$higher"],
    "$gt",
    "MongoDB",
    "medium"
  ),
  createQuestion(
    "What is Mongoose used for?",
    ["Front-end routing", "Object data modeling for MongoDB", "Password hashing only", "Webpack configuration"],
    "Object data modeling for MongoDB",
    "MongoDB",
    "easy"
  ),
  createQuestion(
    "Which method updates a document by its id and can return the updated version?",
    ["findByIdAndUpdate()", "replaceAll()", "setById()", "updateFirst()"],
    "findByIdAndUpdate()",
    "MongoDB",
    "medium"
  ),
  createQuestion(
    "What is an index in MongoDB primarily used for?",
    ["Improving query performance", "Encrypting collections", "Making documents smaller", "Rendering charts"],
    "Improving query performance",
    "MongoDB",
    "medium"
  ),
  createQuestion(
    "What does `.populate()` do in Mongoose?",
    ["Adds CSS classes", "Loads referenced documents", "Deletes duplicates", "Builds database indexes"],
    "Loads referenced documents",
    "MongoDB",
    "hard"
  ),

  createQuestion(
    "What does HTML stand for?",
    ["HyperText Markup Language", "HighText Machine Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
    "HyperText Markup Language",
    "HTML",
    "easy"
  ),
  createQuestion(
    "Which HTML element is used for the largest page heading by default?",
    ["<heading>", "<h1>", "<title>", "<head>"],
    "<h1>",
    "HTML",
    "easy"
  ),
  createQuestion(
    "Which element is used to create a hyperlink?",
    ["<link>", "<href>", "<a>", "<navlink>"],
    "<a>",
    "HTML",
    "easy"
  ),
  createQuestion(
    "Which attribute provides alternative text for an image?",
    ["title", "alt", "srcset", "caption"],
    "alt",
    "HTML",
    "easy"
  ),
  createQuestion(
    "Which HTML element is used to collect user input?",
    ["<input>", "<data>", "<text>", "<feed>"],
    "<input>",
    "HTML",
    "easy"
  ),
  createQuestion(
    "Which element is semantically appropriate for page navigation links?",
    ["<navigate>", "<nav>", "<menuitem>", "<links>"],
    "<nav>",
    "HTML",
    "medium"
  ),
  createQuestion(
    "Which HTML tag contains metadata and links to stylesheets?",
    ["<body>", "<main>", "<head>", "<section>"],
    "<head>",
    "HTML",
    "easy"
  ),
  createQuestion(
    "What is the purpose of the `<label>` element in forms?",
    ["To style inputs", "To describe and associate text with a form control", "To submit the form", "To encrypt values"],
    "To describe and associate text with a form control",
    "HTML",
    "medium"
  ),
  createQuestion(
    "Which attribute makes a form field mandatory before submission?",
    ["validate", "needed", "required", "mustfill"],
    "required",
    "HTML",
    "easy"
  ),
  createQuestion(
    "Which element is best for the main content of a document?",
    ["<main>", "<meta>", "<footer>", "<aside>"],
    "<main>",
    "HTML",
    "medium"
  ),

  createQuestion(
    "What does CSS stand for?",
    ["Computer Style Sheets", "Cascading Style Sheets", "Creative Styling Syntax", "Colorful Style Structure"],
    "Cascading Style Sheets",
    "CSS",
    "easy"
  ),
  createQuestion(
    "Which CSS property changes text color?",
    ["font-color", "text-style", "color", "foreground"],
    "color",
    "CSS",
    "easy"
  ),
  createQuestion(
    "Which layout system is one-dimensional and great for aligning items in a row or column?",
    ["Grid", "Flexbox", "Float", "Table"],
    "Flexbox",
    "CSS",
    "easy"
  ),
  createQuestion(
    "Which CSS property controls the space outside an element's border?",
    ["padding", "margin", "gap", "outline"],
    "margin",
    "CSS",
    "easy"
  ),
  createQuestion(
    "Which CSS property controls the space inside an element's border?",
    ["spacing", "margin", "padding", "indent"],
    "padding",
    "CSS",
    "easy"
  ),
  createQuestion(
    "Which unit is relative to the root element's font size?",
    ["px", "em", "rem", "%"],
    "rem",
    "CSS",
    "medium"
  ),
  createQuestion(
    "Which property is commonly used to round element corners?",
    ["corner-radius", "border-round", "border-radius", "radius"],
    "border-radius",
    "CSS",
    "easy"
  ),
  createQuestion(
    "What is the default `position` value for most HTML elements?",
    ["relative", "fixed", "static", "absolute"],
    "static",
    "CSS",
    "medium"
  ),
  createQuestion(
    "Which feature is commonly used in CSS for responsive design at different screen sizes?",
    ["media queries", "keyframes", "pseudo-elements", "gradients"],
    "media queries",
    "CSS",
    "easy"
  ),
  createQuestion(
    "Which property sets the stacking order of positioned elements?",
    ["stack", "layer", "z-index", "depth"],
    "z-index",
    "CSS",
    "medium"
  ),

  createQuestion(
    "Which attack injects malicious scripts into trusted pages viewed by other users?",
    ["CSRF", "XSS", "DDoS", "MITM"],
    "XSS",
    "Web Security",
    "medium"
  ),
  createQuestion(
    "What does JWT stand for?",
    ["Java Web Token", "JSON Web Token", "Joint Web Ticket", "JSON Wide Transfer"],
    "JSON Web Token",
    "Web Security",
    "easy"
  ),
  createQuestion(
    "Which HTTP header is commonly used to send a bearer token?",
    ["Content-Type", "Authorization", "X-Powered-By", "Accept-Language"],
    "Authorization",
    "Web Security",
    "easy"
  ),
  createQuestion(
    "Why should passwords be hashed before storing them?",
    ["To make login slower", "To protect raw passwords if the database is leaked", "To remove duplicates", "To compress storage"],
    "To protect raw passwords if the database is leaked",
    "Web Security",
    "easy"
  ),
  createQuestion(
    "Which package in your backend is used to hash passwords?",
    ["jsonwebtoken", "bcryptjs", "cors", "morgan"],
    "bcryptjs",
    "Web Security",
    "easy"
  ),
  createQuestion(
    "What is the main purpose of CORS?",
    ["Compress responses", "Control cross-origin browser requests", "Encrypt cookies", "Speed up DNS"],
    "Control cross-origin browser requests",
    "Web Security",
    "medium"
  ),
  createQuestion(
    "Which vulnerability involves tricking a logged-in user into performing an unwanted action?",
    ["XSS", "SQL injection", "CSRF", "Open redirect"],
    "CSRF",
    "Web Security",
    "medium"
  ),
  createQuestion(
    "What is the least-privilege principle?",
    ["Give every user admin access", "Grant only the access needed to perform a task", "Never use passwords", "Block all APIs"],
    "Grant only the access needed to perform a task",
    "Web Security",
    "medium"
  ),
  createQuestion(
    "Why is keeping `JWT_SECRET` private important?",
    ["It controls CSS themes", "It prevents attackers from forging valid tokens", "It speeds up MongoDB", "It changes route order"],
    "It prevents attackers from forging valid tokens",
    "Web Security",
    "hard"
  ),
  createQuestion(
    "Which status code is commonly returned for unauthorized requests?",
    ["200", "201", "401", "500"],
    "401",
    "Web Security",
    "easy"
  ),

  createQuestion(
    "Which data structure uses First In, First Out ordering?",
    ["Stack", "Queue", "Tree", "Graph"],
    "Queue",
    "Computer Science",
    "easy"
  ),
  createQuestion(
    "Which data structure uses Last In, First Out ordering?",
    ["Array", "Queue", "Stack", "Heap"],
    "Stack",
    "Computer Science",
    "easy"
  ),
  createQuestion(
    "What is the worst-case time complexity of binary search on a sorted array?",
    ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    "O(log n)",
    "Computer Science",
    "medium"
  ),
  createQuestion(
    "Which notation describes algorithm growth relative to input size?",
    ["Big O notation", "JSON notation", "CSS notation", "Prime notation"],
    "Big O notation",
    "Computer Science",
    "easy"
  ),
  createQuestion(
    "What is a tree data structure?",
    ["A flat list only", "A hierarchical structure with nodes", "A numeric sorting rule", "A CSS layout"],
    "A hierarchical structure with nodes",
    "Computer Science",
    "medium"
  ),
  createQuestion(
    "Which number system do computers fundamentally use?",
    ["Decimal", "Binary", "Hexadecimal", "Roman numerals"],
    "Binary",
    "Computer Science",
    "easy"
  ),
  createQuestion(
    "What does CPU stand for?",
    ["Central Processing Unit", "Core Power Utility", "Central Program Usage", "Computer Primary Unit"],
    "Central Processing Unit",
    "Computer Science",
    "easy"
  ),
  createQuestion(
    "Which algorithm category includes merge sort?",
    ["Greedy only", "Divide and conquer", "Dynamic rendering", "Brute styling"],
    "Divide and conquer",
    "Computer Science",
    "hard"
  ),
  createQuestion(
    "What is recursion?",
    ["A loop in CSS", "A function calling itself", "A database index", "A file system path"],
    "A function calling itself",
    "Computer Science",
    "medium"
  ),
  createQuestion(
    "Which memory type is generally faster but smaller than RAM and helps the CPU access data quickly?",
    ["Hard disk", "Cache", "USB storage", "Optical media"],
    "Cache",
    "Computer Science",
    "hard"
  ),

  createQuestion(
    "Which planet is known as the Red Planet?",
    ["Venus", "Mars", "Jupiter", "Mercury"],
    "Mars",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "What gas do plants absorb from the atmosphere?",
    ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"],
    "Carbon Dioxide",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "Which ocean is the largest on Earth?",
    ["Atlantic", "Indian", "Pacific", "Arctic"],
    "Pacific",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "What is the capital of Japan?",
    ["Seoul", "Kyoto", "Tokyo", "Bangkok"],
    "Tokyo",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "Which continent is Egypt located in?",
    ["Asia", "Africa", "Europe", "South America"],
    "Africa",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "Who wrote 'Romeo and Juliet'?",
    ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
    "William Shakespeare",
    "General Knowledge",
    "medium"
  ),
  createQuestion(
    "Which organ pumps blood through the human body?",
    ["Lungs", "Brain", "Heart", "Kidney"],
    "Heart",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "How many days are there in a leap year?",
    ["364", "365", "366", "367"],
    "366",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "Which is the largest mammal in the world?",
    ["Elephant", "Blue whale", "Giraffe", "Hippopotamus"],
    "Blue whale",
    "General Knowledge",
    "medium"
  ),
  createQuestion(
    "What is the boiling point of water at standard atmospheric pressure?",
    ["90 degrees C", "95 degrees C", "100 degrees C", "120 degrees C"],
    "100 degrees C",
    "General Knowledge",
    "medium"
  ),
  createQuestion(
    "Which country is famous for the pyramids of Giza?",
    ["Peru", "Mexico", "Egypt", "Jordan"],
    "Egypt",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "What is the currency of the United Kingdom?",
    ["Euro", "Pound sterling", "Dollar", "Yen"],
    "Pound sterling",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "Which vitamin is mainly produced when skin is exposed to sunlight?",
    ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
    "Vitamin D",
    "General Knowledge",
    "medium"
  ),
  createQuestion(
    "Which river is commonly listed as the longest in the world in general knowledge books?",
    ["Amazon", "Nile", "Yangtze", "Danube"],
    "Nile",
    "General Knowledge",
    "medium"
  ),
  createQuestion(
    "Which language has the most native speakers worldwide?",
    ["English", "Spanish", "Mandarin Chinese", "Hindi"],
    "Mandarin Chinese",
    "General Knowledge",
    "medium"
  ),
  createQuestion(
    "What is the smallest prime number?",
    ["0", "1", "2", "3"],
    "2",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "Which instrument is used to measure temperature?",
    ["Barometer", "Thermometer", "Altimeter", "Speedometer"],
    "Thermometer",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "Who painted the Mona Lisa?",
    ["Pablo Picasso", "Vincent van Gogh", "Leonardo da Vinci", "Claude Monet"],
    "Leonardo da Vinci",
    "General Knowledge",
    "medium"
  ),
  createQuestion(
    "What is the capital city of Canada?",
    ["Toronto", "Vancouver", "Ottawa", "Montreal"],
    "Ottawa",
    "General Knowledge",
    "medium"
  ),
  createQuestion(
    "Which blood type is known as the universal donor?",
    ["AB positive", "O negative", "A positive", "B negative"],
    "O negative",
    "General Knowledge",
    "hard"
  ),
  createQuestion(
    "Which desert is the largest hot desert in the world?",
    ["Gobi", "Kalahari", "Arabian", "Sahara"],
    "Sahara",
    "General Knowledge",
    "medium"
  ),
  createQuestion(
    "How many continents are there on Earth?",
    ["5", "6", "7", "8"],
    "7",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "What is H2O more commonly known as?",
    ["Salt", "Hydrogen", "Water", "Oxygen"],
    "Water",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "Which planet has the most prominent ring system?",
    ["Mars", "Saturn", "Venus", "Neptune"],
    "Saturn",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "What is the national sport of Bangladesh?",
    ["Football", "Cricket", "Kabaddi", "Hockey"],
    "Kabaddi",
    "General Knowledge",
    "medium"
  ),
  createQuestion(
    "Which country hosted the 2016 Summer Olympics?",
    ["China", "Brazil", "Japan", "Greece"],
    "Brazil",
    "General Knowledge",
    "medium"
  ),
  createQuestion(
    "What is the square root of 144?",
    ["10", "11", "12", "14"],
    "12",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "Which famous scientist developed the theory of relativity?",
    ["Isaac Newton", "Nikola Tesla", "Albert Einstein", "Galileo Galilei"],
    "Albert Einstein",
    "General Knowledge",
    "medium"
  ),
  createQuestion(
    "Which sea creature has eight arms?",
    ["Squid", "Octopus", "Starfish", "Jellyfish"],
    "Octopus",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "What is the largest continent by land area?",
    ["Africa", "Europe", "North America", "Asia"],
    "Asia",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "Which country is known as the Land of the Rising Sun?",
    ["China", "Japan", "Thailand", "South Korea"],
    "Japan",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "How many players are there in a standard football team on the field?",
    ["9", "10", "11", "12"],
    "11",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "Which metal is liquid at room temperature?",
    ["Mercury", "Iron", "Aluminum", "Copper"],
    "Mercury",
    "General Knowledge",
    "hard"
  ),
  createQuestion(
    "What is the capital of Australia?",
    ["Sydney", "Melbourne", "Canberra", "Perth"],
    "Canberra",
    "General Knowledge",
    "medium"
  ),
  createQuestion(
    "Which animal is known as the King of the Jungle?",
    ["Tiger", "Elephant", "Lion", "Leopard"],
    "Lion",
    "General Knowledge",
    "easy"
  ),
  createQuestion(
    "Which month has the fewest days?",
    ["February", "April", "June", "November"],
    "February",
    "General Knowledge",
    "easy"
  )
];

const seedDatabase = async () => {
  await connectDatabase();

  await Promise.all([
    User.deleteMany({}),
    Question.deleteMany({}),
    QuizSettings.deleteMany({}),
    Score.deleteMany({}),
    Category.deleteMany({})
  ]);

  await Category.insertMany(categories);

  const admin = await User.create({
    name: "Quiz Admin",
    email: "admin@quizmaster.dev",
    password: "Admin@123",
    role: "admin"
  });

  await User.create({
    name: "Demo Player",
    email: "user@quizmaster.dev",
    password: "User@1234",
    role: "user"
  });

  await Question.insertMany(questions);
  await QuizSettings.create({
    questionsPerQuiz: 10,
    secondsPerQuestion: 30
  });

  console.log(`Seed complete: ${categories.length} categories, ${questions.length} questions`);
  console.log(`Admin login: ${admin.email} / Admin@123`);
  process.exit(0);
};

seedDatabase().catch((error) => {
  console.error("Seed failed", error);
  process.exit(1);
});
