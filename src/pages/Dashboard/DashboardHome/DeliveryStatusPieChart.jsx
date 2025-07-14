import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

// Colors for pie slices
const COLORS = [
    '#22c55e', // green
    '#eab308', // yellow
    '#3b82f6', // blue
    '#a855f7', // purple
    '#ef4444', // red
    '#6b7280'  // gray
];

// Custom label beside pie slices
const renderCustomLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, index, name
}) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="#6b7280" // Tailwind gray-500
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="transition hover:bg-gray-700/20 hover:text-gray-200 p-1 rounded-md cursor-pointer text-sm font-medium"
        >
            {name}
        </text>
    );
};

const DeliveryStatusPieChart = () => {
    const axiosSecure = useAxiosSecure();

    const { data = [], isLoading, isError } = useQuery({
        queryKey: ['deliveryStatusCount'],
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels/delivery/status-count');
            return res.data;
        },
    });

    if (isLoading) {
        return <div className="text-center py-6 text-neutral-content">Loading chart...</div>;
    }

    if (isError) {
        return <div className="text-center py-6 text-red-500">Failed to load chart data.</div>;
    }

    return (
        <div className="flex flex-col md:flex-row items-center gap-6 w-full h-[400px] md:h-[300px] px-4">
            {/* Chart */}
            <div className="w-full md:w-2/3 h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="count"
                            nameKey="status"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            labelLine
                            label={renderCustomLabel}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937', // dark gray bg
                                borderRadius: '6px',
                                border: 'none',
                                color: '#ffff', // light text
                                fontSize: '14px',
                            }}
                            labelStyle={{ display: 'none' }}
                            cursor={{ fill: 'transparent' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="w-full md:w-1/3 space-y-2">
                <h3 className="text-lg font-semibold text-gray-300 text-center md:text-left mb-2">
                    Status
                </h3>
                {data.map((entry, index) => (
                    <div
                        key={index}
                        className="flex items-center gap-3 group transition hover:bg-gray-800/10 dark:hover:bg-gray-700/30 p-2 rounded-md cursor-pointer"
                    >
                        <span
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="capitalize text-sm text-gray-500 group-hover:text-gray-200">
                            {entry.status} ({entry.count})
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeliveryStatusPieChart;
