// src/components/AddCompanyModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, ListGroup, Spinner, Alert } from 'react-bootstrap';

export default function AddCompanyModal({ show, onHide, userID, onAddSuccess }) {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all companies when the modal is shown
  useEffect(() => {
    if (show) {
      fetchCompanies();
    }
  }, [show]);

  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/companies'); // Adjust the endpoint if necessary
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to load companies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (companyName) => {
    setSelectedCompanies((prevSelected) => {
      if (prevSelected.includes(companyName)) {
        return prevSelected.filter((name) => name !== companyName);
      } else {
        return [...prevSelected, companyName];
      }
    });
  };

  const handleAddCompanies = async () => {
    if (selectedCompanies.length === 0) {
      setError('Please select at least one company to add.');
      return;
    }

    setAdding(true);
    setError(null);
    try {
      // Send a separate request for each selected company
      const addPromises = selectedCompanies.map((companyName) =>
        fetch('http://localhost:5000/api/addCompany', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userID, companyName }),
        }).then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to add ${companyName}`);
          }
          return res.json();
        })
      );

      await Promise.all(addPromises);

      // Notify parent component of successful addition
      onAddSuccess(selectedCompanies);

      // Reset selection and close modal
      setSelectedCompanies([]);
      onHide();
    } catch (err) {
      console.error('Error adding companies:', err);
      setError('Failed to add selected companies. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const isCompanySelected = (companyName) => selectedCompanies.includes(companyName);

  return (
    <Modal show={show} onHide={onHide} size="lg" aria-labelledby="add-company-modal" centered>
      <Modal.Header closeButton>
        <Modal.Title id="add-company-modal">Add Companies to Your Portfolio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : (
          <ListGroup>
            {companies.map((company) => (
              <ListGroup.Item key={company.name} className="d-flex align-items-center">
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={isCompanySelected(company.name)}
                  onChange={() => handleSelect(company.name)}
                  id={`checkbox-${company.name}`}
                />
                <label htmlFor={`checkbox-${company.name}`} className="form-check-label">
                  {company.name} - {company.industry}
                </label>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={adding}>
          Close
        </Button>
        <Button variant="primary" onClick={handleAddCompanies} disabled={adding || loading}>
          {adding ? 'Adding...' : 'Add Selected Companies'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}