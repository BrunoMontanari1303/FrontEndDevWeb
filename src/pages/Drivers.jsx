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
    fetchMotoristas,
    createMotorista,
    updateMotorista,
    deleteMotorista,
    fetchVeiculos,
} from '../features/reference/api'

export default function DriversPage() {
    const [motoristas, setMotoristas] = useState([])
    const [veiculos, setVeiculos] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [editing, setEditing] = useState(null)

    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        veiculoId: '',
    })

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
            const [mData, vData] = await Promise.all([
                fetchMotoristas(),
                fetchVeiculos(),
            ])
            setMotoristas(Array.isArray(mData) ? mData : [])
            setVeiculos(Array.isArray(vData) ? vData : [])
        } catch (err) {
            console.error('Erro ao carregar motoristas / veículos:', err)
            setError('Não foi possível carregar os motoristas.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    function sanitizeCpf(input) {
        return (input || '').replace(/\D/g, '')
    }

    function validateDriverForm(form) {
        const nome = (form.nome || '').trim()
        const cpfDigits = sanitizeCpf(form.cpf)
        const veiculoId = form.veiculoId

        if (!nome) return 'Informe o nome do motorista.'
        if (!cpfDigits || cpfDigits.length !== 11) {
            return 'Informe um CPF válido com 11 dígitos.'
        }
        if (!veiculoId) return 'Selecione um veículo para o motorista.'

        return null
    }

    function handleOpenNew() {
        setEditing(null)
        setFormData({
            nome: '',
            cpf: '',
            veiculoId: '',
        })
        setError('')
        setShowModal(true)
    }

    function handleOpenEdit(motorista) {
        const veiculoIdFromData = motorista.veiculoId ?? motorista.veiculoid ?? ''
        setEditing(motorista)
        setFormData({
            nome: motorista.nome || '',
            cpf: motorista.cpf || '',
            veiculoId: String(veiculoIdFromData),
        })
        setError('')
        setShowModal(true)
    }

    async function handleDelete(motorista) {
        if (!window.confirm(`Deseja realmente excluir o motorista ${motorista.nome || motorista.id}?`))
            return

        try {
            await deleteMotorista(motorista.id)
            await loadData()
        } catch (err) {
            console.error('Erro ao excluir motorista:', err)
            alert('Não foi possível excluir o motorista.')
        }
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setSaving(true)
        setError('')

        const validationError = validateDriverForm(formData)
        if (validationError) {
            setSaving(false)
            setError(validationError)
            return
        }

        const cpfDigits = sanitizeCpf(formData.cpf)

        const payload = {
            nome: formData.nome.trim(),
            cpf: cpfDigits, // manda só dígitos pro back
            veiculoId: Number(formData.veiculoId),
        }

        console.log('[MOTORISTAS] Enviando payload:', payload)

        try {
            if (editing) {
                await updateMotorista(editing.id, payload)
            } else {
                await createMotorista(payload)
            }
            setShowModal(false)
            await loadData()
        } catch (err) {
            console.error('Erro ao salvar motorista (detalhado):', {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
            })

            const data = err?.response?.data
            let msg = 'Não foi possível salvar o motorista.'

            const text = [
                data?.message,
                data?.error,
                data?.detail,
                typeof data === 'string' ? data : null,
            ]
                .filter(Boolean)
                .join(' | ')
                .toLowerCase()

            // cpf duplicado
            if (
                text.includes('cpf') &&
                (text.includes('já existe') ||
                    text.includes('duplic') ||
                    text.includes('unique'))
            ) {
                msg = 'Já existe um motorista cadastrado com esse CPF.'
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

    function getVeiculoLabel(motorista) {
        const veiculoId =
            motorista.veiculoId ?? motorista.veiculoid ?? null
        if (!veiculoId) return '-'

        const v = veiculos.find((v) => v.id === veiculoId)
        if (!v) return veiculoId
        return `${v.placa} (${v.modelo})`
    }

    return (
        <Container fluid className="py-3">
            <Row className="mb-3">
                <Col>
                    <h1 className="h4 mb-1">Motoristas</h1>
                    <p className="text-muted mb-0">
                        Cadastre e gerencie os motoristas da frota.
                    </p>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={handleOpenNew}>
                        + Novo motorista
                    </Button>
                </Col>
            </Row>

            <Card className="shadow-sm border-0">
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" role="status" />
                            <div className="mt-2 text-muted">Carregando motoristas...</div>
                        </div>
                    ) : motoristas.length === 0 ? (
                        <p className="text-muted mb-0">Nenhum motorista cadastrado ainda.</p>
                    ) : (
                        <Table striped hover responsive size="sm" className="mb-0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nome</th>
                                    <th>CPF</th>
                                    <th>Veículo</th>
                                    <th>Data criação</th>
                                    <th style={{ width: 140 }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {motoristas.map((m) => (
                                    <tr key={m.id}>
                                        <td>{m.id}</td>
                                        <td>{m.nome}</td>
                                        <td>{m.cpf}</td>
                                        <td>{getVeiculoLabel(m)}</td>
                                        <td>{formatDate(m.dataCriacao || m.datacriacao)}</td>
                                        <td>
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                className="me-2"
                                                onClick={() => handleOpenEdit(m)}
                                            >
                                                Editar
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(m)}
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
                            {editing ? 'Editar motorista' : 'Novo motorista'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error && <div className="alert alert-danger py-2">{error}</div>}

                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.nome}
                                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>CPF</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.cpf}
                                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-0">
                            <Form.Label>Veículo</Form.Label>
                            <Form.Select
                                value={formData.veiculoId}
                                onChange={(e) =>
                                    setFormData({ ...formData, veiculoId: e.target.value })
                                }
                                required
                            >
                                <option value="">Selecione um veículo</option>
                                {veiculos.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.placa} ({v.modelo})
                                    </option>
                                ))}
                            </Form.Select>
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
