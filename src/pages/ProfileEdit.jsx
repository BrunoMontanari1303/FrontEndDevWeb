import { useEffect, useState } from 'react'
import { useAuthStore } from '../features/auth/useAuthStore'
import { updateMyProfile } from '../features/users/api'

export default function ProfileEditPage() {
    const { user, token, setSession } = useAuthStore()
    const [nome, setNome] = useState(user?.nome || '')
    const [email, setEmail] = useState(user?.email || '')
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        if (user) {
            setNome(user.nome || '')
            setEmail(user.email || '')
        }
    }, [user])

    if (!user) {
        return <div className="p-4">Nenhum usuário logado.</div>
    }

    const perfilLabel = (() => {
        const papel = user.papel
        if (papel === 1 || papel === 'ADMIN') return 'Administrador'
        if (papel === 2 || papel === 'USER') return 'Cliente (posta pedidos)'
        if (papel === 3 || papel === 'GESTOR') return 'Transportadora / Prestador (aceita pedidos)'
        return String(papel)
    })()


    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setMessage('')

        try {
            const updated = await updateMyProfile({
                nome,
                email,
            })

            const newUser = {
                ...user,
                ...updated,
            }

            setSession(token, newUser)

            setMessage('Perfil atualizado com sucesso!')
        } catch (err) {
            setError('Erro ao atualizar perfil.')
        }
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4">Meu perfil</h2>

            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            <form onSubmit={handleSubmit} className="col-md-6">
                <div className="mb-3">
                    <label className="form-label">Nome</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">E-mail</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Tipo de perfil</label>
                    <input
                        type="text"
                        className="form-control"
                        value={perfilLabel}
                        disabled
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                >
                    {saving ? 'Salvando...' : 'Salvar alterações'}
                </button>
            </form>
        </div>
    )
}