import { useEffect, useState } from "react";
import { Form } from "@/components/ui/Form";
import Container from "@/components/shared/Container";
import BottomStickyBar from "@/components/template/BottomStickyBar";
import OverviewSection from "./OverviewSection";
import isEmpty from "lodash/isEmpty";
import { useForm } from "react-hook-form";
import type { CommonProps } from "@/@types/common";
import type { CustomerFormSchema } from "./types";
import { useLocation } from "react-router-dom";
import { string, z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type CustomerFormProps = {
  onFormSubmit: (values: CustomerFormSchema) => void;
  defaultValues?: CustomerFormSchema;
  newCustomer?: boolean;
} & CommonProps;

const validationSchema: ZodType = z.object({
  customer: z.number().min(1, { message: "Customer is required" }),
  owner: z.number().min(1, { message: "Owner is required" }),
  second_owner: z.number().min(1, { message: "Second Owner is required" }),
  referral: z.number().min(1, { message: "Referral is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  stage: z.string().optional(),
  due_date: z
    .string()
    .min(1, { message: "Due date is required" })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Invalid date format. Use YYYY-MM-DD.",
    }),
  description: z.string().min(1, { message: "Description is required" }),
});

const TaskForm = (props: CustomerFormProps) => {
  const location = useLocation();
  const isViewRoute = location.pathname.includes("/view/");
  const {
    onFormSubmit,
    defaultValues = {},
    newCustomer = false,
    children,
  } = props;
  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<CustomerFormSchema>({
    defaultValues: {
      // ...{
      //     banAccount: false,
      //     accountVerified: true,
      // },
      ...defaultValues,
    },
    resolver: zodResolver(validationSchema),
  });

  useEffect(() => {
    if (!isEmpty(defaultValues)) {
      reset(defaultValues);
    }
  }, [JSON.stringify(defaultValues)]);
  const [names, SetNames] = useState("");
  const onSubmit = (values: any) => {
    const payload = {
      ...values,
      customer: Array.isArray(values.customer)
        ? values.customer
        : [values.customer],
      name: names || "",
      status:String(values.status)
    };

    onFormSubmit?.(payload);
  };
  return (
    <Form
      className="flex w-full h-full"
      containerClassName="flex flex-col w-full justify-between"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Container>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="gap-4 flex flex-col flex-auto">
            <OverviewSection
              control={control}
              errors={errors}
              viewcustomer={isViewRoute}
              SetName={SetNames}
            />
            {/* <AddressSection control={control} errors={errors} /> */}
          </div>
        </div>
      </Container>
      <BottomStickyBar>{children}</BottomStickyBar>
    </Form>
  );
};

export default TaskForm;
