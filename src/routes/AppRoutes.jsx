import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'

import Dashboard from '../pages/Dashboard'
import Produtos from '../pages/Produtos'
import Categorias from '../pages/Categorias'
import Movimentacoes from '../pages/Movimentacoes'

import AppLayout from '../layouts/AppLayout'

function AppRoutes() {
  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* SISTEMA */}
      <Route element={<AppLayout />}>

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/produtos"
          element={<Produtos />}
        />

        <Route
          path="/categorias"
          element={<Categorias />}
        />

        <Route
          path="/movimentacoes"
          element={<Movimentacoes />}
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Route>

    </Routes>
  )
}

export default AppRoutes