import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'core-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css'],
})
export class TreeViewComponent implements OnChanges {
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {}
}
