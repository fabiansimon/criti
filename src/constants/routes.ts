export const ROUTES = {
  home: "home",
  listen: "listen",
  upload: "upload",
  landing: "",
};

export const openRoutes = new Set([ROUTES.landing, ROUTES.listen]);

export function route(name: string, ...params: string[]) {
  let post = "";
  for (const param of params) {
    post += "/";
    post += param;
  }
  return `/${name}${post}`;
}
