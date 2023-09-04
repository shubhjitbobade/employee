const express = require("express")
const router = new express.Router()

const employeeController = require("../controllers/employeeController")

// routes
router.get("/", employeeController.getEmployees)
router.post("/create", employeeController.createEmployee)
router.put("/update", employeeController.updateEmployee)
router.delete("/delete/:id", employeeController.deleteEmployee)
router.get("/export", employeeController.exportEmployees)

module.exports = router
