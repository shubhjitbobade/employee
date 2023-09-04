const { ObjectId } = require("mongodb")
const { getDb } = require("../db")
const ITEMS_PER_PAGE = 5
const fs = require("fs")
const csv = require("fast-csv")
const csvParser = require("csvtojson")

// Get paginated employee data
const getEmployees = async (req, res) => {
  const page = parseInt(req.query.page) || 1
  const skip = (page - 1) * ITEMS_PER_PAGE

  try {
    const db = getDb()
    const collection = db.collection("employees")

    const totalItems = await collection.countDocuments({})
    const data = await collection
      .find({})
      .skip(skip)
      .limit(ITEMS_PER_PAGE)
      .toArray()

    res.json({
      success: true,
      data: data,
      currentPage: page,
      totalPages: Math.ceil(totalItems / ITEMS_PER_PAGE),
    })
  } catch (error) {
    res.status(500).json({ success: false, error: "An error occurred." })
  }
}
const exportEmployees = async (req, res) => {
  try {
    const db = getDb()
    const collection = db.collection("employees")
    const data = await collection.find({}).toArray()

    const csvStream = csv.format({ headers: true })
    const excludeFields = ["_id", "photo"]

    const headers = Object.keys(data[0]).filter(
      key => !excludeFields.includes(key)
    )

    csvStream.write(headers)

    data.forEach(item => {
      const row = headers.map(header => item[header])
      csvStream.write(row)
    })
    csvStream.end().pipe(res)

    res.setHeader("Content-disposition", "attachment; filename=employees.csv")
    res.setHeader("Content-type", "text/csv")
  } catch (error) {
    console.error("Error exporting data:", error)
    res.status(500).json({
      success: false,
      message: "An error occurred while exporting data.",
      error: error,
    })
  }
}
// Create a new employee
const createEmployee = async (req, res) => {
  try {
    const db = getDb()
    const collection = db.collection("employees")

    // const employeeData = {
    //   employeeNo: req.body.employeeNo,
    //   name: req.body.name,
    //   email: req.body.email,
    //   phoneNumber: req.body.phoneNumber,
    //   birthDate: req.body.birthDate,
    // }
    // if (req.file) {
    //   employeeData.photo = req.file.filename
    // }

    await collection.insertOne(req.body)

    res.send({
      success: true,
      message: "Data saved and email sent successfully...",
    })
  } catch (error) {
    console.error("Error saving data:", error)
    res.status(500).send({
      success: false,
      message: "An error occurred while saving data.",
      error: error,
    })
  }
}

const uploadEmployees = async (req, res) => {
  try {
    const db = getDb()
    const collection = db.collection("employees")
    var userData = []
    csvParser()
      .fromFile(req.file.path)
      .then(async response => {
        for (var x = 0; x < response.length; x++) {
          userData.push({
            employeeNo: response[x].employeeNo,
            name: response[x].name,
            email: response[x].email,
            phoneNumber: response[x].phoneNumber,
            birthDate: response[x].birthDate,
          })
        }
        await collection.insertMany(userData)
      })
    res.send({ status: 200, success: true, msg: "csv Impported.." })
  } catch (error) {
    res.send({ status: 404, success: false, msg: error.message })
  }
}

const updateEmployee = async (req, res) => {
  const { _id, ...rest } = req.body
  try {
    const db = getDb()
    const collection = db.collection("employees")

    const objectId = new ObjectId(_id)
    const result = await collection.updateOne({ _id: objectId }, { $set: rest })

    if (result.modifiedCount > 0) {
      res.send({
        success: true,
        message: "Data updated successfully...",
        data: result,
      })
    } else {
      res.status(404).send({
        success: false,
        message: "No document found for the provided ID.",
      })
    }
  } catch (error) {
    console.error("Error updating data:", error)
    res.status(500).send({
      success: false,
      message: "An error occurred while updating data.",
      error: error,
    })
  }
}

// Delete an employee
const deleteEmployee = async (req, res) => {
  const id = req.params.id
  try {
    const db = getDb()
    const collection = db.collection("employees")

    const objectId = new ObjectId(id)
    const result = await collection.deleteOne({ _id: objectId })

    if (result.deletedCount > 0) {
      res.send({
        success: true,
        message: "Data deleted successfully...",
        data: result,
      })
    } else {
      res.status(404).send({
        success: false,
        message: "No document found for the provided ID.",
      })
    }
  } catch (error) {
    console.error("Error deleting data:", error)
    res.status(500).send({
      success: false,
      message: "An error occurred while deleting data.",
      error: error,
    })
  }
}

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  exportEmployees,
  uploadEmployees,
}
