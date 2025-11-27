import React, { useEffect, useState } from 'react'
import {
    Container,
    Row,
    Col,
    Card,
    Table,
    Button,
    Modal,
    Form,
    Spinner,
} from 'react-bootstrap'

import {
    fetchVeiculos,
    createVeiculo,
    updateVeiculo,
    deleteVeiculo,
} from '../features/reference/api'

export default function VehiclesPage() {
    const [veiculos, setVeiculos] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [editing, setEditing] = useState(null)

    const [formData, setFormData] = useState({
        placa: '',
        modelo: '',
        capacidade: '',
    })

    function sanitizePlaca(value) {
        return (value || '').toUpperCase().trim()
    }

    function validateVehicleForm(form) {
        const placa = sanitizePlaca(form.placa)
        const modelo = (form.modelo || '').trim()
        const capacidade = Number(form.capacidade)

        if (!placa) return 'Informe a placa do veículo.'
        if (placa.length < 7) return 'Placa inválida. Verifique e tente novamente.'
        if (!modelo) return 'Informe o modelo do veículo.'
        if (Number.isNaN(capacidade) || capacidade <= 0) {
            return 'Informe uma capacidade maior que zero.'
        }

        return null
    }

    function formatDate(value) {
        if (!value) return ''

        const d = new Date(value)
        if (Number.isNaN(d.getTime())) return value

        // dd/mm/aaaa
        return d.toLocaleDateString('pt-BR')
    }

    async function loadData() {
        try {
            setLoading(true)
            const rows = await fetchVeiculos()
            setVeiculos(rows) // rows já é []
        } catch (err) {
            console.error('Erro ao carregar veículos:', err)
            setError('Não foi possível carregar os veículos.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    function handleOpenNew() {
        setEditing(null)
        setFormData({
            placa: '',
            modelo: '',
            capacidade: '',
        })
        setError('')
        setShowModal(true)
    }

    function handleOpenEdit(veiculo) {
        setEditing(veiculo)
        setFormData({
            placa: veiculo.placa || '',
            modelo: veiculo.modelo || '',
            capacidade: veiculo.capacidade || '',
        })
        setError('')
        setShowModal(true)
    }

    async function handleDelete(veiculo) {
        if (
            !window.confirm(
                `Deseja realmente excluir o veículo ${veiculo.placa || veiculo.id}?`
            )
        )
            return

        try {
            await deleteVeiculo(veiculo.id)
            await loadData()
        } catch (err) {
            console.error('Erro ao excluir veículo (detalhado):', {
                status: err.response?.status,
                data: err.response?.data,
            })

            const data = err.response?.data
            let msg = 'Não foi possível excluir o veículo.'

            const text = [
                data?.message,
                data?.error,
                data?.detail,
                typeof data === 'string' ? data : null,
            ]
                .filter(Boolean)
                .join(' | ')
                .toLowerCase()

            // Erros típicos de FK: 409, constraint, foreign key, etc.
            if (
                err.response?.status === 409 ||
                text.includes('foreign key') ||
                text.includes('violates foreign key') ||
                (text.includes('constraint') && text.includes('veiculo'))
            ) {
                msg =
                    'Este veículo está vinculado a um ou mais motoristas e não pode ser excluído.\n' +
                    'Remova ou transfira os motoristas antes de excluir o veículo.'
            }

            alert(msg)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true)
        setError('')

        const validationError = validateVehicleForm(formData)
        if (validationError) {
            setSaving(false)
            setError(validationError)
            return
        }

        const placa = sanitizePlaca(formData.placa)

        const payload = {
            placa,
            modelo: formData.modelo.trim(),
            capacidade: Number(formData.capacidade),
            status: editing?.status || 'Ativo', // backend exige NOT NULL
        }

        console.log('[VEICULOS] Enviando payload:', payload)

        try {
            if (editing) {
                await updateVeiculo(editing.id, payload)
            } else {
                await createVeiculo(payload)
            }
            setShowModal(false)
            await loadData()
        } catch (err) {
            console.error('Erro ao salvar veículo (detalhado):', {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
            })

            const data = err?.response?.data
            let msg = 'Não foi possível salvar o veículo.'

            const text = [
                data?.message,
                data?.error,
                data?.detail,
                typeof data === 'string' ? data : null,
            ]
                .filter(Boolean)
                .join(' | ')
                .toLowerCase()

            // placa duplicada (unique)
            if (
                text.includes('placa') &&
                (text.includes('já existe') ||
                    text.includes('duplic') ||
                    text.includes('unique'))
            ) {
                msg = 'Já existe um veículo cadastrado com essa placa.'
            } else if (Array.isArray(data?.errors)) {
                msg = data.errors
                    .map((e) => e.msg || e.message || JSON.stringify(e))
                    .join('\n')
            } else if (data?.message && typeof data.message === 'string') {
                msg = data.message
            }

            setError(msg)
        } finally {
            setSaving(false)
        }
    }

    return (
        <Container fluid className="py-3">
            <Row className="mb-3">
                <Col>
                    <h1 className="h4 mb-1">Veículos</h1>
                    <p className="text-muted mb-0">
                        Cadastre e gerencie os veículos da frota.
                    </p>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={handleOpenNew}>
                        + Novo veículo
                    </Button>
                </Col>
            </Row>

            <Card className="shadow-sm border-0">
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" role="status" />
                            <div className="mt-2 text-muted">Carregando veículos...</div>
                        </div>
                    ) : veiculos.length === 0 ? (
                        <p className="text-muted mb-0">Nenhum veículo cadastrado ainda.</p>
                    ) : (
                        <Table striped hover responsive size="sm" className="mb-0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Placa</th>
                                    <th>Modelo</th>
                                    <th>Capacidade (t)</th>
                                    <th>Data criação</th>
                                    <th style={{ width: 140 }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {veiculos.map((v) => (
                                    <tr key={v.id}>
                                        <td>{v.id}</td>
                                        <td>{v.placa}</td>
                                        <td>{v.modelo}</td>
                                        <td>{Number(v.capacidade).toFixed(2)} t</td>
                                        <td>{formatDate(v.dataCriacao || v.datacriacao)}</td>
                                        <td>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleOpenEdit(v)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(v)}
                                            >
                                                Excluir
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>

            {/* Modal de formulário */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Form onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {editing ? 'Editar veículo' : 'Novo veículo'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error && <div className="alert alert-danger py-2">{error}</div>}

                        <Form.Group className="mb-3">
                            <Form.Label>Placa</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.placa}
                                onChange={(e) =>
                                    setFormData({ ...formData, placa: e.target.value })
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Modelo</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.modelo}
                                onChange={(e) =>
                                    setFormData({ ...formData, modelo: e.target.value })
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-0">
                            <Form.Label>Capacidade (toneladas)</Form.Label>
                            <Form.Control
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.capacidade}
                                onChange={(e) =>
                                    setFormData({ ...formData, capacidade: e.target.value })
                                }
                                required
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            variant="secondary"
                            onClick={() => setShowModal(false)}
                            disabled={saving}
                        >
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit" disabled={saving}>
                            {saving ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    )
}
