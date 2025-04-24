import { useEffect, useState } from 'react'
import Loading from '@/components/shared/Loading'
import AnalyticHeader from './components/AnalyticHeader'
import WebAnalytic from './components/AnalyticChart'
import { apiGetAnalyticDashboard } from '@/services/DashboardService'
import useSWR from 'swr'
import type { GetAnalyticDashboardResponse, Period } from './types'
import { Switcher } from '@/components/ui'
import SolarLifecycleTracker from './components/solarBadge'

const AnalyticDashboard = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('thisMonth')
    const MAX_VISIBLE_SERIES = 10

    const [groupAActive, setGroupAActive] = useState(true)
    const [groupBActive, setGroupBActive] = useState(false)

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
        const series = data[selectedPeriod].webAnalytic.series.slice(
            0,
            MAX_VISIBLE_SERIES,
        )
        const half = Math.ceil(series.length / 2)
        setGroupASeries(series.slice(0, half))
        setGroupBSeries(series.slice(half))

        // Auto enable A, disable B initially
        setGroupAActive(true)
        setGroupBActive(false)
    }, [data, selectedPeriod])

    console.log(data, 'datataat')
    return (
        <Loading loading={isLoading}>
            {data && (
                <div className="flex flex-col gap-4">
                    {/* <SolarLifecycleTracker
                        sunStatus="active"
                        panelStatus="active"
                        batteryStatus="idle"
                        gridStatus="idle"
                    /> */}

                    <AnalyticHeader
                        selectedPeriod={selectedPeriod}
                        onSelectedPeriodChange={setSelectedPeriod}
                    />
                    <div className="flex flex-col 2xl:grid grid-cols- gap-4">
                        <div className="col-span-4 2xl:col-span-3">
                            <WebAnalytic
                                data={data[selectedPeriod].webAnalytic}
                                activeSeries={[
                                    ...(groupAActive ? groupASeries : []),
                                    ...(groupBActive ? groupBSeries : []),
                                ]}
                            />
                        </div>
                        {/* <div className="2xl:col-span-1">
                            <Metrics
                                data={data[selectedPeriod].metrics}
                                selectedPeriod={selectedPeriod}
                            />
                        </div> */}
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-700 text-base">
                                    Group A
                                </span>
                                <Switcher
                                    checked={groupAActive}
                                    onChange={setGroupAActive}
                                    switcherClass={
                                        groupAActive
                                            ? 'bg-blue-500'
                                            : 'bg-gray-300'
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-700 text-base">
                                    Group B
                                </span>
                                <Switcher
                                    checked={groupBActive}
                                    onChange={setGroupBActive}
                                    switcherClass={
                                        groupBActive
                                            ? 'bg-pink-500'
                                            : 'bg-gray-300'
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    {/* <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-6 xl:col-span-4">
                            <TopPerformingPages
                                data={data[selectedPeriod].topPages}
                            />
                        </div>
                        <div className="col-span-12 md:col-span-6 xl:col-span-4">
                            <DeviceSession
                                data={data[selectedPeriod].deviceSession}
                            />
                        </div>
                        <div className="col-span-12 xl:col-span-4">
                            <TopChannel
                                data={data[selectedPeriod].topChannel}
                            />
                        </div>
                        <div className="col-span-12">
                            <Traffic data={data[selectedPeriod].traffic} />
                        </div>
                    </div> */}
                </div>
            )}
        </Loading>
    )
}

export default AnalyticDashboard
