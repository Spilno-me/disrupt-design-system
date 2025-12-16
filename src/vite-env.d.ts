/// <reference types="vite/client" />

declare module '*.css' {
  const content: string
  export default content
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.avif' {
  const src: string
  export default src
}
