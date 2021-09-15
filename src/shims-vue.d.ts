// Mocks all files ending in `.vue` showing them as plain Vue instances
declare module '*.vue' {
  import { ComponentOptions } from 'vue'
  const component: ComponentOptions
  export default component
}

// import { MediaPlayer } from '../src-electron/MediaPlayer'
declare interface Window {
  instances: {
    mediaPlayer: {
      currentIndex: string,
      togglePlay: () => void,
      currentMode: number
    }
  }
}