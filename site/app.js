'use strict';
const slider = document.querySelector('#conviction');
const output = document.querySelector('#conviction-value');
const title = document.querySelector('#forecast-title');
const copy = document.querySelector('#forecast-copy');
let previous = -1;
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
document.querySelector('#generate').addEventListener('click', () => {
  const group = Number(slider.value) < 34 ? 0 : Number(slider.value) < 67 ? 1 : 2;
  const next = (previous + 1 + Math.floor(Math.random() * 2)) % 3;
  previous = next;
  const forecast = outlooks[group][next];
  title.textContent = forecast[0];
  copy.textContent = forecast[1];
});
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
const steps = [...document.querySelectorAll('.approach-steps span')];
const flow = document.querySelector('.flow-art');
const outlook = document.querySelector('.outlook');
const wash = document.querySelector('.outlook-wash');
const wordmark = document.querySelector('.footer-wordmark');
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

function renderMotion() {
  framePending = false;
  const height = window.innerHeight;
  const scroll = window.scrollY;
  header.classList.toggle('scrolled', scroll > 50);
  if (!motionEnabled) return;
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
  });
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
    [heroImage, heroCopy, heroHorizon, progress, flow, wash, wordmark, ...principles].forEach(element => {
      element.style.removeProperty('transform');
      element.style.removeProperty('opacity');
      element.style.removeProperty('visibility');
    });
    reveals.forEach(element => element.classList.add('visible'));
  }
  requestMotionFrame();
}

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
