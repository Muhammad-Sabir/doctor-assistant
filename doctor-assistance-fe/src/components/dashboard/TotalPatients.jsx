import React from "react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"

import { fetchWithAuth } from "@/utils/fetchApis"
import { useFetchQuery } from "@/hooks/useFetchQuery"

const chartConfig = {
  patients: { label: "patients" },
  patient: { label: "patient" },
}

export default function TotalPatients() {

  const { data: totalPatients } = useFetchQuery({
    url: `patients/`,
    queryKey: ['myPatientCount'],
    fetchFunction: fetchWithAuth,
  });

  const chartData = [
    { item: "patient", patients: totalPatients?.count || 0.0001, fill: "#0ba0da" },
  ]

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]" >
          <RadialBarChart data={chartData} endAngle={100} innerRadius="100%" outerRadius="50%">
            <RadialBar dataKey="patients" />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle" >
                      <tspan x={viewBox.cx} y={viewBox.cy} className="text-3xl font-bold">
                        {chartData[0].patients.toLocaleString()}
                      </tspan>
                      <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                        Patients
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
          Showing your apporoved patients till now
        </div>
      </CardFooter>
    </Card>
  )
}
