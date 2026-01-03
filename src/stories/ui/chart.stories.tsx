/**
 * Chart Stories - Showcase of shadcn/ui Chart components with DDS styling
 *
 * Demonstrates all chart types using ChartContainer and DDS semantic colors.
 * Built on Recharts with consistent tooltip and legend styling.
 */
import type { Meta, StoryObj } from '@storybook/react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart,
  RadialBar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  DDS_CHART_COLORS,
  type ChartConfig,
} from '../../components/ui/chart'
import { ATOM_META, atomDescription, StorySection } from '../_infrastructure'

// =============================================================================
// MOCK DATA
// =============================================================================

const monthlyData = [
  { month: 'Jan', desktop: 186, mobile: 80 },
  { month: 'Feb', desktop: 305, mobile: 200 },
  { month: 'Mar', desktop: 237, mobile: 120 },
  { month: 'Apr', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'Jun', desktop: 214, mobile: 140 },
]

const pieData = [
  { name: 'Completed', value: 400, fill: 'var(--color-completed)' },
  { name: 'In Progress', value: 300, fill: 'var(--color-inprogress)' },
  { name: 'Pending', value: 200, fill: 'var(--color-pending)' },
  { name: 'Blocked', value: 100, fill: 'var(--color-blocked)' },
]

const radarData = [
  { subject: 'Safety', A: 120, B: 110, fullMark: 150 },
  { subject: 'Quality', A: 98, B: 130, fullMark: 150 },
  { subject: 'Delivery', A: 86, B: 130, fullMark: 150 },
  { subject: 'Cost', A: 99, B: 100, fullMark: 150 },
  { subject: 'Morale', A: 85, B: 90, fullMark: 150 },
  { subject: 'Environment', A: 65, B: 85, fullMark: 150 },
]

const radialData = [
  { name: 'Critical', value: 85, fill: 'var(--color-critical)' },
  { name: 'High', value: 65, fill: 'var(--color-high)' },
  { name: 'Medium', value: 45, fill: 'var(--color-medium)' },
  { name: 'Low', value: 25, fill: 'var(--color-low)' },
]

// =============================================================================
// CHART CONFIGS - Using DDS semantic colors
// =============================================================================

const areaChartConfig: ChartConfig = {
  desktop: {
    label: 'Desktop',
    color: DDS_CHART_COLORS.info.color,
  },
  mobile: {
    label: 'Mobile',
    color: DDS_CHART_COLORS.accent.color,
  },
}

const barChartConfig: ChartConfig = {
  desktop: {
    label: 'Desktop',
    color: DDS_CHART_COLORS.success.color,
  },
  mobile: {
    label: 'Mobile',
    color: DDS_CHART_COLORS.warning.color,
  },
}

const lineChartConfig: ChartConfig = {
  desktop: {
    label: 'Desktop',
    color: DDS_CHART_COLORS.accent.color,
  },
  mobile: {
    label: 'Mobile',
    color: DDS_CHART_COLORS.secondary.color,
  },
}

const pieChartConfig: ChartConfig = {
  completed: {
    label: 'Completed',
    color: DDS_CHART_COLORS.success.color,
  },
  inprogress: {
    label: 'In Progress',
    color: DDS_CHART_COLORS.info.color,
  },
  pending: {
    label: 'Pending',
    color: DDS_CHART_COLORS.warning.color,
  },
  blocked: {
    label: 'Blocked',
    color: DDS_CHART_COLORS.error.color,
  },
}

const radarChartConfig: ChartConfig = {
  A: {
    label: 'This Year',
    color: DDS_CHART_COLORS.info.color,
  },
  B: {
    label: 'Last Year',
    color: DDS_CHART_COLORS.muted.color,
  },
}

const radialChartConfig: ChartConfig = {
  critical: {
    label: 'Critical',
    color: DDS_CHART_COLORS.error.color,
  },
  high: {
    label: 'High',
    color: DDS_CHART_COLORS.warning.color,
  },
  medium: {
    label: 'Medium',
    color: DDS_CHART_COLORS.info.color,
  },
  low: {
    label: 'Low',
    color: DDS_CHART_COLORS.success.color,
  },
}

// =============================================================================
// META
// =============================================================================

const meta: Meta = {
  title: 'UI/Chart',
  ...ATOM_META,
  parameters: {
    ...ATOM_META.parameters,
    layout: 'padded',
    docs: {
      description: {
        component: atomDescription(`
shadcn/ui Chart components with DDS semantic color integration.

**Features:**
- \`ChartContainer\` - Wraps Recharts with CSS variable injection
- \`ChartTooltip\` + \`ChartTooltipContent\` - Consistent tooltip styling
- \`ChartLegend\` + \`ChartLegendContent\` - Consistent legend styling
- \`DDS_CHART_COLORS\` - Pre-configured semantic colors

**Supported Chart Types:**
- Area, Bar, Line (Cartesian)
- Pie, Radar, Radial (Polar)

**Usage:**
\`\`\`tsx
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const config = {
  sales: { label: 'Sales', color: 'var(--color-success)' }
}

<ChartContainer config={config}>
  <BarChart data={data}>
    <Bar dataKey="sales" fill="var(--color-sales)" />
    <ChartTooltip content={<ChartTooltipContent />} />
  </BarChart>
</ChartContainer>
\`\`\`
        `),
      },
    },
  },
}

export default meta
type Story = StoryObj

// =============================================================================
// STORIES
// =============================================================================

/**
 * Area Chart - Filled line chart for showing trends over time.
 */
