const express = require("express")
const { getDb, connectToDb } = require("./db")
const cors = require("cors")
const multer = require("multer")
const path = require("path")
const bodyParser = require("body-parser")
const employeeController = require("./controllers/employeeController")
const app = express()
app.use(cors())
// app.use(express.json())
app.use(express.json({ limit: "50mb" }))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.resolve(__dirname, "public")))

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uplods")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})
const upload = multer({ storage: storage })

let db

connectToDb(err => {
  if (!err) {
    app.listen("5000", () => {
      console.log("app listening on port 5000")
    })
    db = getDb()
  }
})

app.get("/", employeeController.getEmployees)
app.post("/create", employeeController.createEmployee)
app.put("/update", employeeController.updateEmployee)
app.delete("/delete/:id", employeeController.deleteEmployee)
app.get("/export", employeeController.exportEmployees)
app.post("/upload", upload.single("file"), employeeController.uploadEmployees)
