// src/pages/environmental.jsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import Header from '../components/header';
import ScoreRing from '../components/scoreRing'; // Assuming you have a ScoreRing component
// import './environmental.css'; // Optional: For additional styling

export default function Environmental() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {

        const response = await fetch('http://localhost:5173/api/companies'); 
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(response)
        const data = await response.json();
        console.log(data)
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
          Welcome to the Explore page! Here you can find information about companies' environmental Risk scores and sustainable practices
        </p>

        {/* Cards Section */}
        <Row className="mb-5">
          {companies.map((company, index) => (
            <Col key={index} md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img 
                  variant="top" 
                  src={company.logo_url} 
                  alt={`${company.name} logo`} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/path/to/default/logo.png'; // Replace with a default image path
                  }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{company.name}</Card.Title>
                  <Card.Text>{company.industry}</Card.Text>
                  <div className="mt-auto">
                    <ScoreRing percentage={company.env_score} text="Environmental Score" />
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
      </Container>
    </div>
  );
}
