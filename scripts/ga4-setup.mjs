#!/usr/bin/env node
/**
 * GA4 Setup Script
 * 1. OAuth2 authentication
 * 2. List GA4 properties to find Property ID
 * 3. Save refresh token for cron usage
 */

import { google } from 'googleapis'
import http from 'http'
import { URL } from 'url'
import fs from 'fs'
import path from 'path'

const CLIENT_SECRET_PATH = path.join(
  process.env.HOME,
  '.config/gog/client_secret.json'
)
const TOKEN_PATH = path.join(
  process.env.HOME,
  '.config/gog/ga4-token.json'
)

const SCOPES = [
  'https://www.googleapis.com/auth/analytics.readonly',
]

async function getAuthClient() {
  const content = JSON.parse(fs.readFileSync(CLIENT_SECRET_PATH, 'utf8'))
  const { client_id, client_secret } = content.installed

  const oauth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    'http://localhost:3333/callback'
  )

  // Check for existing token
  if (fs.existsSync(TOKEN_PATH)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'))
    oauth2Client.setCredentials(token)
    console.log('Using existing token from', TOKEN_PATH)
    return oauth2Client
  }

  // Start OAuth flow
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  })

  console.log('\nOpen this URL in your browser:\n')
  console.log(authUrl)
  console.log('\nWaiting for callback on http://localhost:3333/callback ...\n')

  const code = await new Promise((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url, 'http://localhost:3333')
      if (url.pathname === '/callback') {
        const authCode = url.searchParams.get('code')
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end('<h1>OK - You can close this tab</h1>')
        server.close()
        resolve(authCode)
      }
    })
    server.listen(3333, () => {
      console.log('Listening on port 3333...')
    })
    server.on('error', reject)
  })

  const { tokens } = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens)

  // Save token
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2))
  console.log('\nToken saved to', TOKEN_PATH)
  console.log('Refresh token:', tokens.refresh_token ? 'YES' : 'NO')

  return oauth2Client
}

async function listProperties(authClient) {
  const analyticsAdmin = google.analyticsadmin({
    version: 'v1beta',
    auth: authClient,
  })

  console.log('\n--- GA4 Accounts ---')
  const accounts = await analyticsAdmin.accounts.list()

  for (const account of accounts.data.accounts || []) {
    console.log(`\nAccount: ${account.displayName} (${account.name})`)

    const properties = await analyticsAdmin.properties.list({
      filter: `parent:${account.name}`,
    })

    for (const prop of properties.data.properties || []) {
      console.log(`  Property: ${prop.displayName}`)
      console.log(`    ID: ${prop.name}`)
      console.log(`    Property ID: ${prop.name.replace('properties/', '')}`)

      // List data streams
      const streams = await analyticsAdmin.properties.dataStreams.list({
        parent: prop.name,
      })

      for (const stream of streams.data.dataStreams || []) {
        console.log(`    Stream: ${stream.displayName}`)
        console.log(`      Type: ${stream.type}`)
        if (stream.webStreamData) {
          console.log(`      Measurement ID: ${stream.webStreamData.measurementId}`)
          console.log(`      Stream ID: ${stream.name}`)
        }
      }
    }
  }
}

async function enableAPIs(authClient) {
  const token = await authClient.getAccessToken()
  const accessToken = token.token

  const apis = [
    'analyticsadmin.googleapis.com',
    'analyticsdata.googleapis.com',
  ]

  for (const api of apis) {
    console.log(`\nEnabling ${api}...`)
    const resp = await fetch(
      `https://serviceusage.googleapis.com/v1/projects/emerald-trilogy-414009/services/${api}:enable`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )
    const data = await resp.json()
    if (data.error) {
      console.error(`  Failed: ${data.error.message}`)
    } else {
      console.log(`  OK: ${JSON.stringify(data.name || 'enabled')}`)
    }
  }

  // Wait for propagation
  console.log('\nWaiting 10s for API propagation...')
  await new Promise((r) => setTimeout(r, 10000))
}

async function main() {
  const authClient = await getAuthClient()
  await enableAPIs(authClient)
  await listProperties(authClient)
}

main().catch(console.error)
