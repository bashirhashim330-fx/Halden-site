Inspect sequences (the "take the watch apart" view)

For each watch, put numbered frames in a folder named after the watch id:
  assets/inspect/azure/f_001.webp, f_002.webp, f_003.webp ...
Then in js/data.js set that product's  inspect.count  to the number of frames (it is 0 now, which keeps the dial zoom).
The stage labels (Front, Side profile, Case back, Movement, Reassembled) are in HAL.inspectLabels in js/data.js.
Each label has a "from" and "to" position between 0 and 1 along the sequence. Change them to match your video.
Suggested: 60 to 120 frames, 1280 px wide or taller, webp, plain dark background.
