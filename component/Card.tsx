import { Box, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react"

export const CondensedCard = (props: { name: string, data: string | number, icon: string, text?: string, arrow?: 'increase' | 'decrease' | 'normal' }) => {

  const bg = useColorModeValue('gray.50', 'gray.800');
  const iconBG = useColorModeValue('blue.500', 'blue.400');
  const iconColor = useColorModeValue('gray.100', 'gray.100');

  const increaseColor = useColorModeValue('green.500', 'green.400');
  const decreaseColor = useColorModeValue('red.500', 'red.400');

  return (
    <Flex p={4} bg={bg} rounded={'xl'} gap={4} alignItems={'center'}>
      <Flex minW={10} w={10} h={10} bg={iconBG} color={iconColor} justifyContent={'center'} alignItems={'center'} rounded={'full'} fontSize={'xl'}><i className="ri-ancient-gate-fill"></i></Flex>
      <Box>
        <Text fontSize={'xs'}>{props.name}</Text>
        <Flex gap={1} alignItems={'flex-end'}>
          <Heading as={'h4'} size={'md'}>{props.data}</Heading>
          {props.text != undefined &&
            <Flex fontSize={10} color={increaseColor} alignItems={'center'}>
              <i className={props.arrow == 'increase' ? 'ri-arrow-up-s-fill' : 'ri-arrow-down-s-fill'}></i>
              <Text fontWeight={'bold'}>{props.text}</Text>
            </Flex>
          }
        </Flex>
      </Box>
    </Flex>
  )
}