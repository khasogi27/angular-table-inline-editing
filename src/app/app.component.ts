import { Component, OnInit, ViewChild } from '@angular/core';
// import { BackgroundType, FieldType } from './t-grid/grid/grid.component';
import {
  BackgroundType,
  FieldType,
} from './t-grid/tree-grid/tree-grid.component';

// {
//   userId: '56748fb3e3',
//   name: 'Paweł',
//   title: '1',
//   email: 'paweluna@howstuffworks.com',
//   contract: true,
//   date: '20-10-1997',
//   domain: '.comodo',
//   country: 'mamarika',
// },
// {
//   userId: '6de39701b',
//   name: 'Jeffie',
//   title: '2',
//   email: 'jlewzey1@seesaa.net',
//   contract: false,
//   date: '20-10-1997',
//   domain: '.idomaret',
//   country: 'indonesia',
// },
// {
//   userId: '8b3a6dd017',
//   name: 'Mallory',
//   title: '3',
//   email: 'mhulme2@domainmarket.com',
//   contract: true,
//   date: '20-10-1997',
//   domain: '.net',
//   country: 'italy',
// },

interface User {
  id: number | string;
  name: string;
  last: string;
  title: string;
  email: string;
  contract: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  @ViewChild('grid') grid: any;

  public gridField1: FieldType[] | any = [
    // {
    //   name: 'userId',
    //   type: 'label',
    //   text: 'id case',
    // },
    {
      name: 'name',
      type: 'input',
      text: 'name case',
    },
    {
      name: 'email',
      type: 'input',
      text: 'email case',
    },
    {
      name: 'title',
      type: 'select',
      text: 'title case',
      data: [
        { name: 'Designer', value: '1' },
        { name: 'Engineer', value: '2' },
        { name: 'Support', value: '3' },
      ],
    },
    {
      name: 'domain',
      type: 'lookup',
      text: 'domain case',
      data: [
        { name: '.comodo', value: '1' },
        { name: '.idomaret', value: '2' },
        { name: '.net', value: '3' },
        { name: '.combro', value: '4' },
      ],
    },
    {
      name: 'country',
      type: 'lookup',
      text: 'country case',
      data: [
        { name: 'indonesia', value: '1' },
        { name: 'mamarika', value: '2' },
        { name: 'korea', value: '3' },
        { name: 'italy', value: '4' },
        { name: 'vrindavan', value: '4' },
      ],
    },
    {
      name: 'date',
      type: 'date',
      text: 'date',
    },
    {
      name: 'contract',
      type: 'checkbox',
      text: 'admin case',
    },
  ];

  public gridField: FieldType[] | any = [
    // {
    //   name: 'userId',
    //   type: 'label',
    //   text: 'id case',
    // },
    {
      name: 'name',
      type: 'label',
      text: 'name case',
    },
    {
      name: 'email',
      type: 'label',
      text: 'email case',
    },
    {
      name: 'title',
      type: 'select',
      text: 'title case',
      data: [
        { name: 'Designer', value: '1' },
        { name: 'Engineer', value: '2' },
        { name: 'Support', value: '3' },
      ],
    },
    // {
    //   name: 'domain',
    //   type: 'lookup',
    //   text: 'domain case',
    //   data: [
    //     { name: '.comodo', value: '1' },
    //     { name: '.idomaret', value: '2' },
    //     { name: '.net', value: '3' },
    //     { name: '.combro', value: '4' },
    //   ],
    // },
    // {
    //   name: 'country',
    //   type: 'lookup',
    //   text: 'country case',
    //   data: [
    //     { name: 'indonesia', value: '1' },
    //     { name: 'mamarika', value: '2' },
    //     { name: 'korea', value: '3' },
    //     { name: 'italy', value: '4' },
    //     { name: 'vrindavan', value: '4' },
    //   ],
    // },
    // {
    //   name: 'date',
    //   type: 'date',
    //   text: 'date',
    // },
    // {
    //   name: 'contract',
    //   type: 'checkbox',
    //   text: 'admin case',
    // },
  ];

  public dsKey: string = 'userId';

  public dsUser1: User[] | any = [];

  public dsUser2: User[] | any = [
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
      date: '21-11-1998',
      domain: '.idomaret',
      country: 'indonesia',
    },
    {
      userId: '8b3a6dd017',
      name: 'Mallory',
      title: '3',
      email: 'mhulme2@domainmarket.com',
      contract: true,
      date: '22-12-1999',
      domain: '.net',
      country: 'italy',
    },
  ];

  public dsUser: User[] | any = [
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

  public gridType: BackgroundType = 'flat';

  constructor() {}

  ngOnInit(): void {}

  onSaveClick() {
    console.log(this.grid.tableValue, '<<<');
    // this.grid.newData$.subscribe((e) => {
    //   console.log(e, '<<< event');
    //   // this.grid.newData$.complete();
    // });
  }
}
