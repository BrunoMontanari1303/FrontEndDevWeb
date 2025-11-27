import React, { useState } from 'react'
import { Card, Form, Button, Row, Col, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { createShipment } from '../features/shipments/api'
import { useAuthStore } from '../features/auth/useAuthStore'
import toast from 'react-hot-toast'

const ShipmentsForm = () => {
  const [origem, setOrigem] = useState('')
  const [destino, setDestino] = useState('')
  const [tipoCarga, setTipoCarga] = useState('')
  const [dataEntrega, setDataEntrega] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { user } = useAuthStore()

  // Ajusta conforme você usa o papel
  const role = user?.papel
  const isCliente = role === 2 || role === 'USER'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        origem,
        destino,
        tipoCarga,
        dataEntrega,
        quantidade: Number(quantidade),
        status: 'PENDENTE', // status inicial
      }

      await createShipment(payload)
      toast.success('Pedido criado com sucesso!')
      navigate('/shipments')
    } catch (error) {
      console.error('Erro ao criar pedido:', error)
      toast.error('Erro ao criar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!isCliente) {
    return (
      <Card>
        <Card.Body>
          <Card.Title>Acesso não autorizado</Card.Title>
          <p>Somente clientes podem criar novos pedidos de transporte.</p>
        </Card.Body>
      </Card>
    )
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Novo Pedido de Transporte</Card.Title>

        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Origem</Form.Label>
                <Form.Control
                  type="text"
                  value={origem}
                  onChange={(e) => setOrigem(e.target.value)}
                  placeholder="Cidade / Unidade de origem"
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Destino</Form.Label>
                <Form.Control
                  type="text"
                  value={destino}
                  onChange={(e) => setDestino(e.target.value)}
                  placeholder="Cidade / Unidade de destino"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Tipo de carga</Form.Label>
            <Form.Control
              type="text"
              value={tipoCarga}
              onChange={(e) => setTipoCarga(e.target.value)}
              placeholder="Ex.: Paletes, granel, contêiner..."
              required
            />
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Data de entrega</Form.Label>
                <Form.Control
                  type="datetime-local"
                  value={dataEntrega}
                  onChange={(e) => setDataEntrega(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Quantidade</Form.Label>
                <Form.Control
                  type="number"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  min="1"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              className="me-2"
              onClick={() => navigate('/shipments')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Salvando...
                </>
              ) : (
                'Criar pedido'
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default ShipmentsForm
