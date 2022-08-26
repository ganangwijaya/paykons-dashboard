import { RoleState, PermissionState } from "../utils/interface"

export const PermissioData: PermissionState[] = [
  {
    id: 1,
    name: 'Manage Member',
    status: true,
    lastUpdate: '2022-01-01T12:00:00.000+07:00',
  },
  {
    id: 2,
    name: 'Add Transaction',
    status: true,
    lastUpdate: '2022-01-01T12:00:00.000+07:00',
  }
]

export const RoleData: RoleState[] = [
  {
    id: 1,
    name: 'Superadmin',
    permission: [...PermissioData],
    lastUpdate: '2022-01-01T12:00:00.000+07:00',
  },
  {
    id: 2,
    name: 'Member',
    permission: [PermissioData[1]],
    lastUpdate: '2022-01-01T12:00:00.000+07:00',
  }
]