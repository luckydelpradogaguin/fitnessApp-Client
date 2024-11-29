import React, { useState, useEffect, useContext } from "react";
import AppNavbar from "../components/AppNavbar";
import { Container, Card, Button, Modal, Form } from "react-bootstrap";
import { UserContext } from "../context/userContext";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf();

export default function Workout() {
  const { user } = useContext(UserContext);
  const [workouts, setWorkouts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [workoutData, setWorkoutData] = useState({
    name: "",
    duration: "",
  });

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch(
          `https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        console.log("Fetched workouts:", result.workouts);
        if (response.ok && Array.isArray(result.workouts)) {
          const validWorkouts = result.workouts.filter(
            (workout) => workout && workout.name && workout.duration
          );
          setWorkouts(validWorkouts);
        } else {
          notyf.error(result.message || "Failed to fetch workouts.");
        }
      } catch (error) {
        console.error("Error fetching workouts:", error);
        notyf.error("An error occurred while fetching workouts.");
      }
    };

    fetchWorkouts();
  }, []);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleChange = (e) => {
    setWorkoutData({ ...workoutData, [e.target.name]: e.target.value });
  };

  const handleAddWorkout = async () => {
    try {
      const response = await fetch(
        `https://fitnessapp-api-ln8u.onrender.com/workouts/addWorkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...workoutData,
            userId: user ? user.id : "guest",
          }),
        }
      );

      const result = await response.json();
      console.log("Added workout:", result.workout);

      if (response.ok && result.workout) {
        notyf.success("Workout added successfully!");
        setWorkouts([...workouts, result.workout]);
      } else {
        notyf.error(result.message || "Failed to add workout.");
      }
      setWorkoutData({ name: "", duration: "" });
      handleClose();
    } catch (error) {
      console.error("Error adding workout:", error);
      notyf.error("An error occurred while adding the workout.");
    }
  };

  return (
    <>
      <AppNavbar />
      <div className="container text-center mt-5">
        <h1>Welcome to Your Workout Page</h1>
        <p>Track your exercises and progress here.</p>
        <Button className="btn btn-primary" onClick={handleShow}>
          Add Workout
        </Button>
      </div>

      <Container className="mt-4">
        <div className="row">
          {workouts.map((workout, index) => {
            if (!workout || !workout.name || !workout.duration) return null;
            return (
              <div className="col-md-4 mb-4" key={index}>
                <Card>
                  <Card.Body>
                    <Card.Title>{workout.name}</Card.Title>
                    <Card.Text>
                      Duration: {workout.duration}
                      <br />
                      Date:{" "}
                      {workout.date
                        ? new Date(workout.date).toLocaleDateString()
                        : "N/A"}
                      <br />
                      Status: {workout.status || "Pending"}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            );
          })}
        </div>
      </Container>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Workout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={workoutData.name}
                onChange={handleChange}
                placeholder="Enter workout name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                name="duration"
                value={workoutData.duration}
                onChange={handleChange}
                placeholder="Enter workout duration"
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddWorkout}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
