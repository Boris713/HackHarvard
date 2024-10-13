// src/components/CompanyInfoModal.jsx
import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';

function CompanyInfoModal({ show, onHide, company }) {
  if (!company) return null;

  const { name, industry, location, esg_scores } = company;
  const recentESG = esg_scores[0]; // Assume we're using the most recent ESG scores

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
          {name} Overview
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>Company Name: {name}</Card.Title>
                  <Card.Text>
                    Industry: {industry}
                    <br />
                    Location: {location || 'Unknown'}
                    <br />
                    Employees: {company.employees || 'N/A'}
                    <br />
                    Market Cap: {company.marketCap || 'N/A'}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

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
  );
}

export default CompanyInfoModal;
