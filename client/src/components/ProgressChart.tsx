import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ChartData {
  name: string;
  value: number;
  accuracy?: number;
}

interface ProgressChartProps {
  title: string;
  data: ChartData[];
  type?: "line" | "bar";
  dataKey?: string;
  showAccuracy?: boolean;
}

export function ProgressChart({ title, data, type = "line", dataKey = "value", showAccuracy = false }: ProgressChartProps) {
  return (
    <Card data-testid={`card-chart-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          {type === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              {showAccuracy && <Legend />}
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="XP Earned"
              />
              {showAccuracy && (
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="hsl(var(--chart-2))" 
                  strokeWidth={2}
                  name="Accuracy %"
                />
              )}
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              {showAccuracy && <Legend />}
              <Bar 
                dataKey={dataKey} 
                fill="hsl(var(--primary))"
                name="XP Earned"
              />
              {showAccuracy && (
                <Bar 
                  dataKey="accuracy" 
                  fill="hsl(var(--chart-2))"
                  name="Accuracy %"
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
