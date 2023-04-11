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
  public dsPathValue: any[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.buildDs();
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
      this.dsDropdown.push({ perm, value: i, path });
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
    this.buildDs();
    this.dsPathValue = this.dsTreeView;
  }

  private buildDs() {
    this.dsTreeView = [];
    this.dataSource.map((ds) => this.dsTreeView.push(ds));
  }
}
