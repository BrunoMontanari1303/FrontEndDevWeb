import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import ProtectedRoute from './ProtectedRoute'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Shipments from '../pages/Shipments'
import ShipmentDetails from '../pages/ShipmentDetails'
import ShipmentsForm from '../pages/ShipmentsForm'
import RegisterPage from '../pages/Register'
import ProfileEditPage from '../pages/ProfileEdit'
import ShipmentsAccepted from '../pages/ShipmentsAccepted'
import VehiclesPage from '../pages/Vehicles'
import DriversPage from '../pages/Drivers'

export const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <RegisterPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <Dashboard /> },
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/shipments', element: <Shipments /> },
          { path: '/shipments/:id', element: <ShipmentDetails /> },
          { path: '/shipments/new', element: <ShipmentsForm /> },
          { path: '/shipments/:id/edit', element: <ShipmentsForm /> },
          { path: '/shipments/accepted', element: <ShipmentsAccepted /> },
          { path: '/meu-perfil', element: <ProfileEditPage /> },
          { path: '/reference/vehicles', element: <VehiclesPage /> },
          { path: '/reference/drivers', element: <DriversPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <div className="p-4">Não encontrado</div> },
])
