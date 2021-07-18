import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { FC, useState } from "react";
import getTransactions from "app/transactions/queries/getTransactions";
import { usePaginatedQuery, useRouter, Link, Routes } from "blitz";
import formatCurrency from "app/core/utils/formatCurrency";
import { TransactionType } from "db";
import { Decimal } from "@prisma/client/runtime";
import SkeletonArray from "app/core/components/SkeletonArray";
import { Skeleton } from "@material-ui/core";

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

interface TransationTableProps {
  walletId: string;
}

const TransactionsTable: FC<TransationTableProps> = ({ walletId }) => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [response] = usePaginatedQuery(
    getTransactions,
    {
      skip: rowsPerPage * page,
      take: rowsPerPage,
    },
    { suspense: false }
  );

  const { transactions, count } = response || {};

  const handleChangePage = (_: unknown, newPage: number) => {
    router.push({ query: { page: newPage, walletId } });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    router.push({ query: { page: 0, walletId } });
  };

  if (count === 0) {
    return (
      <section className="justify-self-center text-center flex flex-col gap-4">
        <h3 className="text-xl font-bold">
          It looks like you haven&apos;t made any transactions yet.
        </h3>
        <Link href={Routes.ShowWalletPage({ walletId })} passHref>
          <a className="underline">Click here to start using your wallet!</a>
        </Link>
      </section>
    );
  }

  return (
    <Paper className="mx-4 mb-4">
      <TableContainer>
        <Table>
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
            {transactions ? (
              transactions.map((t) => {
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
              })
            ) : (
              <SkeletonArray
                component={
                  <TableRow hover role="checkbox" tabIndex={-1}>
                    {columns.map((column) => {
                      return (
                        <TableCell key={column.id} className={column.className}>
                          <Skeleton width="100%" />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                }
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={count || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TransactionsTable;
