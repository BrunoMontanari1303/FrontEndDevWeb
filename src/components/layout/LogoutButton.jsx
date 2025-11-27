import { useAuthStore } from '/src/features/auth/useAuthStore'
import { useNavigate } from 'react-router-dom'

export default function LogoutButton() {
  const { clear } = useAuthStore() // Função para limpar o estado da sessão
  const navigate = useNavigate()

  const handleLogout = () => {
    clear() // Limpa o token e o usuário da store e do localStorage
    navigate('/login') // Redireciona para a página de login
  }

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Sair
    </button>
  )
}