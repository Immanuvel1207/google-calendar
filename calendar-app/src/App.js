"use client"

import { useState } from "react"
import Calendar from "./components/Calendar"
import Priorities from "./components/Priorities"
import "./styles/Calendar.css"

const App = () => {
  const [activeTab, setActiveTab] = useState("calendar")

  return (
    <div className="app-container">
      <main className="tab-content">
        {activeTab === "calendar" && (
          <div id="calendar-panel" role="tabpanel" aria-labelledby="calendar-tab">
            <Calendar onTabChange={setActiveTab} />
          </div>
        )}
        {activeTab === "priorities" && (
          <div id="priorities-panel" role="tabpanel" aria-labelledby="priorities-tab">
            <Priorities onTabChange={setActiveTab} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
