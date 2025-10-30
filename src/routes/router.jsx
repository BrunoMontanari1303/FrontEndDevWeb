import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import ProtectedRoute from './ProtectedRoute'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import ShipmentsList from '/src/features/shipments/ShipmentsList'


export const router = createBrowserRouter([
    { path: '/login', element: <Login /> },
    {
        element: <ProtectedRoute />, children: [
            {
                element: <AppLayout />, children: [
                    { path: '/', element: <Dashboard /> },
                    { path: '/shipments', element: <ShipmentsList /> }
                ]
            }
        ]
    },
    { path: '*', element: <div className="p-4">Não encontrado</div> }
])