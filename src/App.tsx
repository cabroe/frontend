"use client"

import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layouts/layout'
import LoginPage from './app/login/login-page'
import DashboardPage from './app/dashboard/dashboard-page'
import EmployeePage from './app/employee/employee-page'
import DepartmentPage from './app/department/department-page'
import ShiftTypePage from './app/shifttype/shifttype-page'
import SchedulePage from './app/shiftweek/shiftweek-page'
import CalendarPage from './app/calendar/calendar-page'
import { Department } from '@/types/api'
import { API_ROUTES, API_CONFIG } from '@/config/api'
import './App.css'

function App() {
  const [departments, setDepartments] = useState<Department[]>([])

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(API_ROUTES.DEPARTMENTS, {
          ...API_CONFIG,
          method: 'GET'
        })
        
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Abteilungen')
        }
        
        const data = await response.json()
        setDepartments(data.data)
      } catch (error) {
        console.error('Fehler:', error)
        setDepartments([])
      }
    }

    fetchDepartments()
  }, [])

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <Layout>
              <DashboardPage />
            </Layout>
          } />
          <Route path="/employees" element={
            <Layout>
              <EmployeePage />
            </Layout>
          } />
          <Route path="/departments" element={
            <Layout>
              <DepartmentPage />
            </Layout>
          } />
          <Route path="/shifttype" element={
            <Layout>
              <ShiftTypePage />
            </Layout>
          } />
          <Route path="/shiftweek" element={
            <Layout>
              <SchedulePage departments={departments} />
            </Layout>
          } />
          <Route path="/calendar" element={
            <Layout>
              <CalendarPage />
            </Layout>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
