import { Request, Response, NextFunction } from "express";
import { storage } from "./storage";

// 扩展 Request 接口以包含用户组信息
declare global {
  namespace Express {
    interface Request {
      userGroups?: string[];
      activeGroupId?: string;
    }
  }
}

/**
 * 组级别权限验证中间件
 * 确保用户只能访问其所属组的数据
 */
export async function groupAccessMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // 从请求体或会话中获取用户信息（适配现有认证方式）
    const userId = req.body?.user?.id || req.session?.user?.id || req.headers?.['x-user-id'] as string;
    
    if (!userId) {
      return res.status(401).json({ message: "未授权：用户未登录" });
    }

    // 获取用户所属的所有组
    const userGroups = await storage.getUserGroups(userId);
    req.userGroups = userGroups.map(g => g.id);
    
    // 如果请求包含组ID，验证用户是否属于该组
    const requestedGroupId = req.params.groupId || req.query.groupId as string;
    if (requestedGroupId) {
      if (!req.userGroups.includes(requestedGroupId)) {
        return res.status(403).json({ 
          message: "禁止访问：您不属于请求的组" 
        });
      }
      req.activeGroupId = requestedGroupId;
    } else if (req.userGroups.length > 0) {
      // 如果未指定组ID，使用用户的第一个组作为默认组
      req.activeGroupId = req.userGroups[0];
    }

    next();
  } catch (error) {
    console.error("组权限验证错误:", error);
    res.status(500).json({ message: "服务器内部错误" });
  }
}

/**
 * 患者数据访问控制
 * 确保用户只能访问其组分配的患者数据
 */
export async function patientAccessMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const patientId = req.params.patientId;
    const userGroupId = req.activeGroupId;
    
    if (!patientId || !userGroupId) {
      return next();
    }

    // 检查该组是否有权访问此患者数据
    const groupAssignments = await storage.getGroupDataAssignments(userGroupId);
    const hasAccess = groupAssignments.some(assignment => 
      assignment.patientId === patientId
    );

    if (!hasAccess) {
      return res.status(403).json({ 
        message: "禁止访问：您的组无权访问此患者数据" 
      });
    }

    next();
  } catch (error) {
    console.error("患者数据访问控制错误:", error);
    res.status(500).json({ message: "服务器内部错误" });
  }
}

/**
 * SOAP笔记和医嘱数据隔离
 * 确保用户只能看到自己组内创建的笔记和医嘱
 */
export async function groupDataIsolationMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // 在请求中添加组过滤信息
    req.groupFilter = {
      userGroups: req.userGroups || [],
      activeGroupId: req.activeGroupId
    };
    
    next();
  } catch (error) {
    console.error("组数据隔离错误:", error);
    res.status(500).json({ message: "服务器内部错误" });
  }
}

// 扩展 Request 接口
declare global {
  namespace Express {
    interface Request {
      groupFilter?: {
        userGroups: string[];
        activeGroupId?: string;
      };
    }
  }
}