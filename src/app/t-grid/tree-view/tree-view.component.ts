import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { animatedToggleTree } from '../animated-tree';
import { TablerIcon } from '../icons';

@Component({
  selector: 'core-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css'],
  animations: [animatedToggleTree('toggleTree')],
})
export class TreeViewComponent implements OnChanges {
  @Input() dataSource: any[] = [];
  @Input() expanded: boolean = true;
  @Input() dataSelect: any[] = [];

  public dsIcon: any = TablerIcon;
  public dsTreeView: any[] = [];
  public dsDropdown: any[] = [];
  public dsPathValue: any[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.dsTreeView = this.dataSource;
    this.addValueChange(this.dsTreeView);
    this.dsTreeView.map((item) => (item['parent'] = true));

    if (this.dataSelect.length == 0) return;
    let arrPath = [];
    this.dataSelect.find((ds, i) => {
      let splitOf = ds.split('#');
      let perm = splitOf[1];
      let path = splitOf[0];
      arrPath.push(path);

      for (let dd of this.dsDropdown) if (dd.name == perm) continue;
      let ddValue = perm == 'Mixx' ? 0 : perm == 'Full' ? 1 : 2;
      this.dsDropdown.push({ perm, value: ddValue, path });
    });
  }

  addValueChange(data: any) {
    for (let item of data) {
      item['expand'] = this.expanded;
      if (item.children == undefined) return;
      this.addValueChange(item.children);
    }
  }

  onRightClick(data: any, select: string) {
    data['perm'] = select;
    if (data.children == undefined) return;
    this.findChild(data, select);
  }

  private findChild(data: any, select: any) {
    for (let item of data.children) {
      item['perm'] = select;
      if (item.children == undefined) return;
      this.findChild(data, select);
    }
  }

  onSaveClick() {
    if (this.dsPathValue.length != 0) this.dsPathValue = [];

    let result = this.dsTreeView.map((item: any) => {
      let namePerm = item.perm == 0 ? 'Mixx' : item.perm == 1 ? 'Full' : 'Read';
      return item.path + '#' + namePerm;
    });
    this.dsPathValue = result;
  }

  onCancelClick() {
    this.dsTreeView = this.dataSource;
    this.dsPathValue = this.dataSelect;
  }
}
