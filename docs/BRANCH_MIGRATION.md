# Preserving the working project history

The original `main` tip was `3194bf2180cfc3399ade4937388e1bbac6315eb1`, a mostly empty CRA template. The working branch `AE.Dolmatov/diploma` ends at `4bd1d35` and contains the layout, JavaScript and React stages.

`git merge-base --is-ancestor origin/main origin/AE.Dolmatov/diploma` returned success. The working branch is a descendant of main, so no history rewrite or conflict resolution is needed.

A local backup branch, `backup/main-before-portfolio-20261031`, preserves the original main tip. The presentation branch was advanced with `git merge --ff-only origin/AE.Dolmatov/diploma`, followed by reviewed documentation and small technical fixes.

The safe promotion is an ordinary non-force push of the reviewed descendant to main. If main changes concurrently, stop and inspect the new commits; never force the update. Preserve the original working branch and the backup. Recovery can use a separate branch at the original SHA without deleting the completed work.

Local preparation is distinct from a successful remote push. Check the final delivery report for the actual published commit and branch state.
