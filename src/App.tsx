import { Box, Button, Center} from '@mantine/core'
import  { useState } from 'react'
import FilterUi from './components/Filter'
import { Transition } from '@mantine/core';

function App() {
  const [showFilter, setShowFilter] = useState(false)
  
  return (<div style={{ minHeight: '100vh', width: "100%", backgroundColor:"#111927"}}>

    <Center w={'100%'} mih="100vh">
     
      {showFilter?
        <Transition mounted={showFilter} transition="fade" duration={400} timingFunction="ease">
          {(styles) => (
            <Box
                w='100%' style={{ ...styles }}>
              <FilterUi  closeWindow={setShowFilter} />
            </Box>
          )}
      </Transition>
       : <Button variant="outline" radius="lg" size="md" onClick={() => setShowFilter(!showFilter)}>
        Add Filter
      </Button>}
    </Center>


  </div>
  )
}

export default App
