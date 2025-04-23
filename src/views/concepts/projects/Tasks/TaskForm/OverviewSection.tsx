import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { FormItem } from "@/components/ui/Form";
import { Controller, useWatch } from "react-hook-form";
import { DatePicker, Select } from "@/components/ui";
import { useEffect, useState } from "react";
import { FormSectionBaseProps } from "./types";
import PaginatedSelect from "@/views/concepts/PaginatedSelect";
import AxiosBase from "@/services/axios/AxiosBase";

type OverviewSectionProps = FormSectionBaseProps;

const OverviewSection = ({
  control,
  errors,
  viewcustomer = false,
  SetName,
}: OverviewSectionProps) => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [staffOptions, setStaffOptions] = useState([]);
  const selectedCustomerId = useWatch({ control, name: "customer" });

  const fetchCustomer = async () => {
    try {
      const response = await AxiosBase.get(`api/crm/customer/`);
      if (response.data.data && Array.isArray(response.data.data)) {
        const formattedOptions = response.data.data.map((customer: any) => ({
          value: customer.id,
          label: customer.first_name,
        }));
        setStaffOptions(formattedOptions);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await AxiosBase.get(`api/crm/status/`);
      setStatus(
        response.data.data.map((stat: any) => ({
          value: stat.id.toString(),
          label: stat.display_name,
        }))
      );
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
    fetchStatus();
  }, []);

  const selectedCustomer = staffOptions.find(
    (option) => option.value === selectedCustomerId
  );

  return (
    <Card>
      <div className="grid md:grid-cols-2 gap-4">
        <FormItem label="Customer" invalid={Boolean(errors.customer)}>
          <Controller
            name="customer"
            control={control}
            render={({ field }) => {
              return (
                <Select
                  {...field}
                  isLoading={loading}
                  onChange={(selectedOption) => {
                    field.onChange(selectedOption?.value);
                    SetName(`${selectedOption?.label}`);
                  }}
                  placeholder="Select customer"
                  isClearable
                  options={staffOptions}
                  value={
                    staffOptions.find((opt) => opt.value === field.value) ||
                    null
                  }
                />
              );
            }}
          />
        </FormItem>

        {/* Name Field (Auto-filled based on selected customer) */}
        <FormItem
          label="Name"
          invalid={Boolean(errors.name)}
          errorMessage={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                autoComplete="off"
                placeholder="Name"
                disabled
                {...field}
                value={selectedCustomer?.label || ""}
              />
            )}
          />
        </FormItem>

        <PaginatedSelect
          control={control}
          name="owner"
          label="Owner"
          url="api/hrms/employee/"
          errors={errors}
          placeholder="Search for owner..."
          disabled={viewcustomer}
        />
        <PaginatedSelect
          control={control}
          name="second_owner"
          label="Second Owner "
          url="api/hrms/employee/"
          errors={errors}
          placeholder="Search for second_owner..."
          disabled={viewcustomer}
        />

        <FormItem
          label="Due Date"
          invalid={Boolean(errors.due_date)}
          errorMessage={errors.due_date?.message}
        >
          <Controller
            name="due_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                placeholder="Pick a due_date"
                {...field}
                disabled={viewcustomer}
                onChange={(date) => {
                  const formattedDate = date
                    ? date.toLocaleDateString("en-CA")
                    : "";
                  field.onChange(formattedDate);
                }}
                value={field.value ? new Date(field.value) : null}
              />
            )}
          />
        </FormItem>
        {/* Reason Input */}
        <FormItem
          label="Status"
          invalid={Boolean(errors.status)}
          errorMessage={errors.status?.message}
        >
          <Controller
            name="status"
            control={control}
            render={({ field }) => {
              const selectedOption = Array.isArray(status)
                ? status.find(
                    (option) => option.value === field.value?.toString()
                  )
                : null;

              return (
                <Select
                  {...field}
                  isDisabled={viewcustomer}
                  options={status}
                  onChange={(selectedOption) => {
                    field.onChange(
                      selectedOption ? selectedOption.value : null
                    );
                  }}
                  placeholder="Select status"
                  value={selectedOption || null}
                />
              );
            }}
          />
        </FormItem>

        <FormItem
          label="Description"
          invalid={Boolean(errors.description)}
          errorMessage={errors.description?.message}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                autoComplete="off"
                placeholder="description"
                disabled={viewcustomer}
                {...field}
              />
            )}
          />
        </FormItem>

        <PaginatedSelect
          control={control}
          name="referral"
          label="Referral"
          url="api/crm/contact_person/fetch_all/"
          errors={errors}
          placeholder="Search for Referral..."
          onChange={(selectedValue, selectedLabel) => {
            console.log("Selected Value:", selectedValue);
            console.log("Selected Label:", selectedLabel);
          }}
          getOptionLabel={(option) => option.first_name}
          getOptionValue={(option) => option.id}
        />
      </div>
    </Card>
  );
};

export default OverviewSection;
