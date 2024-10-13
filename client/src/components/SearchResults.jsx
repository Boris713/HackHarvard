import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // To receive the companies data
import { Card, Container, Row, Col, Button, Spinner } from "react-bootstrap";

export default function SearchResults() {
  const location = useLocation();
  const initialCompanies = location.state?.companies || []; // Get the companies passed from state
  const [detailedCompanies, setDetailedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const promises = initialCompanies.map(async (company) => {
          const response = await fetch(
            `http://localhost:5000/api/company/name/${company.id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch company details");
          }
          const data = await response.json();
          return data;
        });

        const detailedData = await Promise.all(promises);
        setDetailedCompanies(detailedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching company details:", error);
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [initialCompanies]);

  if (loading) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Search Results</h2>
      <Row>
        {detailedCompanies.map((company, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={company.logo_url}
                alt={`${company.name} logo`}
              />
              <Card.Body>
                <Card.Title>{company.name}</Card.Title>
                <Card.Text>
                  Industry: {company.industry}
                  <br />
                  Environmental Score: {company.env_score[0]}
                </Card.Text>
                <Button variant="primary">More Info</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
