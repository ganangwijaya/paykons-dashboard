import { Box, Button, Flex, Heading, IconButton, Stack, Text, Tooltip } from "@chakra-ui/react"
import { useDisclosure, useColorModeValue } from "@chakra-ui/react"
import Link from "next/link"
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from "framer-motion";

interface NavItemProps {
  icon: string,
  text: string,
  url: string,
  isOpen: any
}

const NavItem = ({ icon, text, url, isOpen }: NavItemProps) => {
  const router = useRouter();
  const iconBG = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('blue.500', 'gray.100');
  const iconColorActive = useColorModeValue('gray.100', 'gray.100');

  return (
    <Link href={url}>
      <Button variant={'unstyled'} size={'sm'} _focus={{ boxShadow: 'none' }}>
        <Tooltip label={text} placement={'right'} size={'xs'} isDisabled={isOpen ? true : false}>
          <Flex alignItems={'center'} cursor={'pointer'} p={1.5} role={'group'}>
            <Flex color={router.pathname == url ? 'gray.100' : iconColor} w={6} h={6} minW={6} alignItems={'center'} justifyContent={'center'} fontSize={'md'} fontWeight={'light'} bg={router.pathname == url ? 'blue.400' : iconBG} _groupHover={{ bg: 'blue.400', color: iconColorActive }} transition={'all 0.2s ease-in'} rounded={'md'}><i className={icon}></i></Flex>
            <AnimatePresence initial={false}>
              {isOpen &&
                <motion.div
                  key="content"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { width: 'auto', opacity: 1 },
                    collapsed: { width: 0, opacity: 0 }
                  }}
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <Text pl={2} fontSize={'xs'} margin={0} fontWeight={'semibold'}>{text}</Text>
                </motion.div>
              }
            </AnimatePresence>
          </Flex>
        </Tooltip>
      </Button>
    </Link>
  )
}

const SideNav = () => {
  const { getButtonProps, isOpen } = useDisclosure({ defaultIsOpen: true });
  const bg = useColorModeValue('gray.50', 'gray.800');
  const borderBack = useColorModeValue('gray.300', 'gray.700');

  return (
    <Box py={4} pl={4} pr={2} h={'100vh'} pos={'sticky'} top={0} display={{ base: 'none', md: 'block' }}>
      <Flex rounded={'xl'} flexDirection={'column'} justifyContent={'space-between'} w={'auto'} bg={bg} h={'100%'}>
        <Box p={6}>
          <Heading as={'h3'} fontSize={'1rem'}>
            <motion.div
              initial="collapsed"
              animate={isOpen ? "open" : "collapsed"}
              exit="collapsed"
              variants={{
                open: {
                  width: 'auto',
                  textAlign: 'left',
                  transition: {
                    staggerChildren: 0.025,
                    staggerDirection: 1,
                    when: "beforeChildren",
                  }
                },
                collapsed: {
                  width: 'auto',
                  textAlign: 'center',
                  transition: {
                    staggerChildren: 0.025,
                    staggerDirection: -1,
                    when: "afterChildren",
                  }
                }
              }}
              style={{ overflow: "hidden", whiteSpace: 'nowrap' }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {['P', 'a', 'y', 'K', 'o', 'n', 's'].map((c, i) => (
                <motion.span key={i}
                  variants={{
                    open: {
                      width: 'auto',
                      opacity: 1,
                      display: 'inline-flex',
                    },
                    collapsed: {
                      width: 'auto',
                      opacity: (isOpen || c === 'P' || c === "K") ? 1 : 0,
                      display: (isOpen || c === 'P' || c === "K") ? 'inline-flex' : 'none',
                      flexWrap: 'nowrap'
                    }
                  }}
                  style={{ overflow: "hidden", whiteSpace: 'nowrap' }}
                >
                  {c}
                </motion.span>
              ))}
            </motion.div>
          </Heading>
          <Stack mt={8} gap={3}>
            <NavItem isOpen={isOpen} icon={'ri-dashboard-fill'} text={'Dashboard'} url={'/dashboard'} />
            <motion.div
              animate={isOpen ? "open" : "collapsed"}
              exit="collapsed"
              variants={{
                open: { width: 'auto', opacity: 1 },
                collapsed: { width: 0, opacity: 0 }
              }}
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Heading as={'h4'} size={'xs'}>Payment</Heading>
            </motion.div>
            <Stack>
              <NavItem isOpen={isOpen} icon={'ri-exchange-fill'} text={'Transaction'} url={'/'} />
              <NavItem isOpen={isOpen} icon={'ri-team-fill'} text={'Member'} url={'/'} />
              <NavItem isOpen={isOpen} icon={'ri-bank-card-line'} text={'Payout'} url={'/'} />
              <NavItem isOpen={isOpen} icon={'ri-scales-line'} text={'Balances'} url={'/'} />
              <NavItem isOpen={isOpen} icon={'ri-check-double-line'} text={'Subcription'} url={'/'} />
              <NavItem isOpen={isOpen} icon={'ri-list-check-2'} text={'Payment Plans'} url={'/'} />
            </Stack>
            <motion.div
              animate={isOpen ? "open" : "collapsed"}
              exit="collapsed"
              variants={{
                open: { width: 'auto', opacity: 1 },
                collapsed: { width: 0, opacity: 0 }
              }}
              style={{
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Heading as={'h4'} size={'xs'}>Preference</Heading>
            </motion.div>
            <Stack>
              <NavItem isOpen={isOpen} icon={'ri-eye-fill'} text={'Audit Logs'} url={'/'} />
              <NavItem isOpen={isOpen} icon={'ri-settings-3-fill'} text={'Settings'} url={'/'} />
            </Stack>
          </Stack>
        </Box>

        <Box borderTop={'1px solid'} borderColor={borderBack} p={2}>
          <motion.div
            animate={isOpen ? 'open' : 'collapsed'}
            initial={false}
            exit="collapsed"
            variants={{
              open: {
                justifyContent: 'flex-end', width: '100%', transition: {
                  staggerChildren: 0.5,
                  when: "beforeChildren"
                }
              },
              collapsed: {
                justifyContent: 'flex-end', width: '68%', transition: {
                  staggerChildren: 0.5,
                  when: "beforeChildren"
                }
              }
            }}
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <motion.div
              variants={{
                open: { rotate: 0, },
                collapsed: { rotate: 180, }
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <IconButton size={'xs'} aria-label={'Sidenav Collapse'} icon={<i className="ri-arrow-left-s-line"></i>} {...getButtonProps()} variant={'unstyled'} />
            </motion.div>
          </motion.div>
        </Box>
      </Flex>
    </Box>

  )
}

export default SideNav