import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TablerIcon } from '../icons';

@Component({
  selector: 'core-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css'],
})
export class TreeViewComponent implements OnChanges {
  @Input() dataSource: any[] = [];
  @Input() expanded: boolean = true;

  public dsIcon: any = TablerIcon;
  public dsTreeView: any = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.dsTreeView = this.dataSource;
    this.addValueChange(this.dsTreeView);
    for (let item of this.dsTreeView) {
      item['parent'] = true;
    }
  }

  addValueChange(data: any) {
    for (let item of data) {
      item['expand'] = this.expanded;
      if (item.children == undefined) return;
      this.addValueChange(item.children);
    }
  }

  onRightClick(evn: any, data: any) {
    console.log(this.dsTreeView, '<<<');
    evn.preventDefault();
  }
}
