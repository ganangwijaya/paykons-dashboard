import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useColorMode } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export interface ChartState {
  width: string,
  height: string,
  chartOption: ApexOptions
}

const ChartBalances = ({ chartOption, width, height }: ChartState) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const [chartConfig, setChartConfig] = useState<ApexOptions>(chartOption);

  useEffect(() => {
    if (chartOption.chart?.type == 'area') {
      setChartConfig(c => ({
        ...c,
        fill: {
          gradient: {
            ...c.fill?.gradient,
            shade: colorMode == 'dark' ? 'dark' : 'light',
          }
        },
        xaxis: {
          labels: {
            style: {
              colors: colorMode == 'dark' ? '#FFF' : '#171923',
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: colorMode == 'dark' ? '#FFF' : '#171923',
            },
            formatter: function (value) {
              return (new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'compact' }).format(value))
            }
          }
        },
        grid: {
          borderColor: colorMode == 'dark' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.25)',
        },
        tooltip: {
          ...c.tooltip,
          theme: colorMode == 'dark' ? 'dark' : 'light',
        }
      }))
    }
    else if(chartOption.chart?.type == 'donut') {
      setChartConfig(c => ({
        ...c,
        plotOptions: {
          pie: {
            donut: {
              labels: {
                value: {
                  color: colorMode == 'dark' ? '#FFF' : '#171923',
                },
                total: {
                  color: colorMode == 'dark' ? '#FFF' : '#171923',
                }
              }
            }
          }
        }
      }))
    }

    return () => { }
  }, [colorMode])

  return (
    <Chart
      options={chartConfig}
      series={chartOption.series}
      type={chartOption.chart?.type}
      width={width}
      height={height}
    />
  )
}

export default ChartBalances