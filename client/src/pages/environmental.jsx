import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import Header from '../components/header';
import ScoreRing from '../components/scoreRing'; // Assuming you have a ScoreRing component
import CompanyInfoModal from '../components/modal'; // Import the modal
import './environmental.css'; // Optional: For additional styling

export default function Environmental() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null); // State to track the selected company
  const [modalShow, setModalShow] = useState(false); // State to control the modal visibility
  const [loadingCompany, setLoadingCompany] = useState(false); // State for loading individual company data
  const [companyError, setCompanyError] = useState(null); // State for individual company errors

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/companies');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCompanies(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Failed to fetch companies.');
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleCardClick = async (companyName) => {
    setLoadingCompany(true);
    setCompanyError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/company/name/${companyName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setSelectedCompany(data); // Set the fetched company data to the selectedCompany state
      setModalShow(true); // Show the modal after fetching
      setLoadingCompany(false);
    } catch (err) {
      console.error('Error fetching company details:', err);
      setCompanyError('Failed to fetch company details.');
      setLoadingCompany(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <Container className="py-5 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <Container className="py-5">
          <Alert variant="danger">{error}</Alert>
        </Container>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div>
        <Header />
        <Container className="py-5">
          <Alert variant="info">No companies found.</Alert>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <Container className="py-5">
        <p>
          Welcome to the Explore page! Here you can find information about companies' environmental Risk scores and sustainable practices.
        </p>

        {/* Cards Section */}
        <Row className="mb-5">
          {companies.map((company, index) => (
            <Col key={index} md={4} className="mb-4">
              <Card
                className="h-100 shadow-sm"
                onClick={() => handleCardClick(company.name)} // Trigger modal on card click
                style={{ cursor: 'pointer' }} // Change cursor to indicate clickability
              >
                <Card.Img 
                  variant="top" 
                  src={'http://localhost:5173' + (company.logo_url.startsWith('.') ? company.logo_url.substring(1) : company.logo_url)} 
                  alt={`${company.name} logo`} 
                  className="imgg"
                  onError={(e) => {
                    e.target.onerror = null; // Prevents infinite loop
                    e.target.src = '../images/google_logo.png'; // Replace with your default image path
                  }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{company.name}</Card.Title>
                  <Card.Text>{company.industry}</Card.Text>
                  <div className="">
                    <ScoreRing percentage={company.env_score[0]} text="Environment Risk Asessment" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Ranked List Section */}
        <div>
          <h2 className="mb-4">Companies Ranked by Environmental Score</h2>
          <ul className="list-group">
            {companies
              .sort((a, b) => b.env_score - a.env_score)
              .map((company, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  {company.name}
                  <span className="badge bg-primary rounded-pill">{company.env_score}</span>
                </li>
              ))}
          </ul>
        </div>

        {/* Company Info Modal */}
        <CompanyInfoModal
          show={modalShow}
          onHide={() => setModalShow(false)} // Hide modal on close
          company={selectedCompany} // Pass the selected company to the modal
          loading={loadingCompany}
          error={companyError}
        />
      </Container>
    </div>
  );
}
