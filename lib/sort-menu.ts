"use client";

export const sortMenuItems = (items: any) => {
  items.sort((a: any, b: any) => {
    // If 'delete' is found in the key of 'b' but not in 'a', 'a' should come before 'b'
    if (b.key.includes("delete") && !a.key.includes("delete")) {
      return -1;
    }
    // If 'delete' is found in the key of 'a' but not in 'b', 'b' should come before 'a'
    else if (a.key.includes("delete") && !b.key.includes("delete")) {
      return 1;
    }
    // For all other cases, maintain the original order
    else {
      return a.key.localeCompare(b.key);
    }
  });
};
