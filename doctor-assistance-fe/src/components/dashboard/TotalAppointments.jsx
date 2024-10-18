import React, { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

import { useFetchQuery } from '@/hooks/useFetchQuery';
import { fetchWithAuth } from '@/utils/fetchApis';

const chartConfig = {
  appointments: { label: "appointments" },
  pending: { label: "pending" },
  rejected: { label: "rejected" },
  approved: { label: "approved" },
}

export default function TotalAppointments() {

  const { data: pending } = useFetchQuery({
    url: `appointments/?status=pending`,
    queryKey: ['appointmentsPending'],
    fetchFunction: fetchWithAuth,
  });

  const { data: approved } = useFetchQuery({
    url: `appointments/?status=approved`,
    queryKey: ['appointmentsApproved'],
    fetchFunction: fetchWithAuth,
  });

  const { data: rejected } = useFetchQuery({
    url: `appointments/?status=rejected`,
    queryKey: ['appointmentsRejected'],
    fetchFunction: fetchWithAuth,
  });


  const chartData = [
    { item: "pending", appointments: pending?.count || 0.00001, fill: "#0ba0da" },
    { item: "approved", appointments: approved?.count || 0.00001, fill: "#0a5c8f" },
    { item: "rejected", appointments: rejected?.count || 0.00001, fill: "#2a9d90" },
  ]

  const totalappointments = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.appointments, 0)
  }, [chartData])

  return (
    <Card className="flex flex-col ">
      <CardContent className="flex-1 pb-0 -mt-2">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[230px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="appointments" nameKey="item" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {totalappointments.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Appointments
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm mt-1">
        <div className="leading-none text-muted-foreground">
          Showing your total appointments till now
        </div>
      </CardFooter>
    </Card>
  )
}
