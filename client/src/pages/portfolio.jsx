import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import Header from '../components/header'; // Assuming the Header is located in this path
import './portfolio.css'
// Sample data for the cards and ranked list
const companies = [
  { name: "Company 1", score: 95, description: "Focused on reducing emissions and renewable energy adoption." },
  { name: "Company 2", score: 88, description: "Investing in sustainable agriculture and clean energy." },
  { name: "Company 3", score: 78, description: "Committed to reducing plastic waste and improving recycling processes." },
];



export default function Portfolio() {
  return (
    <div>
      <Header />
      <Container className="py-5">
        <h2 className="mb-4">Portfolio</h2>
 

        {/* Cards Section */}
        <Card className="text-center" id='longCard'>
      <Card.Header>          Welcome to the Portfolio page! Here you can track the sustainability of the companies you are invested in.
      </Card.Header>
      <Card.Body>
        <Card.Title>Portfolio Overview</Card.Title>
        <Card.Text>
          Your Porfolio is Highly Sustainable!
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
      <Card.Footer className="text-muted"></Card.Footer>
    </Card>
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
        <div className='addCompanyContainer'>
            <h3>Add a Company to your Portfolio</h3>
          <Button className='addButton'>+</Button>
          </div>
      </Container>
    </div>
  );
}
