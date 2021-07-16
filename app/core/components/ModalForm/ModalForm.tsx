import { FC, ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  DialogProps,
} from "@material-ui/core";
import Form, { FormProps } from "app/core/components/Form";
import { Close } from "@material-ui/icons";
import { z } from "zod";
import classNames from "classnames";
import { useForm, useFormState } from "react-final-form";

interface ModalActionsProps {
  handleClose: () => void;
}
interface WalletConfigModalProps<S extends z.ZodType<any, any>>
  extends Omit<FormProps<S>, "submitText">,
    ModalActionsProps {
  open: boolean;
  title: string;
  children: ReactNode;
  maxWidth?: DialogProps["maxWidth"];
  fullScreen?: DialogProps["fullScreen"];
}

const ModalActions: FC<ModalActionsProps> = ({ handleClose }) => {
  const { valid, submitting } = useFormState();
  return (
    <DialogActions>
      <Button variant="outlined" onClick={handleClose}>
        Cancel
      </Button>
      <Button type="submit" variant="contained" disabled={!valid || submitting}>
        Save
      </Button>
    </DialogActions>
  );
};

const ModalForm = <S extends z.ZodType<any, any>>({
  open,
  handleClose,
  title,
  schema,
  onSubmit,
  initialValues,
  className,
  maxWidth,
  fullScreen,
  children,
}: WalletConfigModalProps<S>) => {
  return (
    <Dialog open={open} fullScreen={fullScreen} onClose={handleClose} maxWidth={maxWidth} fullWidth>
      <DialogTitle className="flex justify-between items-center">
        {title}
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <Form onSubmit={onSubmit} initialValues={initialValues} schema={schema} className="h-full">
        <DialogContent dividers className={classNames(className)}>
          {children}
        </DialogContent>
        <ModalActions handleClose={handleClose} />
      </Form>
    </Dialog>
  );
};

export default ModalForm;
