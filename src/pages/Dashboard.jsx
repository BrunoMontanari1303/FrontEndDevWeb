import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

import { useAuthStore } from '../features/auth/useAuthStore'
import { fetchShipments } from '../features/shipments/api'
import { fetchVeiculos, fetchMotoristas } from '../features/reference/api'

// registra componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend)

export default function Dashboard() {
  const { user } = useAuthStore()
  const role = user?.papel
  const isGestor = role === 3 || role === 'GESTOR'
  const isAdmin = role === 1 || role === 'ADMIN'
  const canSeeFleet = isGestor || isAdmin

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalPedidos: 0,
    pendentes: 0,
    aceitos: 0,
    outros: 0,
    veiculos: 0,
    motoristas: 0,
  })
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  })

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)

        let shipmentsResult
        let veiculosArr = []
        let motoristasArr = []

        if (canSeeFleet) {
          // GESTOR / ADMIN: carrega tudo
          const [shipRes, vArr, mArr] = await Promise.all([
            fetchShipments({ page: 1, perPage: 100, sort: 'dataEntrega:ASC' }),
            fetchVeiculos({ page: 1, limit: 100 }),
            fetchMotoristas({ page: 1, limit: 100 }),
          ])
          shipmentsResult = shipRes
          veiculosArr = vArr
          motoristasArr = mArr
        } else {
          // CLIENTE: só pedidos (evita 403 nas outras rotas)
          shipmentsResult = await fetchShipments({
            page: 1,
            perPage: 100,
            sort: 'dataEntrega:ASC',
          })
        }

        // shipmentsResult vem como { data: [...] }
        const shipments = Array.isArray(shipmentsResult?.data)
          ? shipmentsResult.data
          : Array.isArray(shipmentsResult)
          ? shipmentsResult
          : []

        console.log('[DASHBOARD] Pedidos carregados:', shipments.length)

        const totalPedidos = shipments.length
        let pendentes = 0
        let aceitos = 0
        let outros = 0

        const countsByMonth = {}

        shipments.forEach((s) => {
          const status = (s.status || '').toLowerCase()

          if (status === 'pendente') pendentes++
          else if (status === 'aceito') aceitos++
          else outros++

          const dateStr =
            s.dataEntrega ||
            s.dataentrega ||
            s.dataCriacao ||
            s.datacriacao

          if (!dateStr) return

          const d = new Date(dateStr)
          if (Number.isNaN(d.getTime())) return

          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
          countsByMonth[key] = (countsByMonth[key] || 0) + 1
        })

        const sortedKeys = Object.keys(countsByMonth).sort()
        const labels = sortedKeys.map((k) => {
          const [year, month] = k.split('-')
          return `${month}/${year}`
        })
        const values = sortedKeys.map((k) => countsByMonth[k])

        setStats({
          totalPedidos,
          pendentes,
          aceitos,
          outros,
          veiculos: canSeeFleet && Array.isArray(veiculosArr) ? veiculosArr.length : 0,
          motoristas: canSeeFleet && Array.isArray(motoristasArr) ? motoristasArr.length : 0,
        })

        setChartData({
          labels,
          datasets: [
            {
              label: 'Pedidos criados',
              data: values,
              tension: 0.3,
              fill: false,
            },
          ],
        })
      } catch (error) {
        console.error('Erro ao carregar dados da dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [canSeeFleet])

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col>
          <h1 className="h4 mb-1">Dashboard</h1>
          <p className="text-muted mb-0">
            Visão geral dos pedidos de transporte no Logix.
          </p>
        </Col>
      </Row>

      {loading ? (
        <Row className="justify-content-center my-5">
          <Col xs="auto" className="text-center">
            <Spinner animation="border" role="status" />
            <div className="mt-2 text-muted">Carregando dados...</div>
          </Col>
        </Row>
      ) : (
        <>
          {/* Cards de resumo de pedidos */}
          <Row>
            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="text-muted text-uppercase small mb-1">
                    Pedidos Totais
                  </Card.Title>
                  <div className="fs-3 fw-bold">{stats.totalPedidos}</div>
                  <Card.Text className="mb-0 small text-muted">
                    Todos os pedidos cadastrados no sistema.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="text-muted text-uppercase small mb-1">
                    Pendentes
                  </Card.Title>
                  <div className="fs-3 fw-bold text-warning">{stats.pendentes}</div>
                  <Card.Text className="mb-0 small text-muted">
                    Aguardando aceite pela transportadora.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="text-muted text-uppercase small mb-1">
                    Aceitos
                  </Card.Title>
                  <div className="fs-3 fw-bold text-success">{stats.aceitos}</div>
                  <Card.Text className="mb-0 small text-muted">
                    Pedidos já aceitos pela transportadora.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} className="mb-3">
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="text-muted text-uppercase small mb-1">
                    Outros Status
                  </Card.Title>
                  <div className="fs-3 fw-bold text-secondary">{stats.outros}</div>
                  <Card.Text className="mb-0 small text-muted">
                    Pedidos em outros estados (cancelado, em transporte, etc.).
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Cards de Veículos / Motoristas – só para ADMIN / GESTOR */}
          {canSeeFleet && (
            <Row className="mt-2">
              <Col md={6} className="mb-3">
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Card.Title className="text-muted text-uppercase small mb-1">
                          Veículos Cadastrados
                        </Card.Title>
                        <div className="fs-3 fw-bold">{stats.veiculos}</div>
                        <Card.Text className="mb-0 small text-muted">
                          Frota disponível para roteirização.
                        </Card.Text>
                      </div>
                      <Link
                        to="/reference/vehicles"
                        className="btn btn-sm btn-outline-primary"
                      >
                        Gerenciar
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} className="mb-3">
                <Card className="shadow-sm border-0">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Card.Title className="text-muted text-uppercase small mb-1">
                          Motoristas Cadastrados
                        </Card.Title>
                        <div className="fs-3 fw-bold">{stats.motoristas}</div>
                        <Card.Text className="mb-0 small text-muted">
                          Condutores ativos no sistema.
                        </Card.Text>
                      </div>
                      <Link
                        to="/reference/drivers"
                        className="btn btn-sm btn-outline-primary"
                      >
                        Gerenciar
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Gráfico de pedidos por mês */}
          <Row className="mt-4">
            <Col md={12}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title className="mb-3">Pedidos por mês</Card.Title>
                  {chartData.labels.length === 0 ? (
                    <p className="text-muted mb-0">
                      Ainda não há dados suficientes para montar o gráfico.
                    </p>
                  ) : (
                    <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: true,
                          },
                        },
                      }}
                    />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  )
}