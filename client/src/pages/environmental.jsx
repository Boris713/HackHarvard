import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import Header from '../components/header'; // Assuming the Header is located in this path

// Sample data for the cards and ranked list
const companies = [
  { name: "Company 1", score: 95, description: "Focused on reducing emissions and renewable energy adoption." },
  { name: "Company 2", score: 88, description: "Investing in sustainable agriculture and clean energy." },
  { name: "Company 3", score: 78, description: "Committed to reducing plastic waste and improving recycling processes." },
];

const rankedCompanies = [
  { name: "GreenTech", score: 99 },
  { name: "EcoWorld", score: 92 },
  { name: "CleanPower", score: 85 },
  { name: "NatureFirst", score: 80 },
  { name: "PlanetSafe", score: 75 },
];

export default function Environmental() {
  return (
    <div>
      <Header />
      <Container className="py-5">
        <h2 className="mb-4">Environmental Page</h2>
        <p>
          Welcome to the Environmental page! Here you can find information about companies' environmental performance.
        </p>

        {/* Cards Section */}
        <Row className="mb-5">
          {companies.map((company, index) => (
            <Col key={index} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{company.name}</Card.Title>
                  <Card.Text>{company.description}</Card.Text>
                  <Button variant="primary">Score: {company.score}</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Ranked List Section */}
        <div>
          <h2 className="mb-4">Companies Ranked by Environmental Score</h2>
          <ul className="list-group">
            {rankedCompanies
              .sort((a, b) => b.score - a.score)
              .map((company, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                  {company.name}
                  <span className="badge bg-primary rounded-pill">{company.score}</span>
                </li>
              ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}
