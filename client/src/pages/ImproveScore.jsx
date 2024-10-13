import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useLocation } from 'react-router-dom'; // To receive state passed from the previous page

export default function ImproveScore() {
  const location = useLocation();
  const companies = location.state?.companies || []; // Get the companies data from state

  return (
    <Container className="py-5">
      <h2 className="mb-4">Companies to Improve Your Sustainability Score</h2>
      <Row>
        {companies.map((company, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={company.logo_url} alt={`${company.name} logo`} />
              <Card.Body>
                <Card.Title>{company.name}</Card.Title>
                <Card.Text>
                  Industry: {company.industry}
                  <br />
                  Environmental Score: {company.env_score[0]}
                </Card.Text>
                <Button variant="primary">Add to Portfolio</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
