import { Controller, Get, Param, Req, Res } from '@nestjs/common';

@Controller('ssr')
export class SSRController {
  constructor(
  ) { }

  @Get(':uniqueId')
  async Share(@Req() req, @Res() res, @Param() param) {
    try {
      let title: string, description: string, image: string, url: string, videoLink: string = '', totalDuration = 0
      title = 'Title';
      description = 'Description';
      image = 'static/no-image.jpg';
      url = `ANY URL`;

      return res.send(this.getMetaTagsHtml(title, description, image, url, videoLink, totalDuration));

    } catch (error) {
      console.error(error);
      return res.json({ status: 'error', message: 'Something went wrong' })
    }
  }


  /**
   * Get og:meta tags 
   * @param title string
   * @param description string
   * @param imageUrl string
   * @param url string
   * @param videoLink string
   * @returns string
   */
  getMetaTagsHtml(title: string, description: string, imageUrl: string, url: string, videoLink?: string, totalDuration?: number) {
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