export interface AuthError {
  message: string
}

export interface GithubUser {
  login: string
  name: string
  email: string
}

export interface LoginFormData {
  username: string
  password: string
}

