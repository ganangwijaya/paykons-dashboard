import { ApexOptions } from "apexcharts"
import theme from "../styles/theme";

export const CashFlowChartData: ApexOptions = {
  series: [
    {
      name: "Income",
      data: [4000000, 3600000, 3800000, 4000000, 3600000, 4400000, 4000000, 4200000, 3400000, 3800000, 4000000, 3500000]
    },
    {
      name: "Outcome",
      data: [3900000, 3500000, 3700000, 3900000, 3500000, 4300000, 3900000, 4100000, 3300000, 3700000, 3900000, 3400000]
    }
  ],
  chart: {
    id: "balances",
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
    categories: ["2022-01-19T00:00:00.000Z", "2022-02-19T00:00:00.000Z", "2022-03-19T00:00:00.000Z", "2022-04-19T00:00:00.000Z", "2022-05-19T00:00:00.000Z", "2022-06-19T00:00:00.000Z", "2022-07-19T00:00:00.000Z", "2022-08-19T00:00:00.000Z", "2022-09-19T00:00:00.000Z", "2022-10-19T00:00:00.000Z", "2022-11-19T00:00:00.000Z", "2022-12-19T00:00:00.000Z"],
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