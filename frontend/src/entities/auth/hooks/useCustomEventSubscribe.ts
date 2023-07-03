import { useCustomEventSubscribe } from '../../../shared'
import { REFRESH_TOKEN_FAILED_EVENT_NAME } from '../utils/unauthorisedHandleInterceptor'

export function useSubscribeOnRefreshTokenFail(callback: () => void) {
  useCustomEventSubscribe(REFRESH_TOKEN_FAILED_EVENT_NAME, callback)
}
