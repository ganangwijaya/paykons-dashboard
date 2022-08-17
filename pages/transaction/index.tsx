import { ReactElement, useEffect, useMemo, useState } from "react"

import Head from 'next/head'
import dynamic from 'next/dynamic'
import { Badge, Box, Button, ButtonGroup, Flex, Grid, GridItem, Heading, IconButton, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuDivider, MenuItem, MenuItemOption, MenuList, MenuOptionGroup, NumberInput, NumberInputField, Select, Stack, Text } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/react'

import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react'
import {
  Column, Table as TableData, useReactTable, createColumnHelper, getCoreRowModel, flexRender, getSortedRowModel, SortingState, getFilteredRowModel, getFacetedRowModel, getFacetedUniqueValues, getFacetedMinMaxValues, ColumnFiltersState, getPaginationRowModel,
} from "@tanstack/react-table"

import DashboardLayout from "../../component/layout/DashboardLayout"
import { DataState } from "../../utils/interface"
import { TransactionData } from "../../data/transaction/dataTransaction"

const TransactionPage = () => {
  const bg = useColorModeValue('gray.50', 'gray.800');
  const iconBG = useColorModeValue('blue.500', 'blue.400');
  const iconColor = useColorModeValue('gray.100', 'gray.100');
  const increaseColor = useColorModeValue('green.500', 'green.400');
  const decreaseColor = useColorModeValue('red.500', 'red.400');

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const data: DataState[] = useMemo(
    () => [...TransactionData], [],
  )

  const columnHelper = createColumnHelper<DataState>();

  const columns = [
    columnHelper.accessor('name', {
      cell: i => i.getValue()
    }),
    columnHelper.accessor('amount', {
      cell: i => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'compact' }).format(i.getValue())
    }),
    columnHelper.accessor('transactionDate', {
      header: 'Datetime',
      cell: i => i.getValue()
    }),
    columnHelper.accessor('pic', {
      cell: i => i.getValue()
    }),
    columnHelper.accessor('status', {
      cell: i => (
        <Badge colorScheme={i.getValue() == 'confirmed' ? 'green' : 'red'} fontSize={10}>{i.getValue()}</Badge>
      )
    }),
    columnHelper.accessor('id', {
      header: '',
      enableSorting: false,
      cell: i => (
        <Menu>
          <MenuButton as={IconButton} variant={'ghost'} size={'xs'} icon={<i className="ri-more-line"></i>} />
          <MenuList fontSize={'xs'}>
            <MenuItem icon={<i className="ri-bill-line"></i>}>View Payment Evidence</MenuItem>
            <MenuItem _hover={{ color: 'green.500' }} icon={<i className="ri-checkbox-circle-fill"></i>}>Confirm</MenuItem>
            <MenuDivider />
            <MenuItem _hover={{ color: 'red.500' }} icon={<i className="ri-delete-bin-2-fill"></i>}>Delete</MenuItem>
          </MenuList>
        </Menu>
      ),
    }),
  ]

  const table = useReactTable({
    data, columns, state: { sorting, columnFilters },
    onColumnFiltersChange: setColumnFilters, getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onSortingChange: setSorting, getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <Stack mt={4} gap={2}>
      <Grid templateColumns={'repeat(3, 1fr)'} gap={4}>
        <GridItem colSpan={{ base: 3, md: 3 }} bg={bg} p={6} rounded={'xl'} >
          <Flex justifyContent={'space-between'}>
            <Box>
              <Heading as={'h4'} size={'md'}>Transaction Data</Heading>
              {/* <Text fontSize={'xs'}>Monthly cashflow overview.</Text> */}
            </Box>
          </Flex>
          <Box mt={6} overflow={'hidden'} pb={2}>
            <Table colorScheme={'gray'}>
              <Thead>
                {table.getHeaderGroups().map(hg => (
                  <Tr key={hg.id}>
                    {hg.headers.map(h => (
                      <Th role={'group'} key={h.id}>
                        {h.isPlaceholder ? null : (
                          <Flex justifyContent={'space-between'}
                          >
                            <Flex gap={2}>
                              {flexRender(
                                h.column.columnDef.header,
                                h.getContext()
                              )}
                              <chakra.span
                                {...{ onClick: h.column.getToggleSortingHandler() }}
                                cursor={h.column.getCanSort() ? 'pointer' : 'default'}
                                visibility={String(h.column.getIsSorted()) == "false" ? 'hidden' : 'visible'}
                                _groupHover={{ visibility: h.column.getCanSort() ? 'visible' : 'hidden' }}
                                className={String(h.column.getIsSorted()) == "false" ? 'ri-sort-asc' : String(h.column.getIsSorted()) == 'asc' ? 'ri-sort-asc' : 'ri-sort-desc'}>
                              </chakra.span>
                            </Flex>
                            <Menu closeOnSelect={false}>
                              <MenuButton visibility={'hidden'} _groupHover={{ visibility: 'visible' }} as={IconButton} w={4} h={4} variant={'ghost'} fontSize={12} size={'xs'} icon={<i className="ri-more-2-fill"></i>} />
                              <MenuList fontSize={'xs'}>
                                {h.column.columnDef.header == 'Datetime' ?
                                  <MenuOptionGroup textTransform={'capitalize'} fontSize={12} defaultValue='month' title='Filter By' type={'radio'}>
                                    <MenuItemOption isDisabled value='day'>Day</MenuItemOption>
                                    <MenuItemOption value='month'>Month</MenuItemOption>
                                    <MenuItemOption isDisabled value='year'>Year</MenuItemOption>
                                    <Box p={2} ml={2}>
                                      <Filter column={h.column} table={table} />
                                      {/* {h.column.getFilterValue()} */}
                                    </Box>
                                  </MenuOptionGroup>
                                  :
                                  <MenuOptionGroup textTransform={'capitalize'} fontSize={12} defaultValue='month' title='Filter by Input' type={'checkbox'}>
                                    <Box p={2} ml={2}>
                                      <Filter column={h.column} table={table} />
                                      {/* {h.column.getFilterValue()} */}
                                    </Box>
                                  </MenuOptionGroup>
                                }

                                <MenuDivider />
                                <MenuOptionGroup textTransform={'capitalize'} fontSize={12} value={sorting.length == 0 ? 'none' : sorting[0].desc == false && h.column.getIsSorted() ? 'asc' : h.column.getIsSorted() ? 'desc' : 'none'} title='Sort By' type={'radio'}>
                                  <MenuItemOption onClick={() => setSorting([])} value='none'>None</MenuItemOption>
                                  <MenuItemOption onClick={() => setSorting([{ id: h.column.id, desc: false }])} value='asc'>Ascending</MenuItemOption>
                                  <MenuItemOption onClick={() => setSorting([{ id: h.column.id, desc: true }])} value='desc'>Descending</MenuItemOption>
                                </MenuOptionGroup>
                              </MenuList>
                            </Menu>
                          </Flex>
                        )}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody fontSize={12}>
                {table.getRowModel().rows.map(row => (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <Td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Flex justifyContent={'space-between'} mt={4}>
              <Flex gap={2} alignItems={'center'}>
                <Heading as={'h5'} size={'xs'}>Page</Heading>
                <NumberInput mx={1} size={'xs'} defaultValue={table.getState().pagination.pageIndex + 1} >
                  <NumberInputField rounded={'md'}
                    pr={2}
                    w={14}
                    onChange={e => {
                      const page = e.target.value ? Number(e.target.value) - 1 : 0
                      table.setPageIndex(page)
                    }} />
                </NumberInput>
                <Text fontSize={'xs'}>of{' '} {table.getPageCount()}</Text>
                <ButtonGroup gap={1} ml={4}>
                  <IconButton onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} size={'xs'} aria-label={"Prev Page"} icon={<i className="ri-arrow-left-s-line"></i>} />
                  <IconButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} size={'xs'} aria-label={"Next Page"} icon={<i className="ri-arrow-right-s-line"></i>} />
                </ButtonGroup>
              </Flex>
              <Flex gap={2} alignItems={'center'}>
                <Heading as={'h5'} size={'xs'}>Show</Heading>
                <Select
                  size={'xs'}
                  rounded={'md'}
                  value={table.getState().pagination.pageSize}
                  onChange={e => {
                    table.setPageSize(Number(e.target.value))
                  }}
                >
                  {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </Select>
                <Text whiteSpace={'nowrap'} fontSize={'sm'}>of {data.length} row</Text>
              </Flex>
            </Flex>
          </Box>
        </GridItem>
      </Grid>
    </Stack>
  )
}

TransactionPage.getLayout = (page: ReactElement) => {
  return (
    <>
      <Head>
        <title>KonsPay</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <DashboardLayout>
        {page}
      </DashboardLayout>
    </>
  )
}

const Filter = ({ column, table }: { column: Column<any, unknown>, table: TableData<any> }) => {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  return typeof firstValue === 'number' ? (
    <>
      <Flex gap={2}>
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[0] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${column.getFacetedMinMaxValues()?.[0]
            ? `(${column.getFacetedMinMaxValues()?.[0]})`
            : ''
            }`}
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
          value={(columnFilterValue as [number, number])?.[1] ?? ''}
          onChange={value =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${column.getFacetedMinMaxValues()?.[1]
            ? `(${column.getFacetedMinMaxValues()?.[1]})`
            : ''
            }`}
        />
      </Flex>
    </>
  ) : (
    <>
      {column.columnDef.header == 'Datetime' ?
        <>
          <chakra.datalist id={column.id + 'list'}>
            {sortedUniqueValues.slice(0, 5000).map((value: any) => (
              <option value={value} key={value} />
            ))}
          </chakra.datalist>
          <DebouncedInput
            type={'month'}
            value={''}
            onChange={value => {
              try {
                column.setFilterValue(new Intl.DateTimeFormat('id-ID', { month: '2-digit', year: 'numeric', }).format(new Date(value)));
              } catch (error) {
              }
            }}
            placeholder={`Filter... (${column.getFacetedUniqueValues().size})`}
            list={column.id + 'list'}
          />
        </> :
        <>
          <datalist id={column.id + 'list'}>
            {sortedUniqueValues.slice(0, 5000).map((value: any) => (
              <option value={value} key={value} />
            ))}
          </datalist>
          <DebouncedInput
            type={'text'}
            value={(columnFilterValue ?? '') as string}
            onChange={value => column.setFilterValue(value)}
            placeholder={`Filter... (${column.getFacetedUniqueValues().size})`}
            list={column.id + 'list'}
          />
        </>
      }
    </>
  )
}

const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }:
  {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
  } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {

  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <InputGroup size={'xs'}>
      <InputLeftElement
        fontSize={8}
        pointerEvents='none'
        children={<i className="ri-filter-3-line"></i>}
      />
      <Input {...props} size={'xs'} rounded={'md'} value={value} onChange={e => setValue(e.target.value)} />
    </InputGroup>
  )
}

export default TransactionPage