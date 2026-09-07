'use strict';
const slider = document.querySelector('#conviction');
const output = document.querySelector('#conviction-value');
const title = document.querySelector('#forecast-title');
const copy = document.querySelector('#forecast-copy');
const weather = document.querySelector('#weather-label');
const note = document.querySelector('#note-number');
let edition = 1;
let previous = -1;
const outlooks = [
  [
    ['Strategically doing nothing.', 'A light breeze suggests the most sophisticated move is to make tea and let someone else have an opinion.', 'LIGHT AND VARIABLE'],
    ['Long on lunch. Short on meetings.', 'The committee has identified a compelling opportunity to close the laptop. Due diligence will take place at the bakery.', 'CALM CONDITIONS'],
    ['Preserving optionality. And biscuits.', 'Our defensive posture involves a comfortable chair, a sensible cardigan, and refusing to say “new paradigm” before noon.', 'SCATTERED HUNCHES']
  ],
  [
    ['The fundamentals are breezy.', 'Our wind-adjusted model has detected a pattern. It may be the office blinds, but the research team is cautiously excited.', 'A FRESH NORTHERLY'],
    ['A strong case for a second coffee.', 'Several indicators are pointing in the same direction. Unfortunately, that direction is the kitchen.', 'MODERATE CONVICTION'],
    ['An emerging front of interesting ideas.', 'We have connected three unrelated data points with a very convincing line. Further research is required, preferably near a window.', 'LOCALISED INSIGHT']
  ],
  [
    ['We have upgraded the font to bold.', 'The thesis is unchanged, but the presentation now has fewer caveats and a considerably larger arrow. The committee is impressed.', 'GUSTING WITH CERTAINTY'],
    ['A paradigm has left the building.', 'Conviction has exceeded the safe operating limits of the spreadsheet. We are opening a second spreadsheet.', 'GALE-FORCE NARRATIVE'],
    ['This time it’s meteorological.', 'Our outlook is so confident it has booked its own podcast appearance. The evidence has been invited but cannot yet confirm attendance.', 'EXTREME THOUGHT LEADERSHIP']
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
  weather.textContent = forecast[2];
  note.textContent = String(++edition).padStart(3, '0');
});
convictionLabel();
