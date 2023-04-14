import { Component, OnInit, ViewChild } from '@angular/core';
import {
  dsGridUser,
  dsPath,
  dsTreeGridUser,
  dsTreeView,
  dsDataTree,
} from './t-grid/local-data';
// import { BackgroundType, FieldType } from './t-grid/grid/grid.component';
import {
  BackgroundType,
  FieldType,
} from './t-grid/tree-grid/tree-grid.component';

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
  @ViewChild('treegrid') treegrid: any;
  @ViewChild('datatree') datatree: any;

  public gridField: FieldType[] | any = [
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
    // {
    //   name: 'email',
    //   type: 'input',
    //   text: 'email case',
    // },
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
    // {
    //   name: 'date',
    //   type: 'date',
    //   text: 'date',
    // },
    {
      name: 'contract',
      type: 'checkbox',
      text: 'admin case',
    },
  ];
  public dsKey: string = 'userId';
  public dsUser: User[] | any;
  public gridType: BackgroundType = 'normal';

  public treeGridField: FieldType[] | any = [
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
  public dsTreeKey: string = 'userId';
  public dsTreeUser: User[] | any;
  public treeGridType: BackgroundType = 'flat';

  public dsTreeView: any[];
  public dsExpanded: boolean = false;
  public dsSelect: any[];

  public dsDataTree: any[];

  constructor() {}

  ngOnInit(): void {
    this.dsUser = dsGridUser;
    this.dsTreeUser = dsTreeGridUser;
    this.dsTreeView = dsTreeView;
    this.dsDataTree = dsDataTree;
    this.dsSelect = dsPath;
  }

  onSaveClick() {
    // console.log(this.grid.tableValue, '<<< grid');
    console.log(this.datatree.dsPathValue, '<<< treeview');
    // this.grid.newData$.subscribe((e) => {
    //   console.log(e, '<<< event');
    //   // this.grid.newData$.complete();
    // });
  }
}
