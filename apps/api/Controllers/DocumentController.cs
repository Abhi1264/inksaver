using Microsoft.AspNetCore.Mvc;
using SkiaSharp;

namespace InkSaver.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DocumentController : ControllerBase
{
    [HttpPost("process")]
    public IActionResult ProcessDocument(IFormFile file, [FromQuery] int threshold = 120) 
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        // 1. Decode the image
        using var stream = file.OpenReadStream();
        using var rawBitmap = SKBitmap.Decode(stream);

        if (rawBitmap == null)
            return BadRequest("Could not decode image.");

        // 2. Convert to BGRA8888 for processing
        using var srcBitmap = rawBitmap.Copy(SKColorType.Bgra8888);

        // 3. Apply the filter
        using var processedBitmap = ApplyInkSaverFilter(srcBitmap, threshold);

        // 4. Export
        using var outputStream = new MemoryStream();
        processedBitmap.Encode(outputStream, SKEncodedImageFormat.Jpeg, 80);
        outputStream.Position = 0;

        return File(outputStream.ToArray(), "image/jpeg");
    }

    private unsafe SKBitmap ApplyInkSaverFilter(SKBitmap source, int threshold)
    {
        int width = source.Width;
        int height = source.Height;
        var result = new SKBitmap(width, height, SKColorType.Bgra8888, SKAlphaType.Premul);

        byte* srcPtr = (byte*)source.GetPixels().ToPointer();
        byte* dstPtr = (byte*)result.GetPixels().ToPointer();

        int totalPixels = width * height;

        for (int i = 0; i < totalPixels; i++)
        {
            // BGRA layout
            byte b = srcPtr[0];
            byte g = srcPtr[1];
            byte r = srcPtr[2];
            // byte a = srcPtr[3];

            // 1. Calculate Brightness (Luma)
            int gray = (r * 299 + g * 587 + b * 114) / 1000;

            // 2. Thresholding
            // If the pixel is BRIGHTER than threshold -> Make it WHITE (Background)
            // If the pixel is DARKER than threshold -> Make it BLACK (Text)
            
            if (gray > threshold)
            {
                // WHITE (Background)
                dstPtr[0] = 255; // B
                dstPtr[1] = 255; // G
                dstPtr[2] = 255; // R
                dstPtr[3] = 255; // A (Fully Opaque)
            }
            else
            {
                // BLACK (Text)
                dstPtr[0] = 0;   // B
                dstPtr[1] = 0;   // G
                dstPtr[2] = 0;   // R
                dstPtr[3] = 255; // A (Fully Opaque)
            }

            srcPtr += 4;
            dstPtr += 4;
        }

        return result;
    }
}