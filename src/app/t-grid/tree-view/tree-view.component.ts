import { Component, Input, OnInit } from '@angular/core';
import { TablerIcon } from '../icons';

@Component({
  selector: 'core-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css'],
})
export class TreeViewComponent implements OnInit {
  @Input() dataSource: any[] = [];

  public dsIcon: any = TablerIcon;
  public dsTreeView: any[] = [
    {
      name: 'admin',
      access: 1,
    },
    {
      name: 'hr',
      access: 2,
    },
    {
      name: 'employee',
      access: 1,
    },
  ];

  constructor() {}

  ngOnInit() {}
}
