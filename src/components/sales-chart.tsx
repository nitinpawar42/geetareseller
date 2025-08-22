"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const data = [
  { date: "01/05", sales: 4000 },
  { date: "02/05", sales: 3000 },
  { date: "03/05", sales: 2000 },
  { date: "04/05", sales: 2780 },
  { date: "05/05", sales: 1890 },
  { date: "06/05", sales: 2390 },
  { date: "07/05", sales: 3490 },
  { date: "08/05", sales: 2500 },
  { date: "09/05", sales: 4100 },
  { date: "10/05", sales: 3600 },
  { date: "11/05", sales: 4300 },
  { date: "12/05", sales: 3200 },
]

export function SalesChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
          <XAxis 
            dataKey="date" 
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
             stroke="hsl(var(--muted-foreground))"
             fontSize={12}
             tickLine={false}
             axisLine={false}
             tickFormatter={(value) => `$${value/1000}k`}
          />
          <Tooltip 
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)',
            }}
            labelStyle={{
                color: 'hsl(var(--foreground))',
                fontWeight: '600',
            }}
          />
          <Line 
            type="monotone" 
            dataKey="sales" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2} 
            dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'hsl(var(--background))' }}
            activeDot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'hsl(var(--background))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
