<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import Header from './header';
import CompanyInfoModal from './modal';
import axios from 'axios';  // Import Axios for making API calls
=======
// src/components/CompanyInfoModal.jsx
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';
>>>>>>> 006dadf27cc4dcc1371ce98b3ea2902715bd0587

export default function EsgPage({ category, title }) {
  const [companies, setCompanies] = useState([]);
  const [rankedCompanies, setRankedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null); // Track selected company

  // Fetch companies from the backend when the component mounts
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      try {
        // Fetch companies from your backend
        const response = await axios.get('/api/companies');  // Adjust this URL to match your backend endpoint
        const fetchedCompanies = response.data.map((company) => ({
          ...company,
          score: company.env_score,  // Assuming you're using the environmental score (adjust this if necessary)
        }));

        // Set the companies and sort them by score
        setCompanies(fetchedCompanies);
        setRankedCompanies([...fetchedCompanies].sort((a, b) => b.score - a.score));
      } catch (error) {
        console.error('Error fetching companies:', error);
      }

      setLoading(false);
    }

    fetchData();
  }, [category]);

  // Fetch company by name and open the modal
  const handleCardClick = async (company) => {
    console.log('Card clicked:', company.name);  // Debugging to check if the card was clicked
  
    try {
      const response = await fetch(`/api/company/name/${company.name}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch company details for ${company.name}: ${response.statusText}`);
      }
  
      const data = await response.json();  // Convert the response to JSON
      console.log('Company data fetched:', data);  // Debugging to check the fetched data
  
      setSelectedCompany(data);  // Set the selected company data
      setModalShow(true);  // Show the modal
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
  };
  

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <div>
      <Header />
      <Container className="py-5">
        <h2 className="mb-4">{title} Page</h2>
        <p>Welcome to the {title} page! Here you can find information about companies' {title.toLowerCase()} performance.</p>

        {/* Cards Section */}
        <Row className="mb-5">
          {companies.slice(0, 3).map((company, index) => (
            <Col key={index} md={4} className="mb-4">
              {/* Pass the full company object to handleCardClick */}
              <Card onClick={() => handleCardClick(company)} style={{ cursor: 'pointer' }}>
                <Card.Body>
                  <Card.Title>{company.name}</Card.Title>
                  <Card.Text>{company.description}</Card.Text>
                  <Button variant="primary">Score: {company.score}</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

<<<<<<< HEAD
        {/* Modal */}
        <CompanyInfoModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          company={selectedCompany} // Pass the selected company data
        />

        {/* Ranked List Section */}
        <div>
          <h2 className="mb-4">Companies Ranked by {title} Score</h2>
          <ul className="list-group">
            {rankedCompanies.map((company, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                {company.name}
                <span className="badge bg-primary rounded-pill">{company.score}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
=======
          <Row>
            <Col>
              <h5>Environmental Score</h5>
              <ProgressBar 
                variant="success" 
                now={recentESG.environmental_score} 
                label={`${recentESG.environmental_score}%`} 
              />
            </Col>
            <Col>
              <h5>Social Score</h5>
              <ProgressBar 
                variant="info" 
                now={recentESG.social_score} 
                label={`${recentESG.social_score}%`} 
              />
            </Col>
            <Col>
              <h5>Governance Score</h5>
              <ProgressBar 
                variant="warning" 
                now={recentESG.governance_score} 
                label={`${recentESG.governance_score}%`} 
              />
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <h5>Performance Graph</h5>
              <div 
                style={{ 
                  height: '300px', 
                  backgroundColor: '#f5f5f5', 
                  textAlign: 'center', 
                  lineHeight: '300px' 
                }}
              >
                <strong>[Graph Placeholder]</strong>
              </div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
>>>>>>> 006dadf27cc4dcc1371ce98b3ea2902715bd0587
  );
}
