import { FC, ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@material-ui/core";
import Form from "app/core/components/Form";
import CurrencySelect from "app/core/components/CurrencySelect";
import { Close } from "@material-ui/icons";
import { invalidateQuery, useMutation } from "blitz";
import updateWallet from "app/wallets/mutations/updateWallet";
import { WalletConfig } from "app/wallets/validations";
import getWalletTotal from "app/wallets/queries/getWalletTotal";
import { Form as FinalForm, FormProps as FinalFormProps } from "react-final-form";
import { z } from "zod";

interface WalletConfigModalProps<S extends z.ZodType<any, any>> {
  open: boolean;
  handleClose: () => void;
  title: string;
  schema?: S;
  onSubmit: FinalFormProps<z.infer<S>>["onSubmit"];
  initialValues?: FinalFormProps<z.infer<S>>["initialValues"];
  children: ReactNode;
}

const ModalForm = <S extends z.ZodType<any, any>>({
  open,
  handleClose,
  title,
  schema,
  onSubmit,
  initialValues,
  children,
}: WalletConfigModalProps<S>) => {
  const [update] = useMutation(updateWallet);
  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle className="flex justify-between items-center">
        {title}
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <Form onSubmit={onSubmit} initialValues={initialValues} schema={schema}>
        <DialogContent dividers>{children}</DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};

export default ModalForm;
