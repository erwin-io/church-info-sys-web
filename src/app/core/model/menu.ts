import { NavItem } from "src/app/core/model/nav-item";


export let menu: NavItem[] = [
  {
    displayName: 'Reservations',
    iconName: 'today',
    route: 'reservations',
    isParent: false,
  },
  {
    displayName: 'Request',
    iconName: 'assignment_turned_in',
    route: 'requests',
    isParent: false,
  },
  {
    displayName: 'Configuration',
    iconName: 'settings',
    route: 'configuration',
    isParent: true,
    children: [
      {
        displayName: 'Priest',
        iconName: 'radio_button_checked',
        route: 'configuration/priest',
        isParent: false,
      },
    ]
  },
  {
    displayName: 'Security',
    iconName: 'security',
    route: 'security',
    isParent: true,
    children: [
      {
        displayName: 'Users',
        iconName: 'account_circle',
        route: 'security/users',
        isParent: false,
      },
      {
        displayName: 'Roles',
        iconName: 'supervisor_account',
        route: 'security/roles',
        isParent: false,
      },
    ]
  }
];
