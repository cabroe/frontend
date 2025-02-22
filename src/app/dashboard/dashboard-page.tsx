import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { useEffect, useState } from 'react'
import { Employee, Department } from "@/types/api"
import { API_ROUTES, API_CONFIG } from "@/config/api"

const lineData = [
  { name: 'Mo', stunden: 8 },
  { name: 'Di', stunden: 6 },
  { name: 'Mi', stunden: 7 },
  { name: 'Do', stunden: 8 },
  { name: 'Fr', stunden: 4 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [employeesResponse, departmentsResponse] = await Promise.all([
        fetch(API_ROUTES.EMPLOYEES, API_CONFIG),
        fetch(API_ROUTES.DEPARTMENTS, API_CONFIG)
      ])

      const employeesResult = await employeesResponse.json()
      const departmentsResult = await departmentsResponse.json()

      setEmployees(employeesResult.data)
      setDepartments(departmentsResult.data)
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error)
    }
  }

  const pieData = departments.map(dept => ({
    name: dept.name,
    value: employees.filter(emp => emp.department_id === dept.id).length
  }))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="font-semibold mb-2">Mitarbeiter</h2>
          <div className="text-2xl font-bold text-blue-600">{employees.length}</div>
          <p className="text-gray-600">Gesamt</p>
        </div>
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="font-semibold mb-2">Abteilungen</h2>
          <div className="text-2xl font-bold text-green-600">{departments.length}</div>
          <p className="text-gray-600">Gesamt</p>
        </div>
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="font-semibold mb-2">Durchschnitt</h2>
          <div className="text-2xl font-bold text-purple-600">
            {departments.length ? Math.round(employees.length / departments.length) : 0}
          </div>
          <p className="text-gray-600">Mitarbeiter pro Abteilung</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="font-semibold mb-4">Arbeitsstunden diese Woche</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="stunden" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-4 border rounded-lg shadow bg-white">
          <h2 className="font-semibold mb-4">Mitarbeiter pro Abteilung</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
