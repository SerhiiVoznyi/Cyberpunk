import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import express from 'express'

const root = join(dirname(fileURLToPath(import.meta.url)), 'dist')
const app = express()

app.use(express.static(root, { index: false }))

app.use((req, res) => {
  if (req.method !== 'GET' || extname(req.path)) {
    res.status(404).end()
    return
  }
  res.sendFile(join(root, 'index.html'))
})

const port = Number(process.env.PORT) || 3000
app.listen(port, () => console.log(`Serving dist on port ${port}`))
