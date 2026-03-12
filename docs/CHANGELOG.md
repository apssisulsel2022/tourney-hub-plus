# CHANGELOG

## [1.0.0] - 2026-03-12
### Added
- Initial project structure with modular tournament management.
- Tournament Creation Form with validation.
- Modularized Tournament Detail Page with tabs (Overview, Teams, Standings, Matches).
- Modularized Tournament Bracket Page with stage and connector components.
- Established documentation structure in `/docs/development-log/` and `/docs/CHANGELOG.md`.

## [1.1.0] - 2026-03-12
### Added
- Comprehensive global navigation system in `DashboardLayout`.
- Collapsible sidebar with hierarchical organization and new Media module.
- Top navigation with global search placeholder, notifications dropdown, and user profile menu.
- Dynamic breadcrumb navigation reflecting page hierarchy.
- Mobile-first responsive design with hamburger menu toggle.

## [1.2.0] - 2026-03-12
### Added
- Comprehensive SaaS platform administrator interface.
- Admin Dashboard with KPI widgets and Organizations Table.
- Subscription, and User management pages.
- System Logs, Analytics, and Platform Settings modules.
- `AdminLayout` with "Super Admin Mode" visual style.

## [1.4.0] - 2026-03-12
### Added
- Real-time WebSocket synchronization layer in `src/modules/realtime`.
- `SocketService` for simulating and handling live data updates.
- `useRealtime` hook and `RealtimeProvider` for application-wide real-time context.
- Live sync status indicator in the dashboard header.
- Dynamic Activity Feed sidebar with auto-updating events.
- Real-time stat updates for Active Tournaments, Teams, and Matches.
### Modified
- Integrated `RealtimeProvider` into `App.tsx` layout wrappers.
- Redesigned `DashboardPage` to consume live activities and statistics.

## [1.3.0] - 2026-03-12
### Added
- Redesigned Event Organizer Dashboard with actionable widgets.
- Real-time Match Timeline with live status indicators.
- Enhanced Tournament Cards showing age category, team count, and status.
- Centralized Quick Actions for common management tasks.
- Performance and platform stats tracking widgets.
### Fixed
- `ReferenceError: cn is not defined` in `DashboardPage.tsx`.
- `ReferenceError: React is not defined` in `DashboardLayout.tsx`.
- Incorrect prop usage in `BreadcrumbLink` component.
- Enabled React Router v7 future flags for improved stability.
