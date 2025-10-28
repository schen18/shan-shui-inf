LingDong's original https://github.com/LingDong-/shan-shui-inf was so breathtaking that others have tried their own spin on it. However those typically amounted to porting the code into another framework like React, Node etc. instead of adding anything new or contributing to deeper understanding of how LingDong created such a miracle in raw Javascript.

This repo focuses on refactoring LingDong's original monolithic code into constitutent modules, including JSdocs and READMEs for each module to facilitate understanding and improvements.
Using this as a base, improvements were made to LingDong's original.

1. Autoscroll "infinitely" on load (vs needing manual toggle)
2. Add ability to toggling scroll direction from L-R / R-L 
3. Add ability to toggle elements (Trees, Buildings, Boats, People) to include/exclude from painting
4. Addded "Broken Strokes" toggle that randomly breaks stroke paths of Mountains, Water, Boats to mimic brush stroke aesthetics

