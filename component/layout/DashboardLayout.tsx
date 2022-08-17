import { Box, Flex, useColorModeValue } from "@chakra-ui/react"
import styled from "@emotion/styled"
import SideNav from "./SideNav"
import TopNav from "./TopNav"

interface Props {
  children: JSX.Element
}

const DashboardLayout = ({ children }: Props) => {
  const bg = useColorModeValue('linear(blue.500 40%, white 40%)', 'gray.900');
  
  return (
    <Flex bg={bg} bgGradient={bg} flexDir={{base: 'column', md: 'row'}}>
      <SideNav />
      <Box flexGrow={2} p={4} minH={'100vh'}>
        <TopNav />
        {children}
      </Box>
    </Flex>
  )
}

export default DashboardLayout