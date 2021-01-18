module.exports = {
  title: '渊辰的博客',
  description: '记录了渊辰小同学的学习日记',
  base: '/vuepress/',
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/logo.png'
      }
    ]
  ],
  themeConfig: {
    nav: [
      {
        text: 'Vue',
        link: '/Vue/'
      },
      {
        text: 'React',
        link: '/React/'
      },
      {
        text: 'TypeScript',
        link: '/ts/'
      },
      {
        text: 'JavaScript',
        link: '/js/'
      },
      {
        text: 'html',
        link: '/html/'
      },
      {
        text: 'LeetCode',
        link: '/LeetCode/'
      },
      {
        text: 'Interview experience',
        link: '/Interview_experience/'
      },
      {
        text: 'MarkDown',
        link: '/MarkDown/'
      }
    ],
    sidebar: {
      '/Interview_experience/': ['', 'xiaomi'],
      '/ts/': ['', 'higher'],
      '/MarkDown/': [''],
      '/Vue/': ['', 'observer'],
      '/js/': ['', 'parallel_request'],
      '/LeetCode/': ['', 'merge_ordered_arrays'],
      '/React/': ['', 'jichu', 'redux', 'hooks'],
      '/html/': ['', 'html5_api']
    }
  },
  // 全局的一个评论组件
  plugins: [
    [
      'vuepress-plugin-comment',
      {
        choosen: 'valine',
        // options选项中的所有参数，会传给Valine的配置
        options: {
          el: '#vcomments',
          appId: 'zRQGc8Mbe1V3O9XRkrEqt4nP-gzGzoHsz', // your appId
          appKey: 'q4yKFWX6NmWIJeCSy35cxHQq', // your appKey
          notify: false,
          verify: false,
          avatar: 'mm',
          placeholder: '说说你的看法吧'
        }
      }
    ]
  ]
};
