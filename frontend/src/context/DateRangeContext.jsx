import { createContext, useContext, useState } from 'react'
import { DEMO_DATE_START, DEMO_DATE_END } from '../config/demoPeriod.js'

const DateRangeContext = createContext(null)

export function DateRangeProvider({ children }) {
  const [startDate, setStartDate] = useState(DEMO_DATE_START)
  const [endDate, setEndDate] = useState(DEMO_DATE_END)

  return (
    <DateRangeContext.Provider value={{ startDate, endDate, setStartDate, setEndDate }}>
      {children}
    </DateRangeContext.Provider>
  )
}

export function useDateRange() {
  const ctx = useContext(DateRangeContext)
  if (!ctx) throw new Error('useDateRange must be used within DateRangeProvider')
  return ctx
}
