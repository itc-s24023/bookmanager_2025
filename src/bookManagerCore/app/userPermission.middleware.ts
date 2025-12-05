import { Request, Response, NextFunction } from "express";

export function middlewareIsAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user?.isAdmin) return next();

  res.status(403).json({ message: "管理者権限が必要です" });
}

type PermissionErrorResponseOptions = {
  /** ログインしていない場合のレスポンスをカスタマイズする関数 */
  notLoggedInResponse?: (res: Response) => void;
  /** 権限が不足している場合のレスポンスをカスタマイズする関数 */
  insufficientPermissionResponse?: (res: Response) => void;
};

/**
 * expressのミドルウェアとして使用するユーザー権限チェック関数を返す
 * @param level
 * @returns
 */
export function middlewareCheckUserPermission(
  level: "user" | "admin",
  options: PermissionErrorResponseOptions = {}
) {
  const {
    notLoggedInResponse = (res: Response) =>
      res.status(401).json({ message: "ログインが必要です" }),
    insufficientPermissionResponse = (res: Response) =>
      res.status(403).json({ message: "権限が不足しています" }),
  } = options;

  return async (req: Request, res: Response, next: NextFunction) => {
    const sessionUser = req.user;
    if (!sessionUser) return notLoggedInResponse(res);

    if (level === "user") return next();

    if (sessionUser?.isAdmin) return next();

    return insufficientPermissionResponse(res);
  };
}
