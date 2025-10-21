import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = parseInt(env.FRONTEND_PORT, 10)
  return defineConfig({
    plugins: [react()],
    server: {
      port,
    },
  })
}
