import { Box, Flex, IconButton } from "@chakra-ui/react"
import { useState } from "react"

export const HideData = (props: { data: string, position: 'start' | 'end', length: number }) => {
  const [hiddenData, setHiddenData] = useState(true)

  const data = props.data;
  var datahide;

  if (props.position == 'start') {
    datahide = data.slice(0, props.length) + props.data.slice(props.length, data.length).replace(/[a-zA-Z0-9+]/g, '*');
  }
  else {
    datahide = props.data.slice(0, data.length - props.length).replace(/[a-zA-Z0-9+]/g, '*') + data.slice(data.length - props.length, data.length);
  }

  return (
    <Flex gap={2} alignItems={'center'} role={'group'} onMouseLeave={() => setHiddenData(true)}>
      <Box>{hiddenData ? datahide : data}</Box>
      <IconButton fontSize={8} visibility={'hidden'} _groupHover={{ visibility: 'visible' }} aria-label="view-data" onClick={() => setHiddenData(d => !d)} variant={'ghost'} size={'xs'} icon={<i className="ri-eye-line"></i>} />
    </Flex>
  )
}