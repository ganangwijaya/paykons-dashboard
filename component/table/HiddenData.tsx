import { Box, Flex, IconButton } from "@chakra-ui/react"
import { useState } from "react"

export const HideData = (props: { data: string }) => {
  const [hiddenData, setHiddenData] = useState(true)

  return (
    <Flex gap={2} alignItems={'center'} role={'group'} onMouseLeave={() => setHiddenData(true)}>
      <Box>{hiddenData ? props.data.replace(/[a-zA-Z0-9+]/g, '*') : props.data}</Box>
      <IconButton fontSize={8} visibility={'hidden'} _groupHover={{ visibility: 'visible' }} aria-label="view-data" onClick={() => setHiddenData(d => !d)} variant={'ghost'} size={'xs'} icon={<i className="ri-eye-line"></i>} />
    </Flex>
  )
}