import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "../actions/auth";
import { useDispatch, useSelector } from "react-redux";
import FoodService from "../services/food.service";
import Regular from "./Regular";
import Admin from "./Admin";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Authservice from "../services/auth.service";

export default function Main() {
  const [user, setUser] = useState({});
  const [showAdminPage, setShowAdminPage] = useState(false);
  const [show, setShow] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [friendEmail, setFriendEmail] = useState("");

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
  }, []);

  const dispatch = useDispatch();

  const logOut = () => {
    dispatch(logout());
  };

  const handleClose = () => setShow(false);
  const handleInviteShow = () => setShow(true);

  const handleInvite = () => {
    Authservice.invite(friendName, friendEmail)
      .then((result) => {
        console.log(result.data);
      })
      .catch((err) => {
        console.error(err);
      });

    setShow(false);
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Invite a Friend</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter friend's name"
                onChange={(e) => setFriendName(e.target.value)}
              />
              <Form.Text className="text-muted">
                Share the love of using this awesome app!
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter friend's email"
                onChange={(e) => setFriendEmail(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleInvite}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="navbar-nav me-auto ms-5">
          <div className="nav-item navbar-brand">FOOD REPO</div>
          {user.is_admin && (
            <div className="d-flex flex-row">
              <li className="nav-item">
                <a
                  href=""
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAdminPage(false);
                  }}
                >
                  HOME
                </a>
              </li>
              <li className="nav-item">
                <a
                  href=""
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAdminPage(true);
                  }}
                >
                  ADMIN PAGE
                </a>
              </li>
            </div>
          )}
        </div>
        <div className="navbar-nav ms-auto me-5">
          <li className="nav-item">
            <button
              className="btn btn-secondary me-3"
              onClick={handleInviteShow}
            >
              Invite a Friend
            </button>
          </li>
          <li className="nav-item">
            <Link to="/login" className="nav-link" onClick={logOut}>
              Log Out
            </Link>
          </li>
        </div>
      </nav>
      {showAdminPage ? <Admin /> : <Regular />}
    </div>
  );
}
