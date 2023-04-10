export const dsGridUser = [
  {
    userId: '56748fb3e3',
    name: 'Paweł',
    title: '1',
    email: 'paweluna@howstuffworks.com',
    contract: true,
    date: '20-10-1997',
    domain: '.comodo',
    country: 'mamarika',
  },
  {
    userId: '6de39701b',
    name: 'Jeffie',
    title: '2',
    email: 'jlewzey1@seesaa.net',
    contract: false,
    date: '20-10-1997',
    domain: '.idomaret',
    country: 'indonesia',
  },
  {
    userId: '8b3a6dd017',
    name: 'Mallory',
    title: '3',
    email: 'mhulme2@domainmarket.com',
    contract: true,
    date: '20-10-1997',
    domain: '.net',
    country: 'italy',
  },
];

export const dsPath = [
  '/app/master/manpower#Mixx',
  '/app/admin/users#Full',
  '/app/admin/user#Read',
];

export const dsTreeView = [
  {
    name: 'master',
    path: '/app/master/manpower',
    perm: 1,
    children: [
      {
        name: 'manpower',
        path: '/app/master/manpower',
        perm: 1,
      },
    ],
  },
  {
    name: 'admin',
    path: '/app/admin/users',
    perm: 0,
    children: [
      {
        name: 'users',
        path: '/app/admin/users',
        perm: 0,
      },
    ],
  },
  {
    name: 'admin',
    path: '/app/admin/user',
    perm: 2,
    children: [
      {
        name: 'user',
        path: '/app/admin/user',
        perm: 2,
      },
    ],
  },
];

export const dsTreeView1 = [
  {
    name: 'Admin',
    access: 2,
    children: [
      {
        name: 'Employee',
        access: 2,
        children: [
          {
            name: 'User',
            access: 2,
          },
        ],
      },
    ],
  },
  {
    name: 'HR',
    access: 1,
    children: [
      {
        name: 'Employee',
        access: 1,
        children: [
          {
            name: 'User',
            access: 1,
          },
        ],
      },
    ],
  },
  {
    name: 'IT',
    access: 0,
    children: [],
  },
  {
    name: 'Finance',
    access: 0,
    children: [
      {
        name: 'Employee',
        access: 0,
      },
    ],
  },
];

export const dsTreeGridUser = [
  {
    userId: '56748fb3e3',
    name: 'Paweł',
    title: '1',
    contract: true,
    email: 'paweluna@howstuffworks.com',
    children: [
      {
        domain: '.comodo',
        children: [
          {
            date: '20-10-1997',
            country: 'mamarika',
          },
        ],
      },
    ],
  },
  {
    userId: '6de39701b',
    name: 'Jeffie',
    title: '2',
    contract: false,
    email: 'jlewzey1@seesaa.net',
    children: [
      {
        domain: '.idomaret',
        children: [
          {
            date: '21-11-1998',
            country: 'indonesia',
          },
        ],
      },
    ],
  },
  {
    userId: '8b3a6dd017',
    name: 'Mallory',
    title: '3',
    contract: true,
    email: 'mhulme2@domainmarket.com',
    children: [
      {
        domain: '.net',
        children: [
          {
            date: '22-12-1999',
            country: 'italy',
          },
        ],
      },
    ],
  },
];
