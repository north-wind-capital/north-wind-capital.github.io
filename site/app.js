'use strict';
const slider = document.querySelector('#conviction');
const output = document.querySelector('#conviction-value');
const title = document.querySelector('#forecast-title');
const copy = document.querySelector('#forecast-copy');
let previous = -1;
let selectedOutlook = null;
let forecastAnimation = null;
let shareResetTimer;
const forecastResult = document.querySelector('.forecast-result');
const shareStatus = document.querySelector('#share-status');
const shareButton = document.querySelector('#copy-outlook');
const outlooks = [
  [
    ['Strategically doing nothing.', 'Make tea. Let someone else have an opinion.'],
    ['Long on lunch. Short on meetings.', 'The committee has identified an opportunity to close the laptop. Due diligence will take place at the bakery.'],
    ['Preserving optionality. And biscuits.', 'We won’t say “new paradigm” before noon. After lunch, no promises.']
  ],
  [
    ['The fundamentals are breezy.', 'We’ve detected a pattern. It may be the office blinds.'],
    ['A strong case for a second coffee.', 'Several indicators point in the same direction. Unfortunately, it’s the kitchen.'],
    ['Three data points. One convincing line.', 'We’ll need a fourth before calling this research.']
  ],
  [
    ['We have upgraded the font to bold.', 'The thesis is unchanged. The arrow is bigger. The committee is impressed.'],
    ['Conviction has exceeded the spreadsheet.', 'We’re opening a second spreadsheet.'],
    ['The outlook has booked a podcast.', 'The evidence has been invited but cannot confirm attendance.']
  ]
];
function convictionLabel() {
  const value = Number(slider.value);
  output.textContent = value < 34 ? 'Pleasingly noncommittal' : value < 67 ? 'Quietly confident' : 'Insufferably certain';
  slider.setAttribute('aria-valuetext', output.textContent);
}
slider.addEventListener('input', convictionLabel);
function showOutlook(group, index, confidence, animate = true) {
  selectedOutlook = { group, index, confidence };
  previous = index;
  title.textContent = outlooks[group][index][0];
  copy.textContent = outlooks[group][index][1];
  shareStatus.textContent = '';
  if (forecastAnimation) forecastAnimation.cancel();
  if (animate && motionEnabled) {
    forecastAnimation = forecastResult.animate(
      [{ opacity: .25, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 420, easing: 'cubic-bezier(.2,.7,.2,1)' }
    );
  }
}

document.querySelector('#generate').addEventListener('click', () => {
  const confidence = Number(slider.value);
  const group = confidence < 34 ? 0 : confidence < 67 ? 1 : 2;
  const next = (previous + 1 + Math.floor(Math.random() * 2)) % 3;
  showOutlook(group, next, confidence);
});

shareButton.addEventListener('click', async () => {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = 'outlook';
  if (selectedOutlook) {
    url.searchParams.set('outlook', `${selectedOutlook.group}-${selectedOutlook.index}`);
    url.searchParams.set('confidence', String(selectedOutlook.confidence));
  }
  clearTimeout(shareResetTimer);
  try {
    await navigator.clipboard.writeText(url.href);
    shareStatus.textContent = 'Link copied.';
    shareResetTimer = setTimeout(() => { shareStatus.textContent = ''; }, 4000);
  } catch {
    shareStatus.replaceChildren();
    const link = document.createElement('a');
    link.href = url.href;
    link.textContent = 'Open this outlook to copy its address.';
    shareStatus.append(link);
  }
});
document.querySelector('.forecast-sharing').hidden = false;
const sharedParams = new URLSearchParams(window.location.search);
const sharedMatch = /^([0-2])-([0-2])$/.exec(sharedParams.get('outlook') || '');
if (sharedMatch) {
  const group = Number(sharedMatch[1]);
  const index = Number(sharedMatch[2]);
  const requested = Number(sharedParams.get('confidence'));
  const validConfidence = sharedParams.has('confidence') && Number.isInteger(requested) && requested >= 0 && requested <= 100 && (requested < 34 ? 0 : requested < 67 ? 1 : 2) === group;
  const confidence = validConfidence ? requested : [16, 50, 84][group];
  slider.value = String(confidence);
  showOutlook(group, index, confidence, false);
}
convictionLabel();

// Native scrolling drives one animation frame per update; no scroll interception.
const root = document.documentElement;
const motionToggle = document.querySelector('#motion-toggle');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const compactScreen = window.matchMedia('(max-width: 760px)');
const header = document.querySelector('.masthead');
const hero = document.querySelector('.hero');
const heroImage = document.querySelector('.hero-image');
const heroCopy = document.querySelector('.hero-copy');
const heroHorizon = document.querySelector('.hero-horizon');
const progress = document.querySelector('.scroll-progress');
const statement = document.querySelector('.statement');
const reading = document.querySelector('.reading-line');
const approach = document.querySelector('.philosophy');
const principles = [...document.querySelectorAll('.principle')];
const steps = [...document.querySelectorAll('.approach-steps button')];
const flow = document.querySelector('.flow-art');
const outlook = document.querySelector('.outlook');
const wash = document.querySelector('.outlook-wash');
const wordmark = document.querySelector('.footer-wordmark');
const compass = document.querySelector('.compass-guide');
const compassNeedle = document.querySelector('.compass-needle');
const reveals = [...document.querySelectorAll('.reveal')];
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
let motionEnabled = !reducedMotion.matches;
let framePending = false;
let userMotionChoice = false;

const text = reading.textContent.trim();
reading.replaceChildren();
text.split(' ').forEach((word, index) => {
  if (index) reading.append(' ');
  const span = document.createElement('span');
  span.className = 'word';
  span.textContent = word;
  reading.append(span);
});
const words = [...reading.querySelectorAll('.word')];

let compassState = null;
let compassTarget = null;
let compassFrame = null;
let compassTime = null;

function glideCompass(time) {
  compassFrame = null;
  if (!motionEnabled || !compassTarget) return;
  const elapsed = compassTime === null ? 16 : Math.min(time - compassTime, 64);
  compassTime = time;
  const blend = 1 - Math.exp(-elapsed / 180);
  let moving = false;
  for (const key of ['x', 'y', 'angle']) {
    const delta = compassTarget[key] - compassState[key];
    if (Math.abs(delta) > .05) {
      compassState[key] += delta * blend;
      moving = true;
    } else compassState[key] = compassTarget[key];
  }
  compass.style.transform = `translate3d(${compassState.x}px,${compassState.y}px,0)`;
  compassNeedle.style.transform = `rotate(${compassState.angle}deg)`;
  if (moving) compassFrame = requestAnimationFrame(glideCompass);
  else compassTime = null;
}

function positionCompass(scroll, height) {
  const width = window.innerWidth;
  const size = compass.offsetWidth;
  const inset = compactScreen.matches ? 7 : 12;
  // A continuous path in the outside margin avoids both text and collision detours.
  const drift = compactScreen.matches ? 0 : (1 + Math.sin(scroll / 1200)) * 3;
  const top = header.getBoundingClientRect().bottom + 24;
  const bottom = height - size - 24;
  compassTarget = {
    x: width - size - inset - drift,
    y: clamp(height * (.65 + .12 * Math.sin(scroll / 1000)), top, bottom),
    angle: scroll * .065 - 18
  };
  if (!compassState) compassState = { ...compassTarget };
  if (compassFrame === null) compassFrame = requestAnimationFrame(glideCompass);
}

function renderMotion() {
  framePending = false;
  const height = window.innerHeight;
  const scroll = window.scrollY;
  header.classList.toggle('scrolled', scroll > 50);
  const currentSection = ['philosophy', 'directors', 'outlook'].filter(id => document.getElementById(id).getBoundingClientRect().top <= height * .4).at(-1);
  document.querySelectorAll('nav a').forEach(link => {
    if (link.hash === '#' + currentSection) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  if (!motionEnabled) return;
  positionCompass(scroll, height);
  const pageLength = document.documentElement.scrollHeight - height;
  progress.style.transform = `scaleX(${pageLength > 0 ? clamp(scroll / pageLength) : 0})`;

  const heroRect = hero.getBoundingClientRect();
  const heroPhase = clamp(-heroRect.top / Math.max(hero.offsetHeight - height, 1));
  heroImage.style.transform = `translate3d(0,${heroPhase * 5}%,0) scale(${1.04 + heroPhase * .2})`;
  heroCopy.style.transform = `translate3d(0,${-heroPhase * (compactScreen.matches ? 70 : 140)}px,0)`;
  heroCopy.style.opacity = heroCopy.contains(document.activeElement) ? '1' : String(1 - heroPhase * .85);
  heroHorizon.style.transform = `scaleY(${1 - heroPhase})`;

  const statementRect = statement.getBoundingClientRect();
  const readingPhase = clamp((height * .88 - statementRect.top) / (height * .65));
  words.forEach((word, index) => word.classList.toggle('lit', readingPhase >= index / words.length));

  const approachRect = approach.getBoundingClientRect();
  const approachPhase = clamp(-approachRect.top / Math.max(approach.offsetHeight - height, 1));
  const chapter = Math.min(approachPhase * 2.6, 2);
  principles.forEach((principle, index) => {
    if (compactScreen.matches) {
      principle.style.removeProperty('transform');
      principle.style.removeProperty('opacity');
      principle.style.removeProperty('visibility');
    } else {
      const distance = index - chapter;
      principle.style.opacity = String(clamp(1 - Math.abs(distance) * 1.65));
      principle.style.transform = `translate3d(0,${distance * 100}px,0)`;
      principle.style.visibility = Math.abs(distance) < .61 ? 'visible' : 'hidden';
    }
    steps[index].style.setProperty('--fill', String(clamp(chapter - index + 1)));
    const activeChapter = compactScreen.matches ? Math.max(0, principles.filter(item => item.getBoundingClientRect().top < height * .6).length - 1) : Math.round(chapter);
    if (activeChapter === index) steps[index].setAttribute('aria-current', 'step');
    else steps[index].removeAttribute('aria-current');
  });
  flow.style.setProperty('--draw', String(1 - clamp(.25 + approachPhase * .9)));
  flow.style.transform = `translate3d(${approachPhase * -6}%,0,0) rotate(${approachPhase * 14 - 7}deg) scale(1.2)`;

  const outlookRect = outlook.getBoundingClientRect();
  const outlookPhase = clamp((height - outlookRect.top) / (height * .8));
  wash.style.transform = `scaleX(${outlookPhase})`;
  const footerRect = wordmark.parentElement.getBoundingClientRect();
  const footerPhase = clamp((height - footerRect.top) / height);
  wordmark.style.transform = `translate3d(0,${(1 - footerPhase) * 90}px,0)`;
  reveals.forEach(element => {
    if (element.getBoundingClientRect().top < height * .92) element.classList.add('visible');
  });
}

function requestMotionFrame() {
  if (!framePending) {
    framePending = true;
    window.requestAnimationFrame(renderMotion);
  }
}

function setMotion(enabled) {
  motionEnabled = enabled;
  root.classList.toggle('motion-enabled', enabled);
  root.classList.toggle('motion-off', !enabled);
  motionToggle.textContent = enabled ? 'Pause motion' : 'Enable motion';
  motionToggle.setAttribute('aria-pressed', String(!enabled));
  if (!enabled) {
    if (forecastAnimation) forecastAnimation.cancel();
    cancelAnimationFrame(compassFrame);
    compassFrame = null;
    compassState = null;
    compassTarget = null;
    compassTime = null;
    [heroImage, heroCopy, heroHorizon, progress, flow, wash, wordmark, compass, compassNeedle, ...principles].forEach(element => {
      element.style.removeProperty('transform');
      element.style.removeProperty('opacity');
      element.style.removeProperty('visibility');
    });
    reveals.forEach(element => element.classList.add('visible'));
  }
  requestMotionFrame();
}

document.querySelector('.approach-steps').hidden = false;
steps.forEach((button, index) => button.addEventListener('click', () => {
  steps.forEach((step, i) => {
    if (i === index) step.setAttribute('aria-current', 'step');
    else step.removeAttribute('aria-current');
  });
  if (motionEnabled && !compactScreen.matches) {
    const start = approach.getBoundingClientRect().top + window.scrollY;
    const distance = Math.max(approach.offsetHeight - window.innerHeight, 0);
    window.scrollTo({ top: start + distance * index / 2.6, behavior: 'smooth' });
  } else {
    principles[index].scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'instant', block: 'center' });
  }
}));

motionToggle.hidden = false;
motionToggle.addEventListener('click', () => {
  userMotionChoice = true;
  setMotion(!motionEnabled);
});
reducedMotion.addEventListener('change', () => {
  if (!userMotionChoice) setMotion(!reducedMotion.matches);
});
window.addEventListener('scroll', requestMotionFrame, { passive: true });
window.addEventListener('resize', requestMotionFrame, { passive: true });
window.addEventListener('load', requestMotionFrame);
window.addEventListener('hashchange', requestMotionFrame);
setMotion(motionEnabled);
