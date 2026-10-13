import type { FaqItem } from '@/components/FaqSection';

export const FULL_FAQ: FaqItem[] = [
  {
    question: 'How do I download a Threads video?',
    answer:
      'Copy the link to a public Threads post, paste it into the box on this page, and click "Download Video." Once the preview loads, pick a quality and click the download button to save the MP4 file.',
  },
  {
    question: 'Is the Threads Video Downloader free?',
    answer: 'Yes. It is free to use and there is nothing to sign up for.',
  },
  {
    question: 'Do I need a Threads account?',
    answer: 'No. You never need to log in or provide your Threads username or password to use this tool.',
  },
  {
    question: 'Can I download Threads videos on Android?',
    answer:
      'Yes, the tool works in any modern mobile browser on Android, including Chrome and Samsung Internet. Just paste the post link and tap Download.',
  },
  {
    question: 'Can I download Threads videos on iPhone?',
    answer:
      'Yes, it works in Safari and Chrome on iOS. After downloading, the video is typically saved to your Files app or Photos, depending on your browser settings.',
  },
  {
    question: 'What video format is supported?',
    answer: 'Videos are provided as standard MP4 files, which play on virtually every device and media player.',
  },
  {
    question: 'Can I download private Threads videos?',
    answer:
      'No. This tool only processes posts that are already publicly visible. It does not bypass login walls, private-account restrictions, or any other access control.',
  },
  {
    question: 'Where are downloaded videos saved?',
    answer:
      'Files are saved to your device’s default download location — typically the "Downloads" folder on desktop, or your device’s Files/Gallery app on mobile, depending on your browser settings.',
  },
  {
    question: 'Why is my Threads video not downloading?',
    answer:
      'This usually means the post is private, has been deleted, doesn’t contain a video, or Threads has temporarily changed how it serves media. Double-check the link is public and try again in a few minutes.',
  },
];

export const HOME_FAQ: FaqItem[] = FULL_FAQ.slice(0, 6);

export const ANDROID_FAQ: FaqItem[] = [
  {
    question: 'Which Android browser works best for saving Threads videos?',
    answer:
      'Chrome, Samsung Internet and Firefox all work the same with this tool. Use whichever is already on your phone. Just avoid the small built-in browser that opens when you tap a link inside another app, because those sometimes block downloads.',
  },
  {
    question: 'Where does the Threads video go on my Android phone?',
    answer:
      'To your Downloads folder, which you can open from the Files (or My Files) app or from the browser’s downloads page. The Gallery or Google Photos often picks it up within a moment as well.',
  },
  {
    question: 'The download did not start on my Android phone. What should I do?',
    answer:
      'Open the link in Chrome or Samsung Internet rather than an in-app browser, turn off data saver or battery saver for a minute, and make sure you have free storage. Then press the download button again.',
  },
  {
    question: 'Do I need to install an app to download Threads videos on Android?',
    answer:
      'No. It runs in your browser. If you want a shortcut, use Chrome’s menu and choose Add to Home screen.',
  },
];

export const IPHONE_FAQ: FaqItem[] = [
  {
    question: 'Where does a downloaded Threads video go on iPhone?',
    answer:
      'Safari saves it to the Files app, in Downloads. Depending on your settings that is either iCloud Drive > Downloads or On My iPhone > Downloads, and both are listed in the Files sidebar.',
  },
  {
    question: 'How do I get the Threads video into my Photos app?',
    answer:
      'Open the file in Files, tap the Share icon and choose Save Video. It is then in your camera roll as well as in Files.',
  },
  {
    question: 'I cannot find the download on my iPhone. What now?',
    answer:
      'Tap the small download icon next to Safari’s address bar to see recent downloads, or look in both Downloads folders in the Files app. If nothing is there, open the link in Safari instead of an in-app browser and try again.',
  },
  {
    question: 'Does this work on iPad as well?',
    answer: 'Yes. Safari on iPad downloads files the same way, and they appear in the Files app.',
  },
];

export const IMAGE_FAQ: FaqItem[] = [
  {
    question: 'How do I download a photo from Threads?',
    answer:
      'Paste the public post URL into the box above and click "Download Video" — the tool detects that the post is a photo and shows a "Download Image" button instead, which saves the file as a JPEG.',
  },
  {
    question: 'Can I download every photo in a multi-photo post?',
    answer:
      'Yes. Where a post exposes more than one image, each appears as a separate download option rather than being bundled together, so you can save the ones you want individually.',
  },
  {
    question: 'What resolution will the downloaded photo be?',
    answer:
      'The same resolution Threads itself serves for that post. The tool downloads the stored file as-is — it doesn’t upscale, sharpen, or otherwise alter the image.',
  },
  {
    question: 'Do I need a Threads account to save photos?',
    answer: 'No. You never need to log in or provide your Threads username or password to use this tool.',
  },
  {
    question: 'Can I download photos from a private account?',
    answer:
      'No. This tool only processes posts that are already publicly visible. It does not bypass login walls, private-account restrictions, or any other access control.',
  },
  {
    question: 'Where are downloaded photos saved?',
    answer:
      'Files are saved to your device’s default download location — typically the "Downloads" folder on desktop, or your device’s Files/Gallery app on mobile, depending on your browser settings.',
  },
];

export const GIF_FAQ: FaqItem[] = [
  {
    question: 'Will I get a real .gif file or an MP4?',
    answer:
      'It depends on how the post itself is encoded. Most "GIF-style" loops on Threads are actually short MP4 videos set to repeat, since video compresses far more efficiently than animated GIF. When a post exposes a true .gif file, the tool downloads it as-is; otherwise you’ll get the looping MP4, which plays the same way in any video player.',
  },
  {
    question: 'Can I download a Boomerang-style clip?',
    answer:
      'Yes. Boomerang-style clips (forward-then-reverse loops) are delivered as short MP4 files, and this tool downloads them the same way it handles any other looping video attached to a public post.',
  },
  {
    question: 'Does the downloaded loop include audio?',
    answer:
      'If the original clip has audio, the downloaded file keeps it. Animated GIFs never carry sound (it’s a limitation of the format itself), but looping MP4s can include the original audio track.',
  },
  {
    question: 'Is the Threads GIF Downloader free?',
    answer: 'Yes. It is free to use and there is nothing to sign up for.',
  },
  {
    question: 'Do I need to log in to Threads to save a loop?',
    answer: 'No. You never need to log in or provide your Threads username or password to use this tool.',
  },
  {
    question: 'Can I download a looping clip from a private account?',
    answer:
      'No. This tool only processes posts that are already publicly visible. It does not bypass login walls, private-account restrictions, or any other access control.',
  },
];
