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
