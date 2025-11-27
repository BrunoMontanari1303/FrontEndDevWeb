import React, { useState } from 'react'
import { Container, Row, Col, Card, Form } from 'react-bootstrap'
import ShipmentsList from '../features/shipments/ShipmentsList'

export default function ShipmentsAccepted() {
  const [search, setSearch] = useState('')

  return (
    <Container fluid className="py-3">
      <Row>
        <Col md={12} className="mb-4">
          <Card>
            <Card.Body>
              <Form>
                <Form.Group controlId="searchAccepted">
                  <Form.Label>Buscar Pedido Aceito</Form.Label>
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
              <Card.Title>Pedidos Aceitos</Card.Title>
              {/* 👉 aqui SIM usamos filterStatus */}
              <ShipmentsList search={search} filterStatus="Aceito" />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}