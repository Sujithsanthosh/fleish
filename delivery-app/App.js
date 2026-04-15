/**
 * ⚠️ THIS FILE IS NOT USED BY THE APP ⚠️
 * 
 * This project uses expo-router for file-based routing.
 * The actual entry point is configured in package.json as "expo-router/entry".
 * 
 * Entry point: app/_layout.js
 * 
 * Do not modify this file.
 */

import { registerRootComponent } from 'expo';
import { Redirect } from 'expo-router';

function App() {
  return <Redirect href="/(tabs)/dashboard" />;
}

export default registerRootComponent(App);
