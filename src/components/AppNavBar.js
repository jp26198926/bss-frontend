import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FaHammer } from 'react-icons/fa';

const AppNavBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector(state => state.currentUser);
    const settings = useSelector(state => state.settings);

    const triggerLogin = () => {
        dispatch({ type: 'SHOW_LOGIN', payload: true });
    }

    const triggerLogout = () => {
        navigate('/');
        dispatch({ type: 'LOGOUT' });
    }

    return (
        <>
            <Navbar collapseOnSelect  expand="lg" bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <FaHammer className="me-1" />
                        <span className="d-sm-none">BS System</span> {/* display on smaller viewport */}
                        <span className="d-none d-sm-inline-block">{settings?.appName}</span> {/* display on wider viewport */}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to={`/Knowledgebase`}>Knowledgebase</Nav.Link>
                            {
                                Object.entries(currentUser).length > 0 
                                    ? //if true
                                    (
                                        currentUser.role.pages.map(page => {
                                            return (
                                                <Nav.Link
                                                    as={Link}
                                                    to={`/${page.page}`}
                                                    key={page.page}
                                                >{page.page}</Nav.Link>
                                            )
                                        })
                                    )
                                    : //else
                                    (null)
                            }                            
                        </Nav>

                        <Nav className="ms-auto">                            
                            {
                                Object.entries(currentUser).length > 0 
                                    ? //if true
                                    (
                                        <NavDropdown title={`Hello! ${currentUser?.name}`} id="collasible-nav-dropdown">
                                            {/* <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
                                            <NavDropdown.Item href="#action/3.2">Change Password</NavDropdown.Item>
                                            <NavDropdown.Divider /> */}
                                            <NavDropdown.Item onClick={triggerLogout}>Logout</NavDropdown.Item>
                                        </NavDropdown>
                                    )
                                    : //else
                                    (
                                        <Nav.Link onClick={triggerLogin}>Login</Nav.Link>
                                    ) 
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar> 
        </>
    )
}

export default AppNavBar
