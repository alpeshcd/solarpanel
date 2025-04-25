import { useEffect, useRef } from 'react'
import Card from '@/components/ui/Card'
import Chart from '@/components/shared/Chart'
import { useThemeStore } from '@/store/themeStore'
import { NumericFormat } from 'react-number-format'
import type { WebAnalyticData } from '../types'

type WebAnalyticProps = {
    data: WebAnalyticData
    activeSeries: any
}

const WebAnalytic = ({ data, activeSeries }: WebAnalyticProps) => {
    const isFirstRender = useRef(true)

    const sideNavCollapse = useThemeStore(
        (state) => state.layout.sideNavCollapse,
    )

    useEffect(() => {
        if (!sideNavCollapse && isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        if (!isFirstRender.current) {
            window.dispatchEvent(new Event('resize'))
        }
    }, [sideNavCollapse])

    return (
        <Card className="h-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h4>Web analytic</h4>
                <div className="inline-flex items-center gap-6"></div>
            </div>
            <div className="mt-6">
                <div className="flex items-center gap-10">
                    <div>
                        <div className="mb-2">Production</div>
                        <div className="flex items-end gap-2">
                            <h4>
                                <NumericFormat
                                    displayType="text"
                                    value="4"
                                    thousandSeparator={true}
                                />{' '}
                                <span className="text-base text-gray-600">
                                    MWH{' '}
                                </span>
                            </h4>
                        </div>
                    </div>
                    <div>
                        <div className="mb-2">Net Revenue</div>
                        <div className="flex items-end gap-2">
                            <h4>
                                4,036.4
                                <span className="text-base text-gray-600">
                                    INR{' '}
                                </span>
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <Chart
                    type="line"
                    series={activeSeries.map((s: any) => ({
                        name: s.name,
                        data: s.data,
                    }))}
                    xAxis={data.date}
                    height="360px"
                    customOptions={{
                        legend: { show: false },
                        colors: activeSeries.map((s: any) => s.color ?? '#000'),
                    }}
                />
            </div>
        </Card>
    )
}

export default WebAnalytic
