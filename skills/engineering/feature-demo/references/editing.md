# Editing a feature demo

Use an available video editor or FFmpeg. Inspect the source before editing:

```bash
ffprobe -v error -show_entries format=duration -show_entries stream=codec_name,width,height,avg_frame_rate -of default=noprint_wrappers=1 captures/after-raw.mp4
ffmpeg -hide_banner -filters
```

Choose timestamps from the actual recording. Keep the source files intact. The examples use silent video and require an FFmpeg build with `libx264`. If the source has requested audio, preserve and edit its audio alongside the video.

## Trim and change speed

This example keeps three intervals. It plays the middle interval at twice its original speed. Replace the timestamps with the intervals from the recording.

```bash
ffmpeg -i captures/after-raw.mp4 -filter_complex \
  "[0:v]trim=start=1.2:end=3.2,setpts=PTS-STARTPTS[a]; \
   [0:v]trim=start=3.2:end=8.2,setpts=(PTS-STARTPTS)/2[b]; \
   [0:v]trim=start=8.2:end=11.2,setpts=PTS-STARTPTS[c]; \
   [a][b][c]concat=n=3:v=1:a=0[out]" \
  -map "[out]" -fps_mode vfr -c:v libx264 -pix_fmt yuv420p \
  -movflags +faststart captures/after-trimmed.mp4
```

Keep critical transitions and outcomes at normal speed. Do not speed up the evidence of a performance change without an explicit label. For a comparison, apply equivalent edits where possible. Preserve differences that are the subject of the demo.

## Add a caption

Use a short caption that adds context, such as `Previous result` or `Loading (2x)`. Choose its position and time after reviewing the actual video. Use sufficient contrast and leave the important interface visible.

If `ffmpeg -filters` lists `drawtext`, write the caption to a UTF-8 text file and use a filter like this:

```bash
ffmpeg -i captures/after-trimmed.mp4 -vf \
  "drawtext=textfile=captures/caption.txt:fontcolor=white:fontsize=24:box=1:boxcolor=black@0.75:boxborderw=10:x=24:y=24:enable='between(t,0,3)'" \
  -fps_mode vfr -c:v libx264 -pix_fmt yuv420p -movflags +faststart captures/after.mp4
```

Some FFmpeg builds omit `drawtext`. In that case, create a transparent PNG with the caption in an available editor. Then overlay the image:

```bash
ffmpeg -i captures/after-trimmed.mp4 -i captures/caption.png \
  -filter_complex "[0:v][1:v]overlay=x=24:y=24:enable='between(t,0,3)'[out]" \
  -map "[out]" -fps_mode vfr -c:v libx264 -pix_fmt yuv420p \
  -movflags +faststart captures/after.mp4
```

Adjust the font, position, and duration for the target viewport. Do not add text that describes an outcome the video does not show.

## Review

Play the entire final video, or inspect consecutive frames across the full timeline if playback is unavailable. Inspect each cut and caption at the intended viewing size. Make sure that the file decodes and that its duration, dimensions, and frame rate match the intended output. Review both sides of a comparison against the same checklist.

If the intended experience is motion-sensitive, compare the source cadence and distinct frames with the desired result. A higher output frame rate alone does not add captured motion.
