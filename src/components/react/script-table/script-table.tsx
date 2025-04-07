import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Script } from "@/types/script";
import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns } from "./columns";
import { Typography } from "../typography";
import { Filters, type TableFilter } from "./filters";
import type { CharacterName } from "@/data/characters/registry";

export const ScriptTable = ({ scripts }: { scripts: Script[] }) => {
  const [globalFilter, setGlobalFilter] = useState<TableFilter>({
    selectedCharacters: [],
    filterText: "",
  });

  const table = useReactTable({
    data: scripts,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      globalFilter,
    },
    // This is kinda hacky, but it works.
    globalFilterFn: (row, _, { filterText, selectedCharacters }: TableFilter) => {
      const name = row.getValue("name") as string;
      const author = row.getValue("author") as string;

      const matchesName =
        filterText === "" || name.toLowerCase().includes(filterText.toLowerCase());
      const matchesAuthor =
        filterText === "" || author.toLowerCase().includes(filterText.toLowerCase());

      const matchesCharacters =
        selectedCharacters.length === 0 ||
        selectedCharacters.every((character) =>
          (row.original.characters as CharacterName[]).includes(character),
        );

      return (matchesName || matchesAuthor) && matchesCharacters;
    },
  });

  return (
    <div className="space-y-4">
      <Filters globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => {
                  window.location.href = `/scripts/${row.original.id}`;
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <Typography variant="caption">No results.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
