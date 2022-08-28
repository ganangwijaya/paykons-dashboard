import { Button, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react"
import Link from "next/link"

export const Custom404 = () => {
  const bg = useColorModeValue('white', 'gray.900');

  return (
    <Flex bg={bg} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} h={'100vh'}>
      <Heading as={'h2'} size={'3xl'} bgGradient={'linear(to-r, blue.400, blue.600)'} backgroundClip={'text'}>
        404
      </Heading>
      <Text fontSize='18px' mt={3} mb={2}>
        Page Not Found
      </Text>
      <Text color={'gray.500'} mb={6}>
        The page you're looking for does not seem to exist or under development
      </Text>

      <Link href={'/dashboard'} passHref>
        <Button size={'sm'} colorScheme={'blue'} bgGradient={'linear(to-r, blue.400, blue.500, blue.600)'} color={'white'} variant={'solid'}>
          Go to Home
        </Button>
      </Link>
    </Flex>
  )
}

export default Custom404