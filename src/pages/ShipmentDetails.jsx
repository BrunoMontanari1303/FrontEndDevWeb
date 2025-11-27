import { useEffect, useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { fetchShipmentDetails } from '../features/shipments/api'

export default function ShipmentDetails() {
  const { id } = useParams()  // Obtendo o ID do pedido da URL
  const [shipment, setShipment] = useState(null)  // Estado para armazenar os dados do pedido

  useEffect(() => {
    async function loadShipmentDetails() {
      try {
        const response = await fetchShipmentDetails(id)  // Buscando os detalhes do pedido
        console.log('Detalhes do pedido:', response)  // Logando a resposta da API
        setShipment(response.data)  // Definindo os dados do pedido no estado
      } catch (error) {
        console.error('Erro ao buscar os detalhes do pedido:', error)
      }
    }

    loadShipmentDetails()
  }, [id])

  if (!shipment) return <div>Carregando...</div>  // Exibe "Carregando..." enquanto os dados estão sendo carregados

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(date).toLocaleDateString('pt-BR', options)
  }

  return (
    <Card>
      <Card.Body>
        <Card.Title>Detalhes do Pedido #{shipment.id}</Card.Title>
        <Card.Text>
          <strong>Status:</strong> {shipment.status}
        </Card.Text>
        <Card.Text>
          <strong>Origem:</strong> {shipment.origem}
        </Card.Text>
        <Card.Text>
          <strong>Destino:</strong> {shipment.destino}
        </Card.Text>
        <Card.Text>
          <strong>Tipo de Carga:</strong> {shipment.tipocarga}
        </Card.Text>
        <Card.Text>
          <strong>Data de Entrega:</strong> {formatDate(shipment.dataentrega)}  {/* Formatando a data */}
        </Card.Text>
        <Card.Text>
          <strong>Veículo ID:</strong> {shipment.veiculoid}
        </Card.Text>
        <Card.Text>
          <strong>Motorista ID:</strong> {shipment.motoristaid}
        </Card.Text>
        <Card.Text>
          <strong>Quantidade:</strong> {shipment.quantidade}
        </Card.Text>

        <Button variant="secondary" onClick={() => window.history.back()}>Voltar</Button>
      </Card.Body>
    </Card>
  )
}

async function register(req, res, next) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    const { nome, email, senha } = req.body

    // Verifica se já existe usuário com esse e-mail
    const existente = await usuarioService.buscarPorEmail(email)
    if (existente) {
      return res.status(409).json({ message: 'Já existe um usuário com esse e-mail.' })
    }

    // Cria usuário sempre com papel USER (2)
    const novoUsuario = await usuarioService.criar({
      nome,
      email,
      senha,
      papel: 2, // USER
    })

    return res.status(201).json({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      papel: papelMapOut[novoUsuario.papel] || novoUsuario.papel,
    })
  } catch (err) {
    next(err)
  }
}