import { useState } from "react";
import Container from "@/components/shared/Container";
import Button from "@/components/ui/Button";
import Notification from "@/components/ui/Notification";
import toast from "@/components/ui/toast";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { TbTrash } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import AxiosBase from "@/services/axios/AxiosBase";
import TaskForm from "../TaskForm/TaskForm";

const TaskCreate = () => {
  const navigate = useNavigate();

  const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false);
  const [isSubmiting, setIsSubmiting] = useState(false);

  const handleFormSubmit = async (values: any) => {
    setIsSubmiting(true);
    try {
      const response = await AxiosBase.post("/api/crm/lead/", values);
      toast.push(<Notification type="success">Task created!</Notification>, {
        placement: "top-center",
      });
      navigate("/concepts/pms/Tasks");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.push(
        <Notification type="danger">
          Failed to create Verification. Please try again.
        </Notification>,
        { placement: "top-center" }
      );
    } finally {
      setIsSubmiting(false);
    }
  };
  const handleConfirmDiscard = () => {
    setDiscardConfirmationOpen(true);
    toast.push(<Notification type="success">Task discardd!</Notification>, {
      placement: "top-center",
    });
    navigate("/concepts/pms/Tasks");
  };

  const handleDiscard = () => {
    setDiscardConfirmationOpen(true);
  };

  const handleCancel = () => {
    setDiscardConfirmationOpen(false);
  };

  return (
    <>
      <TaskForm
        newCustomer
        defaultValues={{
          //@ts-ignore
          employee: 0,
          date: "",
          reason: "",
          customer: [],
          assigned_to: 0,
          status: "",
        }}
        onFormSubmit={handleFormSubmit}
      >
        <Container>
          <div className="flex items-center justify-between px-8">
            <span></span>
            <div className="flex items-center">
              <Button
                className="ltr:mr-3 rtl:ml-3"
                type="button"
                customColorClass={() =>
                  "border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent"
                }
                icon={<TbTrash />}
                onClick={handleDiscard}
              >
                Discard
              </Button>
              <Button variant="solid" type="submit" loading={isSubmiting}>
                Create
              </Button>
            </div>
          </div>
        </Container>
      </TaskForm>
      <ConfirmDialog
        isOpen={discardConfirmationOpen}
        type="danger"
        title="Discard changes"
        onClose={handleCancel}
        onRequestClose={handleCancel}
        onCancel={handleCancel}
        onConfirm={handleConfirmDiscard}
      >
        <p>
          Are you sure you want discard this? This action can&apos;t be undo.{" "}
        </p>
      </ConfirmDialog>
    </>
  );
};

export default TaskCreate;
