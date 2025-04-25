import { useEffect, useState } from 'react'
import Loading from '@/components/shared/Loading'
import AnalyticHeader from './components/AnalyticHeader'
import WebAnalytic from './components/AnalyticChart'
import { apiGetAnalyticDashboard } from '@/services/DashboardService'
import useSWR from 'swr'
import type { GetAnalyticDashboardResponse, Period } from './types'

const AnalyticDashboard = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('thisMonth')
    const MAX_VISIBLE_SERIES = 10
    const [activeColors, setActiveColors] = useState<string[]>([])
    const [checkedTypes, setCheckedTypes] = useState<string[]>(['Power'])
    const [groupASeries, setGroupASeries] = useState<
        { color?: string; name: string; data: number[] }[]
    >([])
    const [groupBSeries, setGroupBSeries] = useState<
        { color?: string; name: string; data: number[] }[]
    >([])

    const { data, isLoading } = useSWR(
        ['/api/dashboard/analytic'],
        () => apiGetAnalyticDashboard<GetAnalyticDashboardResponse>(),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    useEffect(() => {
        if (!data?.[selectedPeriod]?.webAnalytic?.series) return

        const allSeries = data[selectedPeriod].webAnalytic.series.slice(
            0,
            MAX_VISIBLE_SERIES,
        )

        let filteredSeries: any[] = []

        checkedTypes.forEach((type) => {
            if (type === 'Power') {
                filteredSeries.push(...allSeries)
            } else if (type === 'AC') {
                const half = Math.ceil(allSeries.length / 2)
                filteredSeries.push(...allSeries.slice(0, half))
            } else if (type === 'DC') {
                const half = Math.ceil(allSeries.length / 2)
                filteredSeries.push(...allSeries.slice(half))
            }
        })

        const uniqueSeries = Array.from(
            new Map(filteredSeries.map((item) => [item.name, item])).values(),
        )

        const half = Math.ceil(uniqueSeries.length / 2)
        setGroupASeries(uniqueSeries.slice(0, half))
        setGroupBSeries(uniqueSeries.slice(half))

        const uniqueColors = Array.from(
            new Set(uniqueSeries.map((item) => item.color || 'default')),
        )
        setActiveColors(uniqueColors)
    }, [data, selectedPeriod, checkedTypes])

    const toggleColor = (color: string) => {
        setActiveColors((prev) =>
            prev.includes(color)
                ? prev.filter((c) => c !== color)
                : [...prev, color],
        )
    }

    const handleCheckboxChange = (type: string) => {
        setCheckedTypes((prev) =>
            prev.includes(type)
                ? prev.filter((t) => t !== type)
                : [...prev, type],
        )
    }

    return (
        <Loading loading={isLoading}>
            {data && (
                <div className="flex flex-col gap-2">
                    <AnalyticHeader
                        selectedPeriod={selectedPeriod}
                        onSelectedPeriodChange={setSelectedPeriod}
                        selectedType={checkedTypes.join(', ')}
                        onSelectedTypeChange={(type) => {
                            setCheckedTypes([type])
                        }}
                    />
                    {/* Checkboxes for Power, AC, DC */}
                    <div className="flex flex-col 2xl:grid grid-cols- gap-4">
                        <div className="col-span-4 2xl:col-span-3">
                            {groupASeries.length > 0 ||
                            groupBSeries.length > 0 ? (
                                <WebAnalytic
                                    data={data[selectedPeriod].webAnalytic}
                                    activeSeries={[
                                        ...groupASeries,
                                        ...groupBSeries,
                                    ].filter((s) =>
                                        activeColors.includes(
                                            s.color || 'default',
                                        ),
                                    )}
                                />
                            ) : (
                                <p>No data available for this selection.</p>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        {['Power', 'AC', 'DC'].map((type) => {
                            const isChecked = checkedTypes.includes(type)
                            // Show the checkbox only if the type is selected
                            if (isChecked || checkedTypes.length === 0) {
                                return (
                                    <label
                                        key={type}
                                        onClick={() =>
                                            handleCheckboxChange(type)
                                        }
                                        className={`flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer transition-all
            ${isChecked ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-gray-300'}
            hover:bg-blue-200`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            readOnly
                                            className="w-4 h-4 accent-blue-600"
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            {type}
                                        </span>
                                    </label>
                                )
                            } else {
                                return null // Don't render the checkbox if not selected
                            }
                        })}
                    </div>

                    {/* Color Switches */}
                    <div className="flex gap-4 flex-wrap">
                        {Array.from(
                            new Set(
                                [...groupASeries, ...groupBSeries].map(
                                    (s) => s.color || 'default',
                                ),
                            ),
                        ).map((color) => (
                            <div
                                key={color}
                                className="flex items-center gap-3"
                            >
                                {/* Display the color dot */}
                                <span
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: color }}
                                ></span>

                                {/* Custom toggle switch */}
                                <div
                                    onClick={() => toggleColor(color)}
                                    className={`w-12 h-6 flex items-center rounded-full cursor-pointer transition-all duration-300 ${
                                        activeColors.includes(color)
                                            ? ''
                                            : 'opacity-40'
                                    }`}
                                    style={{
                                        backgroundColor: activeColors.includes(
                                            color,
                                        )
                                            ? color
                                            : '#d1d5db',
                                    }}
                                >
                                    <div
                                        className={`w-[22px] h-[22px] bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                                            activeColors.includes(color)
                                                ? 'translate-x-6'
                                                : 'translate-x-1'
                                        }`}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Loading>
    )
}

export default AnalyticDashboard
