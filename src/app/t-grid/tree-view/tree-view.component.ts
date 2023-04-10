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
  @Input() dataSelect: any[] = [];

  public dsIcon: any = TablerIcon;
  public dsTreeView: any[] = [];
  public dsDropdown: any[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.dsTreeView = this.dataSource;
    this.addValueChange(this.dsTreeView);
    for (let item of this.dsTreeView) {
      item['parent'] = true;
    }

    if (this.dataSelect.length == 0) return;
    this.dataSelect.find((ds, i) => {
      let splitOf = ds.split('#');
      let perm = splitOf[1];
      let path = splitOf[0];

      for (let dd of this.dsDropdown) if (dd.name == perm) continue;
      this.dsDropdown.push({ name: perm, value: i, path });
    });

    console.log(this.dsDropdown, '<<<');
  }

  addValueChange(data: any) {
    for (let item of data) {
      item['expand'] = this.expanded;
      if (item.children == undefined) return;
      this.addValueChange(item.children);
    }
  }

  onRightClick(evn: any, data: any) {
    console.log(data, 'data');
    console.log(this.dsTreeView, '<<<');
    evn.preventDefault();
  }
}
