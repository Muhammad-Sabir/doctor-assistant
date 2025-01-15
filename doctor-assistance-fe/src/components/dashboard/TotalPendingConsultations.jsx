import React from "react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"

import { fetchWithAuth } from "@/utils/fetchApis"
import { useFetchQuery } from "@/hooks/useFetchQuery"

const chartConfig = {
  consultations: { label: "consultations" },
  consultation: { label: "consultation" },
}

export default function TotalPendingConsultations() {

  const { data: totalconsultations } = useFetchQuery({
    url: `consultations/?completed=false`,
    queryKey: ['myPendingconsultationCount'],
    fetchFunction: fetchWithAuth,
  });

  const chartData = [
    { item: "consultation", consultations: totalconsultations?.count || 0.0001, fill: "#0caaa1" },
  ]

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]" >
          <RadialBarChart data={chartData} endAngle={100} innerRadius="100%" outerRadius="50%">
            <RadialBar dataKey="consultations" />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle" >
                      <tspan x={viewBox.cx} y={viewBox.cy} className="text-3xl font-bold">
                        {chartData[0].consultations.toLocaleString()}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                        {totalconsultations?.count === 1 ? 'Consultation' : 'Consultations' }
                      </tspan>
                    </text>
                  )
                }
              }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col text-sm -mt-6">
        <div className="leading-none text-muted-foreground">
          Showing your pending consultations
        </div>
      </CardFooter>
    </Card>
  )
}
