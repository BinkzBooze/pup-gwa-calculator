import { NextRequest } from 'next/server'

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ filename: string }> }
) {
  try {
    const params = await props.params;
    const filename = decodeURIComponent(params.filename)
    
    const formData = await req.formData()
    const contentType = formData.get('contentType') as string || 'application/octet-stream'
    const base64data = formData.get('base64data') as string

    if (!base64data) {
      return new Response('Missing file data', { status: 400 })
    }

    // Convert the base64 string back to binary buffer
    const buffer = Buffer.from(base64data, 'base64')

    // Force a download by returning the binary data with Content-Disposition attachment.
    // The dynamic route ensures the URL ends with the filename, which fixes IDE webview downloaders
    // that ignore the Content-Disposition header and use the URL path instead.
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
        // Prevent browser caching to ensure fresh downloads
        'Cache-Control': 'no-store, max-age=0',
      },
    })
  } catch (error) {
    console.error('Export API error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
