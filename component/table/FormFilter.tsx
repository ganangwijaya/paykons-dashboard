import { chakra, Flex, Input, InputGroup, Select } from "@chakra-ui/react"
import { Column, Table as TableData } from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"

export const Filter = ({ column, table, type }: { column: Column<any, unknown>, table: TableData<any>, type: undefined | string }) => {
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
      {column.columnDef.header == 'Date' ?
        <>
          {type == 'select' ?
            <>
              <Select size={'xs'}
                value={(columnFilterValue ?? '') as string}
                defaultValue={column.getFacetedMinMaxValues()?.[0] ? column.getFacetedMinMaxValues()?.[0].toString().split('-')[0] : ''}
                onChange={(e) => { column.setFilterValue(String(e.target.value)) }}
              >
                {['2013', '2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'].map((value: any, index: any) => (
                  <chakra.option value={value} key={index} >{value}</chakra.option>
                ))}
              </Select>
            </>
            :
            <DebouncedInput
              type={type}
              value={(columnFilterValue ?? '') as string}
              onChange={value => {
                try {
                  column.setFilterValue(value);
                } catch (error) {
                }
              }}
              list={column.id + 'list'}
            />
          }
        </> :
        <>
          <chakra.datalist id={column.id + 'list'}>
            {sortedUniqueValues.slice(0, 5000).map((value: any, index: any) => (
              <option value={value} key={index} />
            ))}
          </chakra.datalist>
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

export const DebouncedInput = ({ value: initialValue, onChange, debounce = 500, ...props }:
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
      <Input {...props} size={'xs'} rounded={'md'} value={value} onChange={e => setValue(e.target.value)} />
    </InputGroup>
  )
}
