import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'

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
    setError('')
    setLoading(true)

    if (!nome || !email || !senha || !confirmSenha) {
      setError('Preencha todos os campos.')
      setLoading(false)
      return
    }

    if (senha !== confirmSenha) {
      setError('As senhas não conferem.')
      setLoading(false)
      return
    }

    if (senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      setLoading(false)
      return
    }

    try {
      await api.post('/auth/register', {
        nome,
        email,
        senha,
        tipoPerfil,
      })

      toast.success('Conta criada com sucesso! Faça login para continuar.')
      navigate('/login')
    } catch (err) {
      let message = 'Erro ao criar conta. Tente novamente.'

      if (err.response?.status === 409) {
        message = 'Já existe um usuário com esse e-mail.'
      } else if (err.response?.status === 422) {
        message = 'Dados inválidos. Verifique os campos.'
      } else if (err.response?.data?.message) {
        message = err.response.data.message
      }

      setError(message)
      toast.error(message)
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
                required
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
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Senha</label>
              <input
                type="senha"
                className="form-control"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Confirmar senha</label>
              <input
                type="senha"
                className="form-control"
                value={confirmSenha}
                onChange={(e) => setConfirmSenha(e.target.value)}
                required
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