export const AreaChartExample: Story = {
  render: () => (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-primary">Area Chart</h3>
      <ChartContainer config={areaChartConfig} className="h-[300px] w-full">
        <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
          <Area
            type="monotone"
            dataKey="desktop"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            fill="url(#fillDesktop)"
          />
          <Area
            type="monotone"
            dataKey="mobile"
            stroke="var(--color-mobile)"
            strokeWidth={2}
            fill="url(#fillMobile)"
          />
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  ),
}

/**
 * Bar Chart - Vertical bars for comparing categories.
 */
export const BarChartExample: Story = {
  render: () => (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-primary">Bar Chart</h3>
      <ChartContainer config={barChartConfig} className="h-[300px] w-full">
        <BarChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="mobile" fill="var(--color-mobile)" radius={[4, 4, 0, 0]} />
          <ChartLegend content={<ChartLegendContent />} />
        </BarChart>
      </ChartContainer>
    </div>
  ),
}

/**
 * Line Chart - Simple lines for showing trends.
 */
export const LineChartExample: Story = {
  render: () => (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-primary">Line Chart</h3>
      <ChartContainer config={lineChartConfig} className="h-[300px] w-full">
        <LineChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <Line
            type="monotone"
            dataKey="desktop"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={{ fill: 'var(--color-desktop)', r: 4 }}
            activeDot={{ r: 6, fill: 'var(--color-desktop)' }}
          />
          <Line
            type="monotone"
            dataKey="mobile"
            stroke="var(--color-mobile)"
            strokeWidth={2}
            dot={{ fill: 'var(--color-mobile)', r: 4 }}
            activeDot={{ r: 6, fill: 'var(--color-mobile)' }}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </LineChart>
      </ChartContainer>
    </div>
  ),
}

/**
 * Pie Chart - Circular chart for showing proportions.
 */
export const PieChartExample: Story = {
  render: () => (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-primary">Pie Chart</h3>
      <ChartContainer config={pieChartConfig} className="h-[300px] w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <ChartLegend content={<ChartLegendContent nameKey="name" />} />
        </PieChart>
      </ChartContainer>
    </div>
  ),
}

/**
 * Radar Chart - Spider/web chart for comparing multiple variables.
 */
export const RadarChartExample: Story = {
  render: () => (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-primary">Radar Chart</h3>
      <ChartContainer config={radarChartConfig} className="h-[350px] w-full">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
          <PolarGrid stroke="var(--color-border-subtle)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Radar
            name="This Year"
            dataKey="A"
            stroke="var(--color-A)"
            fill="var(--color-A)"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Last Year"
            dataKey="B"
            stroke="var(--color-B)"
            fill="var(--color-B)"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </RadarChart>
      </ChartContainer>
    </div>
  ),
}

/**
 * Radial Bar Chart - Circular progress bars.
 */
export const RadialBarChartExample: Story = {
  render: () => (
    <div className="w-full max-w-2xl mx-auto">
      <h3 className="text-lg font-semibold mb-4 text-primary">Radial Bar Chart</h3>
      <ChartContainer config={radialChartConfig} className="h-[350px] w-full">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="20%"
          outerRadius="90%"
          barSize={20}
          data={radialData}
          startAngle={90}
          endAngle={-270}
        >
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
          <RadialBar
            background={{ fill: 'var(--color-muted-bg)' }}
            dataKey="value"
            cornerRadius={10}
          />
          <ChartLegend content={<ChartLegendContent nameKey="name" />} />
        </RadialBarChart>
      </ChartContainer>
    </div>
  ),
}

/**
 * AllStates - All chart types in one view.
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-12 p-4">
      <StorySection title="Area Chart" description="Filled line chart for trends over time">
        <ChartContainer config={areaChartConfig} className="h-[250px] w-full">
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="fillDesktopAll" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillMobileAll" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area type="monotone" dataKey="desktop" stroke="var(--color-desktop)" fill="url(#fillDesktopAll)" />
            <Area type="monotone" dataKey="mobile" stroke="var(--color-mobile)" fill="url(#fillMobileAll)" />
          </AreaChart>
        </ChartContainer>
      </StorySection>

      <StorySection title="Bar Chart" description="Vertical bars for comparing categories">
        <ChartContainer config={barChartConfig} className="h-[250px] w-full">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </StorySection>

      <StorySection title="Line Chart" description="Simple lines for showing trends">
        <ChartContainer config={lineChartConfig} className="h-[250px] w-full">
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-subtle)" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Line type="monotone" dataKey="desktop" stroke="var(--color-desktop)" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="mobile" stroke="var(--color-mobile)" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ChartContainer>
      </StorySection>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StorySection title="Pie Chart" description="Proportions of a whole">
          <ChartContainer config={pieChartConfig} className="h-[250px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </StorySection>

        <StorySection title="Radial Bar" description="Circular progress bars">
          <ChartContainer config={radialChartConfig} className="h-[250px] w-full">
            <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270}>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <RadialBar background={{ fill: 'var(--color-muted-bg)' }} dataKey="value" cornerRadius={8} />
            </RadialBarChart>
          </ChartContainer>
        </StorySection>
      </div>

      <StorySection title="Radar Chart" description="Multi-variable comparison">
        <ChartContainer config={radarChartConfig} className="h-[300px] w-full max-w-xl mx-auto">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid stroke="var(--color-border-subtle)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Radar dataKey="A" stroke="var(--color-A)" fill="var(--color-A)" fillOpacity={0.3} />
            <Radar dataKey="B" stroke="var(--color-B)" fill="var(--color-B)" fillOpacity={0.2} />
          </RadarChart>
        </ChartContainer>
      </StorySection>
    </div>
  ),
}
