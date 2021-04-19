import React from "react"

import { Home } from "./screens"
import { SafeAreaProvider } from 'react-native-safe-area-context';



const App = () => {
  return (
    <SafeAreaProvider>
      <Home />
    </SafeAreaProvider>

  )
}

export default App;