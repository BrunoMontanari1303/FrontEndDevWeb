import { Outlet } from 'react-router-dom'
import { useAuthStore } from '../../features/auth/useAuthStore'
import { Container, Navbar, Nav, Button } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'

export default function AppLayout() {
  const { user, clear } = useAuthStore()
  const navigate = useNavigate()
  const role = user?.papel
  const isGestor = role === 3 || role === 'GESTOR'

  const handleLogout = () => {
    clear()
    navigate('/login')
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
        <Container fluid>
          <Navbar.Brand as={Link} to="/dashboard">
            <img
              src="/logo.png"
              alt="Logix"
              width={24}
              height={24}
              className="me-2"
            />
            LOGIX
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard">
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/shipments">
                Pedidos
              </Nav.Link>
              {isGestor && (
                <Nav.Link as={Link} to="/shipments/accepted">
                  Pedidos Aceitos
                </Nav.Link>
              )}
            </Nav>

            <div className="d-flex align-items-center gap-2">
              {user && (
                <span className="text-light me-2">
                  Olá, <strong>{user.nome}</strong>
                </span>
              )}

              <Link to="/meu-perfil">
                <Button variant="outline-light" size="sm">
                  Meu perfil
                </Button>
              </Link>

              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleLogout}
              >
                Sair
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid>
        <Outlet />
      </Container>
    </>
  )
}