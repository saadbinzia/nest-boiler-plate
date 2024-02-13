import { Controller, Get, Req, Res } from '@nestjs/common';
import GlobalResponses from 'src/core/config/GlobalResponses';

@Controller('ssr')
export class SSRController {
  constructor(
    private readonly _globalResponses: GlobalResponses
  ) { }

  @Get('')
  async ssr(@Req() req, @Res() res) {
    try {
      let title: string, description: string, image: string, url: string
      const videoLink: string = '', totalDuration = 0

      return res.send(this.getMetaTagsHtml(title, description, image, url, videoLink, totalDuration));

    } catch (error) {
      console.error(error);
      return res.json(this._globalResponses.formatResponse('error', null, null))
    }
  }


  /**
   * Get og:meta tags 
   * @param {string} title
   * @param {string} description
   * @param {string} imageUrl
   * @param {string} url
   * @param {string} videoLink
   * @param {number} totalDuration
   * @returns {any}
   */
  getMetaTagsHtml(title: string, description: string, imageUrl: string, url: string, videoLink?: string, totalDuration?: number): any {
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
      <meta property="og:title" content="${title}" />
      <meta property="og:type" content="${videoLink ? 'video.episode' : 'website'}" />
      <meta property="og:description" content="${description}" />
      <meta property="og:image" content="${process.env['API_URL']}/${imageUrl}" />
      ${videoLink ?
        `<meta property="og:video" content="${videoLink}" />
        <meta property="og:video:width" content="350" />
        <meta property="og:video:height" content="200" />
        <meta property="og:video:duration" content="${totalDuration}" />`
        : ``}
      <meta property="og:url" content="${process.env['APP_URL']}/${url}" />
      <meta name="twitter:card" content="${videoLink ? 'player' : 'app'}" />
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:site" content="${process.env['APP_URL']}/${url}" />
      <meta name="twitter:description" content="${description}" />
      ${videoLink ?
        `<meta name="twitter:player" content="${videoLink}" />
        <meta name="twitter:player:width" content="360" />
        <meta name="twitter:player:height" content="200" />`:
        ``}
      <meta name="twitter:image" content="${process.env['API_URL']}/${imageUrl}" /> 

      </head>
      <body>
        <video
          id="my-player"
          controls
          style="width: 100%; max-width: 500px;"
        />
      </body>
    </html> 
`  }
}