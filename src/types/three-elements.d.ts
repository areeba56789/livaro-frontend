import { ThreeElements } from '@react-three/fiber'

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements extends ThreeElements {}
    }
  }
  
  // For older TypeScript / Next.js configurations that still use the global JSX namespace
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}
