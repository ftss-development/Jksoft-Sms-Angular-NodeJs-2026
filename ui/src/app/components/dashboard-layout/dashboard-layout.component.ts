
import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  href?: string;
  badge?: number;
  exact?: boolean;
  requiredRight?: string; // New field to filter menu items
}

interface MenuGroup {
  label: string;
  expanded: boolean;
  items: MenuItem[];
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {
  private readonly authService = inject(AuthService);
  
  sidebarExpanded = signal(false);
  currentUser = this.authService.currentUser;

  // Initial Menu Structure with Rights
  private readonly _allMenuGroups: MenuGroup[] = [
    {
      label: 'Main Menu',
      expanded: true,
      items: [
        { label: 'Dashboard', icon: 'home', route: '/dashboard', exact: true, requiredRight: 'VIEW_DASHBOARD' },
        { label: 'Service Categories', icon: 'category', route: '/service-categories', requiredRight: 'VIEW_INVENTORY' },
        { label: 'Service Types', icon: 'room_service', route: '/service-types', requiredRight: 'VIEW_INVENTORY' },
        { label: 'Signal Types', icon: 'settings_input_antenna', route: '/signal-types', requiredRight: 'VIEW_INVENTORY' },
        { label: 'Quality Control', icon: 'verified', route: '/quality', requiredRight: 'VIEW_INVENTORY' },
        { label: 'Item Makers', icon: 'precision_manufacturing', route: '/item-makers', requiredRight: 'VIEW_INVENTORY' },
        { label: 'Languages', icon: 'language', route: '/languages', requiredRight: 'VIEW_GEO' }
      ]
    },
    {
      label: 'Finance Admin',
      expanded: true,
      items: [
        { label: 'Tax Management', icon: 'percent', route: '/taxes', requiredRight: 'VIEW_FINANCE' },
        { label: 'Note Types', icon: 'receipt_long', route: '/note-types', requiredRight: 'VIEW_FINANCE' },
        { label: 'Audit Logs', icon: 'receipt_long', route: '/audit-logs', requiredRight: 'MANAGE_ROLES' } // Moved here
      ]
    },
    {
      label: 'Inventory',
      expanded: true,
      items: [
        { label: 'Store Management', icon: 'storefront', route: '/stores', requiredRight: 'VIEW_INVENTORY' },
        { label: 'STB Types', icon: 'router', route: '/stb-types', requiredRight: 'VIEW_INVENTORY' }
      ]
    },
    {
      label: 'Billing System',
      expanded: true,
      items: [
        { label: 'STB Schemes', icon: 'receipt_long', route: '/stb-schemes', requiredRight: 'VIEW_BILLING' }
      ]
    },
    {
      label: 'Documents',
      expanded: true,
      items: [
        { label: 'Categories', icon: 'folder_special', route: '/categories', requiredRight: 'VIEW_DOCS' },
        { label: 'Heads', icon: 'segment', route: '/heads', requiredRight: 'VIEW_DOCS' }
      ]
    },
    {
      label: 'Legal & Compliance',
      expanded: true,
      items: [
        { label: 'Term Categories', icon: 'gavel', route: '/term-categories', requiredRight: 'VIEW_DOCS' }
      ]
    },
    {
      label: 'System Administration',
      expanded: true,
      items: [
        { label: 'Status Management', icon: 'toggle_on', route: '/statuses', requiredRight: 'MANAGE_ROLES' },
        { label: 'Roles', icon: 'badge', route: '/roles', requiredRight: 'VIEW_ROLES' },
        { label: 'System Rights', icon: 'security', route: '/system-rights', requiredRight: 'MANAGE_ROLES' },
        { label: 'Departments', icon: 'apartment', route: '/departments', requiredRight: 'VIEW_DEPTS' },
        { label: 'Sub Departments', icon: 'domain', route: '/sub-departments', requiredRight: 'VIEW_DEPTS' },
        { label: 'Designations', icon: 'badge', route: '/designations', requiredRight: 'VIEW_DEPTS' },
        { label: 'Ticket Heads', icon: 'topic', route: '/ticket-heads', requiredRight: 'VIEW_TICKETS' },
        { label: 'Ticket Reasons', icon: 'help_center', route: '/ticket-reasons', requiredRight: 'VIEW_TICKETS' },
        { label: 'User Management', icon: 'manage_accounts', route: '/users', requiredRight: 'VIEW_USERS' }
      ]
    },
    {
      label: 'Organization',
      expanded: false,
      items: [
         { label: 'Employees', icon: 'groups', route: '/employees', requiredRight: 'VIEW_DEPTS' },
         { label: 'Company Management', icon: 'business', route: '/companies', requiredRight: 'VIEW_FINANCE' }
      ]
    },
    {
      label: 'Financial Assets',
      expanded: false,
      items: [
        { label: 'Bank Accounts', icon: 'account_balance_wallet', route: '/bank-accounts', requiredRight: 'VIEW_FINANCE' },
        { label: 'Banks', icon: 'account_balance', route: '/banks', requiredRight: 'VIEW_FINANCE' }
      ]
    },
    {
      label: 'Customer Management',
      expanded: false,
      items: [
        { label: 'Customers', icon: 'people', route: '/customers', requiredRight: 'VIEW_CUSTOMERS' },
        { label: 'Add Customer', icon: 'person_add', route: '/customers/add', requiredRight: 'MANAGE_CUSTOMERS' }
      ]
    },
    {
      label: 'Infrastructure',
      expanded: false,
      items: [
        { label: 'Amplifiers', icon: 'router', route: '/amplifiers', requiredRight: 'VIEW_INVENTORY' }
      ]
    },
    {
      label: 'Enquiry Management',
      expanded: false,
      items: [
        { label: 'Enquiries', icon: 'contact_support', route: '/enquiries', requiredRight: 'VIEW_TICKETS' }
      ]
    },
    {
      label: 'Particular Management',
      expanded: true,
      items: [
        { label: 'Particulars', icon: 'description', route: '/particulars', requiredRight: 'VIEW_FINANCE' },
        { label: 'Particular Types', icon: 'class', route: '/particular-types', requiredRight: 'VIEW_FINANCE' },
        { label: 'Particular Groups', icon: 'folder_special', route: '/particular-groups', requiredRight: 'VIEW_FINANCE' }
      ]
    },
    {
      label: 'Support',
      expanded: false,
      items: [
        { label: 'Tickets', icon: 'confirmation_number', route: '/tickets', requiredRight: 'VIEW_TICKETS' }
      ]
    },
    {
      label: 'Geo Data',
      expanded: false,
      items: [
        { label: 'Countries', icon: 'public', route: '/countries', requiredRight: 'VIEW_GEO' },
        { label: 'States', icon: 'map', route: '/states', requiredRight: 'VIEW_GEO' },
        { label: 'Cities', icon: 'location_city', route: '/cities', requiredRight: 'VIEW_GEO' },
        { label: 'Districts', icon: 'holiday_village', route: '/districts', requiredRight: 'VIEW_GEO' },
        { label: 'Areas', icon: 'location_on', route: '/areas', requiredRight: 'VIEW_GEO' },
        { label: 'Colonies', icon: 'home_work', route: '/colonies', requiredRight: 'VIEW_GEO' }
      ]
    },
    {
      label: 'Channel Management',
      expanded: false,
      items: [
        { label: 'Channels', icon: 'tv', route: '/channels', requiredRight: 'VIEW_CHANNELS' },
        { label: 'Packages', icon: 'inventory_2', route: '/packages', requiredRight: 'VIEW_BILLING' }
      ]
    }
  ];

  // Filtered menu based on user rights
  menuGroups = computed(() => {
      // 1. Get current state of expanded groups
      const current = this.expandedStates(); // We need a way to preserve expansion state
      
      return this._allMenuGroups.map((group, index) => {
          // Filter items based on rights
          const visibleItems = group.items.filter(item => {
              if (!item.requiredRight) return true; // Public item
              return this.authService.hasRight(item.requiredRight);
          });

          return {
              ...group,
              expanded: current.has(index) ? current.get(index)! : group.expanded,
              items: visibleItems
          };
      }).filter(group => group.items.length > 0); // Hide empty groups
  });

  // Local state to track expansion, initialized with defaults
  private expandedStates = signal<Map<number, boolean>>(new Map(
    this._allMenuGroups.map((g, i) => [i, g.expanded])
  ));

  toggleSidebar(): void {
    this.sidebarExpanded.update(val => !val);
  }

  closeSidebar(): void {
    this.sidebarExpanded.set(false);
  }

  toggleGroup(label: string): void {
      // Find index in original array to keep ID consistent
      const index = this._allMenuGroups.findIndex(g => g.label === label);
      if (index !== -1) {
          this.expandedStates.update(map => {
              const newMap = new Map(map);
              newMap.set(index, !newMap.get(index));
              return newMap;
          });
      }
  }
  
  logout(): void {
      this.authService.logout();
  }

  sidebarClasses = computed(() => {
    let classes = 'fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-[#15202b] transition-transform ease-in-out duration-300';
    classes += ' lg:static lg:translate-x-0 lg:flex';
    if (this.sidebarExpanded()) {
      classes += ' flex translate-x-0';
    } else {
      classes += ' hidden -translate-x-full';
    }
    return classes;
  });
}
