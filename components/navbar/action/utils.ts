import { NavItem } from "./items";

const extractParams = (itemPaths: string[], currPaths: string[]) => {
  const allParamsIndex: number[] = [];

  itemPaths.forEach((path, i) => {
    if (path.includes(":")) allParamsIndex.push(i);
  });

  if (allParamsIndex.length > 0)
    allParamsIndex.forEach((i) => {
      if (itemPaths?.[i] && currPaths?.[i]) itemPaths[i] = currPaths[i];
    });
};

export const getNavItem = (navActionItems: NavItem[], pathname: string) => {
  const item = navActionItems.find((item) => {
    const paths = pathname.split("/").filter((path) => path !== "");

    // if ((item.keys?.length ?? 0) > 0) {
    return item.keys?.some((item) => {
      const itemPath = item.split("/").filter((path) => path !== "");
      extractParams(itemPath, paths);
      return itemPath.join("/") === paths.join("/");
    });
    // }

    // const itemPath = item.key.split("/").filter((path) => path !== "");

    // extractParams(itemPath, paths);

    // return paths.join("/") === itemPath.join("/");
  });

  return item;
};

// const item2 = navActionItems.find((item) => {
//   const pathnames = pathname.split("/").filter((pathname) => pathname !== "");
//   const withParams = item.key.includes(":")
//     ? pathnames?.[pathnames.indexOf(item.key.split("/:")[0]) + 1]
//     : "";
//   const isLastPath =
//     pathnames?.[
//       pathnames.indexOf(
//         item.key.includes("/:") ? item.key.split("/:")[0] : item.key
//       ) + (item.key.includes("/:") ? 2 : 1)
//     ];

//   if (withParams && isLastPath)
//     return pathnames
//       .join("/")
//       .includes(item.key.split("/:")[0] + "/" + withParams);
//   if (isLastPath)
//     return item.key.includes("/:")
//       ? pathnames.includes(item.key.split("/:")[0]) &&
//           pathnames.includes(item.key.split("/:")[1])
//       : pathnames.includes(item.key);
//   return undefined;
// });
