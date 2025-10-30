import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Row, Col, Form, Button, Card } from 'react-bootstrap'
import { createShipment } from './api'
import { useVeiculosOptions, useMotoristasOptions } from '../reference/hooks'

const schema = z.object({
  origem: z.string().min(2),
  destino: z.string().min(2),
  tipoCarga: z.string().min(2),
  dataEntrega: z.string().refine(v => !isNaN(Date.parse(v)), 'Data inválida'),
  status: z.string().min(2),
  veiculoId: z.string().optional(),
  motoristaId: z.string().optional(),
})

export default function ShipmentForm() {
  const { register, handleSubmit, formState:{ errors, isSubmitting }, reset } =
    useForm({ resolver: zodResolver(schema) })

  const veiculos = useVeiculosOptions()
  const motoristas = useMotoristasOptions()

  async function onSubmit(values) {
    const payload = {
      origem: values.origem,
      destino: values.destino,
      tipoCarga: values.tipoCarga,
      dataEntrega: new Date(values.dataEntrega).toISOString(),
      status: values.status,
      veiculoId: values.veiculoId ? Number(values.veiculoId) : null,
      motoristaId: values.motoristaId ? Number(values.motoristaId) : null,
    }
    await createShipment(payload)
    reset()
  }

  return (
    <Card><Card.Body>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row className="g-3">
          <Col md={6}>
            <Form.Label>Origem</Form.Label>
            <Form.Control isInvalid={!!errors.origem} {...register('origem')} />
            <Form.Control.Feedback type="invalid">{errors.origem?.message}</Form.Control.Feedback>
          </Col>
          <Col md={6}>
            <Form.Label>Destino</Form.Label>
            <Form.Control isInvalid={!!errors.destino} {...register('destino')} />
            <Form.Control.Feedback type="invalid">{errors.destino?.message}</Form.Control.Feedback>
          </Col>

          <Col md={4}>
            <Form.Label>Tipo de Carga</Form.Label>
            <Form.Control isInvalid={!!errors.tipoCarga} {...register('tipoCarga')} />
            <Form.Control.Feedback type="invalid">{errors.tipoCarga?.message}</Form.Control.Feedback>
          </Col>

          <Col md={4}>
            <Form.Label>Data/Hora de Entrega</Form.Label>
            <Form.Control type="datetime-local" isInvalid={!!errors.dataEntrega} {...register('dataEntrega')} />
            <Form.Control.Feedback type="invalid">{errors.dataEntrega?.message}</Form.Control.Feedback>
          </Col>

          <Col md={4}>
            <Form.Label>Status</Form.Label>
            <Form.Select isInvalid={!!errors.status} {...register('status')}>
              <option value="draft">Rascunho</option>
              <option value="in_transit">Em Trânsito</option>
              <option value="delivered">Entregue</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.status?.message}</Form.Control.Feedback>
          </Col>

          <Col md={6}>
            <Form.Label>Veículo</Form.Label>
            <Form.Select {...register('veiculoId')}>
              <option value="">— Selecionar —</option>
              {(veiculos.data ?? []).map(v => (
                <option key={v.id} value={v.id}>
                  {v.placa || v.modelo || `#${v.id}`}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col md={6}>
            <Form.Label>Motorista</Form.Label>
            <Form.Select {...register('motoristaId')}>
              <option value="">— Selecionar —</option>
              {(motoristas.data ?? []).map(m => (
                <option key={m.id} value={m.id}>
                  {m.nome || `#${m.id}`}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        <div className="mt-3 text-end">
          <Button type="submit" disabled={isSubmitting}>Salvar</Button>
        </div>
      </Form>
    </Card.Body></Card>
  )
}
