import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, ProgressBar, Spinner } from 'react-bootstrap';
import Header from '../components/header'; // Ensure correct path and casing
import CompanyInfoModal from '../components/AddCompanyModal'; // Ensure correct path and casing
import './portfolio.css';
import ScoreRing from '../components/scoreRing'; // Import the ScoreRing component
import { useNavigate } from 'react-router-dom';

// Function to determine progress bar variant
function getProgressVariant(score) {
  if (score >= 80) return 'danger';      // Green
  if (score >= 60) return 'warning';      // Orange
  return 'success';                        // Red
}

export default function Portfolio() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true); // Show spinner while fetching data
  const [modalShow, setModalShow] = useState(false);
  const [userID] = useState('1'); // Hardcode userID to 1
  const [sustainabilityScore, setSustainabilityScore] = useState(0); // Sustainability score for the progress bar
  const navigate = useNavigate();

  // Fetch companies associated with the user (hardcoded userID = 1)
  useEffect(() => {
    const fetchSustainabilityScore = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${userID}/profile`);
        if (!response.ok) {
          throw new Error('Failed to fetch sustainability score');
        }

        const data = await response.json();
        setSustainabilityScore(data.personalized_sustainability_score);
      } catch (error) {
        console.error('Error fetching sustainability score:', error);
      }
    };

    fetchSustainabilityScore();
  }, [userID]); // Fetch the score once the component mounts

  useEffect(() => {
    const fetchUserCompanies = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${userID}/companies`);
        if (!response.ok) {
          throw new Error('Failed to fetch user companies');
        }

        const fetchedCompanies = await response.json();
        console.log("Fetched Companies:", fetchedCompanies);

        setCompanies(fetchedCompanies);
        setLoading(false); // Stop loading once data is fetched

      } catch (error) {
        console.error('Error fetching user companies:', error);
        setLoading(false);
      }
    };

    fetchUserCompanies();
  }, [userID]);

  const handleImproveScoreClick = async () => {
    console.log("Button clicked!");

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/companies');
      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }

      const companies = await response.json();
      console.log("Companies fetched:", companies);

      const sortedCompanies = companies.sort(
        (a, b) => b.env_score[0] - a.env_score[0]
      );
      console.log("Sorted companies:", sortedCompanies);

      setLoading(false);
      navigate('/improve-score', { state: { companies: sortedCompanies } });
    } catch (error) {
      console.error('Error fetching companies:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <Container className="py-5">

        {/* Portfolio Overview */}
        <Card className="text-center mb-5" id='longCard'>
          <Card.Header>
            Welcome to the Portfolio page! Here you can track the sustainability of the companies you are invested in.
          </Card.Header>
          <Card.Body>
            <Card.Title>Portfolio Overview</Card.Title>
            <Card.Text>Your Portfolio is Highly Sustainable!</Card.Text>
            <ProgressBar now={sustainabilityScore} variant={getProgressVariant(sustainabilityScore)} />
            <br /><br />
            <Button variant="primary" onClick={handleImproveScoreClick}>
              {loading ? <Spinner animation="border" size="sm" /> : "Improve your score"}
            </Button>
          </Card.Body>
          <Card.Footer className="text-muted"></Card.Footer>
        </Card>

        {/* Company Cards */}
        {loading ? (
          <Spinner animation="border" variant="primary" />
        ) : (
          <Row className="mb-5">
            {companies.map((company, index) => (
              <Col key={index} md={4} className="mb-4">
                <Card className="h-100">
                  <Card.Img variant="top" src={company.logo_url} alt={`${company.name} logo`} />
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                      <Card.Title>{company.name}</Card.Title>
                      <Card.Text>{company.industry}</Card.Text>
                      <Card.Text>Environmental Score: {company.env_score[0]}</Card.Text>
                    </div>
                    <div className="mt-3">
                      <ScoreRing percentage={company.env_score[0]} />
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {/* Add Company Section */}
        <div className='addCompanyContainer d-flex align-items-center'>
          <h3 className="me-3">Add a Company to your Portfolio</h3>
          <Button className='addButton' onClick={() => setModalShow(true)}>+</Button>
        </div>
      </Container>

      {/* Add Company Modal */}
      <CompanyInfoModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        userID={userID}
        onAddSuccess={(newCompanies) => setCompanies([...companies, ...newCompanies])} // Update companies when new ones are added
      />
    </div>
  );
}
