import React, { Fragment, useState, useEffect } from "react";
import { Col, Row, Card, Button, Image, Form, FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faFlag } from "@fortawesome/free-solid-svg-icons";
import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from 'react-router-dom';
import { use } from "echarts";
import axiosInstance from '../../../axiosInstance';

const LowLevel = () => {
  // Array to store answers and their like counts along with the user who answered
  let { qid } = useParams();

  const navigate = useNavigate();
  const [question, setQuestion] = useState({
    question_text: "",
    posted_by: "",
    date_time: ""
  });

  const [postAnswer, setPostAnswer] = useState(
    { 
      q_id:"",
      uid: "",
      answers_text: ""
    }
  );

  const [answers, setAnswers] = useState([{
    answer_id: 0,
    answer_posted_by: "",
    answers_text: "",
    Date: "",
    flag: 0,
    upvote: 0
  }]);
  useEffect(() => {

    const checkEligiblity = async () => {
      const accessToken = localStorage.getItem('access_token');
      const userid = localStorage.getItem('id');

      if (accessToken === null) {
        navigate('/sign-in');
      }
    }

    const fetchQuestion = async () => {
      const accessToken = localStorage.getItem('access_token');

      try {

        const headers = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${accessToken}`,
        };

        axiosInstance.get(`/qaresponse/getQuestion/${qid}`, { headers: headers }).then((response) => {
          console.log("Admins: ", response.data);
          setQuestion(response.data);
        });

      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    const fetchAnswers = async () => {
      const accessToken = localStorage.getItem('access_token');

      try {

        const headers = {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${accessToken}`,
        };

        axiosInstance.get(`/qaresponse/responses/${qid}`, { headers: headers }).then((response) => {
          console.log("Admins: ", response.data);
          setAnswers(response.data);
        });

      }
      catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    checkEligiblity();
    fetchQuestion();
    fetchAnswers();
  }, [navigate]);


  // Function to handle liking an answer
  const handleLike = (index) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index].likes += 1;
    setAnswers(updatedAnswers);
  };

  const handleOnChangeAddAnswer = (event) => {
    event.preventDefault();
    setPostAnswer({
      q_id: qid,
      uid: localStorage.getItem('id'),
      answers_text: event.target.value
    });
  }

  const handleAddQuestionSubmit = (event) => {
    event.preventDefault();
    const accessToken = localStorage.getItem('access_token');

    try {
      const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${accessToken}`,
      };

      axiosInstance.post('/qaresponse/postresponse', postAnswer, { headers: headers }).then((response) => {
        console.log("Admins: ", response.data);
        axiosInstance.get(`/qaresponse/responses/${qid}`, { headers: headers }).then((response) => {
          console.log("Admins: ", response.data);
          setAnswers(response.data);
        });
      });

    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  // Dummy user data for the question
  const questionUser = {
    name: "John Doe",
    profilePic: "https://via.placeholder.com/150", // Replace with actual profile picture URL
  };


  return (
    <Fragment>
      <div className="mb-3">
        <h4 className="mb-2">Question:</h4>
        <div className="px-3 mb-3">
          {" "}
          {/* Add padding */}
          <Card className="w-100">
            <Card.Body>
              <Card.Text as="h4">
                {question.question_text}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
      {/* Profile Picture and Name Section */}
      <div className="px-3 d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <Image
            src={questionUser.profilePic}
            roundedCircle
            className="me-2"
            width={50}
            height={50}
          />
          <p className="mb-0">{question.posted_by}</p>
        </div>
        <div>
          <p className="mb-0">Posted on: {question.date_time}</p>
        </div>
      </div>
      <br></br>
      <Row className="justify-content-end mb-3">
          <Form className="d-flex" onSubmit={handleAddQuestionSubmit}>
            <FormControl
              type="search"
              placeholder="Do You Know About it? Then Post Your Suggestions Here!"
              className="me-3 "
              aria-label="Post Answer"
              onChange = {handleOnChangeAddAnswer}
            />
            <Button variant="primary" className="me-5 " type="submit">
              Post Answer
            </Button>
          </Form>
        </Row>

      {/* Answers Section */}
      <div className="mb-3">
        <h4 className="mb-2">Answers:</h4>
        <div className="px-3">
          {" "}
          {/* Add padding */}
          {/* Map through the answers array and render each answer with like and dislike buttons */}
          {answers.map((answer, index) => (
            <div key={index}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <p className="mb-0">Posted on: {answer.Date}</p>
                <span className="me-2">Answered by: {answer.answer_posted_by}</span>
              </div>
              <Card className="iq-mb-3" style={{ borderRadius: "10px" }}>
                <Card.Body>
                  <Card.Text>{answer.answers_text}</Card.Text>
                </Card.Body>
              </Card>
              {/* Like and Dislike Buttons */}

              <div className="d-flex justify-content-end px-3 align-items-center">
                <Button variant="primary" className="me-1 mb-3">
                  <FontAwesomeIcon icon={faFlag} className="me-1" />
                  Flag Answer
                </Button>
                <Button variant="primary" className="me-1 mb-3">
                  <FontAwesomeIcon icon={faThumbsUp} className="me-1" />
                  Upvote
                </Button>

                {/* Like count */}
                <span className="ms-2">Upvotes: {answer.upvote}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fragment>
  );
};

export default LowLevel;
