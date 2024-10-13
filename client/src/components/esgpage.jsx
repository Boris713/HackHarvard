import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import Header from './header'; // Assuming the Header is located in this path

// Mock Data
const mockCompanies = [
  {
    id: "1",
    name: "XYZ Corp",
    description: "A leading technology company.",
    esg_scores: [
      { year: 2023, environmental_score: 75, social_score: 65, governance_score: 80 }
    ],
  },
  {
    id: "2",
    name: "ABC Industries",
    description: "A top player in manufacturing.",
    esg_scores: [
      { year: 2023, environmental_score: 60, social_score: 70, governance_score: 85 }
    ],
  },
  {
    id: "3",
    name: "SmallBiz Inc.",
    description: "A small retail business.",
    esg_scores: [
      { year: 2023, environmental_score: 80, social_score: 55, governance_score: 90 }
    ],
  },
];

export default function EsgPage({ category, title }) {
  const [companies, setCompanies] = useState([]);
  const [rankedCompanies, setRankedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data fetching and sorting
    async function fetchData() {
      setLoading(true);

      // Fetch data from the mockCompanies array
      const fetchedCompanies = mockCompanies.map((company) => ({
        ...company,
        score: company.esg_scores[0][category], // Fetch score for the selected category
      }));

      // Set the companies and rank them by score
      setCompanies(fetchedCompanies);
      setRankedCompanies([...fetchedCompanies].sort((a, b) => b.score - a.score));
      setLoading(false);
    }

    fetchData();
  }, [category]);

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
  );
}
