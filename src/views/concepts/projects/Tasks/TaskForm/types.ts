import type { Control, FieldErrors } from 'react-hook-form'

interface OverviewFields {
    customer: any;
    owner: number;
    status: string;
    referral: number;
    stage: string;
    second_owner?: number;
    name: string;
    description: string;
    due_date: string;
}

export type AddressFields = {
    country: string
    address: string
    postcode: string
    city: string
}

export type ProfileImageFields = {
    img: string
}

export type TagsFields = {
    tags: Array<{ value: string; label: string }>
}

export type AccountField = {
    banAccount?: boolean
    accountVerified?: boolean
}

export type CustomerFormSchema = OverviewFields

export type FormSectionBaseProps = {
    control: Control<CustomerFormSchema>
    errors: FieldErrors<CustomerFormSchema>
    viewcustomer:boolean
    SetName:any
}
