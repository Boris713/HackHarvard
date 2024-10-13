// src/components/Portfolio.jsx
import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import Header from '../components/header'; // Assuming the Header is located in this path
import './portfolio.css';
import ScoreRing from '../components/scoreRing'; // Import the ScoreRing component

// Sample data for the cards and ranked list
const companies = [
  { name: "Company 1", score: 95, description: "Focused on reducing emissions and renewable energy adoption." },
  { name: "Company 2", score: 65, description: "Investing in sustainable agriculture and clean energy." },
  { name: "Company 3", score: 23, description: "Committed to reducing plastic waste and improving recycling processes." },
];
import ProgressBar from 'react-bootstrap/ProgressBar';
function getProgressVariant(score) {
    if (score >= 80) return 'success';      // Green
    if (score >= 60) return 'warning';      // Orange
    return 'danger';                        // Red
  }

export default function Portfolio() {
  return (
    <div>
      <Header />
      <Container className="py-5">

        {/* Cards Section */}
        <Card className="text-center mb-5" id='longCard'>
          <Card.Header>
            Welcome to the Portfolio page! Here you can track the sustainability of the companies you are invested in.
          </Card.Header>
          <Card.Body>
            <Card.Title>Portfolio Overview</Card.Title>
            <Card.Text>
              Your Portfolio is Highly Sustainable!
            </Card.Text>
            <ProgressBar                       now={80} 
                      variant={getProgressVariant(80)}
                      ></ProgressBar>
                      <br></br>
            <Button variant="primary">Improve your score</Button>
          </Card.Body>
          <Card.Footer className="text-muted"></Card.Footer>
        </Card>

        <Row className="mb-5">
          {companies.map((company, index) => (
            <Col key={index} md={4} className="mb-4">
              <Card className="h-100">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title>{company.name}</Card.Title>
                    <Card.Text>{company.description}</Card.Text>
                  </div>
                  <div className="mt-3">
                    <ScoreRing percentage={company.score} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Ranked List Section */}
        <div className='addCompanyContainer d-flex align-items-center'>
          <h3 className="me-3">Add a Company to your Portfolio</h3>
          <Button className='addButton'>+</Button>
        </div>
      </Container>
    </div>
  );
}
