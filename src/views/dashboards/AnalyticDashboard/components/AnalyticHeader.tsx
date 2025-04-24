import { useState } from 'react'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import DatePickerRange from '@/components/ui/DatePicker/DatePickerRange'
import useDashboardStore from '@/store/dashboardStore'
import { Card } from '@/components/ui'
import type { Period } from '../types'

type GroupOption = {
    value: string
    label: string
    color: string
}

type AnalyticHeaderProps = {
    selectedPeriod: Period
    onSelectedPeriodChange: (period: Period) => void
    groupOptions: GroupOption[]
    groupASelection: string[]
    groupBSelection: string[]
    onGroupAChange: (names: string[]) => void
    onGroupBChange: (names: string[]) => void
}

const AnalyticHeader = ({}: AnalyticHeaderProps) => {
    const {
        temp_start_date,
        temp_end_date,
        temp_company,
        setTempFilters,
        applyFilters,
        resetFilters,
    } = useDashboardStore()

    const [selectedRange, setSelectedRange] = useState<
        [Date | null, Date | null]
    >([new Date(temp_start_date), new Date(temp_end_date)])

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        if (dates[0] && dates[1]) {
            setSelectedRange(dates)
            setTempFilters(
                dates[0]?.toLocaleDateString('en-CA'),
                dates[1]?.toLocaleDateString('en-CA'),
                temp_company,
            )
        }
    }

    const colourOptions = [
        { value: 'ocean', label: 'Ocean', color: '#00B8D9' },
        { value: 'blue', label: 'Blue', color: '#0052CC' },
        { value: 'purple', label: 'Purple', color: '#5243AA' },
        { value: 'red', label: 'Red', color: '#FF5630' },
        { value: 'orange', label: 'Orange', color: '#FF8B00' },
        { value: 'yellow', label: 'Yellow', color: '#FFC400' },
        { value: 'green', label: 'Green', color: '#36B37E' },
        { value: 'forest', label: 'Forest', color: '#00875A' },
        { value: 'slate', label: 'Slate', color: '#253858' },
        { value: 'silver', label: 'Silver', color: '#666666' },
    ]

    return (
        <div>
            <Card className="mt-2 mb-2">
                <div className="grid grid-flow-col auto-cols-max gap-2 items-end">
                    <div className="min-w-[250px]">
                        <div className="mb-2 text-gray-900 font-semibold">
                            Industry
                        </div>
                        <Select
                            placeholder="Select Industry"
                            options={colourOptions}
                        />
                    </div>

                    <div className="">
                        <div className="mb-2 text-gray-900 font-semibold">
                            Date
                        </div>
                        <DatePickerRange
                            className="max-w-[250px]"
                            placeholder="Select date range"
                            singleDate={true}
                            value={selectedRange}
                            onChange={handleDateChange}
                            maxDate={new Date()}
                        />
                    </div>

                    <div className="">
                        <div className="flex justify-center gap-2">
                            <Button onClick={applyFilters}>Search</Button>
                            <Button onClick={resetFilters}>Reset</Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default AnalyticHeader
