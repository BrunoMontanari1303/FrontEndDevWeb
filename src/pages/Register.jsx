import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../features/users/api'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmSenha, setConfirmSenha] = useState('')
  const [tipoPerfil, setTipoPerfil] = useState('CLIENTE')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.post('/auth/register', {
        nome,
        email,
        senha,
      })

      toast.success('Conta criada com sucesso! Faça login para continuar.')
      navigate('/login')
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('Já existe um usuário com esse e-mail.')
      } else if (err.response?.status === 422) {
        toast.error('Dados inválidos. Verifique os campos.')
      } else {
        toast.error('Erro ao criar conta. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="mb-4 text-center">Criar perfil</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Nome</label>
              <input
                type="text"
                className="form-control"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome completo"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@exemplo.com"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirmar senha</label>
              <input
                type="password"
                className="form-control"
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Tipo de perfil</label>
              <select
                className="form-select"
                value={tipoPerfil}
                onChange={(e) => setTipoPerfil(e.target.value)}
              >
                <option value="CLIENTE">Cliente (posta pedidos)</option>
                <option value="TRANSPORTADORA">
                  Transportadora / Prestador (aceita pedidos)
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar perfil'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}