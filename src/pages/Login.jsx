import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { login } from '../features/auth/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(localStorage.getItem('remember_email') || '')
  const [senha, setSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [remember, setRemember] = useState(!!localStorage.getItem('remember_email'))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Se já tiver token, redireciona
  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) navigate('/dashboard', { replace: true })
  }, [navigate])

  const validEmail = (v) => /^\S+@\S+\.\S+$/.test(v)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email || !senha) {
      setError('Preencha e-mail e senha.')
      return
    }
    if (!validEmail(email)) {
      setError('E-mail inválido.')
      return
    }

    setLoading(true)
    const res = await login(email.trim(), senha)
    setLoading(false)

    if (!res.ok) {
      setError(res.message || 'Não foi possível entrar.')
      return
    }

    // remember email (opcional)
    if (remember) localStorage.setItem('remember_email', email.trim())
    else localStorage.removeItem('remember_email')

    // redireciona para a rota original (se veio de rota protegida) ou dashboard
    const from = location.state?.from?.pathname || '/dashboard'
    navigate(from, { replace: true })
  }

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100" style={{ maxWidth: 420 }}>
        <div className="col">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">

              <img
                src="/logo.png"
                alt="Logix"
                className="d-block mx-auto mt-1"
                style={{ width: 40, height: 40 }}
              />
              <div className="d-flex flex-column align-items-center mb-3">
                <h1 className="login-title">LOGIX</h1>
              </div>

              

              <h1 className="h4 mb-1 fw-bold text-center">Entrar</h1>
              <p className="text-muted mb-4 text-center">Acesse o painel do sistema</p>

              {error && (
                <div className="alert alert-danger py-2" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label">E-mail</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="seu@email.com"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Senha</label>
                  <div className="input-group">
                    <input
                      type={showSenha ? 'text' : 'senha'}
                      className="form-control"
                      placeholder="••••••••"
                      autoComplete="current-senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setShowSenha((s) => !s)}
                      aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showSenha ? 'Ocultar' : 'Mostrar'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Entrando…' : 'Entrar'}
                </button>
              </form>

              <p className="text-center text-muted small mt-3 mb-0">
                Ambiente protegido — use suas credenciais cadastradas.
              </p>
            </div>
          </div>

          <div className="mt-3 text-center">
            <span>Ainda não tem conta? </span>
            <Link to="/register">
              <Button variant="link" className="p-0 align-baseline">
                Criar cadastro
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
