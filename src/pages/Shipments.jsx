import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap'
import ShipmentsList from '../features/shipments/ShipmentsList'
import { useAuthStore } from '../features/auth/useAuthStore'

export default function Shipments() {
  const [search, setSearch] = useState('')
  const { user } = useAuthStore()
  const role = user?.papel
  const isCliente = role === 2 || role === 'USER'

  return (
    <Container fluid className="py-3">
      <Row>
        {isCliente && (
          <Col md={12} className="mb-4">
            <Link to="/shipments/new">
              <Button variant="success">Criar Novo Pedido</Button>
            </Link>
          </Col>
        )}

        <Col md={12} className="mb-4">
          <Card>
            <Card.Body>
              <Form>
                <Form.Group controlId="search">
                  <Form.Label>Buscar Pedido</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Pesquisar por ID, origem, destino..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Lista de Pedidos</Card.Title>
              {/* 👉 sem filterStatus = todos os status */}
              <ShipmentsList search={search} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}