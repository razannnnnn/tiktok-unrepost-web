export interface TikTokUser {
  open_id: string
  union_id: string
  avatar_url: string
  display_name: string
  username: string
}

export interface TikTokVideo {
  id: string
  title: string
  cover_image_url: string
  share_url: string
  create_time: number
  duration: number
  view_count: number
  like_count: number
  comment_count: number
  share_count: number
}

export interface TikTokSession {
  access_token: string
  refresh_token: string
  open_id: string
  expires_at: number
  user?: TikTokUser
}

export interface RepostListResponse {
  data: {
    videos: TikTokVideo[]
    cursor: number
    has_more: boolean
  }
  error: {
    code: string
    message: string
    log_id: string
  }
}
