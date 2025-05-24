
// BugGenerator.js
import React, { useState, useEffect } from 'react';
import { Shuffle } from 'lucide-react';

const BugGenerator = ({ onGenerateBugs, existingBugs }) => {
  const [isGenerated, setIsGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Check if dummy bugs already exist
  useEffect(() => {
    const hasDummyBugs = existingBugs.some(bug => 
      bug.id.includes('BUG-DEMO-') || 
      (bug.tags && bug.tags.includes('demo-data'))
    );
    setIsGenerated(hasDummyBugs);
    
    // Also check localStorage flag
    const generatorFlag = localStorage.getItem('bts-demo-bugs-generated');
    if (generatorFlag === 'true') {
      setIsGenerated(true);
    }
  }, [existingBugs]);

  // Bug title templates for multimedia and Linux issues
  const bugTitles = [
    // Audio Issues
    "No sound output after system suspend/resume on {device}",
    "Audio crackling when playing {format} files with {driver}",
    "Microphone not detected on {device} with {driver} driver",
    "Audio latency issues with {application} on {kernel}",
    "System freeze when switching audio output to {device}",
    "No audio in {application} after kernel update to {version}",
    "Audio stuttering during high CPU load with {driver}",
    "Bluetooth audio disconnects randomly on {device}",
    "HDMI audio not working with {gpu} graphics card",
    "Audio volume resets to 100% after reboot",
    
    // Video/Graphics Issues
    "Screen tearing in {application} with {gpu} driver {version}",
    "Black screen after installing {driver} driver version {version}",
    "GPU acceleration not working in {application}",
    "Display resolution resets after reboot with {gpu}",
    "Video playback freezes with {codec} codec",
    "Multiple monitor setup broken after {driver} update",
    "WebGL crashes in {browser} with {gpu} driver",
    "Screen flickering on {display} at {resolution} resolution",
    "Video encoding fails with {encoder} on {gpu}",
    "Compositor crashes when playing {format} videos",
    
    // Webcam/Camera Issues
    "Webcam not recognized in {application} on {distro}",
    "Green screen in video calls with {device} webcam",
    "Camera app crashes when switching to {device}",
    "Low FPS on {device} webcam with {driver} driver",
    "Webcam LED stays on after closing {application}",
    
    // Driver Issues
    "Kernel panic when loading {driver} module",
    "{driver} driver fails to compile on kernel {version}",
    "System boot hangs with {driver} driver enabled",
    "Memory leak in {driver} driver version {version}",
    "{device} not detected after driver update",
    
    // Media Codec Issues
    "Cannot play {format} files after codec update",
    "{codec} hardware acceleration not working",
    "Video artifacts when decoding {format} with {decoder}",
    "Audio sync issues with {format} container",
    "Codec conflict between {codec1} and {codec2}",
    
    // System Integration Issues
    "Media keys not working with {player} on {desktop}",
    "Screen recording fails with {application} on Wayland",
    "Audio device switching broken in {desktop} environment",
    "Media thumbnails not generating for {format} files",
    "Hardware acceleration disabled after {update}"
  ];

  // Components for randomization
  const devices = ['Realtek ALC892', 'Intel HDA', 'USB DAC', 'Logitech C920', 'Blue Yeti', 'NVIDIA HDMI', 'AMD HDMI', 'Razer Kiyo', 'Focusrite Scarlett', 'Behringer UMC22'];
  const drivers = ['ALSA', 'PulseAudio', 'PipeWire', 'nvidia-470', 'nvidia-525', 'amdgpu', 'i915', 'nouveau', 'v4l2', 'snd_hda_intel'];
  const applications = ['Firefox', 'Chrome', 'VLC', 'OBS Studio', 'Kdenlive', 'Audacity', 'Discord', 'Zoom', 'Teams', 'Spotify', 'Steam', 'GIMP', 'Blender', 'DaVinci Resolve'];
  const formats = ['MP4', 'MKV', 'FLAC', 'MP3', 'OGG', 'WebM', 'AVI', 'MOV', 'WAV', 'H.264', 'H.265/HEVC', 'VP9', 'AV1'];
  const kernels = ['5.15.0-88', '6.2.0-35', '6.5.0-14', '5.19.0-50', '6.1.0-13'];
  const gpus = ['NVIDIA GTX 1660', 'NVIDIA RTX 3060', 'AMD RX 580', 'AMD RX 6700', 'Intel UHD 630', 'Intel Iris Xe'];
  const codecs = ['ffmpeg', 'gstreamer', 'VA-API', 'VDPAU', 'NVENC', 'VAAPI', 'x264', 'x265'];
  const distros = ['Ubuntu 22.04', 'Fedora 38', 'Debian 12', 'Arch Linux', 'openSUSE Tumbleweed', 'Pop!_OS 22.04'];
  const desktops = ['GNOME 44', 'KDE Plasma 5.27', 'XFCE 4.18', 'Cinnamon 5.8'];
  const resolutions = ['1920x1080', '2560x1440', '3840x2160', '1366x768'];
  const versions = ['1.2.3', '2.0.1', '3.5.0', '4.1.2', '525.125.06', '470.199.02', '6.5.0'];
  const assignees = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson', 'David Lee', 'Emma Davis', 'Frank Miller'];
  const releases = ['v2.0.0', 'v2.1.0', 'v2.1.1', 'v2.2.0-beta', 'v2.2.0-rc1'];

  // Function to get random item from array
  const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Function to generate bug description with steps
  const generateDescription = (title) => {
    const descriptions = {
      audio: [
        {
          steps: [
            "Open system audio settings",
            "Set output device to {device}",
            "Play audio file using {application}",
            "Suspend system using power menu",
            "Resume system after 30 seconds"
          ],
          expected: "Audio should resume playing normally after system wake",
          actual: "No audio output, must manually restart {application} or switch audio device"
        },
        {
          steps: [
            "Install {driver} driver version {version}",
            "Reboot system",
            "Open {application}",
            "Play {format} audio file",
            "Listen for audio quality"
          ],
          expected: "Audio plays clearly without distortion",
          actual: "Crackling and popping sounds throughout playback"
        }
      ],
      video: [
        {
          steps: [
            "Install {gpu} driver version {version}",
            "Enable hardware acceleration in {application}",
            "Open video file in {format} format",
            "Play video at fullscreen",
            "Observe playback quality"
          ],
          expected: "Smooth video playback without artifacts",
          actual: "Screen tearing visible, especially during fast motion scenes"
        },
        {
          steps: [
            "Boot system with {gpu} graphics",
            "Update driver to version {version}",
            "Reboot system",
            "Wait for display manager to load"
          ],
          expected: "System boots to login screen normally",
          actual: "Black screen after GRUB, must boot with nomodeset parameter"
        }
      ],
      webcam: [
        {
          steps: [
            "Connect {device} webcam via USB",
            "Open {application}",
            "Navigate to video settings",
            "Select {device} as video input",
            "Start video preview"
          ],
          expected: "Webcam feed displays normally",
          actual: "Application shows 'No camera found' error"
        }
      ],
      driver: [
        {
          steps: [
            "Download {driver} driver source",
            "Run 'make && make install'",
            "Load module with 'modprobe {driver}'",
            "Check dmesg for errors"
          ],
          expected: "Driver loads without errors",
          actual: "Kernel panic with call trace in {driver}_init function"
        }
      ],
      codec: [
        {
          steps: [
            "Install {codec} codec package",
            "Open {application}",
            "Load {format} media file",
            "Attempt to play file"
          ],
          expected: "Media file plays with hardware acceleration",
          actual: "Playback fails with 'Unsupported codec' error"
        }
      ]
    };

    // Determine category from title
    let category = 'audio';
    if (title.toLowerCase().includes('screen') || title.toLowerCase().includes('video') || title.toLowerCase().includes('gpu') || title.toLowerCase().includes('display')) {
      category = 'video';
    } else if (title.toLowerCase().includes('webcam') || title.toLowerCase().includes('camera')) {
      category = 'webcam';
    } else if (title.toLowerCase().includes('driver') || title.toLowerCase().includes('kernel')) {
      category = 'driver';
    } else if (title.toLowerCase().includes('codec') || title.toLowerCase().includes('format')) {
      category = 'codec';
    }

    const template = getRandom(descriptions[category] || descriptions.audio);
    
    // Replace placeholders
    const replacePlaceholders = (text) => {
      return text
        .replace(/{device}/g, getRandom(devices))
        .replace(/{driver}/g, getRandom(drivers))
        .replace(/{application}/g, getRandom(applications))
        .replace(/{format}/g, getRandom(formats))
        .replace(/{gpu}/g, getRandom(gpus))
        .replace(/{version}/g, getRandom(versions))
        .replace(/{codec}/g, getRandom(codecs))
        .replace(/{kernel}/g, getRandom(kernels));
    };

    const steps = template.steps.map((step, i) => `${i + 1}. ${replacePlaceholders(step)}`).join('\n');
    const expected = replacePlaceholders(template.expected);
    const actual = replacePlaceholders(template.actual);

    return `**Environment:**
- OS: ${getRandom(distros)}
- Kernel: ${getRandom(kernels)}
- Desktop: ${getRandom(desktops)}
- Affected Package: ${getRandom(drivers)} (${getRandom(versions)})

**Steps to Reproduce:**
${steps}

**Expected Result:**
${expected}

**Actual Result:**
${actual}

**Additional Information:**
- First noticed after system update on ${new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
- Reproducibility: ${getRandom(['Always', 'Intermittent (70%)', 'Intermittent (50%)', 'Random'])}
- Workaround: ${getRandom(['None found', 'Downgrade driver', 'Use different application', 'Disable hardware acceleration', 'Switch to different codec'])}`;
  };

  // Generate title with replacements
  const generateTitle = () => {
    const template = getRandom(bugTitles);
    return template
      .replace(/{device}/g, getRandom(devices))
      .replace(/{driver}/g, getRandom(drivers))
      .replace(/{application}/g, getRandom(applications))
      .replace(/{format}/g, getRandom(formats))
      .replace(/{gpu}/g, getRandom(gpus))
      .replace(/{version}/g, getRandom(versions))
      .replace(/{codec}/g, getRandom(codecs))
      .replace(/{kernel}/g, getRandom(kernels))
      .replace(/{distro}/g, getRandom(distros))
      .replace(/{desktop}/g, getRandom(desktops))
      .replace(/{resolution}/g, getRandom(resolutions))
      .replace(/{codec1}/g, getRandom(codecs))
      .replace(/{codec2}/g, getRandom(codecs))
      .replace(/{encoder}/g, getRandom(['ffmpeg', 'x264', 'nvenc', 'vaapi']))
      .replace(/{decoder}/g, getRandom(['ffmpeg', 'gstreamer', 'vlc']))
      .replace(/{browser}/g, getRandom(['Firefox', 'Chrome', 'Chromium']))
      .replace(/{player}/g, getRandom(['VLC', 'MPV', 'Rhythmbox', 'Clementine']))
      .replace(/{display}/g, getRandom(['Dell U2720Q', 'LG 27UK650', 'ASUS VG248QE', 'Samsung Odyssey']))
      .replace(/{update}/g, getRandom(['kernel update', 'driver update', 'system upgrade']));
  };

  const generateBugs = async () => {
    if (isGenerated || isGenerating) return;
    
    setIsGenerating(true);
    
    const bugs = [];
    const timestamp = Date.now();
    
    for (let i = 0; i < 50; i++) {
      const title = generateTitle();
      const bug = {
        id: `BUG-DEMO-${timestamp}-${i}`,
        title: title,
        description: generateDescription(title),
        status: 'new',
        priority: getRandom(['low', 'medium', 'high', 'critical']),
        category: getRandom(['Driver', 'Multimedia', 'Kernel', 'Hardware', 'Audio', 'Video', 'Performance']),
        assignedTo: getRandom(assignees),
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
        releaseVersion: getRandom(releases),
        severity: getRandom(['S1-Critical', 'S2-Major', 'S3-Minor', 'S4-Trivial']),
        reproducibility: getRandom(['Always', 'Sometimes', 'Random', 'Once']),
        platform: getRandom(['x86_64', 'aarch64', 'armhf']),
        tags: ['demo-data', getRandom(['multimedia', 'driver', 'audio', 'video', 'kernel'])]
      };
      bugs.push(bug);
    }
    
    onGenerateBugs(bugs);
    localStorage.setItem('bts-demo-bugs-generated', 'true');
    setIsGenerated(true);
    setIsGenerating(false);
  };

  return (
    <button
      onClick={generateBugs}
      disabled={isGenerated || isGenerating}
      className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
        isGenerated 
          ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
          : isGenerating
          ? 'bg-purple-400 text-white cursor-wait'
          : 'bg-purple-600 text-white hover:bg-purple-700'
      }`}
      title={isGenerated ? 'Demo bugs already generated' : 'Generate 50 test bugs'}
    >
      <Shuffle className="w-5 h-5 mr-2" />
      {isGenerating ? 'Generating...' : isGenerated ? 'Generated' : 'Bug Generator'}
    </button>
  );
};

export default BugGenerator;
