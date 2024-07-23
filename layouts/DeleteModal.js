import React, { useState, useEffect } from "react";

const DeleteModal = ({ isOpen, onClose, onDelete, itemType, itemId }) => {
  const [enteredCode, setEnteredCode] = useState("");
  const [expectedCode, setExpectedCode] = useState(generateRandomCode());

  useEffect(() => {
    setExpectedCode(generateRandomCode());
    setEnteredCode(""); // Reset enteredCode when a new code is generated
  }, [isOpen]);

  function generateRandomCode() {
    return Math.floor(Math.random() * 9000) + 1000; // Generates a random 4-digit number
  }

  const handleInputChange = (e) => {
    setEnteredCode(e.target.value);
  };

  const isValidCode = parseInt(enteredCode, 10) === expectedCode;

  return (
    <>
      <div className={`${isOpen ? "delete-modal" : "delete_modal_hidden"}`}>
        <div className="delete_modal_content">
          <h2 className="delete_title">Delete Confirmation</h2>
          <p>
            Are you sure you want to delete this <b>{itemType}</b> with ID{" "}
            <b>{itemId}</b> ?
          </p>
          <p>
            Enter the <b>{expectedCode}</b> for delete this item {itemType}

          </p>
          <div>
            <input
              type="text"
              placeholder="Enter code"
              value={enteredCode}
              onChange={handleInputChange}
              style={{
                color: isValidCode ? "black" : "red",
                border: "1px solid #999999",
                padding: "10px",
                width: "100%",
              }}
              className="delete_input"
            />
            <div>
              <button id="close-modal" onClick={onClose}>
                <i className="fa-solid fa-xmark"></i>
              </button>
              <button
                onClick={onDelete}
                id="delete-button"
                disabled={!isValidCode}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
