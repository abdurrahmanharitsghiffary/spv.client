const superChildComment3 = {
  id: 6,

  comment:
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea dolore deleniti quisquam illum mollitia quae libero beatae incidunt modi vero fugiat, ullam velit, iure rerum consequatur quam perferendis quis esse!Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea dolore deleniti quisquam illum mollitia quae libero beatae incidunt modi vero fugiat, ullam velit, iure rerum consequatur quam perferendis quis esse!Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea dolore deleniti quisquam illum mollitia quae libero beatae incidunt modi vero fugiat, ullam velit, iure rerum consequatur quam perferendis quis esse!",
  childrenComment: [],
};

const superChildComment2 = {
  id: 5,

  comment:
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea dolore deleniti quisquam illum mollitia quae libero beatae incidunt modi vero fugiat, ullam velit, iure rerum consequatur quam perferendis quis esse!Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea dolore deleniti quisquam illum mollitia quae libero beatae incidunt modi vero fugiat, ullam velit, iure rerum consequatur quam perferendis quis esse!Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea dolore deleniti quisquam illum mollitia quae libero beatae incidunt modi vero fugiat, ullam velit, iure rerum consequatur quam perferendis quis esse!",
  childrenComment: [superChildComment3],
};

const superChildComment = {
  id: 4,

  comment:
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea dolore deleniti quisquam illum mollitia quae libero beatae incidunt modi vero fugiat, ullam velit, iure rerum consequatur quam perferendis quis esse!Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea dolore deleniti quisquam illum mollitia quae libero beatae incidunt modi vero fugiat, ullam velit, iure rerum consequatur quam perferendis quis esse!Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea dolore deleniti quisquam illum mollitia quae libero beatae incidunt modi vero fugiat, ullam velit, iure rerum consequatur quam perferendis quis esse!",
  childrenComment: [superChildComment2],
};

const moreChildComment = {
  id: 3,

  comment:
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ea dolore deleniti quisquam illum mollitia quae libero beatae incidunt modi vero fugiat, ullam velit, iure rerum consequatur quam perferendis quis esse!",
  childrenComment: [superChildComment],
};

const childComment = {
  id: 2,
  comment: "yuhuhu",
  childrenComment: [moreChildComment],
};
const comment = {
  id: 1,
  comment: "ayhaha",
  childrenComment: [childComment],
};

export const comments = [1, 2, 3, 4, 5].map((id) => ({
  ...comment,
  id,
}));
