import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Heading, IconButton, Stack, Text, Tooltip } from "@chakra-ui/react"
import { useDisclosure, useColorModeValue } from "@chakra-ui/react"
import Link from "next/link"
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from "framer-motion";
import { DashboardMenu, PaymentMenu, PreferenceMenu } from "../../data/PageData";
import { useRef } from "react";

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

  const parentpath = "/" + router.pathname.split("/")[1];

  return (
    <Link href={url}>
      <Button variant={'unstyled'} size={'sm'} _focus={{ boxShadow: 'none' }} height={'auto'}>
        <Tooltip label={text} placement={'right'} size={'xs'} isDisabled={isOpen ? true : false}>
          <Flex alignItems={'center'} cursor={'pointer'} p={1.5} role={'group'} gap={{ base: 2, md: 0 }}>
            <Flex color={parentpath == url ? 'gray.100' : iconColor} w={{ base: 8, md: 6 }} h={{ base: 8, md: 6 }} minW={{ base: 8, md: 6 }} alignItems={'center'} justifyContent={'center'} fontSize={{ base: 'lg', md: 'md' }} fontWeight={'light'} bg={parentpath == url ? 'blue.400' : iconBG} _groupHover={{ bg: 'blue.400', color: iconColorActive }} transition={'all 0.2s ease-in'} rounded={'md'}><i className={icon}></i></Flex>
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
                  <Text pl={2} fontSize={{ base: 'sm', md: 'xs' }} margin={0} fontWeight={'semibold'}>{text}</Text>
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
            <NavItem isOpen={isOpen} icon={DashboardMenu.icon} text={DashboardMenu.title} url={DashboardMenu.path} />
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
              {PaymentMenu.map((menu, index) => (
                <NavItem key={index} isOpen={isOpen} icon={menu.icon} text={menu.title} url={menu.path} />
              ))}
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
              {PreferenceMenu.map((menu, index) => (
                <NavItem key={index} isOpen={isOpen} icon={menu.icon} text={menu.title} url={menu.path} />
              ))}
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

export const MobileSideNav = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = useRef<HTMLButtonElement>(null)
  const bg = useColorModeValue('gray.50', 'gray.800');

  return (
    <>
      <IconButton display={{ base: 'inline-flex', md: 'none' }} aria-label="NavButton" ref={btnRef} size={'sm'} variant={'ghost'} onClick={onOpen}>
        <i className="ri-menu-2-fill"></i>
      </IconButton>
      <Drawer
        isOpen={isOpen}
        placement={'left'}
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bg={bg}>
          <DrawerCloseButton mt={2} />
          <DrawerHeader fontSize={'1.25rem'} fontWeight={'bold'}>PayKons</DrawerHeader>
          <DrawerBody>
            <Stack gap={3}>
              <NavItem isOpen={isOpen} icon={DashboardMenu.icon} text={DashboardMenu.title} url={DashboardMenu.path} />
              <Heading as={'h4'} size={'sm'}>Payment</Heading>
              <Stack>
                {PaymentMenu.map((menu, index) => (
                  <NavItem key={index} isOpen={isOpen} icon={menu.icon} text={menu.title} url={menu.path} />
                ))}
              </Stack>
              <Heading as={'h4'} size={'sm'}>Preference</Heading>
              <Stack>
                {PreferenceMenu.map((menu, index) => (
                  <NavItem key={index} isOpen={isOpen} icon={menu.icon} text={menu.title} url={menu.path} />
                ))}
              </Stack>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideNav