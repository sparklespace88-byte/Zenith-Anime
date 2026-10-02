Apni video files yahan is naam se rakho (MP4, H.264/AAC):

  demon-slayer-ep2.mp4
  demon-slayer-ep3.mp4
  demon-slayer-ep4.mp4
  demon-slayer-ep5.mp4

Phir `npm run dev` chalao. Episode 2-5 par click karne par yeh videos chalengi.
Compress karne ka command (file chhoti rehti hai):
  ffmpeg -i input.mp4 -vf scale=854:-2 -c:v libx264 -crf 30 -preset slow -c:a aac -b:a 64k -movflags +faststart demon-slayer-ep2.mp4
