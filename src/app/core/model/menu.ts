import { NavItem } from "src/app/core/model/nav-item";


export let menu: NavItem[] = [
  {
    displayName: 'Reservations',
    iconName: 'today',
    route: 'reservations',
    isParent: false,
  },
  {
    displayName: 'Certificates',
    iconName: 'assignment_turned_in',
    route: 'certificates',
    isParent: true,
    children: [
      {
        displayName: 'Baptismal',
        iconName: 'perm_contact_calendar',
        route: 'certificates/baptismal',
        isParent: false,
      },
      {
        displayName: 'Confirmation',
        iconName: 'check_circle_outline',
        route: 'certificates/confirmation',
        isParent: false,
      },
      {
        displayName: 'Marriage Contract',
        iconName: 'collections_bookmark',
        route: 'certificates/marriage-contract',
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
