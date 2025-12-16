// With expo-router, navigation is handled through file-based routing
// This component is not needed. Instead, use redirects in _layout.tsx
// or individual route files based on authentication state.

// For role-based routing with expo-router:
// 1. Check authentication in _layout.tsx
// 2. Use router.replace() or router.push() for redirects
// 3. Create role-specific route groups: app/(patient)/, app/(doctor)/, app/(admin)/

export {};

// Example of how to handle role-based redirects in expo-router:
// In app/_layout.tsx:
// import { useSelector } from 'react-redux';
// import { RootState } from '../src/store';
// import { Redirect } from 'expo-router';
//
// const { isLoggedIn, role } = useSelector((state: RootState) => state.user);
//
// if (!isLoggedIn) {
//   return <Redirect href="/login" />;
// }
//
// if (role === 'patient') {
//   return <Redirect href="/(patient)/dashboard" />;
// }
//
// if (role === 'doctor') {
//   return <Redirect href="/(doctor)/dashboard" />;
// }
//
// if (role === 'admin') {
//   return <Redirect href="/(admin)/dashboard" />;
// }
