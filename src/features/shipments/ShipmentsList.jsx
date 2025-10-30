import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Table, Form, Row, Col, Button, Pagination, Badge } from 'react-bootstrap'
import { fetchShipments } from './api'

export default function ShipmentsList() {
    const [page, setPage] = useState(1)
    const [perPage, setPerPage] = useState(25)
    const [search, setSearch] = useState('')


    const { data, isLoading } = useQuery({
        queryKey: ['shipments', page, perPage, search],
        queryFn: () => fetchShipments({ page, perPage, search, sort: 'createdAt:desc' }),
        keepPreviousData: true
    })

    const meta = data?.meta ?? { page: 1, perPage, total: 0 }
    const totalPages = Math.max(1, Math.ceil(meta.total / meta.perPage))

    return (
        <div>
            <Row className="align-items-end g-2 mb-3">
                <Col md={6}>
                    <Form.Label>Buscar</Form.Label>
                    <Form.Control placeholder="Código, cliente, cidade..." value={search} onChange={(e) => { setPage(1); setSearch(e.target.value) }} />
                </Col>
                <Col md={2}>
                    <Form.Label>Por página</Form.Label>
                    <Form.Select value={perPage} onChange={(e) => { setPage(1); setPerPage(parseInt(e.target.value)) }}>
                        {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                    </Form.Select>
                </Col>
                <Col md="auto">
                    <Button onClick={() => setPage(1)}>Aplicar</Button>
                </Col>
            </Row>

            <Table striped bordered hover responsive size="sm" className="align-middle">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Cliente</th>
                        <th>Origem → Destino</th>
                        <th>Status</th>
                        <th>Criado</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr><td colSpan={5} className="text-center py-5">Carregando...</td></tr>
                    )}
                    {!isLoading && data?.data?.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-5">Sem resultados</td></tr>
                    )}
                    {data?.data?.map((s) => (
                        <tr key={s.id}>
                            <td>{s.code}</td>
                            <td>{s.customerName}</td>
                            <td>{s.origin.city}/{s.origin.state} → {s.destination.city}/{s.destination.state}</td>
                            <td><StatusBadge status={s.status} /></td>
                            <td>{new Date(s.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                    {data?.data?.map((s) => (
                        <tr key={s.id}>
                            <td>{s.id}</td>
                            <td>{s.origem} → {s.destino}</td>
                            <td>{s.tipo_carga || s.tipoCarga}</td>
                            <td><StatusBadge status={s.status} /></td>
                            <td>{new Date(s.data_criacao || s.dataCriacao || s.created_at || s.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>


            <Pagination>
                <Pagination.First onClick={() => setPage(1)} disabled={page === 1} />
                <Pagination.Prev onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} />
                <Pagination.Item active>{page}</Pagination.Item>
                <Pagination.Next onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} />
                <Pagination.Last onClick={() => setPage(totalPages)} disabled={page === totalPages} />
            </Pagination>
        </div>
    )
}


function StatusBadge({ status }) {
    const map = {
        draft: 'secondary', tendered: 'info', accepted: 'primary',
        dispatched: 'warning', in_transit: 'primary', stopped: 'danger',
        delivered: 'success', pod_verified: 'success', invoiced: 'dark'
    }
    return <Badge bg={map[status] ?? 'secondary'}>{status}</Badge>
}