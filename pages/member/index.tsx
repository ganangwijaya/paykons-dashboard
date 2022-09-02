import { ReactElement, useEffect, useMemo, useState } from "react"

import Head from 'next/head'
import axios from 'axios'

import { Badge, Box, Button, ButtonGroup, Flex, Grid, GridItem, Heading, IconButton, Menu, MenuButton, MenuDivider, MenuItemOption, MenuList, MenuOptionGroup, Select, Stack, TableContainer, Text } from '@chakra-ui/react'
import { Table, Thead, Tbody, Tr, Th, Td, chakra } from '@chakra-ui/react'
import { useColorModeValue } from '@chakra-ui/react'
import { useReactTable, createColumnHelper, getCoreRowModel, flexRender, getSortedRowModel, SortingState, getFilteredRowModel, getFacetedRowModel, getFacetedUniqueValues, getFacetedMinMaxValues, ColumnFiltersState, getPaginationRowModel } from "@tanstack/react-table"

import DashboardLayout from "../../component/layout/DashboardLayout"
import { DebouncedInput, Filter } from "../../component/table/FormFilter"

import { MemberState } from "../../utils/interface"
import { MemberMenuComponent } from "../../component/table/MemberDataMenu"
import { HideData } from "../../component/table/HiddenData"
import { CondensedCard } from "../../component/Card"
import Link from "next/link"

