import { Autocomplete, Skeleton } from "@material-ui/core";
import getCurrencies from "app/currencies/queries/getCurrencies";
import { useQuery } from "blitz";
import { FC, Suspense } from "react";
import TextField, { TextFieldProps } from "@material-ui/core/TextField";

import { useField, useForm } from "react-final-form";

interface CurrencySelectProps {
  name: string;
  disabled?: boolean;
  inputProps?: TextFieldProps;
}

const CurrencySelectInput: FC<CurrencySelectProps> = ({ name, disabled, inputProps }) => {
  const [allCurrencies] = useQuery(
    getCurrencies,
    {},
    {
      staleTime: Infinity,
    }
  );

  const form = useForm();
  const {
    input,
    meta: { error, touched, submitError },
  } = useField(name, { value: null });

  const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError;

  return (
    <Autocomplete
      {...input}
      options={allCurrencies}
      disabled={disabled}
      onChange={(_, value) => {
        form.change(name, value);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Currency"
          fullWidth
          error={!!normalizedError && touched}
          helperText={touched ? normalizedError : ""}
          {...inputProps}
        />
      )}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => (option ? option.symbol + " - " + option.description : "")}
      fullWidth
    />
  );
};

const CurrencySelect: FC<CurrencySelectProps> = (props) => {
  return (
    <Suspense fallback={<Skeleton variant="rectangular" height="56px" />}>
      <CurrencySelectInput {...props} />
    </Suspense>
  );
};

export default CurrencySelect;
