import React from "react"
import "../App.css"
import { MdClose } from "react-icons/md"

function FormTable({
  handleSubmit,
  handleOnChange,
  handleClose,
  rest,
  validationErrors,
}) {
  return (
    <div className="addContainer">
      <form
        className="employee-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <div className="close-btn" onClick={handleClose}>
          <MdClose />
        </div>
        <label>
          Employee No:
          <input
            type="text"
            name="employeeNo"
            autocomplete="off"
            onChange={handleOnChange}
            value={rest.employeeNo}
          />
          {validationErrors.employeeNo && (
            <span className="error">{validationErrors.employeeNo}</span>
          )}
        </label>

        <label>
          Name:
          <input
            type="text"
            name="name"
            autocomplete="off"
            onChange={handleOnChange}
            value={rest.name}
          />
          {validationErrors.name && (
            <span className="error">{validationErrors.name}</span>
          )}
        </label>
        <label>
          Email:
          <input
            type="text"
            name="email"
            autocomplete="off"
            onChange={handleOnChange}
            value={rest.email}
          />
          {validationErrors.email && (
            <span className="error">{validationErrors.email}</span>
          )}
        </label>
        <label className="file-upload-label">
          Photo:
          <input
            type="file"
            name="photo"
            className="file-input"
            id="photo"
            accept="image/*"
            onChange={handleOnChange}
          />
          {validationErrors.photo && (
            <span className="error">{validationErrors.photo}</span>
          )}
        </label>
        <label>
          Phone Number:
          <input
            type="tel"
            name="phoneNumber"
            autocomplete="off"
            onChange={handleOnChange}
            value={rest.phoneNumber}
          />
          {validationErrors.phoneNumber && (
            <span className="error">{validationErrors.phoneNumber}</span>
          )}
        </label>
        <label>
          Birth Date:
          <input
            type="date"
            name="birthDate"
            onChange={handleOnChange}
            value={rest.birthDate}
          />
          {validationErrors.birthDate && (
            <span className="error">{validationErrors.birthDate}</span>
          )}
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default FormTable
