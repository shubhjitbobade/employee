import "./App.css"
import { useEffect, useState, useRef } from "react"
import axios from "axios"
import FormTable from "./components/FormTable"
import validateForm from "./validation"

axios.defaults.baseURL = "http://localhost:5000/"

function App() {
  const [addSection, setAddSection] = useState(false)
  const [editSection, setEditSection] = useState(false)
  const [dataList, setDataList] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [validationErrors, setValidationErrors] = useState({
    employeeNo: "",
    name: "",
    email: "",
    photo: "",
    phoneNumber: "",
    birthDate: "",
  })

  const resetForm = () => {
    setFormData({
      employeeNo: "",
      name: "",
      email: "",
      photo: "",
      phoneNumber: "",
      birthDate: "",
    })
    setValidationErrors({
      employeeNo: "",
      name: "",
      email: "",
      photo: "",
      phoneNumber: "",
      birthDate: "",
    })
  }

  const [formData, setFormData] = useState({
    employeeNo: "",
    name: "",
    email: "",
    photo: "",
    phoneNumber: "",
    birthDate: "",
  })
  const [formDataEdit, setFormDataEdit] = useState({
    employeeNo: "",
    name: "",
    email: "",
    photo: "",
    phoneNumber: "",
    birthDate: "",
    _id: "",
  })

  const handleOnChange = e => {
    const { name, files } = e.target // Get the name and selected files

    if (name === "photo") {
      // Handle the photo file input
      if (files.length > 0) {
        const selectedFile = files[0] // Get the first selected file

        // Use FileReader to read the selected file as a data URL (base64)
        const reader = new FileReader()
        reader.onload = () => {
          const base64Image = reader.result // This is the base64 image data

          setFormData(prev => ({
            ...prev,
            [name]: base64Image, // Set the base64 image data
          }))

          // Continue with any other necessary logic
        }

        reader.readAsDataURL(selectedFile) // Read the selected file
      }
    } else {
      // Handle other input fields (e.g., text inputs)
      const { value } = e.target

      setFormData(prev => ({
        ...prev,
        [name]: value,
      }))
    }

    // Clear validation errors for the input field
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      [name]: "",
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const imageFile = e.target.photo.files[0]
    if (imageFile && imageFile instanceof Blob) {
      const reader = new FileReader()
      reader.onload = async event => {
        const base64Image = event.target.result
        // Create an employee object with the base64 image data
        const employeeData = {
          employeeNo: formData.employeeNo,
          name: formData.name,
          email: formData.email,
          photo: base64Image, // Store the base64 image data
          phoneNumber: formData.phoneNumber,
          birthDate: formData.birthDate,
        }
        const errors = validateForm(employeeData)
        if (Object.keys(errors).length === 0) {
          try {
            const response = await axios.post("/create", employeeData)
            if (response.data.success) {
              setAddSection(false)
              alert(response.data.message)
              getFeatchData(currentPage)
              // Reset the form fields
              setFormData({
                employeeNo: "",
                name: "",
                email: "",
                photo: "",
                phoneNumber: "",
                birthDate: "",
              })
            } else {
              alert("Failed to create employee: " + response.data.error)
            }
          } catch (error) {
            console.error("Error creating employee:", error)
            alert("An error occurred while creating an employee.")
          }
        } else {
          setValidationErrors(errors)
        }
      }

      // Read the selected file as a data URL (base64)
      reader.readAsDataURL(imageFile)
    }
  }

  const getFeatchData = async page => {
    try {
      const response = await axios.get(`/?page=${page}`)
      if (response.data.success) {
        response.data.data.map(el => ({
          ...el,
          photo: `data:image/jpg;base64,${el.photo}`, // Assuming the images are in JPEG format; update the format accordingly
        }))
        setDataList(response.data.data)
        setTotalPages(response.data.totalPages)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  useEffect(() => {
    getFeatchData(currentPage)
  }, [])

  const handleDelete = async id => {
    try {
      const response = await axios.delete(`/delete/${id}`)
      if (response.data.success) {
        getFeatchData(currentPage)
        alert(response.data.message)
      }
    } catch (error) {
      console.error("Error deleting employee:", error)
      // Adjust error handling based on backend response structure
      alert("An error occurred while deleting an employee.")
    }
  }

  const handleUpdate = async e => {
    e.preventDefault()
    // Validate the updated data before sending the update request
    const updatedErrors = validateForm(formDataEdit)
    if (Object.keys(updatedErrors).length > 0) {
      setValidationErrors(updatedErrors)
      return // Exit the function if there are validation errors
    }

    // Check if a new photo file is selected
    if (e.target.photo.files.length > 0) {
      const newImageFile = e.target.photo.files[0]

      // Read the new image file as a data URL (base64)
      const reader = new FileReader()

      reader.onload = async event => {
        const base64Image = event.target.result

        // Create an employee object with the new base64 image data
        const updatedEmployeeData = {
          employeeNo: formDataEdit.employeeNo,
          name: formDataEdit.name,
          email: formDataEdit.email,
          photo: base64Image, // Store the new base64 image data
          phoneNumber: formDataEdit.phoneNumber,
          birthDate: formDataEdit.birthDate,
          _id: formDataEdit._id,
        }

        // Send the updated employee data to the server
        try {
          const response = await axios.put("/update", updatedEmployeeData)
          if (response.data.success) {
            getFeatchData(currentPage)
            alert(response.data.message)
            setEditSection(false)
            setValidationErrors({}) // Clear validation errors on successful update
          } else {
            console.error("Error updating employee:", response.data.error)
            alert("Failed to update employee.")
          }
        } catch (error) {
          console.error("Error updating employee:", error)
          alert("An error occurred while updating an employee.")
        }
      }

      // Read the selected file as a data URL (base64)
      reader.readAsDataURL(newImageFile)
    } else {
      // No new photo file selected, update employee data without changing the photo
      try {
        const response = await axios.put("/update", formDataEdit)
        if (response.data.success) {
          getFeatchData(currentPage)
          alert(response.data.message)
          setEditSection(false)
          setValidationErrors({}) // Clear validation errors on successful update
        } else {
          console.error("Error updating employee:", response.data.error)
          alert("Failed to update employee.")
        }
      } catch (error) {
        console.error("Error updating employee:", error)
        alert("An error occurred while updating an employee.")
      }
    }
  }

  const handleEditOnChange = e => {
    const { value, name } = e.target
    setFormDataEdit(preve => ({
      ...preve,
      [name]: value,
    }))
    setValidationErrors(prevErrors => ({
      ...prevErrors,
      [name]: "",
    }))
  }

  const handleEdit = el => {
    setFormDataEdit(el)
    setEditSection(true)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      getFeatchData(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      getFeatchData(currentPage + 1)
    }
  }
  const handleExport = async () => {
    try {
      const response = await axios.get("/export", { responseType: "blob" })
      const blob = new Blob([response.data], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "employees.csv"
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error exporting data:", error)
      alert("An error occurred while exporting data.")
    }
  }
  const fileInputRef = useRef(null)

  const handleFileUpload = e => {
    const selectedFile = e.target.files[0]

    if (selectedFile) {
      if (selectedFile.type !== "text/csv") {
        alert("Please select a CSV file.")
        return
      }
      const maxSizeBytes = 15 * 1024 * 1024
      if (selectedFile.size > maxSizeBytes) {
        alert("File size exceeds the maximum allowed (15 MB).")
        return
      }
      uploadFile(selectedFile)
    }
  }

  const handleImportClick = () => {
    fileInputRef.current.click()
  }

  const uploadFile = async file => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    } catch (error) {
      console.error("Error uploading CSV file:", error)
      alert("An error occurred while uploading the CSV file.")
    }
  }
  return (
    <>
      <div className="container">
        <button className="btn btn-add" onClick={() => setAddSection(true)}>
          Add
        </button>
        <button className="btn btn-export" onClick={handleExport}>
          Export
        </button>

        <input
          type="file"
          style={{ display: "none" }}
          onChange={handleFileUpload}
          ref={fileInputRef}
        />
        <button className="btn btn-import" onClick={handleImportClick}>
          Import
        </button>

        {addSection && (
          <FormTable
            handleSubmit={handleSubmit}
            handleOnChange={handleOnChange}
            handleClose={() => {
              resetForm()
              setAddSection(false)
            }}
            rest={formData}
            validationErrors={validationErrors}
          />
        )}
        {editSection && (
          <FormTable
            handleSubmit={handleUpdate}
            handleOnChange={handleEditOnChange}
            handleClose={() => {
              resetForm()
              setEditSection(false)
            }}
            rest={formDataEdit}
            validationErrors={validationErrors}
          />
        )}

        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>Employee NO</th>
                <th>Name</th>
                <th>Email</th>
                <th>Photo</th>
                <th>Mobile</th>
                <th>Date of Birth</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {dataList[0] ? (
                dataList.map((el, index) => {
                  return (
                    <tr key={index}>
                      <td>{el.employeeNo}</td>
                      <td>{el.name}</td>
                      <td>{el.email}</td>
                      <td>
                        <img
                          src={el.photo}
                          alt={el.name}
                          style={{
                            maxWidth: "75px",
                            maxHeight: "75px",
                            display: "block",
                            margin: "0 auto",
                          }}
                        />
                        <a
                          href={el.photo}
                          download={`${el.name}_photo.jpg`}
                          style={{
                            textDecoration: "none",

                            cursor: "pointer",
                            border: "1px solid #018c5e",
                            backgroundColor: "#018c5e",
                            color: "#fff",
                          }}
                        >
                          download
                        </a>
                      </td>
                      <td>{el.phoneNumber}</td>
                      <td>{el.birthDate}</td>
                      <td>
                        <button
                          className="btn btn-edit"
                          onClick={() => handleEdit(el)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(el._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td>
                    <div>
                      <p style={{ textAlign: "center" }}>NO DATA</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button
              className=" prev-button"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <span>&#8249;</span> Prev
            </button>
            <span className="pageno">{currentPage}</span>
            <button
              className=" next-button"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next <span>&#8250;</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
