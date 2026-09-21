/** 登录表单字段 */
export interface LoginForm {
  username: string
  password: string
  remember: boolean
}

/** 登录请求参数 */
export interface LoginPayload {
  username: string
  password: string
}

/** 登录接口响应 */
export interface LoginResponse {
  token: string
}

/** 注册接口响应 */
export interface RegisterResponse {
  token: string
  username: string
}
