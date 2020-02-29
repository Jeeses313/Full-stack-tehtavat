import React from 'react'
import Notification from './Notification'
import { Navbar, Nav, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Header = ({ user, handleLogout, toBlogList, toUserList }) => {

    return (
        <>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Brand href="" as="span">blog app</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#" as="span">
                            <Button variant="outline-info" onClick={toBlogList}>blogs</Button>
                        </Nav.Link>
                        <Nav.Link href="#" as="span">
                            <Button variant="outline-info" onClick={toUserList}>users</Button>
                        </Nav.Link>
                        <Nav.Link href="#" as="span">
                            <div><Link to={`/users/${user.id}`}>{user.username}</Link> logged in <Button variant="outline-info" onClick={handleLogout}>logout</Button></div>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Notification></Notification>
            <br />
        </>
    )
}

export default Header