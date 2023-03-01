import { Component, OnInit, ViewChild } from '@angular/core';
// import {
//   EditSettingItems,
//   SelectOption,
//   ToolbarItems,
// } from './t-grid/tbr-grid/tbr-grid.component';
import { SelectOption, FieldType } from './t-grid/grid/grid.component';

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
  // public gridEditSettings: EditSettingItems = {
  //   allowEditing: true,
  //   allowAdding: true,
  //   allowDeleting: true,
  // };

  public gridInlineEditing: boolean = true;

  // public gridToolbar: ToolbarItems[] = [
  //   'Add',
  //   'Save',
  //   'Edit',
  //   'Delete',
  //   'Cancel',
  // ];

  public gridSelectOption: SelectOption[] = [
    { name: 'Designer', value: '1' },
    { name: 'Engineer', value: '2' },
    { name: 'Support', value: '3' },
  ];

  public gridField: FieldType[] = [
    // {
    //   name: 'id',
    //   type: 'label',
    //   text: 'id case'
    // },
    {
      name: 'name',
      type: 'input',
      text: 'name case',
    },
    // {
    //   name: 'email',
    //   type: 'input',
    //   text: 'email case'
    // },
    // {
    //   name: 'title',
    //   type: 'select',
    //   text: 'title case',
    //   data: [
    //     { name: 'Designer', value: '1' },
    //     { name: 'Engineer', value: '2' },
    //     { name: 'Support', value: '3' },
    //   ],
    // },
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
      name: 'contract',
      type: 'checkbox',
      text: 'admin case',
    },
    // {
    //   name: 'date',
    //   type: 'date',
    //   text: 'date',
    // },
  ];

  public dsUser1: User[] | any = [];

  public dsUser: User[] | any = [
    {
      id: '56748fb3e3',
      name: 'Paweł',
      title: '1',
      email: 'paweluna@howstuffworks.com',
      contract: true,
      date: '20-10-1997',
      domain: '.comodo',
    },
    {
      id: '6de39701b',
      name: 'Jeffie',
      title: '2',
      email: 'jlewzey1@seesaa.net',
      contract: false,
      date: '20-10-1997',
      domain: '.idomaret',
    },
    {
      id: '8b3a6dd017',
      name: 'Mallory',
      title: '3',
      email: 'mhulme2@domainmarket.com',
      contract: true,
      date: '20-10-1997',
      domain: '.net',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  onSaveClick() {
    this.grid.newData$.subscribe((e) => {
      console.log(e, '<<< event');
      // this.grid.newData$.complete();
    });
  }

  // public onActionClick(event: any) {
  //   // console.log(event, '<<< data');
  // }
}
