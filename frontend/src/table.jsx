/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from "xlsx"; 
import { useNavigate } from 'react-router-dom';
import './list.css';

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:8084/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    navigate('/create-account', { state: user });
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:8084/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };



  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(users); 
    const workbook = XLSX.utils.book_new(); 
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users'); 
    XLSX.writeFile(workbook, 'users.xlsx'); 
  };


  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("User List", 10, 10);
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    const tableColumn = ["Username", "Email", "Password"];
    const tableRows = users.map(user => [user.username, user.email, user.password]);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save("users.pdf");
  };

  const [emailData, setEmailData] = useState({
    to: "",
    subject: "",
    message: "",
  }); 
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("to", emailData.to);
    formData.append("subject", emailData.subject);
    formData.append("message", emailData.message);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await fetch("http://localhost:8084/send-email", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      alert(result.message);
      setShowEmailPopup(false);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email");
    }
  };

  return (
    <div className="container">
      <h2 className="heading">User List</h2>
      {error && <p className="error-message">{error}</p>}
      <table className="data-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.password}</td>
              <td className="action-column">
                <button className="action-button edit" onClick={() => handleEdit(user)}>Edit</button>
                <button className="action-button delete" onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleDownloadPDF}>Download PDF</button>
      <button onClick={handleDownloadExcel}>Download Excel</button> 
      <button onClick={() => setShowEmailPopup(true)}>Send Email</button>

      {showEmailPopup && (
        <div className="email-popup">
          <div className="email-popup-content">
            <span className="close" onClick={() => setShowEmailPopup(false)}>&times;</span>
            <h2>Send Email</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="to"
                placeholder="Recipient Email"
                value={emailData.to}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={emailData.subject}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Message"
                value={emailData.message}
                onChange={handleChange}
                required
              ></textarea>
              <input type="file" onChange={handleFileChange} />
              <button type="submit">Send Email</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;