const MemberPage = () => {
  const bg = useColorModeValue('gray.50', 'gray.800');

  const [member, setMember] = useState<MemberState[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [filteredDate, setFilteredDate] = useState<string | 'day' | 'month' | 'year'>('month');
  const columnHelper = createColumnHelper<MemberState>();

  const data: MemberState[] = useMemo(
    () => [...member], [member],
  )

  const columns = [
    columnHelper.accessor('name', {
      cell: i => (
        <Link href={`/member/${i.row.original._id}`} passHref><Button size={'xs'} variant={'unstyled'}>{i.getValue()}</Button></Link>
      )
    }),
    columnHelper.accessor('class', {
      cell: i => i.getValue()
    }),
    columnHelper.accessor('phone', {
      cell: i => {
        return (
          <HideData data={i.getValue()} position={'end'} length={4} />
        )
      }
    }),
    columnHelper.display({
      header: '',
      id: 'action',
      enableSorting: false,
      cell: i => (
        <MemberMenuComponent data={i.row.original} />
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

  var totalClass: number = 0;
  var totalData: number = 0;
  const uniqeClass = table.getColumn('class').getFacetedMinMaxValues();

  if (table.getFilteredRowModel().rows.length > 0) {
    totalData = table.getFilteredRowModel().rows.length;
    totalClass = uniqeClass != undefined ? uniqeClass.length : 0;
  }

  useEffect(() => {
    var mounted: boolean = true;

    const query = `query { 
      member { 
        _id, 
        name, 
        class, 
        phone, 
        bio, 
        role, 
        _lastUpdate 
      }
    }`

    const getMember = async () => {
      await axios.post('/api/graphql', { query }).then(res => {
        const member = res.data.data.member;
        if (mounted) {
          setMember([...member]);
        }
      })
    }

    getMember();
    return () => { mounted = false; }
  }, [])

  return (
    <Stack mt={4} gap={2}>
      <Grid templateColumns={'repeat(4, 1fr)'} gridAutoRows={'1fr'} gap={4}>
        <GridItem colSpan={{ base: 4, md: 2, lg: 1 }} minW={0}>
          <CondensedCard name={'Total Member'} data={totalData} icon={'ri-team-fill'} />
        </GridItem>
        <GridItem colSpan={{ base: 4, md: 2, lg: 1 }} minW={0}>
          <CondensedCard name={'Total Class'} data={totalClass} icon={'ri-ancient-gate-fill'} />
        </GridItem>
        <GridItem colSpan={{ base: 4, md: 4, lg: 2 }}>
          <Flex h={'100%'} w={{ base: '100%', md: 'auto' }} p={4} bg={bg} rounded={'xl'} gap={6} alignItems={{ base: 'flex-start', md: 'center' }} justifyContent={'flex-end'} flexDir={{ base: 'column', md: 'row' }}>
            <Button w={{ base: '100%', md: 'auto' }} size={'sm'} fontWeight={'medium'} leftIcon={<i className="ri-spy-line"></i>} variant={'outline'}>View Member Log</Button>
            <Link href={'/member/add'} passHref>
              <Button w={{ base: '100%', md: 'auto' }} size={'sm'} fontWeight={'medium'} leftIcon={<i className="ri-add-line"></i>} variant={'outline'}>Add New Member</Button>
            </Link>
          </Flex>
        </GridItem>
      </Grid>
      <Grid templateColumns={'repeat(4, 1fr)'} gap={4}>
        <GridItem colSpan={{ base: 4, md: 4 }} bg={bg} p={6} rounded={'xl'} >
          <Flex justifyContent={'space-between'}>
            <Box>
              <Heading as={'h4'} size={'md'}>Member Data</Heading>
              <Text fontSize={'xs'} mt={2}>Member data list.</Text>
            </Box>
            <Box>
              {/* <Menu closeOnSelect={false}>
                <MenuButton as={IconButton} size={'xs'} icon={<i className="ri-more-fill"></i>} />
                <MenuList fontSize={'xs'}>
                  <MenuOptionGroup textTransform={'capitalize'} fontSize={12} value={filteredDate} onChange={(value: string | string[]) => setFilteredDate(String(value))} title='Filter By' type={'radio'}>
                    <MenuItemOption value='day'>Day</MenuItemOption>
                    <MenuItemOption value='month'>Month</MenuItemOption>
                    <MenuItemOption value='year'>Year</MenuItemOption>
                    <Box p={2} ml={2}>
                      <Filter type={filteredDate == 'day' ? 'date' : filteredDate == 'month' ? 'month' : 'select'} column={table.getColumn('transactionDate')} table={table} />
                    </Box>
                    {columnFilters.length > 0 && <MenuItemOption onClick={() => setColumnFilters([])} icon={<i className="ri-format-clear"></i>}>Clear Filter</MenuItemOption>}
                  </MenuOptionGroup>
                </MenuList>
              </Menu> */}
            </Box>
          </Flex>
          <Box mt={6} overflow={'hidden'} pb={2}>
            <TableContainer>
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
                                  color={h.column.getIsSorted() ? 'blue.300' : 'gray.400'}
                                  {...{ onClick: h.column.getToggleSortingHandler() }}
                                  cursor={h.column.getCanSort() ? 'pointer' : 'default'}
                                  visibility={String(h.column.getIsSorted()) == "false" ? 'hidden' : 'visible'}
                                  _groupHover={{ visibility: h.column.getCanSort() ? 'visible' : 'hidden' }}
                                  className={String(h.column.getIsSorted()) == "false" ? 'ri-sort-asc' : String(h.column.getIsSorted()) == 'asc' ? 'ri-sort-asc' : 'ri-sort-desc'}>
                                </chakra.span>
                                <chakra.span
                                  onClick={() => setColumnFilters([])}
                                  cursor={'pointer'}
                                  color={'blue.300'}
                                  display={h.column.getIsFiltered() ? 'block' : 'none'}
                                  className="ri-filter-2-fill"
                                >
                                </chakra.span>
                              </Flex>
                              <Menu closeOnSelect={false}>
                                {(h.column.getCanSort() || h.column.getCanFilter()) && <MenuButton visibility={'hidden'} _groupHover={{ visibility: 'visible' }} as={IconButton} w={4} h={4} variant={'ghost'} fontSize={12} size={'xs'} icon={<i className="ri-more-2-fill"></i>} />}
                                <MenuList fontSize={'xs'}>
                                  {h.column.columnDef.header == 'Date' ?
                                    <MenuOptionGroup textTransform={'capitalize'} fontSize={12} value={filteredDate} onChange={(value: string | string[]) => setFilteredDate(String(value))} title='Filter By' type={'radio'}>
                                      <MenuItemOption value='day'>Day</MenuItemOption>
                                      <MenuItemOption value='month'>Month</MenuItemOption>
                                      <MenuItemOption value='year'>Year</MenuItemOption>
                                      <Box p={2} ml={2}>
                                        <Filter type={filteredDate == 'day' ? 'date' : filteredDate == 'month' ? 'month' : 'select'} column={h.column} table={table} />
                                        {/* {h.column.getFilterValue()} */}
                                      </Box>
                                      {columnFilters.length > 0 && <MenuItemOption onClick={() => setColumnFilters([])} icon={<i className="ri-format-clear"></i>}>Clear Filter</MenuItemOption>}
                                    </MenuOptionGroup>
                                    :
                                    <MenuOptionGroup textTransform={'capitalize'} fontSize={12} defaultValue='month' title='Filter by Input'>
                                      <Box p={2} ml={2}>
                                        <Filter type={'text'} column={h.column} table={table} />
                                        {/* {h.column.getFilterValue()} */}
                                      </Box>
                                      {columnFilters.length > 0 && <MenuItemOption onClick={() => setColumnFilters([])} icon={<i className="ri-format-clear"></i>}>Clear Filter</MenuItemOption>}
                                    </MenuOptionGroup>
                                  }
                                  <MenuDivider />
                                  <MenuOptionGroup textTransform={'capitalize'} fontSize={12} value={sorting.length == 0 ? 'none' : sorting[0].desc == false && h.column.getIsSorted() ? 'asc' : h.column.getIsSorted() ? 'desc' : 'none'} title='Order By' type={'radio'}>
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
            </TableContainer>
            <Flex justifyContent={'space-between'} mt={4} flexDir={{ base: 'column', md: 'row' }} gap={4}>
              <Flex gap={6} alignItems={'center'} justifyContent={'space-between'}>
                <Flex gap={2} alignItems={'center'}>
                  <Heading as={'h5'} size={'xs'}>Page</Heading>
                  <DebouncedInput
                    type={'number'}
                    value={table.getState().pagination.pageIndex + 1}
                    onChange={value => table.setPageIndex(Number(value) - 1)}
                    width={12}
                  />
                  <Text fontSize={'xs'} whiteSpace={'nowrap'}>of {' '} {table.getPageCount()}</Text>
                </Flex>
                <ButtonGroup gap={1} ml={4}>
                  <IconButton onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} size={'xs'} aria-label={"Prev Page"} icon={<i className="ri-arrow-left-s-line"></i>} />
                  <IconButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} size={'xs'} aria-label={"Next Page"} icon={<i className="ri-arrow-right-s-line"></i>} />
                </ButtonGroup>
              </Flex>
              <Flex gap={2} alignItems={'center'} justifyContent={'flex-end'}>
                <Heading as={'h5'} size={'xs'}>Show</Heading>
                <Select
                  w={16}
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
                <Text whiteSpace={'nowrap'} fontSize={'sm'}>of {table.getFilteredRowModel().rows.length} row</Text>
              </Flex>
            </Flex>
          </Box>
        </GridItem>
      </Grid>
    </Stack>
  )
}

MemberPage.getLayout = (page: ReactElement) => {
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

export default MemberPage