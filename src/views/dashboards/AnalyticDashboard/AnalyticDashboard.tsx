import { useEffect, useState } from 'react'
import Loading from '@/components/shared/Loading'
import AnalyticHeader from './components/AnalyticHeader'
import WebAnalytic from './components/AnalyticChart'
import { apiGetAnalyticDashboard } from '@/services/DashboardService'
import useSWR from 'swr'
import type { GetAnalyticDashboardResponse, Period } from './types'
import Metrics from './components/Metrics'
import Solar from './components/solar'

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

    const mainTypes = ['Power']
    const subTypesMap: Record<string, string[]> = {
        DC: ['PV Current', 'PV Voltage'],
        AC: ['AC Current', 'AC Voltage'],
    }

    // Define mapping from subtype to actual series name patterns
    const seriesPatternMap: Record<string, string[]> = {
        'PV Current': ['PV Current', 'DC Current', 'Solar Current'],
        'PV Voltage': ['PV Voltage', 'DC Voltage', 'Solar Voltage'],
        'AC Current': ['AC Current', 'Grid Current', 'Output Current'],
        'AC Voltage': ['AC Voltage', 'Grid Voltage', 'Output Voltage'],
    }

    // Helper to get parent type of a subtype
    const getParentType = (subType: string): string | null => {
        for (const [parent, children] of Object.entries(subTypesMap)) {
            if (children.includes(subType)) {
                return parent
            }
        }
        return null
    }

    // Function to check if a series belongs to a specific subtype
    const seriesMatchesSubtype = (
        seriesName: string,
        subtype: string,
    ): boolean => {
        const patterns = seriesPatternMap[subtype] || [subtype]
        return patterns.some((pattern) => seriesName.includes(pattern))
    }

    useEffect(() => {
        if (!data?.[selectedPeriod]?.webAnalytic?.series) return

        const allSeries = data[selectedPeriod].webAnalytic.series.slice(
            0,
            MAX_VISIBLE_SERIES,
        )

        let filteredSeries: any[] = []

        // If Power is selected, show everything
        if (checkedTypes.includes('Power')) {
            filteredSeries = [...allSeries]
        }
        // If AC or DC is selected but not Power, filter accordingly
        else {
            if (checkedTypes.includes('AC')) {
                // Check if any AC subtypes are selected
                const acSubtypesSelected = subTypesMap.AC.some((subtype) =>
                    checkedTypes.includes(subtype),
                )

                if (acSubtypesSelected) {
                    // Only include series that match the selected subtypes
                    subTypesMap.AC.forEach((subtype) => {
                        if (checkedTypes.includes(subtype)) {
                            const matchingSeries = allSeries.filter((series) =>
                                seriesMatchesSubtype(series.name, subtype),
                            )
                            filteredSeries.push(...matchingSeries)
                        }
                    })
                } else {
                    // If no subtypes are selected, include all AC series
                    const acSeries = allSeries.filter((series) =>
                        subTypesMap.AC.some((subtype) =>
                            seriesMatchesSubtype(series.name, subtype),
                        ),
                    )
                    filteredSeries.push(...acSeries)
                }
            }

            if (checkedTypes.includes('DC')) {
                // Check if any DC subtypes are selected
                const dcSubtypesSelected = subTypesMap.DC.some((subtype) =>
                    checkedTypes.includes(subtype),
                )

                if (dcSubtypesSelected) {
                    // Only include series that match the selected subtypes
                    subTypesMap.DC.forEach((subtype) => {
                        if (checkedTypes.includes(subtype)) {
                            const matchingSeries = allSeries.filter((series) =>
                                seriesMatchesSubtype(series.name, subtype),
                            )
                            filteredSeries.push(...matchingSeries)
                        }
                    })
                } else {
                    // If no subtypes are selected, include all DC series
                    const dcSeries = allSeries.filter((series) =>
                        subTypesMap.DC.some((subtype) =>
                            seriesMatchesSubtype(series.name, subtype),
                        ),
                    )
                    filteredSeries.push(...dcSeries)
                }
            }
        }

        // Ensure unique series
        const uniqueSeries = Array.from(
            new Map(filteredSeries.map((item) => [item.name, item])).values(),
        )

        // Split into two groups
        const half = Math.ceil(uniqueSeries.length / 2)
        setGroupASeries(uniqueSeries.slice(0, half))
        setGroupBSeries(uniqueSeries.slice(half))

        // Update active colors
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
        setCheckedTypes((prev) => {
            let updated = [...prev]

            if (prev.includes(type)) {
                // Remove the type
                updated = updated.filter((t) => t !== type)

                // If it's a parent type, also remove all its subtypes
                if (subTypesMap[type]) {
                    updated = updated.filter(
                        (t) => !subTypesMap[type].includes(t),
                    )
                }

                // If it's Power, remove all types
                if (type === 'Power') {
                    updated = []
                }
            } else {
                // If it's Power, remove all other types first
                if (type === 'Power') {
                    updated = ['Power']
                } else {
                    // If Power is already selected, remove it
                    if (updated.includes('Power')) {
                        updated = updated.filter((t) => t !== 'Power')
                    }

                    // Add the type
                    updated.push(type)

                    // If it's a subtype, make sure its parent is checked too
                    const parentType = getParentType(type)
                    if (parentType && !updated.includes(parentType)) {
                        updated.push(parentType)
                    }
                }
            }

            return updated
        })
    }

    // Determine which filters to show based on current selection
    const showMainTypes = () => mainTypes

    // Only show subtypes for selected parent types
    const showSubtypes = () => {
        const result: Record<string, string[]> = {}

        Object.entries(subTypesMap).forEach(([parent, types]) => {
            if (checkedTypes.includes(parent)) {
                result[parent] = types
            }
        })

        return result
    }

    return (
        <Loading loading={isLoading}>
            <div className="flex flex-col 2xl:grid grid-cols-4 gap-4">
                <div className="col-span-4 2xl:col-span-3">
                    <Solar />
                </div>
                <div className="2xl:col-span-1 mt-8">
                    <Metrics
                        // data={data[selectedPeriod].metrics}
                        selectedPeriod={selectedPeriod}
                    />
                </div>
            </div>
            {data && (
                <div className="flex flex-col gap-2 mt-12">
                    <AnalyticHeader
                        selectedPeriod={selectedPeriod}
                        onSelectedPeriodChange={setSelectedPeriod}
                        selectedType={checkedTypes.join(', ')}
                        onSelectedTypeChange={(type) => {
                            setCheckedTypes([type])
                        }}
                    />

                    {/* Chart Component */}
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

                    {/* Main filter types - Always shown */}
                    {/* Main filter types - Always shown */}
                    <div className="flex flex-wrap gap-4 mb-2">
                        {showMainTypes().map((type) => {
                            const isChecked = checkedTypes.includes(type)
                            return (
                                <label
                                    key={type}
                                    onClick={() => handleCheckboxChange(type)}
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
                        })}
                    </div>

                    {/* Subtypes section - Only shown for selected parent types */}
                    {Object.entries(showSubtypes()).map(
                        ([mainType, subtypes]) => (
                            <div
                                key={mainType}
                                className="flex flex-wrap gap-4 mb-2 ml-6"
                            >
                                {subtypes.map((subType) => {
                                    const isChecked =
                                        checkedTypes.includes(subType)
                                    return (
                                        <label
                                            key={subType}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-md border cursor-pointer transition-all
                                        ${isChecked ? 'bg-blue-100 border-blue-500' : 'bg-gray-100 border-gray-300'}
                                        hover:bg-blue-200`}
                                            onClick={() =>
                                                handleCheckboxChange(subType)
                                            }
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                readOnly
                                                className="w-4 h-4 accent-blue-600"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                {subType}
                                            </span>
                                        </label>
                                    )
                                })}
                            </div>
                        ),
                    )}

                    {/* Color Switches - Only show for active series */}
                    {(groupASeries.length > 0 || groupBSeries.length > 0) && (
                        <div className="flex gap-4 flex-wrap mt-4">
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
                                            backgroundColor:
                                                activeColors.includes(color)
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
                    )}
                </div>
            )}
        </Loading>
    )
}

export default AnalyticDashboard
