export const ROUTES = {
  home: "home",
  listen: "listen",
  auth: "auth",
  upload: "upload",
  account: "account",
  admin: "admin",
  public: "public",
  landing: "",
};

export const openRoutes = new Set([
  ROUTES.landing,
  ROUTES.listen,
  ROUTES.auth,
  ROUTES.admin,
  ROUTES.public,
]);

export function route(name: string, ...params: string[]) {
  let post = "";
  for (const param of params) {
    post += "/";
    post += param;
  }
  return `/${name}${post}`;
}
