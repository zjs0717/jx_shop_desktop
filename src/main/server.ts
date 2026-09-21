import {
  createServer,
  request as httpRequest,
  type IncomingMessage,
  type ServerResponse,
} from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize, sep } from 'node:path'
import type { AddressInfo } from 'node:net'

const API_ORIGIN = process.env.JJ_API_ORIGIN || 'http://127.0.0.1:8017'

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
}

function isSafePath(root: string, target: string): boolean {
  const resolved = normalize(target)
  const rootNorm = normalize(root + sep)
  return resolved === normalize(root) || resolved.startsWith(rootNorm)
}

function proxyApi(req: IncomingMessage, res: ServerResponse): void {
  const target = new URL(req.url || '/', API_ORIGIN)
  const headers = { ...req.headers, host: target.host }
  const proxyReq = httpRequest(
    {
      protocol: target.protocol,
      hostname: target.hostname,
      port: target.port || 80,
      path: `${target.pathname}${target.search}`,
      method: req.method,
      headers,
    },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode || 502, proxyRes.headers)
      proxyRes.pipe(res)
    },
  )
  proxyReq.on('error', () => {
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' })
    }
    res.end('无法连接业务服务，请确认后端已在 8017 端口启动')
  })
  req.pipe(proxyReq)
}

function sendFile(req: IncomingMessage, res: ServerResponse, file: string): void {
  const stat = statSync(file)
  const ext = extname(file).toLowerCase()
  const type = MIME[ext] || 'application/octet-stream'
  const range = req.headers.range

  if (range) {
    const match = /bytes=(\d*)-(\d*)/.exec(range)
    const start = match?.[1] ? Number(match[1]) : 0
    const end = match?.[2] ? Number(match[2]) : stat.size - 1
    if (Number.isNaN(start) || Number.isNaN(end) || start >= stat.size || end >= stat.size) {
      res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` })
      res.end()
      return
    }
    res.writeHead(206, {
      'Content-Type': type,
      'Content-Length': end - start + 1,
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
    })
    createReadStream(file, { start, end }).pipe(res)
    return
  }

  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': stat.size,
    'Accept-Ranges': 'bytes',
  })
  createReadStream(file).pipe(res)
}

export function startRendererServer(root: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url || '/', 'http://127.0.0.1')
      const pathname = decodeURIComponent(url.pathname)
      if (pathname.startsWith('/api') || pathname.startsWith('/uploads')) {
        proxyApi(req, res)
        return
      }

      const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '')
      let file = join(root, relative)
      if (!isSafePath(root, file) || !existsSync(file) || statSync(file).isDirectory()) {
        file = join(root, 'index.html')
      }
      sendFile(req, res, file)
    })

    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address() as AddressInfo
      resolve(`http://127.0.0.1:${addr.port}`)
    })
  })
}
