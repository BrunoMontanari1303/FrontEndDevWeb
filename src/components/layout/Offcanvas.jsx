import { Offcanvas, Nav } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

export default function AppOffcanvas({ open, setOpen }) {
  return (
    <Offcanvas show={open} onHide={() => setOpen(false)}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Menu</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav className="flex-column gap-2">         
          <Nav.Link as={NavLink} to="/shipments" onClick={() => setOpen(false)}>Pedidos</Nav.Link>
          <Nav.Link as={NavLink} to="/tracking" onClick={() => setOpen(false)}>Tracking</Nav.Link>
          <Nav.Link as={NavLink} to="/settings" onClick={() => setOpen(false)}>Cadastros</Nav.Link>
          <Nav.Link as={NavLink} to="/" onClick={() => setOpen(false)}>Dashboard</Nav.Link>
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  )
}
