import { ApexOptions } from "apexcharts"
import theme from "../styles/theme";
import { BalanceState } from "../utils/interface";

export const BalancesCharts = (data: BalanceState[]) => {
  const CashFlowChartData: ApexOptions = {
    series: [
      {
        name: "Income",
        data: [...data.map((d) => d.income)]
      },
      {
        name: "Outcome",
        data: [...data.map((d) => d.outcome)]
      }
    ],
    chart: {
      id: "cashflow",
      type: 'area',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false,
      },
      fontFamily: 'Inter, sans-serif',
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        useSeriesColors: true,
      },
      itemMargin: {
        horizontal: 10,
      },
      markers: {
        width: 8,
        height: 8,
        radius: 8,
        offsetX: -4,
        offsetY: 0
      },
    },
    colors: [theme.colors.chartBlue, theme.colors.chartRed],
    fill: {
      colors: [theme.colors.chartBlue, theme.colors.chartRed],
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        stops: [0, 100]
      }
    },
    stroke: {
      curve: "smooth"
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      strokeDashArray: 6,
      borderColor: ''
    },
    xaxis: {
      type: "datetime",
      categories: [...data.map(d => d.month)],
      labels: {
        format: 'MMM',
        style: {
          colors: '',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#FFF',
        },
        formatter: function (value) {
          return (new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'compact' }).format(value))
        }
      }
    },
    tooltip: {
      theme: 'dark',
      x: {
        format: 'MMM y'
      },
    },
  }

  const BalancesChartData: ApexOptions = {
    series: [{
      name: 'Balances',
      data: [...data.map(d => d.balance)]
    }],
    chart: {
      id: 'balancesData',
      type: 'bar',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false,
      },
      fontFamily: 'Inter, sans-serif',
    },
    dataLabels: {
      enabled: false
    },
    grid: {
      strokeDashArray: 6,
    },
    colors: [theme.colors.chartBlue],
    xaxis: {
      type: "datetime",
      categories: [...data.map(d => d.month)],
      labels: {
        format: 'MMM',
        style: {
          colors: '#FFF',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#FFF',
        },
        formatter: function (value) {
          return (new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, notation: 'compact' }).format(value))
        }
      }
    },
    tooltip: {
      theme: 'dark',
      x: {
        format: 'MMM y'
      },
    },
  }

  return [CashFlowChartData, BalancesChartData]
}

export const MemberChartData: ApexOptions = {
  series: [18, 4, 12],
  chart: {
    id: "member",
    toolbar: {
      show: false
    },
    type: 'donut',
    fontFamily: 'Inter, sans-serif',
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    labels: {
      useSeriesColors: true,
    },
    markers: {
      width: 8,
      height: 8,
      radius: 8,
      offsetX: -4,
      offsetY: 0
    },
  },
  colors: [theme.colors.chartBlue, '#718096', theme.colors.chartRed],
  labels: ['Confirmed', 'Unconfirmed', 'Hasn’t paid yet'],
  dataLabels: {
    enabled: false
  },
  tooltip: {
    theme: 'dark',
  },
  stroke: {
    colors: ['transparent'],
  },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            show: true,
            offsetY: 22,
          },
          value: {
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#FFF',
            offsetY: -15,
          },
          total: {
            fontSize: '1rem',
            fontWeight: 600,
            show: true,
          }
        }
      }
    }
  }
}