import Card from '@/components/ui/Card'
import GrowShrinkValue from '@/components/shared/GrowShrinkValue'
import classNames from '@/utils/classNames'
import { NumericFormat } from 'react-number-format'
import { TbUsers, TbCoins, TbClick } from 'react-icons/tb'
import { MetricsData, Period } from '../types'
import type { ReactNode } from 'react'

type WidgetProps = {
    title: string
    value: string | number | ReactNode
    growShrink: number
    compareFrom: string
    icon: ReactNode
    iconClass: string
}

type MetricsProps = {
    data: MetricsData
    selectedPeriod: Period
}

const vsPeriod: Record<Period, string> = {
    thisMonth: 'vs last month',
    thisWeek: 'vs last week',
    thisYear: 'vs last year',
}

const Widget = ({
    title,
    growShrink,
    value,
    compareFrom,
    icon,
    iconClass,
}: WidgetProps) => {
    return (
        <Card className="flex-1">
            <div className="flex justify-between gap-2 relative">
                <div>
                    <div className="mb-10 text-base">{title}</div>
                    <h3 className="mb-1">{value}</h3>
                    <div className="inline-flex items-center flex-wrap gap-1">
                        <GrowShrinkValue
                            className="font-bold"
                            value={growShrink}
                            suffix="%"
                            positiveIcon="+"
                            negativeIcon=""
                        />
                        <span>{compareFrom}</span>
                    </div>
                </div>
                <div
                    className={classNames(
                        'flex items-center justify-center min-h-12 min-w-12 max-h-12 max-w-12 text-gray-900 rounded-full text-2xl',
                        iconClass,
                    )}
                >
                    {icon}
                </div>
            </div>
        </Card>
    )
}

const Metrics = ({  selectedPeriod }: MetricsProps) => {
    return (
        <div className="flex flex-col 2xl:flex-col xl:flex-row gap-4">
            <Widget
                title="Visitor"
                value={
                    <NumericFormat
                        displayType="text"
                        value={9}
                        thousandSeparator={true}
                    />
                }
                growShrink={9}
                compareFrom={vsPeriod[selectedPeriod]}
                icon={<TbUsers />}
                iconClass="bg-orange-200"
            />
            <Widget
                title="Conversion rate"
                value={`${8}%`}
                growShrink={8}
                compareFrom={vsPeriod[selectedPeriod]}
                icon={<TbCoins />}
                iconClass="bg-emerald-200"
            />
            <Widget
                title="Ad campaign clicks"
                value={
                    <NumericFormat
                        displayType="text"
                        value={7}
                        thousandSeparator={true}
                    />
                }
                growShrink={8}
                compareFrom={vsPeriod[selectedPeriod]}
                icon={<TbClick />}
                iconClass="bg-purple-200"
            />
        </div>
    )
}

export default Metrics
