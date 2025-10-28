import toast from "react-hot-toast";
import { AlertError, AlertSuccess } from "@/components/ui/Alert";
import { ElementType } from "react";

type ToastType = "success" | "error";
type ToastMessage = string;

export function showToast(type: ToastType, message: ToastMessage) {
  const dismissToast = (id: string) => toast.dismiss(id);

  const showAlert = (AlertComponent: ElementType) => {
    toast.custom(
      (t) => (
        <div className={`${t.visible ? "animate-enter" : "animate-leave"}`}>
          <AlertComponent
            message={message}
            hasCloseIcon={true}
            close={() => dismissToast(t.id)}
          />
        </div>
      ),
      { style: { padding: 0 } },
    );
  };

  if (type === "success") {
    showAlert(AlertSuccess);
  } else if (type === "error") {
    showAlert(AlertError);
  }
}
