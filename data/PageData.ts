export const DashboardMenu = { title: 'Dashboard', path: '/dashboard', icon: 'ri-dashboard-fill' }

export const PaymentMenu = [
  { title: 'Transaction', path: '/transaction', icon: 'ri-exchange-fill' },
  { title: 'Member', path: '/member', icon: 'ri-team-fill' },
  { title: 'Payout', path: '/payout', icon: 'ri-bank-card-line' },
  { title: 'Balances', path: '/balances', icon: 'ri-scales-line' },
  { title: 'Subcription', path: '/subcription', icon: 'ri-check-double-line' },
  { title: 'Payment Plan', path: '/plan', icon: 'ri-list-check-2' },
]

export const ChildMenu = [
  { title: 'Member Payout', parent: 'Payout', path: '/payout/[memberid]', icon: 'ri-bank-card-line' },
  { title: 'Member Detail', parent: 'Member', path: '/member/[memberid]', icon: 'ri-team-fill' },
  { title: 'Add Member', parent: 'Member', path: '/member/add', icon: 'ri-team-fill' },
]

export const PreferenceMenu = [
  { title: 'Audit Logs', path: '/logs', icon: 'ri-eye-fill' },
  { title: 'Setting', path: '/setting', icon: 'ri-settings-3-fill' },
]