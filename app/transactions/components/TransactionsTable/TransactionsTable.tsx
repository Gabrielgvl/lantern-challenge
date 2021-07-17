import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { useState } from "react";
import getTransactions from "app/transactions/queries/getTransactions";
import { usePaginatedQuery, useRouter } from "blitz";
import formatCurrency from "app/core/utils/formatCurrency";
import { TransactionType } from "db";
import { Decimal } from "@prisma/client/runtime";

interface Currency {
  symbol: string;
}

interface Data {
  from: Currency | null;
  amount: Decimal | null;
  to: Currency;
  resultAmount: Decimal;
  createdAt: Date;
  type: TransactionType;
}

interface Column<T extends keyof Data> {
  id: T;
  label: string;
  minWidth?: number;
  format?: (value: Data[T]) => string;
  className?: string;
}

const createColumn = <T extends keyof Data>(column: Column<T>) => column;

const columns: Column<keyof Data>[] = [
  createColumn({
    id: "type",
    label: "Type",
    className: "capitalize",
    format: (value) => value.toLowerCase(),
  }),
  createColumn({
    id: "from",
    label: "From",
    format: (value) => value?.symbol || "-",
  }),
  createColumn({
    id: "amount",
    label: "Amount",
    minWidth: 100,
    format: (value) => (value ? formatCurrency(value.toNumber()) : "-"),
  }),
  createColumn({
    id: "to",
    label: "To",
    format: (value) => value.symbol,
  }),
  createColumn({
    id: "resultAmount",
    label: "Amount",
    minWidth: 170,
    format: (value) => formatCurrency(value.toNumber()),
  }),
  createColumn({
    id: "createdAt",
    label: "Date",
    minWidth: 100,
    format: (value) =>
      Intl.DateTimeFormat(undefined, { dateStyle: "short", timeStyle: "medium" }).format(value),
  }),
];

export default function TransactionsTable() {
  const router = useRouter();
  const page = Number(router.query.page) || 0;

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [{ transactions, count }] = usePaginatedQuery(getTransactions, {
    skip: rowsPerPage * page,
    take: rowsPerPage,
  });

  const handleChangePage = (_: unknown, newPage: number) => {
    const { walletId } = router.params;
    router.push({ query: { page: newPage, walletId } });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    const { walletId } = router.params;
    router.push({ query: { page: 0, walletId } });
  };

  return (
    <Paper className="mx-4 mb-4">
      <TableContainer className="max-h-96">
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} style={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((t) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={t.id}>
                  {columns.map((column) => {
                    const value = t[column.id];
                    return (
                      <TableCell key={column.id} className={column.className}>
                        {column.format ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
