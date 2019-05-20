// const dev = 'pc'
const dev = 'mac'

const host = dev === 'pc' ? '192.168.10.150' : 'localhost'

module.exports = {
  title: 'Charts',
  description: 'Just playing around',
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  host,
  port: 5003,
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'Charts',
      description: '轻量级图表'
    },
    '/EN/': {
      lang: 'en-US',
      title: 'Charts',
      description: 'Lightweight interactive charting.'
    }
  },
  themeConfig: {
    locales: {
      '/': {
        selectText: '选择语言',
        label: '简体中文',
        nav: [
          {
            text: '指南',
            link: '/guide/'
          },
          {
            text: 'GitHub',
            link: 'https://github.com/jiaming743/charts.jiaminghi.com'
          }
        ],
        sidebar: {
          '/guide/': [
            ''
          ]
        }
      },
      '/EN/': {
        selectText: 'Languages',
        label: 'English',
        nav: [
          {
            text: 'Guide',
            link: '/guide/'
          },
          {
            text: 'GitHub',
            link: 'https://github.com/jiaming743/charts.jiaminghi.com'
          }
        ],
        sidebar: {
          '/EN/guide/': [
            ''
          ]
        }
      }
    }
  }
}
