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
  public dsTreeOption: any[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.dsTreeView = this.dataSource;
    this.addValueChange(this.dsTreeView);
    for (let item of this.dsTreeView) {
      item['parent'] = true;
    }

    if (this.dataSelect.length == 0) return;
    let arrPath = [];
    this.dataSelect.find((ds, i) => {
      let splitOf = ds.split('#');
      let perm = splitOf[1];
      let path = splitOf[0];
      arrPath.push(path);

      for (let dd of this.dsDropdown) if (dd.name == perm) continue;
      this.dsDropdown.push({ name: perm, value: i, path });
      // this.dsTreeOption.push({ value: i, path });
    });

    arrPath.find((f, i) => {
      let nodePath = f.split('/');
      for (let np of nodePath) {
        this.createTree(np);
      }
    });

    console.log(this.dsTreeOption, '<<<');
  }

  createTree(data) {
    for (let item of this.dsTreeOption) {
      console.log(item['name'], 'nih');
      if (item['name'] == null) {
        this.dsTreeOption.push({ name: data });
      } else if (item['children'] == null) {
        item['children'] = data;
      } else {
        continue;
      }
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
    evn.preventDefault();
    for (let item of this.dsTreeOption) {
      if (item.value == data.value) {
        item = data;
      }
    }
    // console.log(this.dsTreeOption, '<<<');
  }
}
