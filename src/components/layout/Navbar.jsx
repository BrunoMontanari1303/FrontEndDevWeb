import { Navbar, Nav, Container } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import LogoutButton from './LogoutButton'

export default function AppNavbar({ onToggleSidebar }) {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand onClick={onToggleSidebar} role="button">☰ TMS</Navbar.Brand>
        <Nav className="ms-auto">        
          <Nav.Link as={NavLink} to="/shipments">Pedidos</Nav.Link>
          <Nav.Link as={NavLink} to="/loads">Cargas</Nav.Link>
          <Nav.Link as={NavLink} to="/billing">Faturamento</Nav.Link>
          <Nav.Link as={NavLink} to="/">Dashboard</Nav.Link>         
          <Nav.Link as={NavLink} to="#" onClick={(e) => e.preventDefault()}>
            <LogoutButton />
          </Nav.Link>         
        </Nav>
      </Container>
    </Navbar>
  )
}
