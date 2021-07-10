import { Form, FormProps } from "app/core/components/Form";
import { FormTextField } from "app/core/components/FormTextField";
import { z } from "zod";
export { FORM_ERROR } from "app/core/components/Form";

export function WalletForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <FormTextField name="name" label="Name" placeholder="Name" />
    </Form>
  );
}
