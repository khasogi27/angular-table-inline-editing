import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const animatedToggleTree = (args: string) => {
  return trigger(args, [
    state(
      'true',
      style({
        opacity: 1,
      })
    ),
    state(
      'false',
      style({
        opacity: 0,
        height: 0,
        padding: 0,
      })
    ),
    transition('true => false', animate(300)),
    transition('false => true', animate(300)),
  ]);
};
