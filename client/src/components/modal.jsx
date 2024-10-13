import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Container, Row, Col, Card, ProgressBar, Spinner, Alert } from 'react-bootstrap';
import SustainabilityChart from './SustainibilityChart';
import "./modal.css"
function CompanyInfoModal({ show, onHide, company, loading, error }) {
  const [environmentalScore, setEnvironmentalScore] = useState(50);
  const [socialScore, setSocialScore] = useState(50);
  const [governanceScore, setGovernanceScore] = useState(50);

  useEffect(() => {
    // Only update if company and its env_scores are defined
    console.log(company)
    if (company && company.env_score) {
      setEnvironmentalScore(company.env_score[0]);
      setSocialScore(company.env_score[1] || 0);
      setGovernanceScore(company.env_score[2] || 0);
    }
  }, [company]); // Trigger effect when `company` changes

  if (loading) {
    return (
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        centered
      >
        <Modal.Body className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Modal.Body>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        centered
        dialogClassName="custom-modal-width" // Add this line to assign a custom class
      >
        <Modal.Body>
          <Alert variant="danger">{error}</Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  if (!company) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {company.name} Overview
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Company Name: {company.name}</Card.Title>
                  <Card.Text>
                    Industry: {company.industry}
                    <br />
                    Location: {company.location || 'Unknown'}
                    <br />
                    Summary of impact:
                    <br/> {company.summary}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <h5>Environmental Risk Score</h5>
              <ProgressBar variant="success" now={(environmentalScore/30)*100} label={`${environmentalScore}`} />
            </Col>

          </Row>

          <Row className="mt-4">
            <Col>
              <h5>Performance Graph</h5>
              <div style={{ height: '300px', backgroundColor: '#f5f5f5', textAlign: 'center', lineHeight: '300px' }}>
              <SustainabilityChart selectedCompany={company.name}/>

              </div>
            </Col>
          </Row>

        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CompanyInfoModal;
