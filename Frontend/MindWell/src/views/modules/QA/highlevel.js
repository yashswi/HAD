import React, { Fragment, useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom'
import { Col, Row, Card, Form, FormControl, Button } from "react-bootstrap";
import axiosInstance from '../../../axiosInstance';
const HighLevel = () => {
  // State to hold the search query

  const [searchQuery, setSearchQuery] = React.useState("");

  const [questions, setQuestions] = React.useState([{
    id: 0,
    QuestionText: ""
  }]);

  const [addedQuestion, setAddedQuestion] = React.useState({
    uid: "",
    question_text: "",
    tags: "Medical"
  });

  const navigate = useNavigate();

  useEffect(() => {

    const checkEligiblity = async () => {
      const accessToken = localStorage.getItem('access_token');
      const userid = localStorage.getItem('id');
      setAddedQuestion({ ...addedQuestion, uid: userid });

      if (accessToken === null) {
        navigate('/sign-in');
      }
    }

    const fetchQuestions = async () => {
      const accessToken = localStorage.getItem('access_token');

      try {

        const headers = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${accessToken}`,
        };

        axiosInstance.get('/qaresponse/allQuestions', { headers: headers }).then((response) => {
          console.log("Admins: ", response.data);
          setQuestions(response.data);
        });

      }
      catch (error) {
        console.error('Error fetching data:', error);
      }

    }
    if (checkEligiblity())
      fetchQuestions();
  }, [navigator]);


  // Function to handle search query change
  const handleSearchChange1 = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to handle search form submission
  const handleSearchSubmit1 = (event) => {
    event.preventDefault();
    // Perform search logic here
    console.log("Search Query:", searchQuery);
  };

  const handleSearchChange2 = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to handle search form submission
  const handleSearchSubmit2 = (event) => {
    event.preventDefault();
    // Perform search logic here
    console.log("Search Query:", searchQuery);
  };

  const handleSearchSubmit3 = (event) => {
    event.preventDefault();
    // Perform search logic here
    console.log("Search Query:", searchQuery);
  };

  const handleOnChangeAddQuestion = (event) => {
    event.preventDefault();

    setAddedQuestion({
      ...addedQuestion,
      question_text: event.target.value,

    });
    console.log("Added Question: ", addedQuestion);
  };


  const handleAddQuestionSubmit = (event) => {
    event.preventDefault();
    const accessToken = localStorage.getItem('access_token');
    try {

      const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${accessToken}`,
      };


      axiosInstance.post('/qaresponse/addquestion', addedQuestion, { headers: headers }).then((response) => {
        console.log("Status", response.data);
        axiosInstance.get('/qaresponse/allQuestions', { headers: headers }).then((response) => {
          console.log("Admins: ", response.data);
          setQuestions(response.data);
        });
      });


    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  return (
    <Fragment>
      {/* Search Bar Section */}
      <div>
        <Row className="justify-content-end mb-3">
          <Form className="d-flex" onSubmit={handleSearchSubmit1}>
            <FormControl
              type="search"
              placeholder="Search your favourite blogs"
              className="me-2 "
              aria-label="Search"
              onChange={handleSearchChange1}
            />
            <Button variant="primary" className="me-1 rounded-pill" type="submit">
              Search
            </Button>
          </Form>
        </Row>
        <Row className="justify-content-end mb-3">
          <Form className="d-flex" onSubmit={handleAddQuestionSubmit}>
            <FormControl
              type="text"
              placeholder="Add a question"
              className="me-2 "
              aria-label="Question"
              onChange={handleOnChangeAddQuestion}
            />
            <Button variant="primary" className="me-1 rounded-pill" type="submit">
              Add
            </Button>
          </Form>
        </Row>
        <br></br>
        <h4>Relevant Questions</h4>
        {/* Map over the questions array */}
        {questions.map((question, index) => (
          <div key={index}>
            <Link to={`/home/answers/${question.id}`}>
              <Card className="iq-mb-2" style={{ borderRadius: "10px" }}>
                <Card.Body>
                  <Card.Text>
                    {index + 1}. {question.QuestionText}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Link>
            {/* Add spacing between cards */}
            {index !== questions.length - 1 && <div style={{ marginBottom: "8px" }} />}
          </div>
        ))}
      </div>
      <Row className="justify-content-center">
        <Col xs="auto">
          <Button
            variant="primary"
            className="me-1 mb-3"
            type="submit"
            onClick={handleSearchSubmit3}
            style={{ borderRadius: "100px", marginTop: "5px" }}
          >
            See more questions
          </Button>
        </Col>
      </Row>
    </Fragment>
  );
};

export default HighLevel;
