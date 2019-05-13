export default [
  // user
  {
    path: '/app',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/app', redirect: '/user/login' },
      { path: '/app/login', name: 'login', component: './User/Login' },
      { path: '/app/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/workplace' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          // {
          //   path: '/dashboard/analysis',
          //   name: 'analysis',
          //   component: './Dashboard/Analysis',
          // },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      
      // 项目
      {
        path: '/project',
        // authority: ['projectM'],
        icon: 'table',
        name: 'projectManage',
        routes: [
          {
            path: '/project/project',
            name: 'project',
            component: './Project/Project',
          },
          {
            path: '/project/projectAdd',
            name: 'projectAdd',
            component: './Project/ProjectAdd',
          },
          {
            path: '/project/working',
            name: 'working',
            component: './Project/working',
          },
          {
            path: '/project/cost',
            name: 'cost',
            component: './Project/ProjectCost',
          },
          {
            path: '/project/profile',
            name: 'profile',
            hideInMenu: true,
            component: './Project/ProjectProfile',
          },
        ],
      },
      // 设备
      {
        path: '/machinery',
        // authority: ['machineryM'],
        icon: 'table',
        name: 'machineryManage',
        routes: [
          {
            path: '/machinery/machinery',
            name: 'machineryType',
            component: './Machinery/Machinery',
          },
          {
            path: '/machinery/machineryType',
            name: 'machineryType',
            component: './Machinery/MachineryType',
          },
        ],
      },
       // 结算管理
       {
        path: '/bill',
        icon: 'table',
        // authority: ['billM'],
        name: 'billManage',
        routes: [
          {
            path: '/bill/billAdd',
            name: 'billAdd',
            component: './Bill/BillAdd',
          },
          {
            path: '/bill/bill',
            name: 'bill',
            component: './Bill/Bill',
          },
        ],
      },
       // 人员管理
       {
        path: '/user',
        icon: 'user',
        // authority: ['userM'],
        name: 'userManage',
        routes: [
          {
            path: '/user/user',
            name: 'user',
            component: './User/User',
          },
         
        ],
      },
       // 系统管理
       {
        path: '/sys',
        icon: 'highlight',
        name: 'sysManage',
        routes: [
          {
            path: '/sys/permission',
            name: 'permission',
            component: './Sys/Permission',
          },
          {
            path: '/sys/role',
            name: 'role',
            component: './Sys/Role',
          },
          {
            path: '/sys/user',
            name: 'user',
            component: './Sys/UserRole',
          },
        ],
      },
      // list
      
     
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        hideInMenu:true,
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu:true,
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
