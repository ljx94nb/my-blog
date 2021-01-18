module.exports = {
  title: '渊辰的博客',
  description: '记录了渊辰小同学的学习日记',
  theme: 'reco',
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
    type: 'blog',
    codeTheme: 'okaidia',
    nav: [
      {
        text: 'Vue',
        link: '/Vue/',
        icon: 'reco-date'
      },
      {
        text: 'React',
        link: '/React/',
        icon: 'reco-date'
      },
      {
        text: 'TypeScript',
        link: '/ts/',
        icon: 'reco-date'
      },
      {
        text: 'JavaScript',
        link: '/js/',
        icon: 'reco-date'
      },
      {
        text: 'html',
        link: '/html/',
        icon: 'reco-date'
      },
      {
        text: 'LeetCode',
        link: '/LeetCode/',
        icon: 'reco-date'
      },
      {
        text: 'Interview experience',
        link: '/Interview_experience/',
        icon: 'reco-date'
      },
      {
        text: 'MarkDown',
        link: '/MarkDown/',
        icon: 'reco-date'
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
