// @ts-nocheck
import { uniform } from "three/tsl";
class SC1 {
  perm = $state(0);
  perm_metal = $derived.by(() => {
    let m_vals = [
      0.5, 0.75, 0.5, 0.5, 0.5, 0.2, 0.82, 0.26, 0.2, 0.72, 0.2, 0.2, 0.5,
    ];
    return m_vals[this.perm];
  });
  perm_rough = $derived.by(() => {
    let r_vals = [
      0.4, 0.75, 0.25, 0.5, 0.25, 0.6, 0.6, 0.6, 0.6, 0.426, 0.6, 0.6, 0.6,
    ];
    return r_vals[this.perm];
  });

  uPerm = uniform(this.perm);
  uPerm_m = uniform(this.perm_metal);
  uPerm_r = uniform(this.perm_rough);
}

export const sc1 = new SC1();
