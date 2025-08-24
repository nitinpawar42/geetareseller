"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

const data = [
  { date: "May 01", sales: 4000, commissions: 400 },
  { date: "May 02", sales: 3000, commissions: 300 },
  { date: "May 03", sales: 2000, commissions: 200 },
  { date: "May 04", sales: 2780, commissions: 278 },
  { date: "May 05", sales: 1890, commissions: 189 },
  { date: "May 06", sales: 2390, commissions: 239 },
  { date: "May 07", sales: 3490, commissions: 349 },
  { date: "May 08", sales: 2500, commissions: 250 },
  { date: "May 09", sales: 4100, commissions: 410 },
  { date: "May 10", sales: 3600, commissions: 360 },
  { date: "May 11", sales: 4300, commissions: 430 },
  { date: "May 12", sales: 3200, commissions: 320 },
];

export function SalesChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
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
                boxShadow: 'hsl(var(--shadow-sm))',
            }}
            labelStyle={{
                color: 'hsl(var(--foreground))',
                fontWeight: '600',
            }}
          />
          <Line 
            name="Sales"
            type="monotone" 
            dataKey="sales" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2} 
            dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'hsl(var(--background))' }}
            activeDot={{ r: 6, fill: 'hsl(var(--primary))', strokeWidth: 2, stroke: 'hsl(var(--background))' }}
          />
           <Line 
            name="Commissions"
            type="monotone" 
            dataKey="commissions" 
            stroke="hsl(var(--accent))" 
            strokeWidth={2} 
            dot={{ r: 4, fill: 'hsl(var(--accent))', strokeWidth: 2, stroke: 'hsl(var(--background))' }}
            activeDot={{ r: 6, fill: 'hsl(var(--accent))', strokeWidth: 2, stroke: 'hsl(var(--background))' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
