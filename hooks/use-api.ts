import { useEffect, useState } from "react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000"

export function useTasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = () => {
    setLoading(true)
    fetch(`${API_BASE}/problemEntry/problems`)
      .then((res) => res.json())
      .then((data) => {
        let tasks = Array.isArray(data.problems)
          ? data.problems.map((task: any) => ({
              ...task,
              ip_phone: task.ipPhone?.String ?? "",
              department: task.branchoffice?.String ?? "",
              program: task.program?.String ?? "",
              problem: task.problem?.String ?? "",
              status: task.status?.String ?? "",
              solution: task.solution?.String ?? "",
              other: task.other?.String ?? "",
              solutionUser: task.solutionUser?.String ?? "",
            }))
          : [];
        // เรียง id จากน้อยไปมาก
        tasks = tasks.sort((a: { id: number }, b: { id: number }) => a.id - b.id)
        setTasks(tasks)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return { tasks, loading, error, refreshTasks: fetchTasks }
}

export function useUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`${API_BASE}/userEntry/users`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { users, loading, error }
}

export async function addTask(task: any) {
  const res = await fetch(`${API_BASE}/problemEntry/reportProblem`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  })
  return await res.json()
}

export async function updateTask(id: number, task: any) {
  const res = await fetch(`${API_BASE}/problemEntry/problem/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  })
  return await res.json()
}
