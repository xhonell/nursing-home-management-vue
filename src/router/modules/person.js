/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const personRouter = {
  path: '/person',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Person',
  meta: {
    title: '人员管理',
    icon: 'component'
  },
  children: [
    {
        path: 'doctor',
        component: () => import('@/page/person/doctor/index'),
        name: 'Doctor',
        meta: { title: '医护人员管理' }
      },
      {
        path: 'older',
        component: () => import('@/page/person/older/index'),
        name: 'Older',
        meta: { title: '老人信息管理' }
      },
      {
        path: 'relation',
        component: () => import('@/page/person/relation/index'),
        name: 'Relation',
        meta: { title: '家属信息管理' }
      }
  ]
}

export default personRouter
