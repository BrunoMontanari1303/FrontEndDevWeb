import { Container, Navbar, Nav, Offcanvas } from 'react-bootstrap'
import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'


export default function AppLayout() {
    const [open, setOpen] = useState(false)
    return (
        <>
            <Navbar bg="light" expand="lg" className="shadow-sm">
                <Container fluid>
                    <Navbar.Brand onClick={() => setOpen(true)} role="button">☰ TMS</Navbar.Brand>
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to="/">Dashboard</Nav.Link>
                        <Nav.Link as={NavLink} to="/shipments">Pedidos</Nav.Link>
                        <Nav.Link as={NavLink} to="/loads">Cargas</Nav.Link>
                        <Nav.Link as={NavLink} to="/billing">Faturamento</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>


            <Offcanvas show={open} onHide={() => setOpen(false)}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column gap-2">
                        <Nav.Link as={NavLink} to="/" onClick={() => setOpen(false)}>Dashboard</Nav.Link>
                        <Nav.Link as={NavLink} to="/shipments" onClick={() => setOpen(false)}>Pedidos</Nav.Link>
                        <Nav.Link as={NavLink} to="/loads" onClick={() => setOpen(false)}>Planejamento</Nav.Link>
                        <Nav.Link as={NavLink} to="/tracking" onClick={() => setOpen(false)}>Tracking</Nav.Link>
                        <Nav.Link as={NavLink} to="/settings" onClick={() => setOpen(false)}>Cadastros</Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>


            <Container fluid className="py-3">
                <Outlet />
            </Container>
        </>
    )
}