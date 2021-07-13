import { Autocomplete, Button, ListItem } from "@material-ui/core";
import getCurrencies from "app/currencies/queries/getCurrencies";
import { Link, Routes, useInfiniteQuery, useRouter } from "blitz";
import {
  FC,
  useState,
  Fragment,
  useMemo,
  useRef,
  useEffect,
  SetStateAction,
  Dispatch,
} from "react";
import TextField from "@material-ui/core/TextField";

import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import useIntersectionObserver from "app/core/hooks/useIntersectionObserver";
import { useField, useForm } from "react-final-form";
import useDebounce from "app/core/hooks/useDebounce";
import { Currency } from "db";

interface CurrencySelectProps {
  name: string;
}

const Loading = () => <div>⏳ Loading...</div>;

interface CurrencySelectInputProps extends CurrencySelectProps {
  allCurrencies: Currency[];
  fetchNextPage: () => void;
  hasNextPage: boolean;
  filter: string;
  setFilter: Dispatch<SetStateAction<string>>;
}

const CurrencySelectInput: FC<CurrencySelectInputProps> = ({
  allCurrencies,
  fetchNextPage,
  filter,
  hasNextPage,
  name,
  setFilter,
}) => {
  const form = useForm();
  const {
    input,
    meta: { error, touched, submitError },
  } = useField(name, { value: null });

  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

  useIntersectionObserver({
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
    target: buttonRef,
  });

  const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError;

  return (
    <Autocomplete
      {...input}
      options={allCurrencies}
      disablePortal
      onChange={(_, value) => {
        form.change(name, value);
      }}
      inputValue={filter}
      onInputChange={(_, value: string) => setFilter(value)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Currency"
          fullWidth
          error={!!normalizedError && touched}
          helperText={touched ? normalizedError : ""}
        />
      )}
      getOptionLabel={(option) => (option ? option.symbol + " - " + option.description : "")}
      renderOption={(props, option) => {
        if (option.id === "last") {
          return (
            <Button
              className="px-4"
              type="button"
              ref={setButtonRef}
              onClick={() => fetchNextPage()}
            >
              Load More
            </Button>
          );
        }
        return (
          <ListItem {...props} key={option.id}>
            {option.symbol + " - " + option.description}
          </ListItem>
        );
      }}
      filterOptions={(options) => {
        if (!hasNextPage) {
          return options;
        }
        return [
          ...options,
          { id: "last", createdAt: new Date(), description: "", symbol: "", updatedAt: new Date() },
        ];
      }}
      fullWidth
    />
  );
};

const CurrencySelect: FC<CurrencySelectProps> = ({ name }) => {
  const [filter, setFilter] = useState("");
  const debounceFilter = useDebounce(filter, 500);
  const [currencies, { isFetching, isFetchingNextPage, fetchNextPage, hasNextPage }] =
    useInfiniteQuery(
      getCurrencies,
      (page = { take: 20, skip: 0, filter: "" }) => ({ ...page, filter: debounceFilter }),
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
        staleTime: Infinity,
        suspense: false,
      }
    );

  const allCurrencies = useMemo(() => currencies?.flatMap((c) => c.currencies) || [], [currencies]);

  return (
    <CurrencySelectInput
      allCurrencies={allCurrencies}
      fetchNextPage={fetchNextPage}
      filter={filter}
      hasNextPage={!!hasNextPage}
      setFilter={setFilter}
      name={name}
    />
  );
};

export default CurrencySelect;
