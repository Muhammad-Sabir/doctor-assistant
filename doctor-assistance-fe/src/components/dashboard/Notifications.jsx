import React from 'react'
import { Bell } from "lucide-react"

export default function Notifications() {
    return (
        <div>
            <Bell className="h-5 w-5" />
            <span className="sr-only">Toggle notifications</span>
        </div>
    )
}
