import { Box, Button, Flex, Heading, Menu, MenuButton, MenuList, MenuItem, MenuDivider, Avatar, useColorModeValue, MenuGroup } from "@chakra-ui/react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'
import { useColorMode } from "@chakra-ui/react"
import { css } from '@emotion/react';
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { ChildMenu, DashboardMenu, PaymentMenu, PreferenceMenu } from "../../data/PageData";

const GlassNav = css`
  background: rgba( 0, 0, 0, 0.3 );
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur( 5px );
  -webkit-backdrop-filter: blur( 5px );
  border-radius: 10px;
  border: 1px solid rgba( 255, 255, 255, 0.18 );
  transition: 0.3s all ease-in-out;
`

const LightGlass = css`
  background: rgba( 255, 255, 255, 0.7 );
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur( 5px );
  -webkit-backdrop-filter: blur( 5px );
  border-radius: 10px;
  border: 1px solid rgba( 255, 255, 255, 0.18 );
  transition: 0.3s all ease-in-out;
`

const NormalNav = css`
  background: transparent;
  transition: 0.3s all ease-in-out;
  border: 1px solid transparent;
  color: #FFF;
`

const TopNav = () => {
  const { data: session } = useSession();

  const { colorMode, toggleColorMode } = useColorMode()
  const [header, setHeader] = useState(false);
  const router = useRouter();

  const NavOpt = useColorModeValue(LightGlass, GlassNav);

  const listenScrollEvent = (event: any) => {
    if (window.scrollY < 23) {
      return setHeader(false)
    } else if (window.scrollY > 20) {
      return setHeader(true)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent);
    return () => { window.removeEventListener('scroll', listenScrollEvent); }
  }, []);

  return (
    <Flex css={header == true ? NavOpt : NormalNav} pos={'sticky'} top={4} zIndex={1000} h={'60px'} px={4} py={2} rounded={'lg'} justifyContent={'space-between'} alignItems={'center'}>
      <Box>
        {
          router.pathname == DashboardMenu.path ? (
            <Breadcrumb fontSize={'xs'}>
              <BreadcrumbItem>
                <BreadcrumbLink>Page</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>{DashboardMenu.title}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          ) :
            PaymentMenu.filter(f => router.pathname == f.path).length > 0 ? (
              <Breadcrumb fontSize={'xs'}>
                <BreadcrumbItem>
                  <BreadcrumbLink>Page</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem isCurrentPage>
                  <BreadcrumbLink>{PaymentMenu.filter(f => router.pathname == f.path)[0].title}</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>
            ) :
              PreferenceMenu.filter(f => router.pathname == f.path).length > 0 ? (
                <Breadcrumb fontSize={'xs'}>
                  <BreadcrumbItem>
                    <BreadcrumbLink>Page</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbItem isCurrentPage>
                    <BreadcrumbLink>{PreferenceMenu.filter(f => router.pathname == f.path)[0].title}</BreadcrumbLink>
                  </BreadcrumbItem>
                </Breadcrumb>
              ) :
                ''
        }

        {ChildMenu.filter(f => router.pathname == f.path).length > 0 && (
          <Breadcrumb fontSize={'xs'}>
            <BreadcrumbItem>
              <BreadcrumbLink>Page</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>{ChildMenu.filter(f => router.pathname == f.path)[0].parent}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{ChildMenu.filter(f => router.pathname == f.path)[0].title}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        )}
        <Heading as={'h2'} size={'md'}>
          {
            router.pathname == DashboardMenu.path ? DashboardMenu.title :
              PaymentMenu.filter(f => router.pathname == f.path).length > 0 ? PaymentMenu.filter(f => router.pathname == f.path)[0].title :
                PreferenceMenu.filter(f => router.pathname == f.path).length > 0 ? PreferenceMenu.filter(f => router.pathname == f.path)[0].title : ''
          }
          {ChildMenu.filter(f => router.pathname == f.path).length > 0 && ChildMenu.filter(f => router.pathname == f.path)[0].title}
        </Heading>
      </Box>
      <Flex gap={3} alignItems={'center'}>
        <Button onClick={toggleColorMode} size={'xs'} variant={'unstyled'}><i className="ri-sun-line"></i></Button>
        <Menu>
          <MenuButton as={Button} variant={'unstyled'} size={'xs'}>
            <i className="ri-notification-3-fill" />
          </MenuButton>
          <MenuList color={useColorModeValue('gray.900', 'gray.100')} fontSize={'sm'}>
            <MenuItem>Notif 1</MenuItem>
            <MenuItem>Notif 2</MenuItem>
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={Button} rounded={'full'} variant={'link'} cursor={'pointer'} minW={0}>
            <Avatar size={'sm'} src={'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&&h=200&w=200'} />
          </MenuButton>
          <MenuList color={useColorModeValue('gray.900', 'gray.100')} fontSize={'xs'}>
            <MenuGroup ml={3} title={String(session?.user?.name)}>
              <MenuItem>Profile</MenuItem>
            </MenuGroup>
            <MenuDivider />
            <MenuItem>Changelog</MenuItem>
            <MenuItem>Feedback</MenuItem>
            <MenuItem>Help and Support</MenuItem>
            <MenuDivider />
            <MenuItem onClick={() => signOut({ callbackUrl: `${window.location.origin}/auth` })}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  )
}

export default TopNav