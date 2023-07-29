import { useEffect, useState } from 'react'
import { Menu, MenuProps } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { createFromIconfontCN } from '@ant-design/icons'
import { useAppState } from '@/hooks'
import { iconfontScriptUrl } from '@/config/iconfont'
import { MenuType } from '@/enum'
import { getStore, setStore } from '@/tools/local'
import { arrayToTree } from '@/tools'
import './index.less'

const Iconfont = createFromIconfontCN({
  scriptUrl: iconfontScriptUrl,
})

const MenuCom = () => {
  const info = useAppState((state) => state.info.info)
  const [current, setCurrent] = useState('')
  const [menu, setMenu] = useState<any[]>([])
  const [openKeys, setOpensKey] = useState<string[]>([])
  const location = useLocation()
  const openMenuStoreKey = 'openMenuKeys'

  useEffect(() => {
    const getMenu = () => {
      if (!(info && info.permission)) {
        return []
      }

      const getMenuList = info.permission.filter(menu => menu.menu_type === MenuType.MENU).sort((a, b) => a.sort - b.sort).map(menu => {
        const { parent_id, menu_name, path, menu_id, menu_icon } = menu
        return {
          id: menu_id,
          label: <Link to={path}>{menu_name}</Link>,
          key: path,
          path,
          parent_id,
          icon: menu_icon ? <Iconfont className='menu_icon' type={menu_icon} style={{ 'fontSize': '19px' }} /> : '',
        }
      })

      const getMenuTree = arrayToTree({
        array: getMenuList,
        pId: null,
        fieldNames: { label: 'label', value: 'id', parentId: 'parent_id' }
      })

      return getMenuTree
    }

    const menu = getMenu()
    setMenu(menu)

    setCurrent(location.pathname)
    setOpensKey(getStore(openMenuStoreKey) || [])
  }, [info])

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key)
  }

  const onOpenChange = (openKeys: string[]) => {
    setOpensKey(openKeys)
    setStore(openMenuStoreKey, openKeys)
  }

  return (
    <>
      <Menu
        theme='dark'
        mode="inline"
        selectedKeys={[current]}
        items={menu}
        openKeys={openKeys}
        onClick={handleMenuClick}
        onOpenChange={onOpenChange}
      >
      </Menu>
    </>
  )
}

export default MenuCom