import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap'
import { login } from '../features/auth/api'


const schema = z.object({ email: z.string().email(), password: z.string().min(6) })


export default function Login() {
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) })


    async function onSubmit(values) {
        await login(values.email, values.password)
        navigate('/')
    }


    return (
        <Container className="min-vh-100 d-flex align-items-center">
            <Row className="w-100 justify-content-center">
                <Col md={4}>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <h4 className="mb-3">Entrar</h4>
                            <Form onSubmit={handleSubmit(onSubmit)}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="email@dominio.com" isInvalid={!!errors.email} {...register('email')} />
                                    <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Senha</Form.Label>
                                    <Form.Control type="password" isInvalid={!!errors.password} {...register('password')} />
                                    <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                                </Form.Group>
                                <Button type="submit" className="w-100" disabled={isSubmitting}>Entrar</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}