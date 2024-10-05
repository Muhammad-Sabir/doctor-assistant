import React from 'react'
import { Outlet } from 'react-router-dom'

export default function ConsultationLayout() {
  return (
    <div>
      This is consultation Layout
      <Outlet/>
    </div>
  )
}
