import { request } from '@/api/request'
import type {
  VideoFeedData,
  VideoLikeResult,
  VideoPlayResult,
  VideoRelatedData,
  VideoSearchData,
} from '@/types/video'

/** 推荐流：已发布的用户上传短视频 */
export const fetchVideoFeed = (): Promise<VideoFeedData> => {
  return request<VideoFeedData>('/api/video/feed')
}

/** 关键字搜索相关短视频 */
export const searchVideosApi = (keyword: string, limit = 30): Promise<VideoSearchData> => {
  const q = encodeURIComponent(keyword.trim())
  return request<VideoSearchData>(`/api/video/search?keyword=${q}&limit=${limit}`)
}

/** 根据当前视频推荐相关内容 */
export const fetchRelatedVideosApi = (videoId: string | number, limit = 12): Promise<VideoRelatedData> => {
  return request<VideoRelatedData>(`/api/video/${videoId}/related?limit=${limit}`)
}

/** 点赞 / 取消点赞（切换） */
export const toggleVideoLikeApi = (videoId: string | number): Promise<VideoLikeResult> => {
  return request<VideoLikeResult>(`/api/video/${videoId}/like`, { method: 'POST' })
}

/** 记录一次播放 */
export const recordVideoPlayApi = (videoId: string | number): Promise<VideoPlayResult> => {
  return request<VideoPlayResult>(`/api/video/${videoId}/play`, { method: 'POST' })
}
