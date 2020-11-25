import { NavData } from '../interfaces';

export const NavItems: NavData[] = [
  {
    title: true,
    name: 'Main',
    show: false,
    children: [
      {
        name: 'Employee Registration',
        url: '/registration',
        icon: 'employee',
        iconType: 'img'
      },
      {
        name: 'Medical Surveillance',
        // url: '/trending-videos',
        // icon: 'fas fa-fire',
        // iconType: 'fa'
      },
      {
        name: 'Subscriptions',
        url: '/subscriptions',
        icon: 'subscriptions',
        iconType: 'mat'
      },
      {
        name: 'Watch History',
        url: '/watch-history',
        icon: 'history',
        iconType: 'mat'
      },
    ]
  },
  {
    title: true,
    name: 'Button',
    show: false,
    children: [
      {
        name: 'Private Video Code',
        url: '/private-video',
        icon: 'video_library',
        iconType: 'mat',
        type: 'button',
        rightArrow: true
      },
      {
        name: 'Payments',
        url: '/',
        icon: 'payment',
        iconType: 'mat',
        type: 'button',
        rightArrow: true
      },
      {
        name: 'Reports Available',
        url: '/home',
        icon: 'report',
        iconType: 'mat',
        type: 'button',
        rightArrow: true
      },
    ]
  },
  {
    title: true,
    name: 'Generes',
    show: true,
    children: [
      {
        name: 'Sports',
        url: '/category',
        icon: 'fas fa-football-ball',
        iconType: 'fa'
      },
      {
        name: 'Entertainment',
        url: '/category',
        icon: 'movie',
        iconType: 'mat'
      },
      {
        name: 'Story',
        url: '/category',
        icon: 'history',
        iconType: 'mat'
      },
      {
        name: 'Cooking',
        url: '/category',
        icon: 'outdoor_grill',
        iconType: 'mat'
      },
      {
        name: 'Study',
        url: '/category',
        icon: 'book',
        iconType: 'mat'
      },
    ]
  },
  {
    title: true,
    name: 'Profile Actions',
    show: true,
    children: [
      {
        name: 'Dark Theme: ',
        icon: 'fas fa-moon',
        iconType: 'fa'
      },
      {
        name: 'Language: English (UK)',
        url: '/home',
        icon: 'fas fa-language',
        iconType: 'fa'
      },
      {
        name: 'Settings',
        url: '/settings',
        icon: 'settings_applications',
        iconType: 'mat'
      },
      {
        name: 'Help',
        url: '/help',
        icon: 'help',
        iconType: 'mat'
      },
      {
        name: 'Send Feedback',
        url: '/feedback',
        icon: 'feedback_outline',
        iconType: 'mat'
      },
      {
        name: 'About',
        url: '/about',
        icon: 'info',
        iconType: 'mat'
      },
    ]
  },
];
