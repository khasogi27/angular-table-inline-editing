import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { animatedToggleTree } from '../animated-tree';

@Component({
  selector: 'core-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css'],
  animations: [animatedToggleTree('toggleTree')],
})
export class TreeViewComponent implements OnChanges {
  @Input() dataSource: any[] = [];
  public isExpand: boolean = false;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.dataSource.map((item) => (item['parent'] = true));
    this.addValueChange(this.dataSource);
  }

  private addValueChange(data: any) {
    for (let item of data) {
      item['expand'] = this.isExpand;
      if (item.children == undefined) return;
      this.addValueChange(item.children);
    }
  }

  expandCollapse() {
    this.isExpand = !this.isExpand;
    this.addValueChange(this.dataSource);
  }
}
