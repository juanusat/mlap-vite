import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = parseInt(env.PORT_FRONT || env.PORT || '4202', 10)
  return defineConfig({
    plugins: [react()],
    server: {
      port,
    },
  })
}
